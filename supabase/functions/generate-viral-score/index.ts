import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GeminiResponse } from "../_shared/services/BaseAIService.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const MODEL = "gemini-3.0-flash";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { topic, language = "es" } = await req.json();

    if (!topic) {
      throw new Error("Topic or content is required");
    }

    const systemPrompt = `
    ROLE: You are **KOLINK VIRAL ENGINE**, the world's most advanced LinkedIn Content Auditor and Viral Architect.
    
    TASK: Analyze the provided "Content Seed" or "Draft" and calculate its viral potential using modern LinkedIn algorithms (2025-2026).
    
    IDENTITY MOMENT: You must assign a "Creator Archetype" that makes the user feel seen and special (e.g., 'The Disruptive Visionary', 'The Growth Engineer', 'The Authentic Storyteller', 'The Tactical Mentor').
    
    OUTPUT SCHEMA (STRICT JSON):
    {
      "score": number (0-100),
      "archetype": "string (Catchy, identity-forming name)",
      "analysis": "string (Compelling analysis of why this works or fails)",
      "tips": ["3 specific, actionable tips to increase reach"],
      "viral_coefficient": "string (Low | Medium | High | Extreme)"
    }
    
    LANGUAGE: ${language === "es" ? "Spanish" : "English"}
    
    CRITICAL: Design the result as an "Identity Moment". The user should want to screenshot this result because it defines them.
    `;

    const userPrompt = `Analyze this LinkedIn content for viral potential: 
    
    ---
    "${topic}"
    ---`;

    const payload = {
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I am the KOLINK VIRAL ENGINE. I will provide a premium, identity-focused viral analysis in JSON format." }] },
        { role: "user", parts: [{ text: userPrompt }] }
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data: GeminiResponse = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No response from AI engine");
    }

    return new Response(text, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: unknown) {
    const error = err as Error;
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
