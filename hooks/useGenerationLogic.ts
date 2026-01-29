import React, { useEffect, useRef, useState } from "react";
import { useToast } from "../context/ToastContext";
import { AppTab, GenerationParams, Post, UserProfile, LevelUpData } from "../types";
import { executePostGeneration } from "../services/postWorkflow";
import { supabase } from "../services/supabaseClient";
import { fetchUserProfile } from "../services/userRepository";

interface UseGenerationLogicProps {
    user: UserProfile;
    setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    setCurrentPost: React.Dispatch<React.SetStateAction<Post | null>>;
    setActiveTab: (tab: AppTab) => void;
    handleUpdateUser: (updates: Partial<UserProfile>) => Promise<void>;
    setShowUpgradeModal: (show: boolean) => void;
    setShowCreditDeduction: (show: boolean) => void;
    setLevelUpData: (data: LevelUpData) => void;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void;
    savePostToHistory: (post: Post) => void;
}

/**
 * Custom hook to manage the core post generation workflow.
 * Handles user interaction, recovery from interruptions, state updates, and gamification events.
 *
 * @param props - Dependencies injected from the main Application/Dashboard component.
 * @returns Object containing handlers and state for the generation process.
 */
export const useGenerationLogic = ({
    user,
    setUser,
    posts,
    setPosts,
    setCurrentPost,
    setActiveTab,
    handleUpdateUser,
    setShowUpgradeModal,
    setShowCreditDeduction,
    setLevelUpData,
    isGenerating,
    setIsGenerating,
    savePostToHistory,
}: UseGenerationLogicProps) => {
    const toast = useToast();
    const [prefilledParams, setPrefilledParams] = useState<
        GenerationParams | null
    >(null);
    const justGeneratedPostId = useRef<string | null>(null);
    const hasCheckedRecovery = useRef(false);

    // Recovery mechanism
    useEffect(() => {
        if (!user.id || hasCheckedRecovery.current) return;

        const checkRecovery = async () => {
            hasCheckedRecovery.current = true;
            const genTimestamp = localStorage.getItem("kolink_is_generating");
            if (genTimestamp) {
                const startTime = parseInt(genTimestamp);
                if (Date.now() - startTime < 5 * 60 * 1000) {
                    console.log(
                        "Attempting to recover interrupted generation...",
                    );
                    setIsGenerating(true);
                    await new Promise((resolve) => setTimeout(resolve, 2000));

                    try {
                        const { data: latestPosts } = await supabase
                            .from("posts")
                            .select("*")
                            .eq("user_id", user.id)
                            .order("created_at", { ascending: false })
                            .limit(1);

                        if (latestPosts && latestPosts.length > 0) {
                            const recoveredPost = latestPosts[0];
                            const postTime = new Date(recoveredPost.created_at)
                                .getTime();

                            if (postTime > startTime) {
                                toast.success(
                                    "¡Post recuperado! Se generó mientras no estabas.",
                                    "Recuperado"
                                );
                                const mappedPost: Post = {
                                    id: recoveredPost.id,
                                    content: recoveredPost.content,
                                    params: recoveredPost.generation_params ||
                                        {},
                                    createdAt: postTime,
                                    likes: 0,
                                    views: 0,
                                    isAutoPilot: false,
                                    viralScore: recoveredPost.viral_score,
                                    viralAnalysis: recoveredPost.viral_analysis,
                                };

                                setCurrentPost(mappedPost);
                                setPosts((prev) => {
                                    if (
                                        prev.some((p) => p.id === mappedPost.id)
                                    ) return prev;
                                    return [mappedPost, ...prev];
                                });
                                localStorage.removeItem("kolink_is_generating");
                            }
                        }
                    } catch (e) {
                        console.error("Recovery failed", e);
                    } finally {
                        setIsGenerating(false);
                        // Always clear the flag after one recovery attempt to prevent loops
                        localStorage.removeItem("kolink_is_generating");
                    }
                } else {
                    localStorage.removeItem("kolink_is_generating");
                }
            }
        };
        checkRecovery();
    }, [user.id, setIsGenerating, setPosts, setCurrentPost]);

    /**
     * Triggers the post generation process.
     * Validates credits, calls the backend workflow, updates user state (XP/Level), and handles errors.
     *
     * @param params - Generation parameters.
     * @param isAutoPilot - Whether this is triggered automatically (suppresses UI modals).
     */
    const handleGenerate = async (
        params: GenerationParams,
        isAutoPilot = false,
    ) => {
        if (user.credits <= 0 || user.cancelAtPeriodEnd) {
            if (!isAutoPilot && !user.cancelAtPeriodEnd) {
                setShowUpgradeModal(true);
            }
            return;
        }

        setIsGenerating(true);
        localStorage.setItem("kolink_is_generating", Date.now().toString());
        if (!isAutoPilot) setShowCreditDeduction(false);

        try {
            // Ensure we are on the creation tab
            setActiveTab("create");
            
            const result = await executePostGeneration(
                user,
                params,
                posts,
                isAutoPilot,
            );
            const { post: generatedPost, updatedUser, gamificationResult } =
                result;

            // Frontend Post-processing: Remove all ** used for bolding
            const newPost: Post = {
                ...generatedPost,
                content: generatedPost.content.replace(/\*\*/g, ""),
            };

            setUser(updatedUser);
            savePostToHistory(newPost);

            if (!isAutoPilot) {
                setShowCreditDeduction(true);
                setTimeout(() => setShowCreditDeduction(false), 2500);

                if (
                    gamificationResult.leveledUp ||
                    gamificationResult.newAchievements.length > 0
                ) {
                    setLevelUpData({
                        leveledUp: gamificationResult.leveledUp,
                        newLevel: gamificationResult.newLevel,
                        newAchievements: gamificationResult.newAchievements,
                    });
                }

                handleUpdateUser({
                    xp: gamificationResult.newXP,
                    level: gamificationResult.newLevel,
                    currentStreak: gamificationResult.newStreak,
                    lastPostDate: Date.now(),
                    unlockedAchievements: updatedUser.unlockedAchievements,
                });

                const xpGained = gamificationResult.newXP - user.xp;
                if (xpGained > 0) {
                    toast.success(`+${xpGained} XP! Sigue así para subir de nivel!`, "Ganancia de XP");
                }

                fetchUserProfile(user.id).then((updatedProfile) => {
                    if (updatedProfile) {
                        setUser((prev) => ({ ...prev, ...updatedProfile }));
                    }
                });
            }

            setPrefilledParams(null);
            console.log(
                "Finalizing generation, setting current post:",
                newPost.id,
            );
            setCurrentPost(newPost);
            localStorage.setItem("kolink_current_post_id", newPost.id);
            justGeneratedPostId.current = newPost.id;
            setActiveTab("create");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error: any) {
            console.error("Failed to generate", error);
            if (!isAutoPilot) {
                const msg = error.message || "";

                if (msg.includes("Insufficient credits")) {
                    setShowUpgradeModal(true);
                } else if (msg.includes("Rate limit exceeded")) {
                    toast.warning(
                        "Por favor espera unos segundos antes de generar otro post.",
                        "Límite de velocidad"
                    );
                } else {
                    // Generic error - distinguish between network and server if possible
                    toast.error(
                        msg.length < 50
                                ? msg
                                : "Error de conexión",
                        "Error"
                    );
                }
            }
        } finally {
            setIsGenerating(false);
            localStorage.removeItem("kolink_is_generating");
        }
    };

    return {
        prefilledParams,
        setPrefilledParams,
        handleGenerate,
        justGeneratedPostId,
    };
};
