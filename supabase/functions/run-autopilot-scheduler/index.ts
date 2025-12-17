import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { AIService } from '../_shared/AIService.ts'; // Shared
import { PostRepository } from '../_shared/PostRepository.ts'; // Shared
import { GenerationParams } from '../_shared/schemas.ts'; // Shared schemas? No, schemas are Zod. Types usually in AIService.

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Admin Client (Bypasses RLS to query all profiles)
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Initialize Services
        const aiService = new AIService(Deno.env.get('GEMINI_API_KEY') ?? '');
        const postRepository = new PostRepository(supabaseAdmin);

        // 1. Find users due for AutoPilot
        const now = Date.now();
        const { data: profiles, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('auto_pilot->>enabled', 'true') // Filter by JSONB
            .lt('auto_pilot->>nextRun', now)    // Filter by timestamp
            .limit(10); // Batch size for safety

        if (profileError) throw profileError;

        if (!profiles || profiles.length === 0) {
            return new Response(JSON.stringify({ message: 'No users due for AutoPilot' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        const results = [];

        // 2. Process each user
        for (const profile of profiles) {
            try {
                const config = profile.auto_pilot;

                // Construct Params from Config
                // Basic rotation logic for topics could go here, or just pick random for now if config has list
                const topic = config.topics && config.topics.length > 0
                    ? config.topics[Math.floor(Math.random() * config.topics.length)]
                    : 'LinkedIn Growth';

                const params: GenerationParams = {
                    topic: topic,
                    audience: config.targetAudience || 'Professionals',
                    tone: config.tone || 'Professional',
                    framework: 'Standard', // Default or random
                    length: 'Medium',
                    emojiDensity: 'Moderate',
                    creativityLevel: 80,
                    includeCTA: true,
                    hashtagCount: 3
                };

                const userContext = {
                    brand_voice: profile.brand_voice || "",
                    company_name: profile.company_name || "",
                    industry: profile.industry || "",
                    headline: profile.headline || "",
                    xp: profile.xp || 0,
                    language: profile.language || 'es'
                };

                // Generate
                const generatedContent = await aiService.generatePost(params, userContext);

                // Save
                const savedPost = await postRepository.savePost(profile.id, generatedContent, params);

                // Update Next Run Time
                // Default to daily (24h) if not specified
                const intervalMs = config.frequency === 'weekly' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
                const nextRun = now + intervalMs;

                // Update Profile
                await supabaseAdmin.from('profiles').update({
                    auto_pilot: { ...config, nextRun: nextRun }
                }).eq('id', profile.id);

                results.push({ userId: profile.id, status: 'success', postId: savedPost.id });

            } catch (err: any) {
                console.error(`Error processing user ${profile.id}:`, err);
                results.push({ userId: profile.id, status: 'error', error: err.message });
            }
        }

        return new Response(
            JSON.stringify({
                message: `Processed ${results.length} users`,
                results
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
