import { corsHeaders } from "../_shared/cors.ts";
import { ContentService } from "../_shared/services/ContentService.ts";
import { CreditService } from "../_shared/services/CreditService.ts";
import { createClient } from "@supabase/supabase-js";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { title, body, subtitle, language = "es" } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY")!;

    if (!title || !body) throw new Error("Missing content (title/body)");
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    // 1. Auth & User Context
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    
    if (authHeader) {
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? "",
          { global: { headers: { Authorization: authHeader } } }
        );
        
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        if (user) {
             userId = user.id;
             // Optional: Check credits. For polish (small op), maybe we don't charge or charge 0.1?
             // Leaving credit check out for now to reduce friction, or assume 'expert-chat' usage quota.
        }
    }

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // 2. Polish Content
    const contentService = new ContentService(apiKey);
    const refinedContent = await contentService.refineSlide(
        { title, body, subtitle, type: 'content' }, 
        "Make this slide punchy, clear, and engaging for LinkedIn.", 
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
