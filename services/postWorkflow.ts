import { UserProfile, Post, GenerationParams } from '../types';
import { generateViralPost } from './geminiService';
import { processGamification, calculateLevel } from './gamificationEngine';

export interface PostGenerationResult {
    post: Post;
    updatedUser: UserProfile;
    gamificationResult: {
        newXP: number;
        newLevel: number;
        newStreak: number;
        newAchievements: string[];
        leveledUp: boolean;
    };
}

export const executePostGeneration = async (
    user: UserProfile,
    params: GenerationParams,
    allPosts: Post[],
    isAutoPilot: boolean = false
): Promise<PostGenerationResult> => {
    // 1. Validation
    if (user.credits <= 0 && !isAutoPilot) {
        throw new Error("Insufficient credits");
    }

    // 2. Generate Content
    const result = await generateViralPost(params, user);

    // 3. Create Post Object
    const newPost: Post = {
        id: result.id || Date.now().toString(),
        content: result.content,
        params: params,
        createdAt: Date.now(),
        likes: 0,
        views: 0,
        isAutoPilot,
        viralScore: result.viralScore,
        viralAnalysis: result.viralAnalysis
    };

    // 4. Update Credits (Optimistic)
    // Note: Edge Function handles DB deduction, we just mirror it locally
    const newCreditCount = Math.max(0, user.credits - 1);

    // 5. Process Gamification
    // PRIORITY: Use server-validated gamification result
    const gamificationResult = result.gamification || {
        newXP: user.xp,
        newLevel: user.level,
        newStreak: user.currentStreak,
        newAchievements: [],
        leveledUp: false
    };

    // 6. Construct Updated User State
    const updatedUser: UserProfile = {
        ...user,
        credits: newCreditCount,
        xp: gamificationResult.newXP,
        level: gamificationResult.newLevel,
        currentStreak: gamificationResult.newStreak,
        lastPostDate: Date.now(),
        // Merge unique achievements
        unlockedAchievements: Array.from(new Set([...user.unlockedAchievements, ...gamificationResult.newAchievements]))
    };

    return {
        post: newPost,
        updatedUser,
        gamificationResult
    };
};
