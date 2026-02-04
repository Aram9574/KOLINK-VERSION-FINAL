import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NicheRequest {
  fingerprint: string;
  topic: string;
  nicheTitle: string;
  roleContext: string;
  painPoint: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bodyStr = await req.text();
    console.log("Raw body:", bodyStr);
    
    let body: NicheRequest;
    try {
      body = JSON.parse(bodyStr);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { fingerprint, topic, nicheTitle, roleContext, painPoint } = body;

    if (!fingerprint || !topic || !nicheTitle) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: fingerprint, topic, nicheTitle" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // IP Extraction
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(',')[0] : "unknown";
    
    // Hash IP for privacy
    const ipHash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip)
    ).then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // RPC Rate Limit
    console.log("Checking rate limit for fingerprint:", fingerprint);
    const { data: limitData, error: limitError } = await supabaseClient
      .rpc("increment_tool_usage", {
        p_ip_hash: ipHash,
        p_fingerprint: fingerprint,
        p_tool_name: "niche_content"
      });

    if (limitError) {
      console.error("RPC Error Details:", limitError);
      throw new Error(`Rate limit RPC failed: ${limitError.message}`);
    }

    const [limitInfo] = limitData || [];
    if (!limitInfo) {
      throw new Error("No limit info returned from RPC");
    }
    
    if (limitInfo.limit_reached) {
      return new Response(
        JSON.stringify({ 
          error: "RATE_LIMIT_EXCEEDED",
          message: "Has alcanzado el límite de 3 usos diarios.",
          resetAt: limitInfo.reset_at,
          currentCount: limitInfo.current_count
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Gemini API
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) throw new Error("GEMINI_API_KEY missing");

    const prompt = `Actúa como ${roleContext}.
Tu nicho es: ${nicheTitle}.
El punto de dolor principal de tu audiencia es: ${painPoint}.

Escribe un post viral de LinkedIn en ESPAÑOL sobre el tema: "${topic}".

REGLAS:
- Empieza con un gancho potente.
- Párrafos cortos.
- Aporta valor real.
- 3-5 puntos clave.
- Termina con una pregunta.

Responde SOLO con JSON:
{
  "postContent": "Texto del post...",
  "strategy": "Por qué funcionará."
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
            response_schema: {
              type: "OBJECT",
              properties: {
                postContent: { type: "STRING" },
                strategy: { type: "STRING" }
              },
              required: ["postContent", "strategy"]
            }
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    let resultText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) throw new Error("No response from Gemini");

    const result = JSON.parse(resultText);

    return new Response(
      JSON.stringify({
        postContent: result.postContent,
        strategy: result.strategy,
        usageInfo: {
          currentCount: limitInfo.current_count,
          limit: 3,
          resetAt: limitInfo.reset_at
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Critical Function Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
