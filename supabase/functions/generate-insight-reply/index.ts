import { createClient } from "@supabase/supabase-js";
import { EngagementService } from "../_shared/services/EngagementService.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageBase64, textContext, userIntent, tone } = await req.json();

    // 1. Auth & User Context
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 2. Fetch Brand Voice (Active)
    const { data: voices } = await supabaseClient
      .from("brand_voices")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .limit(1);

    const brandVoice = voices?.[0];

    // 3. User Language
    const { data: profile } = await supabaseClient.from("profiles").select("language").eq("id", user.id).single();
    const language = profile?.language || "es";
    console.log(`[insight-reply] User language: ${language}`);


    // Define expected return type based on Brain schema
    interface InsightReplyItem {
        type: string;
        content: string;
        score: number;
        reasoning: string;
        expected_outcome: string;
    }

    interface InsightResponse {
        suggested_replies: InsightReplyItem[];
    }
    
    // 4. Engagement Service (Modular Brain)
    console.log("[insight-reply] Step 4: Initializing Engagement Service and generating reply.");
    const engagementService = new EngagementService(Deno.env.get("GEMINI_API_KEY")!);
    
    const result = await engagementService.generateInsightReply({
      textContext,
      imageBase64,
      userIntent,
      tone,
      brandVoiceData: brandVoice,
      language: language
    }) as unknown as InsightResponse;
    console.log("[insight-reply] Reply generated successfully.");

    // 5. Save to Database (New Feature)
    const { error: dbError } = await supabaseClient
      .from("insight_responses")
      .insert({
        user_id: user.id,
        original_post_url: textContext.substring(0, 200) + "...", // Truncate as a rough "source" ref if no URL provided
        user_intent: userIntent,
        tone: tone,
        // Safe access to content property
        generated_response: result.suggested_replies?.[0]?.content || "", 
        original_post_image_url: imageBase64 ? "image_provided" : null
      });

    if (dbError) console.error("[insight-reply] DB Save Error:", dbError.message);

    return new Response(JSON.stringify({ replies: result.suggested_replies }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("[insight-reply] CRITICAL ERROR:", err.message);
    console.error(err.stack);
    return new Response(JSON.stringify({ 
        error: err.message || "Unknown error",
        stack: err.stack,
        details: "Check function logs for more info"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
