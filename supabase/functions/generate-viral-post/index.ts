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
import { getCorsHeaders } from "../_shared/cors.ts"; // IMPORTACIÓN ACTUALIZADA
import { SecurityLogger } from "../_shared/services/SecurityLogger.ts";


Deno.serve(async (req: Request) => {
  // 1. OBTENER HEADERS DINÁMICOS
  const headers = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  const debugLogs: string[] = [];
  try {
    const authHeader = req.headers.get("Authorization");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader! } } },
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
       return new Response(
          JSON.stringify({ error: "Unauthorized", details: authError?.message || "No user found" }),
          { status: 401, headers: { ...headers, "Content-Type": "application/json" } },
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
          JSON.stringify({ error: "Validation Error", details: (zodError as z.ZodError).errors }),
          { status: 400, headers: { ...headers, "Content-Type": "application/json" } },
        );
      }
      throw zodError;
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    if (!Deno.env.get("GEMINI_API_KEY")) {
        throw new Error("Configuration Error: AI Service not configured (Missing Key)");
    }

    const creditService = new CreditService(supabaseAdmin, supabaseClient);
    const aiService = new AIService(Deno.env.get("GEMINI_API_KEY") ?? "");
    const postRepository = new PostRepository(supabaseAdmin);
    const gamificationService = new GamificationService(supabaseAdmin);
    const behaviorService = new BehaviorService(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const securityLogger = new SecurityLogger(supabaseAdmin);

    // Check Credits & Rate Limit
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles").select("*").eq("id", user.id).single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Profile Not Found", details: "User profile does not exist." }),
        { status: 404, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }

    const isPremium = ["pro", "viral"].includes(profile.plan_tier);
    if (!isPremium && profile.credits <= 0) {
      return new Response(
        JSON.stringify({ error: "Insufficient Credits", details: "Please upgrade or wait for renewal." }),
        { status: 402, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }

    // Rate Limit Check
    const { data: lastPost } = await supabaseAdmin
      .from("posts").select("created_at").eq("user_id", user.id)
      .order("created_at", { ascending: false }).limit(1).single();

    if (lastPost) {
      const diff = Date.now() - new Date(lastPost.created_at).getTime();
      if (diff < 10000) {
        return new Response(
            JSON.stringify({ error: "Rate Limit Exceeded", details: "Please wait 10 seconds." }),
            { status: 429, headers: { ...headers, "Content-Type": "application/json" } }
        );
      }
    }

    // Prepare Context & Generate
    let brandVoiceDescription = "Professional and engaging";
    if (safeParams.brandVoiceId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(safeParams.brandVoiceId)) {
        const { data: bVoice } = await supabaseAdmin
          .from("brand_voices").select("description")
          .eq("id", safeParams.brandVoiceId).eq("user_id", user.id).single();
        if (bVoice) brandVoiceDescription = bVoice.description;
      }
    } else if (profile.active_voice_id) {
         const { data: activeVoice } = await supabaseAdmin
          .from("brand_voices").select("description").eq("id", profile.active_voice_id).single();
         if (activeVoice) brandVoiceDescription = activeVoice.description;
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
    // 2. CHECK DAILY QUOTA (WAF/Resource protection)
    await creditService.checkAndUpdateQuota(user.id, profile.plan_tier);

    const generatedContent = await aiService.generatePost(safeParams, userContext) as GeneratedPost;
    
    // 3. DETECT PROMPT INJECTION / JAILBREAK
    const fullAiOutput = (generatedContent.post_content + " " + generatedContent.strategy_reasoning).toUpperCase();
    if (fullAiOutput.includes("REQUEST_DENIED_SECURITY")) {
      await securityLogger.logEvent(user.id, "prompt_injection_attempt", "critical", {
        topic: safeParams.topic,
        audience: safeParams.audience,
        ai_response: generatedContent.post_content,
        strategy_reasoning: generatedContent.strategy_reasoning
      });
      throw new Error("Security Alert: Malicious input detected and logged.");
    }

    const insertedPost = await postRepository.savePost(user.id, generatedContent, params);

    behaviorService.trackEvent(user.id, "post_generated", { 
        topic: safeParams.topic, isPremium 
    }).catch(e => console.error(e));

    // Gamification
    const { count: postCount } = await supabaseAdmin
      .from("posts").select("id", { count: "exact", head: true }).eq("user_id", user.id);

    const gamificationResults = await gamificationService.processGamification(
      profile, safeParams, postCount || 0, 
    );

    const currentAchievements = profile.unlocked_achievements || [];
    const allAchievements = Array.from(new Set([...currentAchievements, ...gamificationResults.newAchievements]));

    await supabaseAdmin.from("profiles").update({
        xp_points: gamificationResults.newXP,
        level: gamificationResults.newLevel,
        current_streak: gamificationResults.newStreak,
        last_post_at: insertedPost?.created_at || new Date().toISOString(),
        unlocked_achievements: allAchievements,
      }).eq("id", user.id);

    if (!isPremium) {
      await creditService.deductCredit(user.id);
    }

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
        gamification: gamificationResults,
      }),
      { headers: { ...headers, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    const err = error as Error;
    // ...

    return new Response(
      JSON.stringify({
        error: err.message || String(error),
        details: "Handled exception in generate-viral-post (DEBUG MODE: STATUS 200)",
        debug: debugLogs 
      }),
      {
        status: 200, // Force 200 to bypass CORS on error for debugging
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
  }
});
