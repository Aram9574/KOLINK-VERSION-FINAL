import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
})

const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
    const signature = req.headers.get('Stripe-Signature')

    if (!signature) {
        return new Response('No signature', { status: 400 })
    }

    try {
        const body = await req.text()
        const event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            Deno.env.get('STRIPE_WEBHOOK_SECRET') as string
        )

        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object
            const customerId = invoice.customer as string
            const subscriptionId = invoice.subscription as string

            // Find user by stripe_customer_id
            const { data: profile, error: profileError } = await supabaseClient
                .from('profiles')
                .select('id, credits') // Fetch current credits
                .eq('stripe_customer_id', customerId)
                .single()

            if (profile) {
                // Determine plan based on amount or product ID (simplified here)
                // You might want to look up the product ID from the invoice lines
                const amountPaid = invoice.amount_paid
                let creditsToAdd = 0
                let newPlan = 'pro'

                if (amountPaid > 5000) { // Adjusted threshold for Viral (79 EUR = 7900 cents)
                    newPlan = 'viral'
                    creditsToAdd = 350
                } else {
                    newPlan = 'pro'
                    creditsToAdd = 100
                }

                // Accumulate credits
                const newCreditBalance = (profile.credits || 0) + creditsToAdd;

                await supabaseClient
                    .from('profiles')
                    .update({
                        plan_tier: newPlan,
                        credits: newCreditBalance,
                        subscription_status: 'active',
                        subscription_end_date: new Date(invoice.lines.data[0].period.end * 1000).toISOString()
                    })
                    .eq('id', profile.id)
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (err) {
        return new Response(err.message, { status: 400 })
    }
})
