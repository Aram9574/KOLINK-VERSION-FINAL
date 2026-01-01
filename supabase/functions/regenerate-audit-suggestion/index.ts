import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AIService } from "../_shared/AIService.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { auditResult, section, language } = await req.json();
    
    if (!auditResult || !section) {
        throw new Error("Missing required fields: auditResult, section");
    }

    const aiService = new AIService(Deno.env.get("GEMINI_API_KEY")!);
    
    const isSpanish = language === "es";
    let instructions = "";
    let context = "";

    if (section === "headline") {
        context = `Current Headline: "${auditResult.headline.current}". Identified Gaps: ${auditResult.headline.analysis}`;
        instructions = `Generate ONE (1) premium, high-converting LinkedIn Headline using the user's experience: ${JSON.stringify(auditResult.experience)}. Ensure it addresses the analysis gaps.`;
    } else if (section === "about") {
        context = `Key Missing Skills/Keywords: ${auditResult.about.missingKeywords.join(", ")}. Analysis: ${auditResult.about.analysis}`;
        instructions = `Generate ONE (1) professional LinkedIn Summary (About section) that incorporates these skills: ${JSON.stringify(auditResult.skills.current)}. It must be engaging and metric-driven.`;
    }

    // We bypass generateExpertResponse to ensure we get ONLY the raw text without conversational filler
    // This is critical for the "Regenerate" button which expects just the string.
    const model = aiService['genAI'].getGenerativeModel({
        model: "gemini-3-flash-preview", 
        systemInstruction: "You are a text generation engine. You must output ONLY the final suggested text. No introduction, no labels (like 'Here is the text'), no markdown quotes, no analysis. Just the raw string."
    });

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `TASK: ${instructions}\n\nCONTEXT: ${context}\n\nLANGUAGE: ${isSpanish ? "Spanish" : "English"}\n\nREQUIRED OUTPUT: Raw text string only.` }] }],
        generationConfig: {
            temperature: 0.7, // Higher creativity for variations
            maxOutputTokens: 500,
        }
    });

    const newSuggestion = result.response.text().trim();

    return new Response(JSON.stringify({ suggestion: newSuggestion }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
