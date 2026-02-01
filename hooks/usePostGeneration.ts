import React, { useEffect, useState } from "react";
import { AppTab, GenerationParams, Post, UserProfile, LevelUpData } from "../types";
import { useGenerationLogic } from "./useGenerationLogic";
import { useLinkedInPublishing } from "./useLinkedInPublishing";
import { usePostHistory } from "./usePostHistory";
import { usePosts } from "../context/PostContext";

interface UsePostGenerationProps {
    user: UserProfile;
    currentPost: Post | null;
    setCurrentPost: React.Dispatch<React.SetStateAction<Post | null>>;
    setActiveTab: (tab: AppTab) => void;
    handleUpdateUser: (updates: Partial<UserProfile>) => Promise<void>;
    setShowUpgradeModal: (show: boolean) => void;
    setShowCreditDeduction: (show: boolean) => void;
    setLevelUpData: (data: LevelUpData) => void;
}

export const usePostGeneration = ({
    user,
    currentPost,
    setCurrentPost,
    setActiveTab,
    handleUpdateUser,
    setShowUpgradeModal,
    setShowCreditDeduction,
    setLevelUpData,
}: UsePostGenerationProps) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [autoStartGeneration, setAutoStartGeneration] = useState(false);
    const [prefilledTopic, setPrefilledTopic] = useState<string>("");

    const { posts, setPosts } = usePosts(); // Get from context instead of props

    const { savePostToHistory, handleDeletePost, handleUpdatePostContent } =
        usePostHistory({
            user,
            posts,
            setPosts,
            currentPost,
            setCurrentPost,
        });

    const {
        prefilledParams,
        setPrefilledParams,
        handleGenerate,
        justGeneratedPostId,
    } = useGenerationLogic({
        user,
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
    });

    const { isPublishing, handlePublish: publishToLinkedIn } =
        useLinkedInPublishing();

    // Enforce display of newly generated post
    useEffect(() => {
        if (justGeneratedPostId.current && posts.length > 0) {
            const targetPost = posts.find((p) =>
                p.id === justGeneratedPostId.current
            );
            if (targetPost && currentPost?.id !== targetPost.id) {
                console.log(
                    "Enforcing display of generated post:",
                    targetPost.id,
                );
                setCurrentPost(targetPost);
                justGeneratedPostId.current = null;
            }
        }
    }, [posts, currentPost, setCurrentPost, justGeneratedPostId]);

    const handlePublish = () => publishToLinkedIn(currentPost);

    const handleUseIdea = (idea: string) => {
        setPrefilledTopic(idea);
        setPrefilledParams(null);
        setActiveTab("create");
    };

    const handleReusePost = (params: GenerationParams) => {
        setPrefilledParams(params);
        setPrefilledTopic("");
        setActiveTab("create");
    };

    return {
        isPublishing,
        prefilledTopic,
        setPrefilledTopic,
        prefilledParams,
        setPrefilledParams,
        handleGenerate,
        handleDeletePost,
        handleUpdatePostContent,
        handlePublish,
        handleUseIdea,
        handleReusePost,
        isGenerating,
        setIsGenerating,
        autoStartGeneration,
        setAutoStartGeneration,
    };
};
