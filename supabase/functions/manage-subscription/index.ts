import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
    apiVersion: '2022-11-15',
    httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeKey) {
            console.error('STRIPE_SECRET_KEY is missing');
            throw new Error('Server configuration error');
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        const { action, couponId, reason } = await req.json()

        // Get user profile to find Stripe Customer ID
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single()

        if (profileError || !profile?.stripe_customer_id) {
            console.error('Stripe customer not found for user:', user.id);
            throw new Error('Stripe customer not found')
        }

        const customerId = profile.stripe_customer_id

        // Get active subscription
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'all',
            limit: 1,
        })

        const activeSub = subscriptions.data.find(sub => sub.status === 'active' || sub.status === 'trialing');

        if (!activeSub) {
            console.error('No active subscription found for customer:', customerId);
            throw new Error('No active subscription found')
        }

        const subscriptionId = activeSub.id

        if (action === 'cancel') {
            // Get profile creation date
            const { data: profileData, error: profileFetchError } = await supabaseClient
                .from('profiles')
                .select('created_at')
                .eq('id', user.id)
                .single()

            if (profileFetchError) throw profileFetchError

            const createdAt = new Date(profileData.created_at)
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

            const isNewAccount = createdAt > thirtyDaysAgo

            if (isNewAccount) {
                // Schedule for deletion in 3 days
                const deletionDate = new Date()
                deletionDate.setDate(deletionDate.getDate() + 3)

                await supabaseClient
                    .from('profiles')
                    .update({ 
                        scheduled_for_deletion: true, 
                        deletion_date: deletionDate.toISOString(),
                        subscription_status: 'canceled'
                    })
                    .eq('id', user.id)

                // We also cancel stripe sub immediately to avoid further charges
                await stripe.subscriptions.update(subscriptionId, {
                    cancel_at_period_end: false, // immediate cancel if we are deleting the account
                })
                
                return new Response(
                    JSON.stringify({ 
                        success: true, 
                        message: 'Account scheduled for deletion in 3 days due to cancellation policy for new accounts.', 
                        scheduledForDeletion: true,
                        deletionDate: deletionDate.toISOString()
                    }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            } else {
                // Regular cancellation at period end for older accounts
                const updatedSub = await stripe.subscriptions.update(subscriptionId, {
                    cancel_at_period_end: true,
                    metadata: {
                        cancellation_reason: reason || 'Unknown'
                    }
                })

                await supabaseClient
                    .from('profiles')
                    .update({ subscription_status: 'canceled_pending', cancel_at_period_end: true })
                    .eq('id', user.id)

                return new Response(
                    JSON.stringify({ success: true, message: 'Subscription canceled at period end', subscription: updatedSub }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }
        } else if (action === 'apply_coupon') {
            if (!couponId) throw new Error('Coupon ID required')

            const updatedSub = await stripe.subscriptions.update(subscriptionId, {
                coupon: couponId,
            })

            return new Response(
                JSON.stringify({ success: true, message: 'Coupon applied', subscription: updatedSub }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        } else {
            throw new Error('Invalid action')
        }

    } catch (error) {
        console.error('Error in manage-subscription:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
