import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Service to handle user credit operations.
 * Manages checking balances and deducting credits using atomic RCP calls.
 */
export class CreditService {
    /**
     * @param supabaseAdmin - Admin client for reading profile data (bypassing specific RLS if needed, though checkBalance usually reads own).
     * @param supabaseClient - User client for executing RPCs that require auth context.
     */
    constructor(private supabaseAdmin: SupabaseClient, private supabaseClient: SupabaseClient) { }

    /**
     * Checks if a user has sufficient credits (> 0).
     * @param userId - The UUID of the user to check.
     * @returns Promise<boolean> - True if user has credits, false otherwise.
     * @throws {Error} if profile is not found.
     */
    async checkBalance(userId: string): Promise<boolean> {
        const { data: profile, error } = await this.supabaseAdmin
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single()

        if (error || !profile) {
            console.error("Error checking balance:", error)
            throw new Error('Profile not found')
        }

        return profile.credits > 0
    }

    /**
     * Deducts one credit from the user's balance.
     * Uses the `decrement_credit` Postgres function for atomicity.
     * @param userId - The UUID of the user.
     * @throws {Error} if the deduction fails (e.g. insufficient funds race condition or DB error).
     */
    async deductCredit(userId: string): Promise<void> {
        // Use RPC for atomic update
        const { error } = await this.supabaseClient.rpc('decrement_credit', { user_id: userId })

        if (error) {
            console.error("Failed to deduct credit:", error)
            throw new Error('Failed to deduct credit')
        }
    }
}
