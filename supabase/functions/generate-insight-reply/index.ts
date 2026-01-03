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
    // Using 1.5 Flash until 2.0 is fully generally available/stable in this SDK context, or assuming 1.5 Flash is the "Multimodal Workhorse"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    // 4. Construct Prompt
    const systemPrompt = `
      Actúa como un Estratega de Marca Personal y Experto en el Sector Detectado.

      Tu misión: Analizar la captura de pantalla de un post de LinkedIn y generar 3 variantes de respuesta que aporten valor real, evitando clichés como 'Gracias por compartir'.

      Instrucciones Multimodales:

      Detección de Tesis: Identifica el argumento principal del autor original y su sentimiento.

      Inyección de Autoridad: Integra el ADN de marca del usuario (brand_voice) y sus temas clave (intent_input) para que la respuesta suene propia.

      Generación de Variantes:
      - Deep Dive: Añade un dato técnico o una perspectiva médica/tecnológica profunda.
      - The Bridge: Conecta el post con una tendencia macro del sector.
      - The Catalyst: Haz una pregunta desafiante pero respetuosa que incite al autor a responderte.

      OUTPUT OBLIGATORIO (JSON Strict):
      [
        {
          "type": "Deep Dive",
          "content": "...",
          "score": 95,
          "reasoning": "por qué esto te posiciona..."
        },
        {
          "type": "The Bridge",
          "content": "...",
          "score": 88,
          "reasoning": "..."
        },
        {
          "type": "The Catalyst",
          "content": "...",
          "score": 92,
          "reasoning": "..."
        }
      ]

      CONTEXT:
      - User Intent: ${userIntent || "Aportar valor estratégico"}
      - Desired Tone: ${tone || "Autoridad Profesional"}
      ${brandContext}

      RULES:
      - NO "Great post!", "Thanks for sharing!". 
      - Start directly with value.
      - Keep it under 60 words per reply.
      - RESPONSE MUST BE A VALID JSON ARRAY.
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
