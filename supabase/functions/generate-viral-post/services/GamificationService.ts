import { SupabaseClient } from "@supabase/supabase-js";

export interface GamificationResult {
  newXP: number;
  newLevel: number;
  newStreak: number;
  newAchievements: string[];
  leveledUp: boolean;
}

export class GamificationService {
  constructor(private supabaseAdmin: SupabaseClient) {}

  /**
   * Calculates XP, Levels, and Streaks based on user activity.
   */
  async processGamification(
    profile: any,
    params: any,
    postCount: number,
  ): Promise<GamificationResult> {
    let xpGain = 10; // Base XP for generating a post
    const now = new Date();
    const lastPostDate = profile.last_post_date
      ? new Date(profile.last_post_date)
      : null;

    // Calculate Streak
    let newStreak = profile.current_streak || 0;
    if (lastPostDate) {
      const diffDays = Math.floor(
        (now.getTime() - lastPostDate.getTime()) / (1000 * 3600 * 24),
      );
      if (diffDays === 1) {
        newStreak += 1;
        xpGain += 5 * newStreak; // Streak bonus
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    // Complexity Bonus
    if (params.creativityLevel > 70) xpGain += 5;
    if (params.hashtagCount > 3) xpGain += 2;

    const newXP = (profile.xp || 0) + xpGain;
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
    const leveledUp = newLevel > (profile.level || 1);

    // Achievements Logic (Placeholder for basic checks)
    const newAchievements: string[] = [];
    if (postCount === 1) newAchievements.push("first_post_id");
    if (newStreak === 3) newAchievements.push("streak_3_id");
    if (newLevel === 5) newAchievements.push("level_5_id");

    return {
      newXP,
      newLevel,
      newStreak,
      newAchievements,
      leveledUp,
    };
  }
}
