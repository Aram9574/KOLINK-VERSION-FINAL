import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { BaseAIService } from "../_shared/services/BaseAIService.ts";
import { getCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  const headers = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const { auditResult, section, language } = await req.json();
    
    if (!auditResult || !section) {
        throw new Error("Missing required fields: auditResult, section");
    }

    const aiService = new BaseAIService(Deno.env.get("GEMINI_API_KEY")!);
    
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

    const systemInstruction = "You are a text generation engine. You must output ONLY the final suggested text. No introduction, no labels, no markdown quotes, no analysis. Just the raw string.";
    const prompt = `TASK: ${instructions}\n\nCONTEXT: ${context}\n\nLANGUAGE: ${isSpanish ? "Spanish" : "English"}\n\nREQUIRED OUTPUT: Raw text string only.`;

    const newSuggestion = await aiService.generateRawText(prompt, systemInstruction);

    return new Response(JSON.stringify({ suggestion: newSuggestion }), {
      headers: { ...headers, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("[RegenAudit] Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
});
