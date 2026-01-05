import Stripe from "stripe";
import { SupabaseClient } from "@supabase/supabase-js";
import { Profile } from "../types.ts";

export class BillingService {
  private stripe: Stripe;
  private supabaseAdmin: SupabaseClient;

  // Price IDs from existing implementation
  private PRO_PRICE_ID = "price_1SZJKhE0zDGmS9ihOiYOzLa1";
  private VIRAL_PRICE_ID = "price_1SZDgvE0zDGmS9ihnRXmmx4T";

  constructor(supabaseAdmin: SupabaseClient) {
    this.stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });
    this.supabaseAdmin = supabaseAdmin;
  }

  /**
   * Retrieves active or trialing subscription for a customer.
   */
  async getActiveSubscription(customerId: string) {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 1,
    });
    return subscriptions.data.find((sub: Stripe.Subscription) => sub.status === "active" || sub.status === "trialing");
  }

  /**
   * Handles subscription cancellation logic, including the 3-day deletion policy for new accounts.
   */
  async cancelSubscription(userId: string, customerId: string, reason?: string) {
    const subscription = await this.getActiveSubscription(customerId);
    if (!subscription) throw new Error("No active subscription found");

    const { data: profile, error } = await this.supabaseAdmin
      .from("profiles")
      .select("created_at")
      .eq("id", userId)
      .single();

    if (error || !profile) throw new Error("Profile not found");

    const createdAt = new Date(profile.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const isNewAccount = createdAt > thirtyDaysAgo;

    if (isNewAccount) {
      // 3-day deletion policy
      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 3);

      await this.supabaseAdmin
        .from("profiles")
        .update({
          scheduled_for_deletion: true,
          deletion_date: deletionDate.toISOString(),
          subscription_status: "canceled",
        })
        .eq("id", userId);

      // Sync subscriptions table
      await this.supabaseAdmin
        .from("subscriptions")
        .update({ status: "canceled", canceled_at: new Date().toISOString() })
        .eq("user_id", userId);

      await this.stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: false, // Immediate cancel for deletion flow
      });

      return {
        success: true,
        message: "Account scheduled for deletion in 3 days due to cancellation policy for new accounts.",
        scheduledForDeletion: true,
        deletionDate: deletionDate.toISOString(),
      };
    } else {
      // Standard cancellation at period end
      const updatedSub = await this.stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
        metadata: { cancellation_reason: reason || "Unknown" },
      });

      await this.supabaseAdmin
        .from("profiles")
        .update({ subscription_status: "canceled_pending", cancel_at_period_end: true })
        .eq("id", userId);

      // Sync subscriptions table
      await this.supabaseAdmin
        .from("subscriptions")
        .update({ status: "canceled_pending", canceled_at: new Date().toISOString() })
        .eq("user_id", userId);

      return {
        success: true,
        message: "Subscription canceled at period end",
        subscription: updatedSub,
      };
    }
  }

  /**
   * Applies a coupon to an active subscription.
   */
  async applyCoupon(customerId: string, couponId: string) {
    const subscription = await this.getActiveSubscription(customerId);
    if (!subscription) throw new Error("No active subscription found");

    const updatedSub = await this.stripe.subscriptions.update(subscription.id, {
      coupon: couponId,
    });

    return { success: true, message: "Coupon applied", subscription: updatedSub };
  }

  /**
   * Processes credit updates and plan tier changes after payment.
   */
  async processPaymentSuccess(profile: Profile, amountPaid: number, periodEndTimestamp: number, priceId?: string) {
    console.log(`Processing payment success for user ${profile.id}. Amount: ${amountPaid}, PriceId: ${priceId}`);
    let creditsToAdd = 0;
    let newPlan = "pro";

    if (priceId === this.VIRAL_PRICE_ID || amountPaid > 5000) {
      newPlan = "viral";
      creditsToAdd = 350;
    } else if (priceId === this.PRO_PRICE_ID || amountPaid > 0) {
      newPlan = "pro";
      creditsToAdd = 100;
    } else {
      newPlan = "pro";
      creditsToAdd = 100;
    }

    // High credits for Pro/Viral as they are "unlimited" in the UI (99999)
    const newCreditBalance = (newPlan === "pro" || newPlan === "viral") ? 99999 : (profile.credits || 0) + creditsToAdd;

    const { error: updateError } = await this.supabaseAdmin
      .from("profiles")
      .update({
        plan_tier: newPlan,
        credits: newCreditBalance,
        subscription_status: "active",
        subscription_end_date: new Date(periodEndTimestamp * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (updateError) throw new Error("Database update failed");

    // Sync with 'subscriptions' table (Source of Truth)
    const { error: subError } = await this.supabaseAdmin
      .from("subscriptions")
      .upsert({
        user_id: profile.id,
        plan_type: newPlan,
        status: "active",
        reset_date: new Date(periodEndTimestamp * 1000).toISOString(),
        stripe_customer_id: profile.stripe_customer_id, // Ensure this is available on profile object passed in
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (subError) console.error("Failed to sync subscription table:", subError);

    // Referral Logic
    if (profile.referred_by) {
      await this.processReferralReward(profile.referred_by, profile.email || "unknown_email");
    }

    return { success: true, newCreditBalance, newPlan };
  }

  /**
   * Handles referral rewards (Applying credit to referrer).
   */
  private async processReferralReward(referrerId: string, referredEmail: string) {
    const { data: referrer, error } = await this.supabaseAdmin
      .from("profiles")
      .select("id, stripe_customer_id, email")
      .eq("id", referrerId)
      .single();

    if (!error && referrer && referrer.stripe_customer_id) {
      // €19.00 credit to referrer
      await this.stripe.customers.createBalanceTransaction(referrer.stripe_customer_id, {
        amount: -1900,
        currency: "eur",
        description: `Referral Reward: ${referredEmail} subscribed!`,
      });

      await this.supabaseAdmin.from("notifications").insert({
        user_id: referrer.id,
        type: "referral_reward",
        title: "Referral Reward Unlocked! 🎁",
        message: `Your friend (${referredEmail}) subscribed! You've received €19 credit (1 month free).`,
        read: false,
      });
    }
  }

  /**
   * Updates plan tier based on subscription status.
   */
  async updateSubscriptionStatus(customerId: string, status: string, priceId: string, periodEnd: number) {
    let newPlan = "pro";
    if (priceId === this.VIRAL_PRICE_ID) newPlan = "viral";

    await this.supabaseAdmin
      .from("profiles")
      .update({
        subscription_status: status === "active" ? "active" : "past_due",
        plan_tier: newPlan,
        subscription_end_date: new Date(periodEnd * 1000).toISOString(),
      })
      .eq("stripe_customer_id", customerId);

    // Sync with 'subscriptions' table
    await this.supabaseAdmin
      .from("subscriptions")
      .update({
        status: status === "active" ? "active" : "past_due",
        plan_type: newPlan,
        reset_date: new Date(periodEnd * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_customer_id", customerId);
  }
}
