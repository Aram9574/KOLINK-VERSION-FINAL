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
    const prompt = `
      ACT AS: Senior LinkedIn SEO Strategist & Conversion Copywriter (Top 1% Voice).
      CONTEXT: You are auditing a user's LinkedIn profile to turn it into a high-conversion funnel.
      
      EVALUATION CRITERIA (Strict Technical Grading):
      1. **Discoverability (SEO - 30%)**: 
         - Check Headline: Does it have exact match keywords (Role + Industry)?
         - Check About: Are hard skills mentioned in the first 3 lines?
      2. **Authority (Social Proof - 30%)**:
         - Does the Banner prove competence? 
         - Are there quantitative metrics in Experience?
      3. **Conversion (CRO - 40%)**:
         - Is there a clear CTA?
         - Is the "featured" section used strategically?

      RETURN JSON ONLY (No Markdown):
      {
        "authority_score": number (0-100),
        "visual_score": number (0-100),
        "seo_score": number (0-100),
        "total_score": number (0-100),
        "brutal_diagnosis": "string (Direct, professional, no fluff. 2 sentences max)",
        "quick_wins": ["string (Actionable fix 1)", "string (Actionable fix 2)", "string (Actionable fix 3)"],
        "strategic_roadmap": {
            "headline": "Rewrite suggestion optimized for SEO",
            "about": "Rewrite suggestion for the 'Hook' (first 3 lines)",
            "experience": "Tip to add quantification (e.g., 'Matches 98% of recruiters search')"
        },
        "visual_critique": "string (Feedback on Headshot/Banner)",
        "technical_seo_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
        "processed_data": {
            "name": "string",
            "headline": "string",
            "current_role_match": boolean
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
