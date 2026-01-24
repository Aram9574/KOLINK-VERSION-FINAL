import { SupabaseClient } from "npm:@supabase/supabase-js@2";

export interface GamificationResult {
  newXP: number;
  newLevel: number;
  newStreak: number;
  newAchievements: string[];
  leveledUp: boolean;
}

export class GamificationService {
  constructor(private supabaseAdmin: SupabaseClient) {}

  async processAction(userId: string, action: string): Promise<GamificationResult | null> {
      // 1. Fetch Profile
      const { data: profile, error } = await this.supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (error || !profile) {
          console.error("Gamification Error: Profile not found", error);
          return null;
      }

      // 2. Count posts for legacy achievements
      const { count } = await this.supabaseAdmin
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      
      const postCount = (count || 0) + 1; // Including current one implies strictness, simplified here

      // 3. Run Logic
      const result = this.processGamification(profile, { tone: "standard" }, postCount);

      // 4. Update Profile
      if (result.newXP !== profile.xp || result.newLevel !== profile.level) {
          await this.supabaseAdmin.from("profiles").update({
              xp: result.newXP,
              level: result.newLevel,
              current_streak: result.newStreak,
              unlocked_achievements: Array.from(new Set([...(profile.unlocked_achievements || []), ...result.newAchievements]))
          }).eq("id", userId);
      }

      return result;
  }

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
