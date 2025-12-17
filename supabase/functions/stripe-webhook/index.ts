/// <reference lib="deno.ns" />
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
})

const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req: Request) => {
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
            const dataObject = event.data.object as any; // Cast to any to access properties safely without full Stripe type
            const customerId = dataObject.customer as string;
            // For checkout session, use amount_total. For invoice, use amount_paid.
            const amountPaid = dataObject.amount_paid ?? dataObject.amount_total ?? 0;

            console.log(`Processing ${event.type} for customer: ${customerId}, Amount: ${amountPaid}`);

            // Find user by stripe_customer_id
            const { data: profile, error: profileError } = await supabaseClient
                .from('profiles')
                .select('id, credits, email, referred_by')
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
        // Secure Error Handling: Log internally, return generic error to client
        console.error("Stripe Webhook Processing Error:", err);

        return new Response(
            JSON.stringify({ error: "Webhook processing failed. Please check logs for details." }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
})

async function processCreditUpdate(supabaseClient: SupabaseClient, profile: any, amountPaid: number, periodEndTimestamp: number) {
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

    // Referral Reward Logic
    if (profile.referred_by) {
        console.log(`User was referred by ${profile.referred_by}. Processing reward...`);
        try {
            // 1. Get Referrer details
            const { data: referrer, error: referrerError } = await supabaseClient
                .from('profiles')
                .select('id, stripe_customer_id, email')
                .eq('id', profile.referred_by)
                .single();

            if (referrerError || !referrer) {
                console.error("Referrer not found:", referrerError);
                return;
            }

            if (referrer.stripe_customer_id) {
                // 2. Apply Credit Balance to Referrer in Stripe
                // €19.00 = 1900 cents
                await stripe.customers.createBalanceTransaction(
                    referrer.stripe_customer_id,
                    {
                        amount: -1900, // Negative amount adds credit to the customer balance (owed to customer)
                        currency: 'eur',
                        description: `Referral Reward: ${profile.email} subscribed!`
                    }
                );
                console.log(`Applied €19 credit to referrer ${referrer.id} (Stripe: ${referrer.stripe_customer_id})`);

                // 3. Insert Notification into DB
                const { error: notifError } = await supabaseClient
                    .from('notifications')
                    .insert({
                        user_id: referrer.id,
                        type: 'referral_reward',
                        title: 'Referral Reward Unlocked! 🎁',
                        message: `Your friend (${profile.email}) subscribed! You've received €19 credit (1 month free).`,
                        read: false
                    });
                
                if (notifError) {
                    console.error("Error creating notification:", notifError);
                } else {
                    console.log("Notification created for referrer.");
                }

                // 4. Send Email (Placeholder)
                // if (Deno.env.get('RESEND_API_KEY')) { ... }
                console.log(`[Email Simulation] To: ${referrer.email}, Subject: You got a free month!`);

            } else {
                 console.warn(`Referrer ${referrer.id} has no stripe_customer_id.`);
            }

        } catch (err) {
            console.error("Error processing referral reward:", err);
        }
    }
}
