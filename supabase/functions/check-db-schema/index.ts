import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        // Check user_sessions
        const { error: sessionsError } = await supabaseAdmin
            .from('user_sessions')
            .select('id')
            .limit(1);

        // Check profiles columns by selecting them
        const { error: profilesError } = await supabaseAdmin
            .from('profiles')
            .select('headline, xp, auto_pilot')
            .limit(1);

        return new Response(
            JSON.stringify({
                sessionsError: sessionsError ? sessionsError.message : 'OK',
                profilesError: profilesError ? profilesError.message : 'OK'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
});
