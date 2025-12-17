import { SupabaseClient } from "@supabase/supabase-js";

export interface GamificationUpdate {
  newXP: number;
  newLevel: number;
  newStreak: number;
  newAchievements: string[];
  leveledUp: boolean;
}

export interface UserProfile {
  id: string;
  xp: number;
  level: number;
  current_streak: number;
  last_post_date: string | null;
  unlocked_achievements: string[];
}

import { GenerationParams } from "./AIService.ts";

export class GamificationService {
  constructor(private supabaseAdmin: SupabaseClient) {}

  private calculateLevel(xp: number): number {
    // Simple curve: Level = sqrt(XP / 100)
    const lvl = Math.floor(Math.sqrt(xp / 100));
    return Math.max(1, lvl);
  }

  processGamification(
    user: UserProfile,
    postParams: GenerationParams,
    postCount: number,
  ): GamificationUpdate {
    let currentXP = user.xp || 0;
    let currentStreak = user.current_streak || 0;
    const newAchievements: string[] = [];
    const existingIds = new Set(user.unlocked_achievements || []);

    // 1. Calculate Streak
    const now = new Date();
    const lastDate = user.last_post_date ? new Date(user.last_post_date) : null;

    if (lastDate) {
      const isSameDay = now.toDateString() === lastDate.toDateString();
      // Check if yesterday
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = yesterday.toDateString() === lastDate.toDateString();

      if (!isSameDay) {
        if (isYesterday) {
          currentStreak += 1;
        } else {
          // Streak broken
          currentStreak = 1;
        }
      }
      // If same day, streak stays same (or potentially handled elsewhere if we want to limit per day)
    } else {
      currentStreak = 1;
    }

    // 2. Base XP Reward for Generating
    currentXP += 50;

    // 3. Check Achievements
    // Note: postCount includes the one just created if logic matches client
    // For safety, we assume postCount is the COUNT including the new one.

    // Achievement: First Step
    if (!existingIds.has("first_step") && postCount >= 1) {
      newAchievements.push("first_step");
      currentXP += 50;
    }

    // Achievement: Prolific Writer (10 posts)
    if (!existingIds.has("pro_writer") && postCount >= 10) {
      newAchievements.push("pro_writer");
      currentXP += 300;
    }

    // Achievement: Streak 3
    if (!existingIds.has("streak_3") && currentStreak >= 3) {
      newAchievements.push("streak_3");
      currentXP += 150;
    }

    // Achievement: Streak 7
    if (!existingIds.has("streak_7") && currentStreak >= 7) {
      newAchievements.push("streak_7");
      currentXP += 500;
    }

    // Achievement: Contextual (Tone check)
    if (
      !existingIds.has("clickbait_master") &&
      postParams?.tone?.toLowerCase().includes("controversial")
    ) {
      newAchievements.push("clickbait_master");
      currentXP += 100;
    }

    // 4. Calculate Level
    const newLevel = this.calculateLevel(currentXP);
    const leveledUp = newLevel > (user.level || 1);

    return {
      newXP: currentXP,
      newLevel,
      newStreak: currentStreak,
      newAchievements,
      leveledUp,
    };
  }

  async updateUserStats(userId: string, stats: GamificationUpdate) {
    const { error } = await this.supabaseAdmin
      .from("profiles")
      .update({
        xp: stats.newXP,
        level: stats.newLevel,
        current_streak: stats.newStreak,
        last_post_date: new Date().toISOString(),
        // Unlocked achievements needs to merge with existing?
        // Or we assume the caller passes the merged list?
        // Actually, we should probably append here to be safe or use a specific PG function if it was concurrent.
        // For now, we'll fetch-then-update in the index.ts flow, so we can just append there.
      })
      .eq("id", userId);

    if (error) throw new Error(`Failed to update stats: ${error.message}`);
  }
}
