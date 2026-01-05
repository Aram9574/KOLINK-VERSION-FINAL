import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { BillingService } from "../_shared/services/BillingService.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

const billingService = new BillingService(supabaseAdmin);

console.log("Stripe Webhook Function (Microservice) Hit!");

Deno.serve(async (req: Request) => {
  const signature = req.headers.get("Stripe-Signature");
  if (!signature) return new Response("No signature", { status: 400 });

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") as string,
    );

    console.log(`Received event: ${event.type}`);

    if (event.type === "invoice.payment_succeeded" || event.type === "checkout.session.completed") {
      console.log(`Processing payment event: ${event.type}`);
      let customerId: string;
      let amountPaid: number;
      let periodEnd: number;
      let priceId: string | undefined;
      let email: string | undefined | null;

      if (event.type === "invoice.payment_succeeded") {
        const invoice = event.data.object as Stripe.Invoice;
        customerId = invoice.customer as string;
        amountPaid = invoice.amount_paid;
        periodEnd = invoice.lines.data[0].period.end;
        priceId = invoice.lines.data[0].price?.id;
        email = invoice.customer_email;
        console.log(`Invoice Payment Succeeded: Customer: ${customerId}, Amount: ${amountPaid}, Email: ${email}`);
      } else {
        const session = event.data.object as Stripe.Checkout.Session;
        customerId = session.customer as string;
        amountPaid = session.amount_total ?? 0;
        // Default to +30 days if coming from session without subscription details expanded
        periodEnd = Math.floor(Date.now() / 1000) + 2592000; 
        priceId = session.line_items?.data?.[0]?.price?.id;
        email = session.customer_details?.email;
        console.log(`Checkout Session Completed: Customer: ${customerId}, Amount: ${amountPaid}, Email: ${email}`);
      }

      // Find profile
      let { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("id, credits, email, referred_by, plan_tier, created_at, stripe_customer_id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profileError || !profile) {
        // Fallback email lookup logic
        if (email) {
          const { data: profileByEmail } = await supabaseAdmin
            .from("profiles")
            .select("id, credits, email, referred_by, plan_tier, created_at, stripe_customer_id")
            .eq("email", email)
            .single();

          if (profileByEmail) {
            await supabaseAdmin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", profileByEmail.id);
            profile = profileByEmail;
            // Ensure local profile object is updated for downstream usage
            profile.stripe_customer_id = customerId;
          }
        }
      }

      if (profile) {
        await billingService.processPaymentSuccess(profile, amountPaid, periodEnd, priceId);
      } else {
        console.error("User not found for customer:", customerId);
        return new Response("User not found", { status: 404 });
      }
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      console.log(`Deactivating subscription for customer: ${customerId}`);

      // 1. Downgrade Profile
      await supabaseAdmin.from("profiles").update({
        subscription_status: "canceled",
        plan_tier: "free",
        credits: 50, // Back to free entry credits? Or keep at 0. Let's reset to a base level.
      }).eq("stripe_customer_id", customerId);

      // 2. Clear Active Subscription in 'subscriptions' table
      await supabaseAdmin.from("subscriptions").update({
        status: "canceled",
        plan_type: "free",
        updated_at: new Date().toISOString(),
      }).eq("stripe_customer_id", customerId);
    } else if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
      const priceId = subscription.items.data[0].price.id;

      await billingService.updateSubscriptionStatus(
        customerId,
        subscription.status,
        priceId,
        subscription.current_period_end
      );
    } else if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      await supabaseAdmin.from("profiles").update({
        subscription_status: "past_due",
      }).eq("stripe_customer_id", invoice.customer);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Stripe Webhook Error:", error.message);
    return new Response(JSON.stringify({ error: "Webhook failed" }), { status: 500 });
  }
});
