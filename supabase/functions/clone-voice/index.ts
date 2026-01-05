
import { createClient } from "jsr:@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";
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

    // 2. Call Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3.0-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
        ${VoiceBrain.system_instruction}
        
        ANALYZE THIS CONTENT:
        ${contentToAnalyze.substring(0, 15000)} // Safety limit
    `;

    const result = await model.generateContent(prompt);
    const textResult = result.response.text();
    const jsonResult = JSON.parse(textResult);

    // 3. Save to DB
    const { data: savedVoice, error: dbError } = await supabaseClient
        .from("brand_voices")
        .insert({
            user_id: user.id,
            voice_name: voice_name || jsonResult.voice_name || "New Voice",
            stylistic_dna: jsonResult.stylistic_dna,
            mimicry_instructions: jsonResult.mimicry_instructions,
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
            voice_name: savedVoice.voice_name,
            source: text_samples ? "text" : "url"
        }).catch(err => console.error("Tracking Error:", err));
    } catch (e) {
        console.error("BehaviorService Init Error:", e);
    }

    return new Response(JSON.stringify(savedVoice), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
