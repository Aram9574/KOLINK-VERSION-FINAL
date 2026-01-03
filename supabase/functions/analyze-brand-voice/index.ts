import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { AuditService } from "../_shared/services/AuditService.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { contentSamples, language = "en", imageBase64 } = await req.json();

    if (!contentSamples || !Array.isArray(contentSamples) || contentSamples.length === 0) {
      throw new Error("Missing content samples");
    }

    const auditService = new AuditService(Deno.env.get("GEMINI_API_KEY") ?? "");
    const result = await auditService.analyzeVoice(contentSamples, language, imageBase64);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[BrandVoiceFunc] Error:", error.message);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: "Handled exception in analyze-brand-voice",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
