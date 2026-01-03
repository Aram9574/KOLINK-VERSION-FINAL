import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@^0.1.0";
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
        ACT as a Viral Marketing Expert and Ghostwriter.
        Based on the User's Idea and the specific Brand Voice DNA, generate 5 viral hooks (opening lines) for a LinkedIn post.
        
        BRAND VOICE DNA:
        ${dnaContext}

        USER IDEA: "${idea}"

        LANGUAGE: ${language}

        INSTRUCTIONS:
        1. Strictly adhere to the "HOOK PATTERNS" from the DNA.
        2. If the DNA uses questions, use questions. If it uses statistics, invent a placeholder statistic.
        3. Output exactly 5 distinct options.
        4. Return ONLY a JSON array of strings. Example: ["Hook 1", "Hook 2"]
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
