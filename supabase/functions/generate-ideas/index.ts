import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
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

    const { topic } = await req.json();

    // Fetch user language
    const { data: profile } = await supabaseClient.from("profiles").select(
      "language",
    ).eq("id", user.id).single();
    const language = profile?.language || "es";
    const isSpanish = language === "es";

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        Deno.env.get("GEMINI_API_KEY"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: isSpanish
                ? `Genera 5 ideas virales para posts de LinkedIn sobre: ${topic}.
                Las ideas deben ser variadas (ej: una historia personal, un consejo técnico, una opinión impopular, etc.)
                Responde estrictamente en formato JSON:
                {
                  "ideas": [
                    { "title": "...", "description": "...", "type": "..." }
                  ]
                }`
                : `Generate 5 viral ideas for LinkedIn posts about: ${topic}.
                The ideas should be diverse (e.g., a personal story, a technical tip, an unpopular opinion, etc.)
                Respond strictly in JSON format:
                {
                  "ideas": [
                    { "title": "...", "description": "...", "type": "..." }
                  ]
                }`,
            }],
          }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      },
    );

    const data = await response.json();
    const result = JSON.parse(data.candidates[0].content.parts[0].text);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return new Response(
      JSON.stringify({ error: err.message || "Internal error" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
