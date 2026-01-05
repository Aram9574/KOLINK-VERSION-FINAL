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
  processGamification(
    profile: {
      last_post_at?: string | null;
      current_streak?: number | null;
      xp_points?: number | null;
      level?: number | null;
      unlocked_achievements?: string[] | null;
    },
    params: { tone?: string; isControversial?: boolean },
    postCount: number,
  ): GamificationResult {
    let currentXP = profile.xp_points || 0;
    let currentStreak = profile.current_streak || 0;
    const unlockedAchievements = new Set(profile.unlocked_achievements || []);
    const newAchievements: string[] = [];

    const now = new Date();
    const lastDate = profile.last_post_at ? new Date(profile.last_post_at) : null;

    // 1. Calculate Streak (Legacy Logic)
    if (lastDate) {
      const isSameDay = now.toDateString() === lastDate.toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = yesterday.toDateString() === lastDate.toDateString();

      if (!isSameDay) {
        if (isYesterday) {
          currentStreak += 1;
        } else {
          currentStreak = 1; // Streak broken
        }
      }
    } else {
      currentStreak = 1;
    }

    // 2. Base XP Reward (Legacy was 50)
    currentXP += 50;

    // 3. Check Achievements (Legacy Port)
    // Achievement: First Step
    if (!unlockedAchievements.has("first_step") && postCount >= 1) {
      newAchievements.push("first_step");
      currentXP += 50;
    }

    // Achievement: Prolific Writer (10 posts)
    if (!unlockedAchievements.has("pro_writer") && postCount >= 10) {
      newAchievements.push("pro_writer");
      currentXP += 300;
    }

    // Achievement: Streak 3
    if (!unlockedAchievements.has("streak_3") && currentStreak >= 3) {
      newAchievements.push("streak_3");
      currentXP += 150;
    }

    // Achievement: Streak 7
    if (!unlockedAchievements.has("streak_7") && currentStreak >= 7) {
      newAchievements.push("streak_7");
      currentXP += 500;
    }

    // Achievement: Clickbait Master
    if (
      !unlockedAchievements.has("clickbait_master") &&
      (params.tone?.toLowerCase().includes("controversial") || params.isControversial)
    ) {
      newAchievements.push("clickbait_master");
      currentXP += 100;
    }

    // 4. Calculate Level (Legacy Curve)
    const newLevel = Math.max(1, Math.floor(Math.sqrt(currentXP / 100)));
    const leveledUp = newLevel > (profile.level || 1);

    return {
      newXP: currentXP,
      newLevel,
      newStreak: currentStreak,
      newAchievements,
      leveledUp,
    };
  }
}
