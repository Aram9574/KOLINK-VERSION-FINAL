import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { ContentService } from "../_shared/services/ContentService.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { source, language = "es" } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY")!;

    if (!source || !apiKey) throw new Error("Missing source or API key");

    console.log(`[CarouselFunc] Processing source length: ${source.length}`);
    
    // Use the specialized ContentService microservice
    const contentService = new ContentService(apiKey);
    
    // We treat everything as raw text to prevent any scraping errors as per user request
    const enrichedSource = `[RAW TEXT]: ${source.substring(0, 15000)}`;
    
    const result = await contentService.generateCarousel(
      enrichedSource, 
      "RAW_TEXT", 
      [], // Style fragments empty for now unless passed
      language
    );

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[CarouselFunc] Error:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
