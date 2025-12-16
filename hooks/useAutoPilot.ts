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

    // Simplified: No client-side loop. The backend handles generation.

    // We can keep a "trigger" for manual testing if needed, or remove it.
    // For now, let's keep a simplified manual trigger that calls the Edge Function directly (optional)
    // or just keeps the config syncing.

    const triggerAutoPilotRun = async () => {
        // This is now handled by the Backend Scheduler. 
        // If we want a "Force Run" button, we should call the Edge Function.
        // For this refactor, we just notify the user.
        toast.info("AutoPilot is running in the cloud ☁️");
    };

    // Remove the useEffect loop
    useEffect(() => {
        // No client side polling anymore.
    }, []);

    const updateConfig = (updates: Partial<AutoPilotConfig>) => {
        const newConfig = { ...user.autoPilot, ...updates };
        setUser(prev => ({ ...prev, autoPilot: newConfig }));
    };

    const saveConfig = async () => {
        try {
            await handleUpdateUser({ autoPilot: user.autoPilot });
            toast.success("AutoPilot configuration saved & synced to cloud");
        } catch (error) {
            console.error("Error saving autopilot config:", error);
            toast.error("Failed to save configuration");
        }
    };

    return {
        triggerAutoPilotRun, // retained for compatibility but does nothing active
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
