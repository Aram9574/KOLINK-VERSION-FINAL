import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ScorecardRequest {
  fingerprint: string;
  profileUrl: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fingerprint, profileUrl }: ScorecardRequest = await req.json();

    if (!fingerprint || !profileUrl) {
      return new Response(
        JSON.stringify({ error: "Fingerprint and profileUrl are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get IP hash
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const ipHash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip)
    ).then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check rate limit (scorecard has limit of 2)
    const { data: limitData, error: limitError } = await supabaseClient
      .rpc("increment_tool_usage", {
        p_ip_hash: ipHash,
        p_fingerprint: fingerprint,
        p_tool_name: "scorecard"
      });

    if (limitError) {
      console.error("Rate limit check error:", limitError);
      return new Response(
        JSON.stringify({ error: "Failed to check rate limit" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const [limitInfo] = limitData || [];
    
    if (limitInfo?.limit_reached) {
      return new Response(
        JSON.stringify({ 
          error: "RATE_LIMIT_EXCEEDED",
          message: "Has alcanzado el límite de 2 análisis diarios. Regístrate para obtener acceso ilimitado.",
          resetAt: limitInfo.reset_at,
          currentCount: limitInfo.current_count
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate scorecard with Gemini
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const prompt = `Eres un experto en LinkedIn que analiza perfiles profesionales.

URL del perfil: ${profileUrl}

Analiza este perfil de LinkedIn y genera un scorecard básico con:
- Puntuación general (0-100)
- 3 fortalezas principales
- 3 áreas de mejora prioritarias
- Recomendación de acción inmediata

Responde SOLO con un JSON en este formato exacto:
{
  "overallScore": 75,
  "strengths": [
    "Fortaleza 1",
    "Fortaleza 2",
    "Fortaleza 3"
  ],
  "improvements": [
    "Mejora 1",
    "Mejora 2",
    "Mejora 3"
  ],
  "immediateAction": "Acción recomendada..."
}`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            response_mime_type: "application/json",
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from Gemini");
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify({
        scorecard: result,
        usageInfo: {
          currentCount: limitInfo.current_count,
          limit: 2,
          resetAt: limitInfo.reset_at
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
