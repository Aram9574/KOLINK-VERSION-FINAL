import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { idea, brandVoiceId, language = "es" } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Fetch Brand Voice
    const { data: voice } = await supabaseClient
        .from('brand_voices')
        .select('*')
        .eq('id', brandVoiceId)
        .single();

    if (!voice) throw new Error("Voice not found");

    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    // Upgrade to 2.0 Flash Exp
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Construct DNA Context
    let dnaContext = "";
    if (voice.stylistic_dna) {
        const dna = voice.stylistic_dna; // snake_case from DB
        dnaContext = `
            TONE: ${dna.tone || voice.tone_description}
            HOOK PATTERNS: ${JSON.stringify(dna.hooks_dna || voice.hook_patterns)}
            SENTENCE STRUCTURE: ${dna.sentence_structure}
            TECHNICAL TERMS: ${JSON.stringify(dna.technical_terms)}
        `;
    } else {
        dnaContext = `Tone: ${voice.tone_description}`;
    }

    const prompt = `
        Eres un Experto en Psicología de la Atención y Ghostwriter Viral. Basado en la idea [USER IDEA], genera 5 ganchos (opening lines) que detengan el scroll.
        
        INSTRUCCIONES:
        1. Debes usar estrictamente los patrones de hook detectados en el ADN de marca del usuario.
        2. Si el ADN usa preguntas, usa preguntas. Si usa estadísticas, inventa un placeholder.
        3. Output: JSON array de exactamente 5 strings.
        
        BRAND VOICE DNA:
        ${dnaContext}

        USER IDEA: "${idea}"
        LANGUAGE: ${language}
        
        OUTPUT FORMAT: ["Hook 1", "Hook 2", ...] (JSON Strict Array)
    `;

    const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
    });

    const hooks = JSON.parse(result.response.text());

    return new Response(JSON.stringify({ hooks }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
