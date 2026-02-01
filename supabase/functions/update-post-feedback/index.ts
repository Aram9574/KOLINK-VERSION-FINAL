import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { NexusService } from "../_shared/services/NexusService.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { postId, feedback } = await req.json();
    if (!postId || !feedback) throw new Error("postId and feedback are required");

    const authHeader = req.headers.get("Authorization");
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    // 1. Update Post Feedback
    const { data: post, error: postError } = await supabaseClient
      .from('posts')
      .update({ feedback })
      .eq('id', postId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (postError) throw postError;

    // 2. If positive, auto-memorize
    if (feedback === 'positive') {
        const geminiKey = Deno.env.get('GEMINI_API_KEY');
        if (geminiKey) {
            const nexus = new NexusService(geminiKey);
            const embedding = await nexus.createEmbedding(post.content);

            await supabaseClient
                .from('user_style_memory')
                .upsert({
                    user_id: user.id,
                    content: post.content,
                    embedding,
                    metadata: { source: 'auto-like', post_id: postId }
                }, { onConflict: 'user_id, content' }); // Simplified deduplication
        }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
