// deno-lint-ignore-file no-explicit-any
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { GenerationParamsSchema } from "../_shared/schemas.ts";
import { ContentService } from "../_shared/services/ContentService.ts";
import { PostRepository } from "../_shared/PostRepository.ts";
import { validateInput } from "../_shared/inputGuard.ts";
import { truncateToTokenLimit } from "../_shared/tokenUtils.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

Deno.serve(async (req) => {
  console.log("--- K-FUNC: generate-viral-post (V3.0.0-Premium) ---");
  
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
      throw new Error("Missing critical environment variables.");
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const body = await req.json();
    const params = body.params || body;
    const userIdFromBody = body.userId || params.userId;

    let user = null;

    // 1. AUTH BYPASS / EMERGENCY MODE
    if (authHeader) {
        const supabaseClient = createClient(
            SUPABASE_URL,
            Deno.env.get("CUSTOM_SERVICE_ROLE_KEY") || SUPABASE_SERVICE_ROLE_KEY,
            { global: { headers: { Authorization: authHeader } } }
        );
        const { data: authResult } = await supabaseClient.auth.getUser();
        user = authResult.user;
    }

    if (!user && userIdFromBody) {
        console.warn("[Auth Bypass] Using fallback userId:", userIdFromBody);
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { data: fallbackUser } = await supabaseAdmin.from("profiles").select("id").eq("id", userIdFromBody).single();
        if (fallbackUser) user = { id: fallbackUser.id };
    }

    if (!user) {
        return new Response(JSON.stringify({ success: false, error: "Authentication required" }), { status: 401, headers });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // 2. SCHEMA VALIDATION
    const parseResult = GenerationParamsSchema.safeParse(params);
    if (!parseResult.success) {
        return new Response(JSON.stringify({ success: false, error: "Invalid parameters", details: parseResult.error }), { status: 400, headers });
    }
    const validatedParams = parseResult.data;

    // 3. SANITIZATION
    const inputValidation = validateInput(validatedParams.topic);
    if (!inputValidation.isValid) {
        return new Response(JSON.stringify({ success: false, error: inputValidation.error }), { status: 400, headers });
    }
    validatedParams.topic = truncateToTokenLimit(inputValidation.sanitizedInput!, 4000);

    // 4. SERVICE ORCHESTRATION
    const contentService = new ContentService(GEMINI_API_KEY);
    const postRepository = new PostRepository(supabaseAdmin);

    // Fetch Profile for context
    const { data: profile } = await supabaseAdmin.from("profiles").select("*").eq("id", user.id).single();
    if (!profile) throw new Error("Profile not found");

    console.log(`Generating post for user ${user.id}...`);
    
    // Mapping to UserProfileContext expected by shared ContentService
    const userContext = {
        brand_voice: profile.brand_voice,
        company_name: profile.company_name,
        industry: profile.industry,
        xp: profile.xp,
        behavioral_dna: (profile as any).behavioral_dna
    };

    const generatedPost = await contentService.generatePost(validatedParams, userContext);

    // 5. PERSISTENCE & CREDITS
    const savedPost = await postRepository.savePost(user.id, generatedPost, validatedParams);
    
    // Deduct credits (Soft error: don't fail if this fails)
    try {
        await supabaseAdmin.rpc('deduct_credits', { user_id: user.id, amount: 1 });
    } catch (e) {
        console.error("Credit deduction failed:", e);
    }

    return new Response(JSON.stringify({
        success: true,
        data: {
            id: savedPost?.id,
            content: generatedPost.post_content,
            viralScore: generatedPost.auditor_report.viral_score,
            viralAnalysis: generatedPost.auditor_report,
            meta: generatedPost.meta,
            ai_reasoning: generatedPost.strategy_reasoning
        }
    }), { status: 200, headers });

  } catch (err: any) {
    console.error("Edge Function Error:", err);
    return new Response(JSON.stringify({ 
        success: false, 
        error: "Internal Server Error", 
        message: err.message 
    }), { status: 500, headers });
  }
});

