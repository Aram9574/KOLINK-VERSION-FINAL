import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Login
        const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
            email: 'test_stripe@kolink.com',
            password: 'Password123!',
        });

        if (loginError) throw loginError;

        // 2. Call generate-viral-post
        const functionUrl = `${supabaseUrl}/functions/v1/generate-viral-post`;
        console.log("Calling function:", functionUrl);

        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                params: {
                    topic: 'Test Topic',
                    audience: 'Developers',
                    tone: 'Professional',
                    framework: 'PAS',
                    length: 'SHORT',
                    creativityLevel: 50,
                    emojiDensity: 'MODERATE',
                    includeCTA: true
                }
            })
        });

        const responseText = await response.text();
        let responseJson;
        try {
            responseJson = JSON.parse(responseText);
        } catch (e) {
            responseJson = { error: "Failed to parse JSON", text: responseText };
        }

        return new Response(
            JSON.stringify({
                status: response.status,
                body: responseJson
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
})
