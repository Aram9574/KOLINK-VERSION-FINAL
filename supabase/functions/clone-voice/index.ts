
// @ts-ignore: Deno import map support in IDE is limited
import { createClient } from "@supabase/supabase-js";
// import { GoogleGenerativeAI } from "npm:@google/generative-ai"; // Removed
import { VoiceBrain } from "../_shared/prompts/VoiceBrain.ts";
import { BehaviorService } from "../_shared/services/BehaviorService.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text_samples, url, voice_name } = await req.json();

    if (!text_samples && !url) {
      throw new Error("Must provide 'text_samples' (array) or 'url'.");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 1. Prepare Context for Gemini
    let contentToAnalyze = "";
    if (text_samples) {
        contentToAnalyze = text_samples.join("\n\n---\n\n");
    } else if (url) {
        // Here we would fetch the URL content (not implemented fully for simplicity, trusting text_samples from frontend scraping)
        contentToAnalyze = `Content from URL: ${url}`; 
    }

    // 2. Call Gemini (Raw Fetch)
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

    const prompt = `
        ${VoiceBrain.system_instruction}
        
        ANALYZE THIS CONTENT:
        ${contentToAnalyze.substring(0, 15000)} // Safety limit
    `;

    const model = "gemini-3.0-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                voice_name: { type: "STRING" },
                stylistic_dna: {
                  type: "OBJECT",
                  properties: {
                    rhythm_score: { type: "STRING" },
                    vocabulary_profile: { type: "ARRAY", items: { type: "STRING" } },
                    forbidden_patterns: { type: "ARRAY", items: { type: "STRING" } },
                    punctuation_logic: { type: "STRING" },
                    emotional_anchors: { type: "ARRAY", items: { type: "STRING" } },
                    formatting_rules: { type: "STRING" }
                  }
                },
                mimicry_instructions: { type: "STRING" },
                strategic_intent_discovery: {
                    type: "OBJECT",
                    properties: {
                        primary_goal: { type: "STRING" },
                        trigger_used: { type: "STRING" },
                        content_pillar: { type: "STRING" }
                    }
                }
              }
            }
          }
        }),
      }
    );

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Raw Gemini Response:", textResult); // Debug log

    if (!textResult) throw new Error("No content returned from Gemini");

    let jsonResult;
    try {
        // Clean up markdown code blocks if present
        const cleanText = textResult.replace(/```json\n|\n```/g, "").trim();
        jsonResult = JSON.parse(cleanText);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        throw new Error(`Failed to parse Gemini response: ${textResult}`);
    }

    // Validate structure immediately
    if (!jsonResult.stylistic_dna) {
        throw new Error(`Invalid AI Response (Missing DNA): ${JSON.stringify(jsonResult)}`);
    }

    // 3. Save to DB
    const { data: savedVoice, error: dbError } = await supabaseClient
        .from("brand_voices")
        .insert({
            user_id: user.id,
            name: voice_name || jsonResult.voice_name || "New Voice",
            stylistic_dna: jsonResult.stylistic_dna,
            description: jsonResult.mimicry_instructions, // Map instructions to description
            is_active: false // User manually activates
        })
        .select()
        .single();

    if (dbError) throw dbError;

    // 4. Track Event for Business Logic
    try {
        const behaviorService = new BehaviorService(
            Deno.env.get("GEMINI_API_KEY") ?? "",
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );
        behaviorService.trackEvent(user.id, "voice_cloned", { 
            voice_name: savedVoice.name,
            source: text_samples ? "text" : "url"
        }).catch(err => console.error("Tracking Error:", err));
    } catch (e) {
        console.error("BehaviorService Init Error:", e);
    }

    return new Response(JSON.stringify(savedVoice), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
