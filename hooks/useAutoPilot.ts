import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { UserProfile, Post, AutoPilotConfig, GenerationParams, ViralTone, ViralFramework, PostLength, EmojiDensity } from '../types';
import { executePostGeneration } from '../services/postWorkflow';
import { calculateLevel } from '../services/gamificationEngine';

interface UseAutoPilotProps {
    user: UserProfile;
    setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    setIsGenerating: (isGenerating: boolean) => void;
    handleUpdateUser: (updates: Partial<UserProfile>) => Promise<void>;
    setShowUpgradeModal: (show: boolean) => void;
}

export const useAutoPilot = ({
    user,
    setUser,
    posts,
    setPosts,
    setIsGenerating,
    handleUpdateUser,
    setShowUpgradeModal
}: UseAutoPilotProps) => {

    const calculateNextRun = (config: AutoPilotConfig): number => {
        const now = new Date();
        const targetTime = config.time ? config.time.split(':') : ['09', '00'];
        const targetH = parseInt(targetTime[0]);
        const targetM = parseInt(targetTime[1]);

        if (config.frequency !== 'custom') {
            const dayMs = 24 * 60 * 60 * 1000;
            let daysToAdd = 0;
            if (config.frequency === 'daily') daysToAdd = 1;
            if (config.frequency === 'weekly') daysToAdd = 7;
            if (config.frequency === 'biweekly') daysToAdd = 14;

            let futureDate = new Date(now.getTime() + daysToAdd * dayMs);
            futureDate.setHours(targetH, targetM, 0, 0);

            if (futureDate.getTime() <= now.getTime()) {
                futureDate.setDate(futureDate.getDate() + 1);
            }
            return futureDate.getTime();
        }

        if (config.frequency === 'custom' && config.days && config.days.length > 0) {
            for (let i = 0; i < 14; i++) {
                let checkDate = new Date(now);
                checkDate.setDate(now.getDate() + i);
                checkDate.setHours(targetH, targetM, 0, 0);
                if (checkDate.getTime() <= now.getTime()) continue;
                if (config.days.includes(checkDate.getDay())) {
                    return checkDate.getTime();
                }
            }
        }
        return Date.now() + 24 * 60 * 60 * 1000;
    };

    const triggerAutoPilotRun = async () => {
        if (user.cancelAtPeriodEnd) {
            toast.error("Autopilot disabled for cancelled plans.");
            return;
        }

        // Safety: Ensure config exists
        const config = user.autoPilot || {
            enabled: false,
            frequency: 'weekly',
            nextRun: Date.now(),
            topics: [],
            tone: ViralTone.PROFESSIONAL,
            targetAudience: '',
            postCount: 1
        };

        const count = config.postCount || 1;
        let currentCredits = user.credits;

        if (currentCredits <= 0) {
            toast.error("No tienes créditos suficientes para ejecutar Autopilot.");
            setShowUpgradeModal(true);
            return;
        }

        const newPosts: Post[] = [];
        let updatedUser = { ...user };

        setIsGenerating(true);
        toast.info(`Iniciando Autopilot: Generando ${count} post(s)...`);

        for (let i = 0; i < count; i++) {
            if (currentCredits <= 0) break;

            // Safety: Ensure topics array exists
            const topicsList = (config.topics && config.topics.length > 0)
                ? config.topics
                : ["Industry Trends", "Leadership Lessons", "Productivity"];

            const randomTopic = topicsList[Math.floor(Math.random() * topicsList.length)];

            const params: GenerationParams = {
                topic: randomTopic,
                audience: config.targetAudience || 'Professional Network',
                tone: config.tone || ViralTone.PROFESSIONAL,
                framework: [ViralFramework.PAS, ViralFramework.CONTRARIAN, ViralFramework.STORY][Math.floor(Math.random() * 3)],
                length: PostLength.MEDIUM,
                creativityLevel: 60,
                emojiDensity: EmojiDensity.MODERATE,
                includeCTA: true
            };

            try {
                // Use the new service
                const result = await executePostGeneration(updatedUser, params, [...newPosts, ...posts], true);

                newPosts.push(result.post);
                updatedUser = result.updatedUser;
                currentCredits = result.updatedUser.credits;

            } catch (e) {
                console.error("AutoPilot generation failed for one item:", e);
                toast.error(`Error generando post ${i + 1}: ${e instanceof Error ? e.message : 'Unknown error'}`);
            }
        }

        setIsGenerating(false);
        if (newPosts.length === 0) return;

        // 1. Optimistic UI Update: Show posts immediately
        setPosts(prev => {
            const combined = [...newPosts, ...prev];
            localStorage.setItem('kolink_history', JSON.stringify(combined));
            return combined;
        });

        // 2. Calculate next run
        const nextRun = calculateNextRun(user.autoPilot);

        // 3. Final User State Update
        const finalUserData = {
            ...updatedUser,
            autoPilot: { ...user.autoPilot, nextRun }
        };

        setUser(finalUserData);

        // 4. Background Sync
        (async () => {
            try {
                await handleUpdateUser({
                    autoPilot: finalUserData.autoPilot,
                    credits: currentCredits,
                    xp: finalUserData.xp,
                    level: finalUserData.level,
                    lastPostDate: finalUserData.lastPostDate
                });
            } catch (syncError) {
                console.error("Background sync failed:", syncError);
                toast.error("Tu post se generó, pero hubo un error al sincronizar con la nube.");
            }
        })();
    };

    useEffect(() => {
        if (!user.autoPilot.enabled) return;
        const checkAutoPilot = () => {
            const now = Date.now();
            if (now >= user.autoPilot.nextRun) {
                triggerAutoPilotRun();
            }
        };
        const timer = setInterval(checkAutoPilot, 60000);
        checkAutoPilot();
        return () => clearInterval(timer);
    }, [user.autoPilot]);

    const updateConfig = (updates: Partial<AutoPilotConfig>) => {
        const newConfig = { ...user.autoPilot, ...updates };
        setUser(prev => ({ ...prev, autoPilot: newConfig }));
    };

    const saveConfig = async () => {
        try {
            await handleUpdateUser({ autoPilot: user.autoPilot });
            toast.success("Autopilot configuration saved");
        } catch (error) {
            console.error("Error saving autopilot config:", error);
            toast.error("Failed to save configuration");
        }
    };

    return {
        triggerAutoPilotRun,
        config: user.autoPilot || {
            enabled: false,
            frequency: 'weekly',
            nextRun: Date.now(),
            topics: [],
            tone: ViralTone.PROFESSIONAL,
            targetAudience: '',
            postCount: 1
        },
        updateConfig,
        saveConfig
    };
};
