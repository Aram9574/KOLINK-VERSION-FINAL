
import { corsHeaders } from "../_shared/cors.ts";
import { ContentService } from "../_shared/services/ContentService.ts";
import { createClient } from "@supabase/supabase-js";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { slides, targetLanguage } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY")!;

    if (!slides || !targetLanguage) {
      throw new Error("Missing 'slides' or 'targetLanguage'");
    }

    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    // 1. Auth Check (Optional usage enforcement)
    // For now, we allow authenticated users.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    // 2. Translate
    const contentService = new ContentService(apiKey);
    const result = await contentService.translateCarousel(slides, targetLanguage);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[TranslateCarousel] Error:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
