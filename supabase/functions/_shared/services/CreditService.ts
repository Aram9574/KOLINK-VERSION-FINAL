import { SupabaseClient } from "npm:@supabase/supabase-js@2";

export class CreditService {
  /**
   * @param supabaseAdmin - Admin client to bypass RLS for credit deduction.
   * @param supabaseClient - User client for potential session validation (optional).
   */
  constructor(
    private supabaseAdmin: SupabaseClient,
    private supabaseClient: SupabaseClient,
  ) {}

  /**
   * Checks if the user has enough credits to perform an action.
   * @param userId - The user's ID.
   * @returns Promise<boolean>
   */
  async hasCredits(userId: string): Promise<boolean> {
    const { data: profile, error } = await this.supabaseAdmin
      .from("profiles")
      .select("credits, plan_tier")
      .eq("id", userId)
      .single();

    if (error || !profile) return false;

    // Premium plans (pro, viral) might have unlimited credits or high limits.
    // For now, let's assume 'free' tier needs > 0 credits.
    if (["pro", "viral"].includes(profile.plan_tier)) return true;

    return profile.credits > 0;
  }

  /**
   * Deducts one credit from the user's account.
   * @param userId - The user's ID.
   */
  async deductCredit(userId: string) {
    const { error } = await this.supabaseAdmin.rpc("decrement_credits", {
      user_id: userId,
    });

    if (error) {
      console.error("Failed to deduct credit:", error);
      throw new Error("Credit deduction failed");
    }
  }
}
