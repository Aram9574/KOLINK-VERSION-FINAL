import { supabase } from './supabaseClient';
import { updateUserProfile, fetchUserProfile } from './userRepository';
import { toast } from 'sonner';

// Standard "Runescape" style curve or similar
// Lvl 2 = 100 XP, Lvl 3 = 250...
const XP_FOR_LEVEL = (level: number) => Math.floor(100 * Math.pow(level, 1.5));

export interface XPAction {
    type: 'post_generated' | 'audit_completed' | 'daily_login' | 'streak_bonus' | 'carousel_created';
    baseXp: number;
}

const XP_TABLE: Record<XPAction['type'], number> = {
    'post_generated': 15,
    'audit_completed': 50,
    'carousel_created': 30,
    'daily_login': 10,
    'streak_bonus': 50
};

export const GamificationService = {
    
    /**
     * Calculates current progress to next level
     */
    getProgress: (currentXp: number, currentLevel: number) => {
        const nextLevelXp = XP_FOR_LEVEL(currentLevel + 1);
        const currentLevelBaseXp = XP_FOR_LEVEL(currentLevel); // Approx
        const progress = ((currentXp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100;
        return {
            progress: Math.min(100, Math.max(0, progress)),
            nextLevelXp,
            needed: nextLevelXp - currentXp
        };
    },

    /**
     * Add XP and handle Level Up
     */
    awardXP: async (userId: string, actionType: XPAction['type']): Promise<{ leveledUp: boolean, newLevel?: number, xpAdded: number }> => {
        try {
            const xpToAdd = XP_TABLE[actionType];
            
            // Fetch fresh profile to avoid race conditions (ideally run in DB procedure)
            const profile = await fetchUserProfile(userId);
            if (!profile) return { leveledUp: false, xpAdded: 0 };

            let newXp = (profile.xp || 0) + xpToAdd;
            let newLevel = profile.level || 1;
            let leveledUp = false;

            // Check level up loop (in case massive XP gain)
            while (newXp >= XP_FOR_LEVEL(newLevel + 1)) {
                newLevel++;
                leveledUp = true;
            }

            // Update DB
            await updateUserProfile(userId, {
                xp: newXp,
                level: newLevel
            });

            if (leveledUp) {
                // Determine rewards? Credits?
                // Example: Level up = +10 Free Credits
                // await CreditService.addCredits(userId, 10, 'bonus', { reason: 'level_up', level: newLevel });
            }

            return { leveledUp, newLevel, xpAdded: xpToAdd };

        } catch (e) {
            console.error("Gamification Error:", e);
            return { leveledUp: false, xpAdded: 0 };
        }
    },

    /**
     * Check and Update Streak
     * Should be called on first app load or daily.
     */
    syncStreak: async (userId: string) => {
        const profile = await fetchUserProfile(userId);
        if (!profile) return null;

        const lastPost = profile.lastPostDate ? new Date(profile.lastPostDate) : null;
        const today = new Date();
        
        // Simple logic: If last interaction was "yesterday", streak++, else if older, streak = 1
        // We need a reliable "last_interaction_at" or assume last_post_at for now.
        // For MVP, we stick to what we have or add a new field 'last_active_at' in DB if possible.
        
        // Return current state
        return {
            streak: profile.currentStreak,
            lastDate: lastPost
        };
    }
};
