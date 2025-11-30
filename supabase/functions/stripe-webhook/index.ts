import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'npm:stripe@^14.0.0'

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

        console.log(`Received event: ${event.type}`);

        if (event.type === 'invoice.payment_succeeded' || event.type === 'checkout.session.completed') {
            const dataObject = event.data.object;
            const customerId = dataObject.customer as string;
            // For checkout session, use amount_total. For invoice, use amount_paid.
            const amountPaid = dataObject.amount_paid ?? dataObject.amount_total ?? 0;

            console.log(`Processing ${event.type} for customer: ${customerId}, Amount: ${amountPaid}`);

            // Find user by stripe_customer_id
            const { data: profile, error: profileError } = await supabaseClient
                .from('profiles')
                .select('id, credits, email')
                .eq('stripe_customer_id', customerId)
                .single()

            if (profileError || !profile) {
                console.error('User not found for Stripe Customer ID:', customerId, 'Error:', profileError);
                // Fallback: Try to find by email if customer ID lookup fails
                const email = dataObject.customer_email ?? dataObject.customer_details?.email;
                if (email) {
                    console.log(`Attempting lookup by email: ${email}`);
                    const { data: profileByEmail, error: emailError } = await supabaseClient
                        .from('profiles')
                        .select('id, credits, email')
                        .eq('email', email)
                        .single();

                    if (profileByEmail) {
                        console.log(`Found user by email. Updating customer ID...`);
                        await supabaseClient.from('profiles').update({ stripe_customer_id: customerId }).eq('id', profileByEmail.id);
                        // Continue with this profile logic (re-fetch or just use found profile)
                        // For simplicity in this patch, we'll use the found profile and proceed
                        // But we need to be careful about variable scope if we were strictly typed, but here 'profile' is const.
                        // Let's just recursively call or copy logic? No, let's just proceed if we found it.
                        // Actually, let's just use the profileByEmail as the target.

                        await processCreditUpdate(supabaseClient, profileByEmail, amountPaid, dataObject?.lines?.data?.[0]?.period?.end ?? Math.floor(Date.now() / 1000) + 2592000); // Default 30 days if no period
                        return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } });
                    } else {
                        console.error('User not found by email either.');
                        return new Response('User not found', { status: 404 });
                    }
                } else {
                    return new Response('User not found', { status: 404 });
                }
            }

            if (profile) {
                // Calculate period end
                let periodEnd;
                if (event.type === 'invoice.payment_succeeded') {
                    periodEnd = dataObject.lines.data[0].period.end;
                } else {
                    // For checkout session, we might not have subscription details handy without expansion.
                    // But usually it's a subscription. Let's default to now + 30 days if missing.
                    periodEnd = Math.floor(Date.now() / 1000) + 2592000;
                }

                await processCreditUpdate(supabaseClient, profile, amountPaid, periodEnd);
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (err) {
        return new Response(err.message, { status: 400 })
    }
})

async function processCreditUpdate(supabaseClient, profile, amountPaid, periodEndTimestamp) {
    console.log(`Found user: ${profile.id} (${profile.email}). Current credits: ${profile.credits}`);

    let creditsToAdd = 0
    let newPlan = 'pro'

    if (amountPaid > 5000) {
        newPlan = 'viral'
        creditsToAdd = 350
    } else {
        newPlan = 'pro'
        creditsToAdd = 100
    }

    console.log(`Plan: ${newPlan}, Adding Credits: ${creditsToAdd}`);

    // Accumulate credits
    const newCreditBalance = (profile.credits || 0) + creditsToAdd;

    const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({
            plan_tier: newPlan,
            credits: newCreditBalance,
            subscription_status: 'active',
            subscription_end_date: new Date(periodEndTimestamp * 1000).toISOString()
        })
        .eq('id', profile.id)

    if (updateError) {
        console.error('Failed to update profile:', updateError);
        throw new Error('Database update failed');
    }

    console.log(`Successfully updated profile. New balance: ${newCreditBalance}`);
}
