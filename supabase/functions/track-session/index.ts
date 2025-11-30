import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import UAParser from "https://esm.sh/ua-parser-js@1.0.35"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        const { device_id } = await req.json()

        if (!device_id) {
            throw new Error('Device ID required')
        }

        const userAgent = req.headers.get('user-agent') || ''
        const ip = req.headers.get('x-forwarded-for') || 'Unknown'

        const parser = new UAParser(userAgent)
        const result = parser.getResult()

        const deviceInfo = {
            browser: result.browser.name,
            os: result.os.name,
            device: result.device.type || 'Desktop',
            cpu: result.cpu.architecture
        }

        // Upsert session
        const { error: upsertError } = await supabaseClient
            .from('user_sessions')
            .upsert({
                user_id: user.id,
                device_id: device_id,
                user_agent: userAgent,
                ip_address: ip,
                device_info: deviceInfo,
                last_seen: new Date().toISOString()
            }, { onConflict: 'user_id, device_id' })

        if (upsertError) {
            console.error("Session tracking failed:", upsertError);
            // Ignore error to prevent blocking the client
        }

        return new Response(
            JSON.stringify({ success: true, deviceInfo }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
