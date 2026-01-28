import { getCorsHeaders } from "../_shared/cors.ts";
import { ContentService, CarouselGenerationResult } from "../_shared/services/ContentService.ts";
import { CreditService } from "../_shared/services/CreditService.ts";
import { createClient } from "@supabase/supabase-js";

interface UserContextType {
    behavioral_dna?: string;
    brand_voice?: string;
    xp?: number;
    user_id?: string;
}

Deno.serve(async (req) => {
  const headers = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const { 
        source, 
        sourceType = "text", 
        tone, 
        audience, 
        language = "es",
        action = "generate", // Default action
        slide, // Required for refine
        instruction // Optional for refine
    } = await req.json();
    
    const apiKey = Deno.env.get("GEMINI_API_KEY")!;

    if ((action === "generate" && !source) || !apiKey) throw new Error("Missing source or API key");

    // 1. Auth & User Context
    const authHeader = req.headers.get("Authorization");
    let userContext: UserContextType = {};
    
    if (authHeader) {
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? "",
          { global: { headers: { Authorization: authHeader } } }
        );
        
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        if (user) {
             const supabaseAdmin = createClient(
                Deno.env.get("SUPABASE_URL") ?? "",
                Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
             );

             // CHECK CREDITS
             const creditService = new CreditService(supabaseAdmin, supabaseClient);
             const hasCredits = await creditService.hasCredits(user.id);
             if (!hasCredits) {
                 throw new Error("INSUFFICIENT_CREDITS");
             }

             // FETCH PROFILE CONTEXT
             const { data: profile } = await supabaseAdmin.from("profiles").select("*").eq("id", user.id).single();
             if (profile) {
                 userContext = {
                     behavioral_dna: profile.behavioral_dna ? JSON.stringify(profile.behavioral_dna) : "",
                     brand_voice: "", 
                     xp: profile.xp,
                     user_id: user.id // Pass user_id for credit deduction later
                 };

                 if (profile.active_voice_id) {
                     const { data: voice } = await supabaseAdmin.from("brand_voices").select("description").eq("id", profile.active_voice_id).single();
                     if (voice) {
                         userContext = { ...userContext, brand_voice: voice.description };
                     }
                 }
             }
        }
    }

    console.log(`[CarouselFunc] Processing source type: ${sourceType}, with tone: ${tone}.`);
    
    const contentService = new ContentService(apiKey);
    
    // --- ACTION: REFINE SLIDE ---
    if (action === "refine") {
        console.log(`[CarouselFunc] Refining slide of type: ${slide.type}`);
        const refinedSlide = await contentService.refineSlide(slide, instruction, language);
        
        // DEDUCT CREDIT (Refining costs 1 credit for now)
        if (userContext.user_id) {
            const supabaseAdmin = createClient(
                Deno.env.get("SUPABASE_URL") ?? "",
                Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
            );
            const creditService = new CreditService(supabaseAdmin, createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? ""));
            await creditService.deductCredit(userContext.user_id);
        }

        return new Response(
            JSON.stringify({ slide: refinedSlide }),
            { headers: { ...headers, "Content-Type": "application/json" } }
        );
    }

    // --- ACTION: GENERATE CAROUSEL (Default) ---
    console.log(`[CarouselFunc] Generating full carousel for source type: ${sourceType}`);
    
    // Include tone and audience in style fragments for better context
    const styleFragments = [];
    if (tone) styleFragments.push(`Tone: ${tone}`);
    if (audience) styleFragments.push(`Target Audience: ${audience}`);

    let finalInputSource = source;
    if (sourceType === 'text' || sourceType === 'topic') {
        finalInputSource = `[RAW TEXT]: ${source.substring(0, 15000)}`;
    }
    
    let generatedContent: CarouselGenerationResult;
    try {
        generatedContent = await contentService.generateCarousel(
            finalInputSource, 
            sourceType, 
            styleFragments,
            language,
            userContext
        );
    } catch (genError: any) {
        console.error("[CarouselFunc] Generation specific error:", genError);
        // Fallback to a valid carousel response regarding the error
        generatedContent = {
            carousel_config: {
                theme_id: "error",
                settings: { aspect_ratio: "4:5", dark_mode: false }
            },
            slides: [
                {
                    id: "error-slide",
                    type: "intro",
                    layout: "intro",
                    content: {
                        title: "Generation Failed",
                        subtitle: `${genError.message || "Unknown Error"}`,
                        body: "Please try again or check your credits.",
                        cta_text: "Retry",
                    },
                    design_overrides: { highlight_color: "#ef4444" }
                }
            ],
            linkedin_post_copy: "Generation failed. Please check logs."
        };
    }

    console.log("[CarouselFunc] Generated content received from service. Slides count:", generatedContent.slides?.length);
    if (!generatedContent.slides || !Array.isArray(generatedContent.slides)) {
        console.error("[CarouselFunc] Invalid slides data:", JSON.stringify(generatedContent));
       // Use same fallback if structure is invalid
       generatedContent = {
             carousel_config: { theme_id: "error", settings: { aspect_ratio: "4:5", dark_mode: false } },
             slides: [{ 
                 id: "structure-error", 
                 type: "intro", 
                 layout: "intro",
                 content: { title: "Invalid Data", body: "AI returned invalid JSON structure." } 
             }],
             linkedin_post_copy: "Error"
       };
    }

    const slides = generatedContent.slides.map((s, index: number) => {
        try {
            return {
                id: `gen-slide-${index}`,
                type: s.type || (index === 0 ? 'intro' : index === generatedContent.slides.length - 1 ? 'outro' : 'content'),
                layout: s.layout ?? "classic",
                design_overrides: s.design_overrides,
                content: {
                    title: s.content?.title || "Untitled",
                    subtitle: s.content?.subtitle,
                    body: s.content?.body || "",
                    cta_text: s.content?.cta_text,
                    image_prompt: s.content?.image_prompt
                },
                isVisible: true
            };
        } catch (mapErr) {
            console.error(`[CarouselFunc] Error mapping slide ${index}:`, mapErr, s);
            return {
                id: `gen-slide-${index}`,
                type: 'content',
                layout: 'classic',
                content: { title: "Error", body: "Could not generate slide content." },
                isVisible: true
            };
        }
    });

    const responseData = {
      carousel_config: {
        slides_count: slides.length,
        tone: tone || "Professional",
        analysis: "AI Generated Content" 
      },
      slides: slides,
      linkedin_post_copy: generatedContent.linkedin_post_copy
    };

    // DEDUCT CREDIT IF SUCCESSFUL
    if (userContext.user_id) {
        try {
             const supabaseAdmin = createClient(
                Deno.env.get("SUPABASE_URL") ?? "",
                Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
             );
             const creditService = new CreditService(supabaseAdmin, createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? ""));
             await creditService.deductCredit(userContext.user_id);
             console.log(`[CarouselFunc] Credit deducted for user ${userContext.user_id}`);
        } catch (e) {
            console.error("[CarouselFunc] Failed to deduct credit:", e);
        }
    }

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...headers, "Content-Type": "application/json" },
      }
    );
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[CarouselFunc] Error:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
});
