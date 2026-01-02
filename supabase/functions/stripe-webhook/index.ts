import { serve } from "std/http/server";
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

serve(async (req: Request) => {
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
      const dataObject = event.data.object as Stripe.Checkout.Session & Stripe.Invoice;
      const customerId = dataObject.customer as string;
      const amountPaid = dataObject.amount_paid ?? dataObject.amount_total ?? 0;

      // Find profile
      let { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("id, credits, email, referred_by, plan_tier, created_at")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profileError || !profile) {
        // Fallback email lookup logic
        const email = dataObject.customer_email ?? dataObject.customer_details?.email;
        if (email) {
          const { data: profileByEmail } = await supabaseAdmin
            .from("profiles")
            .select("id, credits, email, referred_by, plan_tier, created_at")
            .eq("email", email)
            .single();

          if (profileByEmail) {
            await supabaseAdmin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", profileByEmail.id);
            profile = profileByEmail;
          }
        }
      }

      if (profile) {
        const periodEnd = event.type === "invoice.payment_succeeded"
          ? dataObject.lines.data[0].period.end
          : (Math.floor(Date.now() / 1000) + 2592000);
        
        const priceId = event.type === "invoice.payment_succeeded"
          ? dataObject.lines.data[0].price?.id
          : dataObject.line_items?.data?.[0]?.price?.id;

        await billingService.processPaymentSuccess(profile, amountPaid, periodEnd, priceId);
      } else {
        return new Response("User not found", { status: 404 });
      }
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      await supabaseAdmin.from("profiles").update({
        subscription_status: "canceled",
        plan_tier: "free",
        credits: 0,
      }).eq("stripe_customer_id", subscription.customer);
    } else if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0].price.id;
      await billingService.updateSubscriptionStatus(
        subscription.customer,
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
