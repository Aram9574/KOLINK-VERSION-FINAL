// @ts-ignore: Deno import map support
import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || ""; 

// Using the project standard model found in BaseAIService.ts
// The user explicitly requested Gemini 3 Flash.
const MODEL = "gemini-3.0-flash"; 

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { industry = "Tech & AI", keywords = [], language = "es" } = await req.json();

    const prompt = `
      ROLE: Trend Hunter AI.
      OUTPUT LANGUAGE: ${language.toUpperCase()}.
      
      TASK: Generate 21 (TWENTY-ONE) diverse, high-potential trending topics relevant to: ${industry} ${keywords.join(", ")}.
      Current Date: ${new Date().toISOString().split('T')[0]}.
      
      CRITICAL: Ensure variety. Mix global news, niche regulatory updates, and social media shifts.
      If "keywords" are empty, focus on global Tech, AI, and Business trends.
      
      For each trend, provide:
      1. A catchy Title in ${language}.
      2. A concise Summary (2 sentences max) in ${language}.
      3. A plausible Source (e.g., TechCrunch, LinkedIn News, Bloomberg).
      4. A Category (news, social, regulatory, search).
      5. A Match Score (70-99).

      Return ONLY a raw JSON array. strictly following this format:
      [
        {
          "id": "unique_string",
          "title": "Title",
          "summary": "Summary",
          "source": "Source",
          "category": "news", 
          "matchScore": 88,
          "timestamp": ${Date.now()}
        }
      ]
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9, 
            maxOutputTokens: 8000,
            responseMimeType: "application/json"
          },
        }),
      }
    );

    const data = await response.json();
    
    // DEBUG: Check for error immediately
    if (data.error) {
        console.error("Gemini Upstream Error:", data.error);
        return new Response(JSON.stringify({ error: "Gemini API Error", details: data.error }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
         return new Response(JSON.stringify({ error: "No candidates returned", debug: data }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
    
    // Clean code blocks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Attempt parsing
    let trends = [];
    try {
        trends = JSON.parse(text);
        if (!Array.isArray(trends)) trends = [];
    } catch (_parseError) {
        // If strict JSON parsing fails, return fallback or partial?
        // Returning 500 so client uses MOCK_TRENDS is safer than serving broken data.
        return new Response(JSON.stringify({ error: "JSON Parse Failed", text: text.substring(0, 500) }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }

    return new Response(JSON.stringify(trends), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
