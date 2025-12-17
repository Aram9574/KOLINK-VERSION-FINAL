import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://esm.sh/zod@3.22.4';
import { CreditService } from './services/CreditService.ts';
import { AIService, GenerationParams } from './services/AIService.ts';
import { PostRepository } from './services/PostRepository.ts';
import { GamificationService } from './services/GamificationService.ts';
import { sanitizeInput } from './utils/validation.ts';
import { GenerationParamsSchema } from '../_shared/schemas.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
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
        topic: sanitizeInput(parsed.topic),
        audience: sanitizeInput(parsed.audience),
        tone: parsed.tone,
        framework: parsed.framework,
        emojiDensity: parsed.emojiDensity,
        length: parsed.length,
        creativityLevel: parsed.creativityLevel,
        hashtagCount: parsed.hashtagCount,
        includeCTA: parsed.includeCTA,
        outputLanguage: parsed.outputLanguage
      } as GenerationParams;
    } catch (zodError: any) {
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
    const postRepository = new PostRepository(supabaseAdmin);
    const gamificationService = new GamificationService(supabaseAdmin);

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

    // 6. Validated Gamification Update
    // Get total post count
    const { count: postCount } = await supabaseAdmin
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const gamificationResults = await gamificationService.processGamification(
      profile, // Use the profile we fetched earlier
      safeParams,
      (postCount || 0) // Should include the one we just inserted? postRepository.savePost inserts it. 
                       // Note: supabase count might or might not see it immediately if read-after-write consistency is laggy, 
                       // but usually it's fine in same transaction or generic usage.
                       // Just to be safe, if we just inserted, the count should be +1 if the query didn't catch it, 
                       // but since we await savePost, it should be there.
    );

    // Apply updates to DB
    // Merge achievements
    const currentAchievements = profile.unlocked_achievements || [];
    const newAchievements = gamificationResults.newAchievements;
    const allAchievements = Array.from(new Set([...currentAchievements, ...newAchievements]));

    await supabaseAdmin
      .from('profiles')
      .update({
        xp: gamificationResults.newXP,
        level: gamificationResults.newLevel,
        current_streak: gamificationResults.newStreak,
        last_post_date: insertedPost?.created_at || new Date().toISOString(),
        unlocked_achievements: allAchievements
      })
      .eq('id', user.id);

    // 7. Deduct Credit (Only if not premium) - Do this last to ensure user gets value first
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
        },
        gamification: {
           newXP: gamificationResults.newXP,
           newLevel: gamificationResults.newLevel,
           newStreak: gamificationResults.newStreak,
           newAchievements: gamificationResults.newAchievements,
           leveledUp: gamificationResults.leveledUp
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error("Endpoint Error:", error);
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
