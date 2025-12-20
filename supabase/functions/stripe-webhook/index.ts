/// <reference lib="deno.ns" />
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.25.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

console.log("Stripe Webhook Function Hit!");

serve(async (req: Request) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  const signature = req.headers.get("Stripe-Signature");
  console.log(`Signature present: ${!!signature}`);

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") as string,
    );

    console.log(`Received event: ${event.type}`);

    if (
      event.type === "invoice.payment_succeeded" ||
      event.type === "checkout.session.completed"
    ) {
      const dataObject = event.data.object as any;
      const customerId = dataObject.customer as string;
      const amountPaid = dataObject.amount_paid ?? dataObject.amount_total ?? 0;

      console.log(`Processing ${event.type} for customer: ${customerId}`);

      const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("id, credits, email, referred_by")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profileError || !profile) {
        // Fallback email lookup logic...
        const email = dataObject.customer_email ??
          dataObject.customer_details?.email;
        if (email) {
          const { data: profileByEmail } = await supabaseClient
            .from("profiles")
            .select("id, credits, email")
            .eq("email", email)
            .single();

          if (profileByEmail) {
            await supabaseClient.from("profiles").update({
              stripe_customer_id: customerId,
            }).eq("id", profileByEmail.id);
            const priceId = dataObject.lines?.data?.[0]?.price?.id;
            await processCreditUpdate(
              supabaseClient,
              profileByEmail,
              amountPaid,
              dataObject?.lines?.data?.[0]?.period?.end ??
                Math.floor(Date.now() / 1000) + 2592000,
              priceId,
            );
            return new Response(JSON.stringify({ received: true }), {
              headers: { "Content-Type": "application/json" },
            });
          }
        }
        return new Response("User not found", { status: 404 });
      }

      const periodEnd = event.type === "invoice.payment_succeeded"
        ? dataObject.lines.data[0].period.end
        : (Math.floor(Date.now() / 1000) + 2592000);
      const priceId = event.type === "invoice.payment_succeeded"
        ? dataObject.lines.data[0].price?.id
        : dataObject.line_items?.data?.[0]?.price?.id;

      await processCreditUpdate(
        supabaseClient,
        profile,
        amountPaid,
        periodEnd,
        priceId,
      );
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as any;
      const customerId = subscription.customer;

      console.log(`Subscription deleted for customer: ${customerId}`);

      await supabaseClient
        .from("profiles")
        .update({
          subscription_status: "canceled",
          plan_tier: "free",
          credits: 0, // Reset credits upon cancellation if desired, or leave them
        })
        .eq("stripe_customer_id", customerId);
    } else if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as any;
      const customerId = subscription.customer;
      const status = subscription.status;
      const priceId = subscription.items.data[0].price.id;

      console.log(
        `Subscription updated for customer: ${customerId}, status: ${status}`,
      );

      // Update plan tier and status
      const PRO_PRICE_ID = "price_1SZJKhE0zDGmS9ihOiYOzLa1";
      const VIRAL_PRICE_ID = "price_1SZDgvE0zDGmS9ihnRXmmx4T";
      let newPlan = "pro";
      if (priceId === VIRAL_PRICE_ID) newPlan = "viral";

      await supabaseClient
        .from("profiles")
        .update({
          subscription_status: status === "active" ? "active" : "past_due",
          plan_tier: newPlan,
          subscription_end_date: new Date(
            subscription.current_period_end * 1000,
          ).toISOString(),
        })
        .eq("stripe_customer_id", customerId);
    } else if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as any;
      const customerId = invoice.customer;

      console.log(`Payment failed for customer: ${customerId}`);

      await supabaseClient
        .from("profiles")
        .update({
          subscription_status: "past_due",
        })
        .eq("stripe_customer_id", customerId);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // Secure Error Handling: Log internally, return generic error to client
    console.error("Stripe Webhook Processing Error:", err);

    return new Response(
      JSON.stringify({
        error: "Webhook processing failed. Please check logs for details.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

async function processCreditUpdate(
  supabaseClient: SupabaseClient,
  profile: any,
  amountPaid: number,
  periodEndTimestamp: number,
  priceId?: string,
) {
  console.log(
    `Found user: ${profile.id} (${profile.email}). Current credits: ${profile.credits}, Amount Paid: ${amountPaid}, PriceID: ${priceId}`,
  );

  let creditsToAdd = 0;
  let newPlan = "pro";

  // Determine plan by priceId (more reliable for coupons/discounts)
  const PRO_PRICE_ID = "price_1SZJKhE0zDGmS9ihOiYOzLa1";
  const VIRAL_PRICE_ID = "price_1SZDgvE0zDGmS9ihnRXmmx4T";

  if (priceId === VIRAL_PRICE_ID || amountPaid > 5000) {
    newPlan = "viral";
    creditsToAdd = 350;
  } else if (priceId === PRO_PRICE_ID || amountPaid > 0) {
    newPlan = "pro";
    creditsToAdd = 100;
  } else {
    // Fallback for zero-amount payments where priceId might not be passed or mapped correctly
    // Default to 'pro' as it's the most common entry plan
    newPlan = "pro";
    creditsToAdd = 100;
  }

  console.log(`Plan Decision: ${newPlan}, Adding Credits: ${creditsToAdd}`);

  // High credits for Pro/Viral as they are "unlimited" in the UI (99999)
  const finalCreditsToAdd = (newPlan === "pro" || newPlan === "viral")
    ? 99999
    : creditsToAdd;

  // For unlimited plans, we set to 99999. If not, we accumulate.
  const newCreditBalance = (newPlan === "pro" || newPlan === "viral")
    ? 99999
    : (profile.credits || 0) + creditsToAdd;

  const { error: updateError } = await supabaseClient
    .from("profiles")
    .update({
      plan_tier: newPlan,
      credits: newCreditBalance,
      subscription_status: "active",
      subscription_end_date: new Date(periodEndTimestamp * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (updateError) {
    console.error("Failed to update profile:", updateError);
    throw new Error("Database update failed");
  }

  console.log(`Successfully updated profile. New balance: ${newCreditBalance}`);

  // Referral Reward Logic
  if (profile.referred_by) {
    console.log(
      `User was referred by ${profile.referred_by}. Processing reward...`,
    );
    try {
      // 1. Get Referrer details
      const { data: referrer, error: referrerError } = await supabaseClient
        .from("profiles")
        .select("id, stripe_customer_id, email")
        .eq("id", profile.referred_by)
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
            currency: "eur",
            description: `Referral Reward: ${profile.email} subscribed!`,
          },
        );
        console.log(
          `Applied €19 credit to referrer ${referrer.id} (Stripe: ${referrer.stripe_customer_id})`,
        );

        // 3. Insert Notification into DB
        const { error: notifError } = await supabaseClient
          .from("notifications")
          .insert({
            user_id: referrer.id,
            type: "referral_reward",
            title: "Referral Reward Unlocked! 🎁",
            message:
              `Your friend (${profile.email}) subscribed! You've received €19 credit (1 month free).`,
            read: false,
          });

        if (notifError) {
          console.error("Error creating notification:", notifError);
        } else {
          console.log("Notification created for referrer.");
        }

        // 4. Send Email (Placeholder)
        // if (Deno.env.get('RESEND_API_KEY')) { ... }
        console.log(
          `[Email Simulation] To: ${referrer.email}, Subject: You got a free month!`,
        );
      } else {
        console.warn(`Referrer ${referrer.id} has no stripe_customer_id.`);
      }
    } catch (err) {
      console.error("Error processing referral reward:", err);
    }
  }
}
