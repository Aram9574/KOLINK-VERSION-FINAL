import React, { useEffect, useState } from "react";
import { AppTab, GenerationParams, Post, UserProfile } from "../types";
import { useGenerationLogic } from "./useGenerationLogic";
import { useLinkedInPublishing } from "./useLinkedInPublishing";
import { usePostHistory } from "./usePostHistory";

interface UsePostGenerationProps {
    user: UserProfile;
    setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    currentPost: Post | null;
    setCurrentPost: React.Dispatch<React.SetStateAction<Post | null>>;
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
    handleUpdateUser: (updates: Partial<UserProfile>) => Promise<void>;
    setShowUpgradeModal: (show: boolean) => void;
    setShowCreditDeduction: (show: boolean) => void;
    setLevelUpData: (data: any) => void;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void;
}

export const usePostGeneration = ({
    user,
    setUser,
    posts,
    setPosts,
    currentPost,
    setCurrentPost,
    activeTab,
    setActiveTab,
    handleUpdateUser,
    setShowUpgradeModal,
    setShowCreditDeduction,
    setLevelUpData,
    isGenerating,
    setIsGenerating,
}: UsePostGenerationProps) => {
    const [prefilledTopic, setPrefilledTopic] = useState<string>("");

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
    };
};
