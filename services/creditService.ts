import { supabase } from './supabaseClient';
import { updateUserProfile } from './userRepository';

export interface CreditTransaction {
    user_id: string;
    amount: number;
    transaction_type: 'generation' | 'audit' | 'top_up' | 'bonus' | 'refund' | 'subscription_reset';
    metadata?: Record<string, any>;
}

export const CreditService = {
    /**
     * securely deduct credits using DB RPC if available, or ledger insert + profile update check
     */
    deductCredits: async (user_id: string, amount: number, type: CreditTransaction['transaction_type'], metadata: any = {}): Promise<boolean> => {
        try {
            console.log(`[CreditService] Deducting ${amount} credits for ${user_id} (${type})`);

            // 1. Check RPC first (Most Atomic)
            const { data: rpcSuccess, error: rpcError } = await supabase.rpc('deduct_user_credits', {
                p_user_id: user_id,
                p_amount: amount,
                p_type: type,
                p_metadata: metadata
            });

            if (!rpcError) {
                return rpcSuccess as boolean;
            }

            // Fallback: Client-side Ledger Insert (Less secure but works if RPC missing)
            console.warn("[CreditService] RPC failed, using client-side fallback:", rpcError);
            
            // Check balance first
            const { data: user } = await supabase.from('profiles').select('credits').eq('id', user_id).single();
            if (!user || user.credits < amount) {
                console.error("[CreditService] Insufficient funds");
                return false;
            }

            // Insert to Ledger
            const { error: ledgerError } = await supabase.from('credits_ledger').insert({
                user_id,
                amount: -amount,
                transaction_type: type,
                metadata: { ...metadata, timestamp: new Date().toISOString() }
            });

            if (ledgerError) throw ledgerError;

            // Trigger will update profile, but for optimistic UI we return true immediately if insert worked
            return true;

        } catch (error) {
            console.error("[CreditService] Transaction failed:", error);
            return false;
        }
    },

    /**
     * Add credits (Top-up or Bonus)
     */
    addCredits: async (user_id: string, amount: number, type: CreditTransaction['transaction_type'], metadata: any = {}) => {
        const { error } = await supabase.from('credits_ledger').insert({
            user_id,
            amount: amount,
            transaction_type: type,
            metadata
        });
        
        if (error) {
            console.error("[CreditService] Failed to add credits:", error);
            throw error;
        }
    },

    /**
     * Get Transaction History
     */
    getHistory: async (user_id: string) => {
        const { data } = await supabase
            .from('credits_ledger')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })
            .limit(20);
        return data || [];
    }
};
