import { corsHeaders } from "../_shared/cors.ts";
import { ContentService } from "../_shared/services/ContentService.ts";
import { CreditService } from "../_shared/services/CreditService.ts";
import { createClient } from "@supabase/supabase-js";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { title, body, subtitle, language = "es", instruction } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY")!;

    if (!title || !body) throw new Error("Missing content (title/body)");
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    // ... Auth ...

    // 2. Polish Content
    const contentService = new ContentService(apiKey);
    const defaultInstruction = "Make this slide punchy, clear, and engaging for LinkedIn.";
    
    const refinedContent = await contentService.refineSlide(
        { title, body, subtitle, type: 'content' }, 
        instruction || defaultInstruction, 
        language
    );

    // 3. Return Result
    return new Response(
      JSON.stringify(refinedContent),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[PolishSlide] Error:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
