import { supabase } from "./supabaseClient";
import { UserSubscription, PlanTier } from "../types";

export const fetchActiveSubscription = async (userId: string): Promise<UserSubscription | null> => {
    const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .in("status", ["active", "trialing", "past_due"])
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (error) {
        if (error.code !== "PGRST116") { // Ignore 'no rows returned' error
            console.error("Error fetching subscription:", error);
        }
        return null;
    }

    return {
        ...data,
        plan_type: data.plan_type as PlanTier,
        billing_cycle: data.billing_cycle as "mensual" | "anual",
        status: data.status as "active" | "canceled" | "past_due" | "incomplete"
    } as UserSubscription;
};

export const cancelSubscription = async (subscriptionId: string): Promise<boolean> => {
    const { error } = await supabase
        .from("subscriptions")
        .update({ status: "canceled", canceled_at: new Date().toISOString() })
        .eq("id", subscriptionId);

    if (error) {
        console.error("Error canceling subscription:", error);
        return false;
    }
    return true;
};

// Deprecated: Use this only for dev/testing when you need to force a plan change
export const upsertSubscription = async (userId: string, planType: PlanTier): Promise<UserSubscription | null> => {
    // In a real app, this would be handled by Stripe webhooks
    const subscriptionData = {
        user_id: userId,
        plan_type: planType,
        status: 'active',
        billing_cycle: 'mensual',
        price: planType === 'viral' ? 97 : (planType === 'pro' ? 29 : 0),
        credits_limit: planType === 'viral' ? -1 : (planType === 'pro' ? 1000 : 50),
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const { data, error } = await supabase
        .from("subscriptions")
        .upsert(subscriptionData, { onConflict: 'user_id' }) // Ideally we insert new rows, but for simple dev mock we upsert
        .select()
        .single();

    if (error) {
        console.error("Error creating subscription:", error);
        return null;
    }
    return data as unknown as UserSubscription;
};
