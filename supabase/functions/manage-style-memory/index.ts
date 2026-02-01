import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

class SimpleEmbeddingService {
  constructor(private apiKey: string) {}
  async createEmbedding(text: string): Promise<number[]> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { parts: [{ text }] } })
    });
    if (!response.ok) throw new Error(`Embedding API Error: ${response.status}`);
    const data = await response.json();
    if (!data.embedding || !data.embedding.values) throw new Error("Invalid embedding response");
    return data.embedding.values;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { action, content, query, metadata, id } = await req.json();
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!geminiKey || !supabaseUrl || !supabaseServiceKey) throw new Error("Missing critical environment variables");

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    
    let user = null;
    if (token) {
        const { data: authResult } = await supabaseAdmin.auth.getUser(token);
        user = authResult.user;
    }

    // Fallback: Si no hay auth y tenemos userId en el body (solo para desarrollo/emergencia si supabaseAdmin falla)
    if (!user && (body.userId || body.user_id)) {
        const uid = body.userId || body.user_id;
        const { data: profile } = await supabaseAdmin.from('profiles').select('id').eq('id', uid).single();
        if (profile) user = { id: profile.id };
    }

    if (!user) throw new Error("Unauthorized");

    const embedder = new SimpleEmbeddingService(geminiKey);

    if (action === 'add') {
        const embedding = await embedder.createEmbedding(content);
        const { data, error } = await supabaseAdmin
            .from('user_style_memory')
            .insert({
                user_id: user.id,
                content,
                embedding,
                metadata: metadata || { source: 'manual' }
            })
            .select()
            .single();
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'search') {
        const embedding = await embedder.createEmbedding(query);
        const { data, error } = await supabaseAdmin.rpc('match_user_style', {
            query_embedding: embedding,
            match_threshold: 0.5,
            match_count: 5
        });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'list') {
        const { data, error } = await supabaseAdmin
            .from('user_style_memory')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    if (action === 'delete') {
         if (!id) throw new Error("ID required");
         const { error } = await supabaseAdmin.from('user_style_memory').delete().eq('id', id).eq('user_id', user.id);
         if (error) throw error;
         return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
