import { Post, UserProfile } from "../types";
import { ACHIEVEMENTS } from "../constants";

interface GamificationUpdate {
  newXP: number;
  newLevel: number;
  newStreak: number;
  newAchievements: string[];
  leveledUp: boolean;
}

export const calculateLevel = (xp: number): number => {
  // Simple curve: Level = sqrt(XP / 100)
  // 100 XP = Lvl 1
  // 400 XP = Lvl 2
  // 900 XP = Lvl 3
  const lvl = Math.floor(Math.sqrt(xp / 100));
  return Math.max(1, lvl);
};

export const processGamification = (
  user: UserProfile,
  newPost: Post,
  allPosts: Post[] // Including the new one
): GamificationUpdate => {
  let currentXP = user.xp;
  let currentStreak = user.currentStreak;
  const newAchievements: string[] = [];
  
  // 1. Calculate Streak
  const now = new Date();
  const lastDate = user.lastPostDate ? new Date(user.lastPostDate) : null;
  
  if (lastDate) {
    const isSameDay = now.toDateString() === lastDate.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === lastDate.toDateString();
    
    // Reset 'now' for other calcs
    const today = new Date(); 

    if (!isSameDay) {
      if (isYesterday) {
        currentStreak += 1;
      } else {
        // Streak broken
        currentStreak = 1;
      }
    }
    // If same day, streak stays same
  } else {
    currentStreak = 1;
  }

  // 2. Base XP Reward with GOAL GRADIENT EFFECT
  // Rewards increase as you approach major milestones (like Level 3 / 900 XP)
  const baseReward = user.xp < 900 ? 50 + Math.floor(user.xp / 10) : 50; 
  currentXP += baseReward;

  // 3. Check Achievements
  const existingIds = new Set(user.unlockedAchievements);

  // Achievement: First Step
  if (!existingIds.has('first_step') && allPosts.length >= 1) {
    newAchievements.push('first_step');
    currentXP += 50;
  }

  // Achievement: Prolific Writer (10 posts)
  if (!existingIds.has('pro_writer') && allPosts.length >= 10) {
    newAchievements.push('pro_writer');
    currentXP += 300;
  }

  // Achievement: Streak 3
  if (!existingIds.has('streak_3') && currentStreak >= 3) {
    newAchievements.push('streak_3');
    currentXP += 150;
  }
  
  // Achievement: Streak 7
  if (!existingIds.has('streak_7') && currentStreak >= 7) {
    newAchievements.push('streak_7');
    currentXP += 500;
  }

  // Achievement: Contextual (Tone check)
  if (!existingIds.has('clickbait_master') && newPost.params.tone.includes('Controversial')) {
    newAchievements.push('clickbait_master');
    currentXP += 100;
  }

  // 4. Calculate Level
  const newLevel = calculateLevel(currentXP);
  const leveledUp = newLevel > user.level;

  return {
    newXP: currentXP,
    newLevel,
    newStreak: currentStreak,
    newAchievements,
    leveledUp
  };
};