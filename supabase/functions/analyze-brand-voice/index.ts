import { serve } from "std/http/server";
import { createClient } from "@supabase/supabase-js";
import { AnalysisService } from "./services/AnalysisService.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    const { data: { user }, error: authError } = await supabaseClient.auth
      .getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { contentSamples, language } = await req.json();

    if (
      !contentSamples || !Array.isArray(contentSamples) ||
      contentSamples.length === 0
    ) {
      throw new Error("Missing content samples");
    }

    const analysisService = new AnalysisService(
      Deno.env.get("GEMINI_API_KEY") ?? "",
    );

    const result = await analysisService.analyzeVoice({
      contentSamples,
      language: language || "en",
    });

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
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
