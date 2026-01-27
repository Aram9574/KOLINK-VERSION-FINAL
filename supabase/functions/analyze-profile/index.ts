import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { pdfBase64, imageBase64 } = await req.json();

    // 1. Auth Validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        throw new Error("Missing Auth Header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
        throw new Error("Unauthorized User");
    }

    // 2. Setup Gemini via SDK
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Prepare Content
    // 3. Prepare Content
    const prompt = `
      You are an elite LinkedIn Profile Auditor (10+ Years Experience).
      Analyze the provided profile (PDF or Image). Be BRUTAL, specific, and strategic.
      
      RETURN JSON ONLY (No Markdown):
      {
        "authority_score": number (0-100),
        "visual_score": number (0-100),
        "brutal_diagnosis": "string (2 sentences)",
        "quick_wins": ["string", "string", "string"],
        "strategic_roadmap": {
            "headline": "New Headline Idea",
            "about": "New About Hook Idea",
            "experience": "Positioning Tip"
        },
        "visual_critique": "string",
        "technical_seo_keywords": ["keyword1", "keyword2", "keyword3"],
        "processed_data": {
            "name": "string",
            "headline": "string",
            "skills": ["string"]
        }
      }
    `;

    // Explicitly type array to allow mixed content (String + Part Objects)
    const parts: any[] = [prompt];

    if (pdfBase64) {
        parts.push({
            inlineData: {
                data: pdfBase64,
                mimeType: "application/pdf"
            }
        });
    } else if (imageBase64) {
        parts.push({
            inlineData: {
                data: imageBase64,
                mimeType: "image/jpeg"
            }
        });
    }

    // 4. Generate
    console.log("Generating via SDK...");
    const result = await model.generateContent(parts);
    const responseText = result.response.text();

    console.log("Raw Response:", responseText.substring(0, 100) + "...");

    // 5. Parse
    let jsonResult;
    try {
        const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        jsonResult = JSON.parse(cleaned);
    } catch(e) {
        console.error("Parse Error", e);
        throw new Error("Failed to parse AI response");
    }

    // 6. Enrich
    const finalData = {
        ...jsonResult,
        source_type: pdfBase64 ? 'pdf' : 'visual'
    };

    // 7. Store (Async)
    supabaseClient.from("audits").insert({
        user_id: user.id,
        profile_url: "File Upload",
        results: finalData
    }).then(() => console.log("Audit saved"));

    return new Response(JSON.stringify(finalData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Handler Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
