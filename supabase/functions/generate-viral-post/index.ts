import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://esm.sh/zod@3.22.4';
import { CreditService } from './services/CreditService.ts';
import { AIService, GenerationParams } from './services/AIService.ts'; // Note: AIService defines interface too, we might want to unify this later
import { PostRepository } from './services/PostRepository.ts';
import { sanitizeInput } from './utils/validation.ts';
import { GenerationParamsSchema } from '../_shared/schemas.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Setup & Auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { params } = await req.json()

    // Validate Params with Zod
    let safeParams: GenerationParams;
    try {
      const parsed = GenerationParamsSchema.parse(params);
      safeParams = {
        topic: sanitizeInput(parsed.topic), // Keep sanitize for extra safety against XSS if displayed raw
        audience: sanitizeInput(parsed.audience),
        tone: parsed.tone,
        framework: parsed.framework,
        emojiDensity: parsed.emojiDensity,
        length: parsed.length,
        creativityLevel: parsed.creativityLevel,
        includeCTA: parsed.includeCTA
      } as GenerationParams;
    } catch (zodError) {
      if (zodError instanceof z.ZodError) {
        return new Response(
          JSON.stringify({
            error: "Validation Error",
            details: zodError.errors
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      throw zodError;
    }

    // Create Admin Client for DB operations (Bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Initialize Services
    const creditService = new CreditService(supabaseAdmin, supabaseClient);
    const aiService = new AIService(Deno.env.get('GEMINI_API_KEY') ?? '');
    // USE ADMIN CLIENT for persistence to ensure we bypass RLS for insertion
    const postRepository = new PostRepository(supabaseAdmin);

    // 2. Check Credits, Rate Limit & Fetch Context
    console.log("Fetching profile for User ID:", user.id);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error("Profile not found:", profileError);
      throw new Error('Profile not found. Please contact support.')
    }

    const isPremium = ['pro', 'viral'].includes(profile.plan_tier);
    if (!isPremium && profile.credits <= 0) throw new Error('Insufficient credits')

    // RATE LIMITING PROTECTION
    // Check if last post was created very recently (e.g. 10 seconds)
    // This relies on 'last_post_date' being updated when a post is created (which happens in gamification/state update usually)
    // Ideally we check the latest post in 'posts' table, but checking profile timestamp is cheaper if available.
    // For now, let's query the latest post timestamp directly to be sure, or just rely on a simple timestamp if we had it.
    // Let's implement a simple check against 'posts' table for the user since 'profile.last_post_date' might be gamification logic.
    // Actually, let's just use the Admin client to quickly check the last created_at for this user.

    const { data: lastPost } = await supabaseAdmin
      .from('posts')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastPost) {
      const lastPostTime = new Date(lastPost.created_at).getTime();
      const now = Date.now();
      const diff = now - lastPostTime;
      if (diff < 10000) { // 10 seconds cooldown
        throw new Error('Rate limit exceeded. Please wait 10 seconds between generations.');
      }
    }

    // 3. Prepare Params
    // The params are now validated by Zod above, and `safeParams` is ready.

    const userContext = {
      brand_voice: sanitizeInput(profile.brand_voice || ""),
      company_name: sanitizeInput(profile.company_name || ""),
      industry: sanitizeInput(profile.industry || ""),
      headline: sanitizeInput(profile.headline || ""),
      xp: profile.xp || 0,
      language: profile.language
    };

    // 4. Generate Content
    const generatedContent = await aiService.generatePost(safeParams, userContext);

    // 5. Save Post
    const insertedPost = await postRepository.savePost(user.id, generatedContent, params);

    // 6. Deduct Credit (Only if not premium)
    if (!isPremium) {
      await creditService.deductCredit(user.id);
    }

    return new Response(
      JSON.stringify({
        id: insertedPost?.id,
        postContent: generatedContent.post_content,
        viralScore: generatedContent.overall_viral_score,
        viralAnalysis: {
          hookScore: generatedContent.hook_score,
          readabilityScore: generatedContent.readability_score,
          valueScore: generatedContent.value_score,
          feedback: generatedContent.feedback
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
        details: "Handled exception in generate-viral-post"
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
