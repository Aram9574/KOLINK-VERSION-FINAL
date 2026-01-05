// No import needed for Deno.serve in modern Deno/Supabase environments.
import { createClient } from "@supabase/supabase-js"
import { BillingService } from "../_shared/services/BillingService.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
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
        if (userError || !user) throw new Error('Unauthorized')

        const { action, couponId, reason } = await req.json()

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const billingService = new BillingService(supabaseAdmin)

        // Get user profile to find Stripe Customer ID
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single()

        if (profileError || !profile?.stripe_customer_id) {
            throw new Error('Stripe customer not found')
        }

        const customerId = profile.stripe_customer_id

        let result;
        if (action === 'cancel') {
            result = await billingService.cancelSubscription(user.id, customerId, reason);
        } else if (action === 'apply_coupon') {
            if (!couponId) throw new Error('Coupon ID required')
            result = await billingService.applyCoupon(customerId, couponId);
        } else {
            throw new Error('Invalid action')
        }

        return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error: unknown) {
        const err = error as Error;
        console.error('Error in manage-subscription:', err.message);
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
