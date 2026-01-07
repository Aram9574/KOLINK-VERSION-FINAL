import { corsHeaders } from "../_shared/cors.ts";
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
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { source, sourceType = "text", tone, audience, language = "es" } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY")!;

    if (!source || !apiKey) throw new Error("Missing source or API key");

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
    
    // Include tone and audience in style fragments for better context
    const styleFragments = [];
    if (tone) styleFragments.push(`Tone: ${tone}`);
    if (audience) styleFragments.push(`Target Audience: ${audience}`);

    let finalInputSource = source;
    // Only truncate and label if it's raw text. 
    // If it's a URL or YouTube ID, we need the full string as is.
    if (sourceType === 'text' || sourceType === 'topic') {
        finalInputSource = `[RAW TEXT]: ${source.substring(0, 15000)}`;
    }
    
    // Explicitly type the result from service
    const generatedContent: CarouselGenerationResult = await contentService.generateCarousel(
      finalInputSource, 
      sourceType, 
      styleFragments,
      language,
      userContext
    );

    // MAP TO FRONTEND CarouselData INTERFACE
    // interface Slide { number: number; title: string; content: string; }
    // interface CarouselData { carousel_config: { slides_count: number; tone: string; analysis: string }; slides: Slide[]; }
    
    const responseData = {
      carousel_config: {
        slides_count: generatedContent.slides.length,
        tone: tone || "Professional",
        analysis: generatedContent.carousel_metadata.topic
      },
      slides: generatedContent.slides.map((s, index: number) => ({
        id: `gen-slide-${index}`,
        type: s.type || (index === 0 ? 'intro' : index === generatedContent.slides.length - 1 ? 'outro' : 'content'),
        content: {
            title: s.title,
            subtitle: s.subtitle,
            body: s.body,
            cta_text: s.cta_text
        },
        isVisible: true
      })),
      linkedin_post_copy: generatedContent.linkedin_post_copy
    };

    // DEDUCT CREDIT IF SUCCESSFUL
    if (userContext.user_id) {
        try {
             // Re-instantiate admin client if needed, or reuse from scope if we refactored to keep it. 
             // Since scope is closed above, we need to create it again or move declaration up. 
             // To be safe and clean, I will recreate it cheaply here.
             const supabaseAdmin = createClient(
                Deno.env.get("SUPABASE_URL") ?? "",
                Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
             );
             const creditService = new CreditService(supabaseAdmin, createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? ""));
             await creditService.deductCredit(userContext.user_id);
             console.log(`[CarouselFunc] Credit deducted for user ${userContext.user_id}`);
        } catch (e) {
            console.error("[CarouselFunc] Failed to deduct credit:", e);
            // Don't fail the response, just log it. Admin can reconcile later.
        }
    }

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[CarouselFunc] Error:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
