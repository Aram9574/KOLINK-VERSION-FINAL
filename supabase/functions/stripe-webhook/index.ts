import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

console.log("Stripe Webhook Function Initialized");

Deno.serve(async (req: Request) => {
    const signature = req.headers.get("Stripe-Signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !webhookSecret) {
        return new Response("Missing signature or webhook secret", { status: 400 });
    }

    const body = await req.text();
    let event;

    try {
        event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            webhookSecret,
            undefined,
            cryptoProvider
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new Response(err.message, { status: 400 });
    }

    // Initialize Admin Client
    const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log(`Processing event: ${event.type}`);

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const userId = session.client_reference_id || session.metadata?.supabase_uid || session.subscription_data?.metadata?.supabase_uid;
                const subscriptionId = session.subscription;

                if (userId && subscriptionId) {
                    console.log(`Checkout completed for user ${userId}. Sub ID: ${subscriptionId}`);
                    
                    // Retrieve full subscription details to get status and plan
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
                    
                    await handleSubscriptionUpdate(supabaseAdmin, userId, subscription);
                }
                break;
            }
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                const userId = subscription.metadata?.supabase_uid;

                if (userId) {
                     console.log(`Subscription updated for user ${userId}. Status: ${subscription.status}`);
                     await handleSubscriptionUpdate(supabaseAdmin, userId, subscription);
                } else {
                    // Try to find user by stripe_customer_id if metadata missing
                    const { data: subRecord } = await supabaseAdmin
                        .from('subscriptions')
                        .select('user_id')
                        .eq('stripe_customer_id', subscription.customer)
                        .single();
                        
                    if (subRecord?.user_id) {
                         console.log(`Matched customer ${subscription.customer} to user ${subRecord.user_id}`);
                         await handleSubscriptionUpdate(supabaseAdmin, subRecord.user_id, subscription);
                    } else {
                        console.warn(`No user found for subscription update. Customer: ${subscription.customer}`);
                    }
                }
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (error: any) {
        console.error("Error processing webhook:", error);
        return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
    });
});

async function handleSubscriptionUpdate(supabase: any, userId: string, subscription: any) {
    const status = subscription.status;
    const priceId = subscription.items.data[0].price.id;
    
    // Map Price ID to Plan Type (You should configure these map based on your Stripe Price IDs)
    // For now, checking against environment vars or simple logic
    let planType = 'inicial';
    
    // Example mapping - Replace with your actual Price IDs or logic
    // const PRO_PRICE_ID = "price_...";
    // const VIRAL_PRICE_ID = "price_...";
    
    // Heuristic: If amount > 0 and status active, assume PRO for now if logic not set
    // Ideally use lookup table or switch
    if (status === 'active' || status === 'trialing') {
        const amount = subscription.items.data[0].price.unit_amount;
         if (amount > 5000) { // e.g. > $50
            planType = 'viral';
         } else {
            planType = 'pro';
         }
    }

    const updateData = {
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        status: status,
        plan_type: planType,
        billing_cycle: subscription.items.data[0].plan.interval === 'year' ? 'anual' : 'mensual',
        price: subscription.items.data[0].price.unit_amount / 100,
        reset_date: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
    };

    if (status === 'canceled') {
        // @ts-ignore
        updateData.canceled_at = new Date(subscription.canceled_at * 1000).toISOString();
        // @ts-ignore
        updateData.plan_type = 'inicial'; // Revert to free on cancel? Or wait until period end? 
        // Usually wait for period end, but status 'canceled' implies it's done. 
        // 'active' with cancel_at_period_end = true is different.
    }

    const { error } = await supabase
        .from('subscriptions')
        .upsert(updateData, { onConflict: 'user_id' });

    if (error) {
        console.error("Failed to update subscription in DB:", error);
        throw error;
    }
    
    console.log(`Successfully updated subscription for user ${userId} to ${planType} (${status})`);
}
