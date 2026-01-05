import { corsHeaders } from "../_shared/cors.ts";
import { ContentService } from "../_shared/services/ContentService.ts";
import { createClient } from "@supabase/supabase-js";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { source, tone, audience, language = "es" } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY")!;

    if (!source || !apiKey) throw new Error("Missing source or API key");

    // 1. Auth & User Context
    const authHeader = req.headers.get("Authorization");
    let userContext = {};
    
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

             const { data: profile } = await supabaseAdmin.from("profiles").select("*").eq("id", user.id).single();
             if (profile) {
                 userContext = {
                     behavioral_dna: profile.behavioral_dna ? JSON.stringify(profile.behavioral_dna) : "",
                     brand_voice: "", // Will try to fetch active voice
                     xp: profile.xp
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

    console.log(`[CarouselFunc] Processing source length: ${source.length} with tone: ${tone}. DNA Present: ${!!(userContext as any).behavioral_dna}`);
    
    const contentService = new ContentService(apiKey);
    
    // Include tone and audience in style fragments for better context
    const styleFragments = [];
    if (tone) styleFragments.push(`Tone: ${tone}`);
    if (audience) styleFragments.push(`Target Audience: ${audience}`);

    const enrichedSource = `[RAW TEXT]: ${source.substring(0, 15000)}`;
    
    const generatedContent = await contentService.generateCarousel(
      enrichedSource, 
      "RAW_TEXT", 
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
      slides: generatedContent.slides.map((s: any) => ({
        number: s.slide_number,
        title: s.headline,
        content: s.content
      })),
      linkedin_post_copy: generatedContent.linkedin_post_copy
    };

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
