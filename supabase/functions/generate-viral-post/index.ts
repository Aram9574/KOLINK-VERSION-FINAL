// No import needed for Deno.serve in modern Deno/Supabase environments.

// @ts-ignore: Deno import map support
import { createClient } from "@supabase/supabase-js";
// @ts-ignore: Deno import map support
import { z } from "zod";
import { CreditService } from "../_shared/services/CreditService.ts";
import { ContentService as AIService, GenerationParams } from "../_shared/services/ContentService.ts";
import { PostRepository, GeneratedPost } from "../_shared/services/PostRepository.ts";
import { GamificationService } from "../_shared/services/GamificationService.ts";
import { sanitizeInput } from "../_shared/validation.ts";
import { GenerationParamsSchema } from "../_shared/schemas.ts";
import { BehaviorService } from "../_shared/services/BehaviorService.ts";

import { corsHeaders } from "../_shared/cors.ts";

// Remove local corsHeaders definition


Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const debugLogs: string[] = [];
  try {
    // 1. Setup & Auth
    const authHeader = req.headers.get("Authorization");
    console.log("[DEBUG] Auth Header Present:", !!authHeader);
    if (authHeader) console.log("[DEBUG] Auth Header Start:", authHeader.substring(0, 15) + "...");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader! },
        },
      },
    );

    const { data: { user }, error: authError } = await supabaseClient.auth
      .getUser();
    
    console.log("[DEBUG] getUser Result:", { user_id: user?.id, error: authError?.message });

    if (authError || !user) {
      console.error("Unauthorized Access logic triggered");
      // Return 401 explicit response to see it in network tab if possible
       return new Response(
          JSON.stringify({ error: "Unauthorized", details: authError?.message || "No user found" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
    }

    const { params } = await req.json();

    // Validate Params with Zod
    let safeParams: GenerationParams;
    try {
      const parsed = GenerationParamsSchema.parse(params);
      safeParams = {
        topic: sanitizeInput(parsed.topic),
        audience: sanitizeInput(parsed.audience),
        tone: parsed.tone,
        framework: parsed.framework,
        emojiDensity: parsed.emojiDensity,
        length: parsed.length,
        creativityLevel: parsed.creativityLevel,
        hashtagCount: parsed.hashtagCount,
        includeCTA: parsed.includeCTA,
        outputLanguage: parsed.outputLanguage,
        brandVoiceId: parsed.brandVoiceId,
        hookStyle: parsed.hookStyle,
        generateCarousel: parsed.generateCarousel,
      } as GenerationParams;
    } catch (zodError: unknown) {
      if (zodError instanceof z.ZodError) {
        return new Response(
          JSON.stringify({
            error: "Validation Error",
            details: (zodError as z.ZodError).errors,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      throw zodError;
    }

    // Create Admin Client for DB operations (Bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Initialize Services
    debugLogs.push("Start Function");
    
    // Initialize Services with error handling
    if (!Deno.env.get("GEMINI_API_KEY")) {
        console.error("CRITICAL: GEMINI_API_KEY is missing in Edge Function secrets.");
        throw new Error("Configuration Error: AI Service not configured (Missing Key)");
    }

    debugLogs.push("Init Services");
    const creditService = new CreditService(supabaseAdmin, supabaseClient);
    const aiService = new AIService(Deno.env.get("GEMINI_API_KEY") ?? "");
    const postRepository = new PostRepository(supabaseAdmin);
    const gamificationService = new GamificationService(supabaseAdmin);
    
    // Behavior service is optional-ish, but let's init it safely
    const behaviorService = new BehaviorService(
        Deno.env.get("GEMINI_API_KEY") ?? "",
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 2. Check Credits, Rate Limit & Fetch Context
    console.log("Fetching profile for User ID:", user.id);
    debugLogs.push(`Fetching profile for ${user.id}`);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile not found error:", profileError);
      debugLogs.push("Profile Fetch Error: " + JSON.stringify(profileError));
      return new Response(
        JSON.stringify({ error: "Profile Not Found", details: "User profile does not exist or fetch failed.", debug: debugLogs }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    debugLogs.push("Profile Found");

    const isPremium = ["pro", "viral"].includes(profile.plan_tier);
    if (!isPremium && profile.credits <= 0) {
      debugLogs.push("Insufficient Credits");
      return new Response(
        JSON.stringify({ error: "Insufficient Credits", details: "Please upgrade or wait for renewal.", debug: debugLogs }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: lastPost } = await supabaseAdmin
      .from("posts")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (lastPost) {
      const lastPostTime = new Date(lastPost.created_at).getTime();
      const now = Date.now();
      const diff = now - lastPostTime;
      if (diff < 10000) { // 10 seconds cooldown
        debugLogs.push("Rate Limited");
        return new Response(
            JSON.stringify({ error: "Rate Limit Exceeded", details: "Please wait 10 seconds between generations.", debug: debugLogs }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    debugLogs.push("Rate Limit OK");

    // 3. Prepare Params
    let brandVoiceDescription = "";

    // A. Explicit Override via Params
    if (safeParams.brandVoiceId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(safeParams.brandVoiceId)) {
        const { data: bVoice } = await supabaseAdmin
          .from("brand_voices")
          .select("description")
          .eq("id", safeParams.brandVoiceId)
          .eq("user_id", user.id)
          .single();
        if (bVoice) brandVoiceDescription = bVoice.description;
      }
    } 
    // B. Default to Active Voice from Profile
    else if (profile.active_voice_id) {
         const { data: activeVoice } = await supabaseAdmin
          .from("brand_voices")
          .select("description")
          .eq("id", profile.active_voice_id)
          .single();
         if (activeVoice) brandVoiceDescription = activeVoice.description;
    }

    // C. Final Fallback
    if (!brandVoiceDescription) {
        brandVoiceDescription = "Professional and engaging";
    }

    const userContext = {
      brand_voice: sanitizeInput(brandVoiceDescription),
      company_name: sanitizeInput(profile.company_name || ""),
      industry: sanitizeInput(profile.industry || ""),
      headline: sanitizeInput(profile.headline || ""),
      xp: profile.xp_points || 0,
      language: profile.language,
      behavioral_dna: profile.behavioral_dna ? JSON.stringify(profile.behavioral_dna) : "",
    };
    debugLogs.push("Context Prepared");

    // 4. Generate Content
    debugLogs.push("Calling AI Service...");
    const rawGeneratedContent = await aiService.generatePost(
      safeParams,
      userContext,
    );
    debugLogs.push("AI Service Response Received");
    const generatedContent = rawGeneratedContent as GeneratedPost;

    // 5. Save Post
    debugLogs.push("Saving Post...");
    const insertedPost = await postRepository.savePost(
      user.id,
      generatedContent,
      params,
    );
    debugLogs.push("Post Saved");

    // 5.5 Track Behavior (Fire and forget)
    // Avoid unhandled promise rejection crashing the runtime in some strict modes
    behaviorService.trackEvent(user.id, "post_generated", { 
        topic: safeParams.topic, 
        tone: safeParams.tone, 
        framework: safeParams.framework,
        isPremium 
    }).catch(e => console.error("Behavior tracking error (non-fatal):", e));

    // 6. Validated Gamification Update
    debugLogs.push("Gamification...");
    const { count: postCount } = await supabaseAdmin
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    const gamificationResults = await gamificationService.processGamification(
      profile, 
      safeParams,
      postCount || 0, 
    );
    debugLogs.push("Gamification Done");

    // Apply updates to DB
    const currentAchievements = profile.unlocked_achievements || [];
    const newAchievements = gamificationResults.newAchievements;
    const allAchievements = Array.from(
      new Set([...currentAchievements, ...newAchievements]),
    );

    await supabaseAdmin
      .from("profiles")
      .update({
        xp_points: gamificationResults.newXP,
        level: gamificationResults.newLevel,
        current_streak: gamificationResults.newStreak,
        last_post_at: insertedPost?.created_at || new Date().toISOString(),
        unlocked_achievements: allAchievements,
      })
      .eq("id", user.id);

    // 7. Deduct Credit (Only if not premium)
    if (!isPremium) {
      debugLogs.push("Deducting Credit");
      await creditService.deductCredit(user.id);
    }
    debugLogs.push("Finished");

    return new Response(
      JSON.stringify({
        id: insertedPost?.id,
        postContent: generatedContent.post_content,
        viralScore: generatedContent.auditor_report.viral_score,
        viralAnalysis: {
          hookStrength: generatedContent.auditor_report.hook_strength,
          hookScore: generatedContent.auditor_report.hook_score,
          readabilityScore: generatedContent.auditor_report.readability_score,
          valueScore: generatedContent.auditor_report.value_score,
          proTip: generatedContent.auditor_report.pro_tip,
          feedback: generatedContent.auditor_report.pro_tip,
          retentionEstimate: generatedContent.auditor_report.retention_estimate,
          flagsTriggered: generatedContent.auditor_report.flags_triggered,
          strategyReasoning: generatedContent.strategy_reasoning,
        },
        meta: generatedContent.meta,
        gamification: {
          newXP: gamificationResults.newXP,
          newLevel: gamificationResults.newLevel,
          newStreak: gamificationResults.newStreak,
          newAchievements: gamificationResults.newAchievements,
          leveledUp: gamificationResults.leveledUp,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    console.error("Endpoint Error:", error);
    const err = error as Error;
    
    // Determine status code based on error type
    // Determine status code based on error type (Logging only in debug mode)
    // if (err.message.includes("Configuration Error")) status = 503;
    // ...

    return new Response(
      JSON.stringify({
        error: err.message || String(error),
        details: "Handled exception in generate-viral-post (DEBUG MODE: STATUS 200)",
        debug: debugLogs 
      }),
      {
        status: 200, // Force 200 to bypass CORS on error for debugging
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
