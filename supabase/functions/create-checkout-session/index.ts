import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'npm:stripe@^14.0.0'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

console.log("Create Checkout Session Function Initialized")

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Verify Environment Variables
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeKey) {
            console.error('STRIPE_SECRET_KEY is missing');
            throw new Error('Server configuration error: Missing Stripe Key');
        }
        console.log('Using Stripe Key starting with:', stripeKey.substring(0, 7)); // Debug log


        const stripe = new Stripe(stripeKey, {
            apiVersion: '2023-10-16',
            httpClient: Stripe.createFetchHttpClient(),
        })

        // 2. Authenticate User
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
        if (authError || !user) {
            console.error('Auth Error:', authError);
            return new Response(
                JSON.stringify({ error: 'Unauthorized', details: authError?.message }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // 3. Parse Request
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return new Response(
                JSON.stringify({ error: 'Invalid JSON body' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const { priceId } = body;
        if (!priceId) {
            return new Response(
                JSON.stringify({ error: 'Missing priceId' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // 4. Get/Create Customer
        const { data: profile } = await supabaseClient
            .from('profiles')
            .select('stripe_customer_id, email')
            .eq('id', user.id)
            .single()

        let customerId = profile?.stripe_customer_id

        if (!customerId) {
            console.log('Creating new Stripe customer for user:', user.id);
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { supabase_uid: user.id },
            })
            customerId = customer.id
            await supabaseClient
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id)
        }

        // 5. Create Session
        // 5. Create Session
        console.log('Creating session for customer:', customerId, 'price:', priceId);
        let session;
        try {
            session = await stripe.checkout.sessions.create({
                customer: customerId,
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${req.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.get('origin')}/pricing`,
            })
        } catch (stripeError) {
            // Self-healing: If customer not found (e.g. switching between Test/Live mode), create a new one
            if (stripeError.code === 'resource_missing' && stripeError.message.includes('No such customer')) {
                console.warn('Customer not found in Stripe (likely mode mismatch). Creating new customer...');

                const customer = await stripe.customers.create({
                    email: user.email,
                    metadata: { supabase_uid: user.id },
                })
                customerId = customer.id

                // Update profile with new customer ID
                await supabaseClient
                    .from('profiles')
                    .update({ stripe_customer_id: customerId })
                    .eq('id', user.id)

                console.log('New customer created:', customerId, '. Retrying session creation...');

                // Retry session creation
                session = await stripe.checkout.sessions.create({
                    customer: customerId,
                    line_items: [
                        {
                            price: priceId,
                            quantity: 1,
                        },
                    ],
                    mode: 'subscription',
                    success_url: `${req.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${req.headers.get('origin')}/pricing`,
                })
            } else {
                throw stripeError; // Re-throw other errors
            }
        }

        return new Response(
            JSON.stringify({ sessionId: session.id, url: session.url }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('General Error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
