import { serve } from "std/http/server.ts";
import { BaseAIService } from "shared/services/BaseAIService.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { slides, title } = await req.json();

    if (!slides || !title) {
        throw new Error("Missing slides or title");
    }

    const aiService = new BaseAIService(Deno.env.get('GEMINI_API_KEY') || '');

    // Construct Context from Slides
    const slidesContext = slides.map((s: any, i: number) => {
        return `Slide ${i+1} (${s.type}): ${s.content.title || ''} - ${s.content.body || ''}`;
    }).join('\n');

    const prompt = `
      You are a Viral LinkedIn Ghostwriter.
      
      TASK: Write a high-engagement LinkedIn post text to accompany this carousel.
      
      CONTEXT:
      Carousel Title: "${title}"
      Slides Content:
      ${slidesContext}

      REQUIREMENTS:
      1. HOOK: First line must be a scroll-stopping hook (under 12 words).
      2. BODY: Summarize the key value provided in the carousel using bullet points or short paragraphs.
      3. TONE: Professional but conversational, authoritative yet accessible.
      4. CTA: End with a question to drive comments.
      5. FORMATTING: Use line breaks for readability. Use simple emojis effectively (not too many).
      6. LANGUAGE: Detect the language of the carousel content (Spanish or English) and write the post in the SAME language.

      OUTPUT FORMAT:
      Return a JSON object with a single key "caption" containing the full post text string.
      Example: { "caption": "Hook line...\n\nBody text...\n\nCTA" }
    `;

    const result = await aiService.generateRawText(prompt, "You are a JSON generator. Output valid JSON.");
    
    // Parse result to ensure valid JSON structure
    let jsonResponse;
    try {
        const cleanJson = result.replace(/```json/g, '').replace(/```/g, '').trim();
        jsonResponse = JSON.parse(cleanJson);
    } catch (e) {
        // Fallback if AI returns raw text instead of JSON
        jsonResponse = { caption: result };
    }

    return new Response(JSON.stringify(jsonResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: unknown) {
    const error = err as Error;
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
