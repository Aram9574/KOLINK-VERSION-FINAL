import { serve } from "std/http/server";
import { corsHeaders } from "../_shared/cors.ts";

// Interfaces matching frontend exactly
interface Slide {
  number: number;
  title: string;
  content: string;
}

interface CarouselResponse {
  carousel_config: {
    slides_count: number;
    tone: string;
    target_audience: string;
    core_value: string;
    analysis: string;
  };
  slides: Slide[];
}

// 1. Simple Extraction (Text Only Mode)
function extractContent(source: string): string {
  // User requested to remove URL/YouTube logic.
  // We treat everything as raw text to prevent any scraping errors.
  return `[RAW TEXT]: ${source.substring(0, 15000)}`;
}

// 2. Gemini Generation (REST API)
async function generateCarousel(
  content: string,
  language: string,
  apiKey: string,
): Promise<CarouselResponse> {
  // Using Gemini 2.0 Flash Experimental as requested ("Gemini 3 Flash" user term)
  const model = "gemini-2.0-flash-exp";
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const responseSchema = {
    type: "OBJECT",
    properties: {
      carousel_config: {
        type: "OBJECT",
        properties: {
          slides_count: { type: "INTEGER" },
          tone: { type: "STRING" },
          target_audience: { type: "STRING" },
          core_value: { type: "STRING" },
          analysis: { type: "STRING" },
        },
        required: [
          "slides_count",
          "tone",
          "target_audience",
          "core_value",
          "analysis",
        ],
      },
      slides: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            number: { type: "INTEGER" },
            title: { type: "STRING" },
            content: { type: "STRING" },
          },
          required: ["number", "title", "content"],
        },
      },
    },
    required: ["carousel_config", "slides"],
  };

  const prompt = `
    You are the "Kolink AI", a viral LinkedIn content expert.
    
    TASK:
    Generate a complete LinkedIn Carousel based on the INPUT below.
    
    INPUT:
    ${content}
    
    CRITICAL REQUIREMENTS:
    1. Language: ${language === "es" ? "SPANISH" : "ENGLISH"} ONLY.
    2. Slide Count: You MUST generate between 7 and 12 slides. LESS THAN 7 IS FORBIDDEN.
    3. NO EMPTY SLIDES: The 'slides' array must contain actual data.
    4. Style: Punchy, short sentences. "Bro-poetry" format. High impact hooks.
    5. Slide 1: Killer Hook (Must stop the scroll).
    6. Last Slide: Value-driven Call to Action.
    
    OUTPUT FORMAT:
    Strict JSON matching the schema.
  `;

  console.log(`[Gemini] Sending request to ${model}...`);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4, // Slightly higher creativity to ensure content generation
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Gemini] API Error ${response.status}:`, errorText);
    throw new Error(`Gemini API Failed: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from AI");

  const parsed = JSON.parse(text);

  // Verification: Ensure we actually got slides
  if (!parsed.slides || parsed.slides.length === 0) {
    console.error("[Gemini] Returned 0 slides. Retrying/Throwing.");
    throw new Error(
      "AI generated 0 slides. Please try again with more content.",
    );
  }

  return parsed;
}

// 3. MAIN SERVER
serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { source, language = "es" } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY")!;

    if (!source || !apiKey) throw new Error("Missing source or API key");

    console.log(`[Func] Processing source length: ${source.length}`);
    const enriched = await extractContent(source);
    const result = await generateCarousel(enriched, language, apiKey);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[Func] Error:`, error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
