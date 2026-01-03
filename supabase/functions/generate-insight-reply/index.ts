import { serve } from "std/http/server.ts";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageBase64, textContext, userIntent, tone } = await req.json();

    // 1. Auth & User Context
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 2. Fetch Brand Voice (Active)
    const { data: voices } = await supabaseClient
      .from("brand_voices")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .limit(1);

    const brandVoice = voices?.[0];
    const brandContext = brandVoice 
        ? `\n\nUSER BRAND VOICE DNA:\n${JSON.stringify(brandVoice.stylisticDNA || brandVoice.description)}` 
        : "";

    // 3. Gemini Setup
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    // Upgrade to 2.0 Flash Exp for speed
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" }); 

    // 4. Construct Prompt
    const systemPrompt = `
      Actúa como un Estratega de Networking de Alto Nivel.
      Analiza la captura del post y genera 3 respuestas estratégicas:

      1. Análisis Profundo: Aporta un dato técnico o perspectiva médica/tech que nadie más haya visto.
      2. Puente Estratégico: Conecta el post con una tendencia macro del sector.
      3. Catalizador Experto: Haz una pregunta desafiante que genere debate con el autor.

      Reglas: 
      - Prohibido decir 'Buen post'. 
      - Empieza directamente con el valor. 
      - Máximo 60 palabras.
      
      Output: JSON Array con type, content y score.

      OUTPUT OBLIGATORIO (JSON Strict):
      [
        {
          "type": "Análisis Profundo",
          "content": "...",
          "score": 95,
          "reasoning": "..."
        },
        {
          "type": "Puente Estratégico",
          "content": "...",
          "score": 88,
          "reasoning": "..."
        },
        {
          "type": "Catalizador Experto",
          "content": "...",
          "score": 92,
          "reasoning": "..."
        }
      ]

      CONTEXT:
      - User Intent: ${userIntent || "Aportar valor estratégico"}
      - Desired Tone: ${tone || "Autoridad Profesional"}
      - LANGUAGE: STRICTLY SPANISH (Output must be in Spanish)
      ${brandContext}
    `;

    const parts: Part[] = [{ text: systemPrompt }];
    
    if (textContext) {
        parts.push({ text: `\n\nPOST TEXT:\n${textContext}` });
    }

    if (imageBase64) {
        // Base64 image handling
         parts.push({
            inlineData: {
                mimeType: "image/png", 
                data: imageBase64.split(',')[1] || imageBase64
            }
        });
    }

    const result = await model.generateContent({
        contents: [{ role: "user", parts: parts }],
        generationConfig: { responseMimeType: "application/json" }
    });

    const replies = JSON.parse(result.response.text());

    return new Response(JSON.stringify({ replies }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
