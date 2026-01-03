import React, { useEffect, useState, Suspense } from "react";
import { Capacitor } from "@capacitor/core";
import { useUser } from "../../../context/UserContext";
import { PostProvider, usePosts } from "../../../context/PostContext";
import { useSubscription } from "../../../hooks/useSubscription";
import { usePostGeneration } from "../../../hooks/usePostGeneration";
import { useAutoPilot } from "../../../hooks/useAutoPilot";
import { useUserSync } from "../../../hooks/useUserSync";
import { useLocation } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import HistoryView from "../history/HistoryView";
import SettingsView from "../settings/SettingsView";

import AutoPostView from "../autopost/AutoPostView";
import UpgradeModal from "../../modals/UpgradeModal";
import CancellationModal from "../../modals/CancellationModal";
import LevelUpModal from "../../modals/LevelUpModal";
import { updateUserProfile } from "../../../services/userRepository";

import LockedAutoPostState from "../autopost/LockedAutoPostState";
import LockedHistoryState from "../history/LockedHistoryState";
import LockedCarouselState from "../generation/LockedCarouselState";
import LockedChatState from "../chat/LockedChatState";
import LockedEditorState from "../editor/LockedEditorState";
import LockedAuditState from "../audit/LockedAuditState";
import ReferralModal from "../../modals/ReferralModal";
import { Gift } from "lucide-react";

import { toast } from "sonner";
import { AppTab, Post, UserProfile } from "../../../types";
import { translations } from "../../../translations";
import { ActionFunctionArgs } from "react-router-dom";
import Skeleton from "../../ui/Skeleton";

// Lazy load PostGenerator to reduce initial Dashboard bundle size
const PostCreator = React.lazy(() => import("../generation/PostGenerator"));
const CarouselStudio = React.lazy(() => import("../generation/CarouselStudio"));
const LinkedInExpertChat = React.lazy(() =>
    import("../chat/LinkedInExpertChat")
);
const PostEditorView = React.lazy(() => import("../editor/PostEditorView"));
const LinkedInAuditView = React.lazy(() =>
    import("../audit/LinkedInAuditView.tsx")
);
const VoiceLabView = React.lazy(() =>
    import("../voice-lab/VoiceLabView")
);
const InsightResponderView = React.lazy(() =>
    import("../insight-responder/InsightResponderView")
);

const DashboardContent: React.FC = () => {
    const { user, refreshUser, setUser, language, setLanguage } = useUser();
    const {
        posts,
        setPosts,
        currentPost,
        setCurrentPost,
        isGenerating,
        setIsGenerating,
        addPost,
        removePost,
        updatePost,
    } = usePosts();

    // Prefetch PostGenerator for smoother experience
    useEffect(() => {
        const prefetchPostGenerator = async () => {
            try {
                await import("../generation/PostGenerator");
            } catch (e) {
                console.error("Error prefetching PostGenerator", e);
            }
        };
        prefetchPostGenerator();
    }, []);

    // UI State
    // Persist active tab selection
    const [activeTab, setActiveTabRaw] = useState<AppTab>(() => {
        const saved = localStorage.getItem("kolink_active_tab");
        if (saved === "ideas") return "create"; // Legacy
        return (saved as any) || "create";
    });

    const setActiveTab = (tab: AppTab) => {
        setActiveTabRaw(tab);
        localStorage.setItem("kolink_active_tab", tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Listen for tab switch events from child components
    useEffect(() => {
        const handleTabSwitch = (e: CustomEvent) => {
            if (e.detail) setActiveTab(e.detail);
        };
        window.addEventListener('kolink-switch-tab', handleTabSwitch as EventListener);
        return () => window.removeEventListener('kolink-switch-tab', handleTabSwitch as EventListener);
    }, []);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showCreditDeduction, setShowCreditDeduction] = useState(false);
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [levelUpData, setLevelUpData] = useState<any>(null);
    const [carouselDraftContent, setCarouselDraftContent] = useState<string>(
        "",
    );

    // Helper for hooks
    const handleUpdateUser = async (updates: Partial<UserProfile>) => {
        // 1. Optimistic Update
        setUser((prev) => ({ ...prev, ...updates }));

        // 2. Persist to Database
        if (user.id) {
            try {
                // Ensure dates are strings for DB if needed, though updateUserProfile usually handles Partial<UserProfile>
                await updateUserProfile(user.id, updates);
            } catch (error) {
                console.error("Failed to persist user updates:", error);
                // Optional: Revert optimistic update here if critical
                toast.error("Error saving progress");
            }
        }
    };

    // Hooks
    useUserSync({ user, setUser, language, setLanguage });
    const { handleUpgrade } = useSubscription();

    const { handleGenerate: generatePost } = usePostGeneration({
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
    });

    // Effects

    // Handle Stripe Success Redirect
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.has("session_id")) {
            console.log("Stripe session detected, refreshing user...");
            refreshUser().then(() => {
                toast.success(
                    language === "es"
                        ? "¡Suscripción actualizada!"
                        : "Subscription updated!",
                );
                // Clean up URL to prevent multiple refreshes on re-render
                window.history.replaceState({}, "", window.location.pathname);
            });
        }
    }, [refreshUser, language]);

    // Handlers
    const handleDeletePost = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this post?")) {
            removePost(id);
            toast.success("Post deleted");
        }
    };

    return (
        <DashboardLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onUpgrade={() => setShowUpgradeModal(true)}
            onReferral={() => setShowReferralModal(true)}
            showCreditDeduction={showCreditDeduction}
            onDeletePost={handleDeletePost}
        >
            <div
                className={`h-full ${
                    ["history", "editor", "chat", "carousel", "audit", "voice-lab"].includes(
                            activeTab,
                        )
                        ? "overflow-hidden"
                        : "overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
                }`}
            >
                <div
                    className={`${
                        ["history", "editor", "chat", "carousel", "audit", "voice-lab"].includes(
                                activeTab,
                            )
                            ? "h-full w-full flex flex-col"
                            : "max-w-7xl mx-auto p-4 lg:p-8 pb-24"
                    }`}
                >
                    {activeTab === "create" && (
                        <div
                            id="viral-engine-view"
                            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                        >
                            <Suspense
                                fallback={
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent">
                                        </div>
                                    </div>
                                }
                            >
                                <PostCreator
                                    onGenerate={(params) =>
                                        generatePost(params)}
                                    isGenerating={isGenerating}
                                    credits={user.credits}
                                    language={user.language || "en"}
                                    showCreditDeduction={showCreditDeduction}
                                    initialParams={currentPost?.params}
                                    initialTopic={currentPost?.params?.topic}
                                    onGoToCarousel={(content) => {
                                        setCarouselDraftContent(content);
                                        setActiveTab("carousel");
                                    }}
                                    onEdit={(post) => {
                                        setCurrentPost(post);
                                        setActiveTab("editor");
                                    }}
                                />
                            </Suspense>
                        </div>
                    )}

                    {activeTab === "history" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
                            {user.planTier === "free"
                                ? (
                                    <LockedHistoryState
                                        onUpgrade={() =>
                                            setShowUpgradeModal(true)}
                                    />
                                )
                                : (
                                    <HistoryView
                                        onSelect={(post) => {
                                            setCurrentPost(post);
                                            setActiveTab("editor");
                                        }}
                                        onReuse={(params) => {
                                            setCurrentPost({
                                                id: "draft-" + Date.now(),
                                                content: "", // Start clear for new generation
                                                params: params,
                                                createdAt: Date.now(),
                                                likes: 0,
                                                views: 0,
                                            });
                                            setActiveTab("create");
                                        }}
                                        onDelete={handleDeletePost}
                                        language={language}
                                        onUpgrade={() =>
                                            setShowUpgradeModal(true)}
                                    />
                                )}
                        </div>
                    )}

                    {activeTab === "autopilot" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {user.planTier === "free"
                                ? (
                                    <LockedAutoPostState
                                        onUpgrade={() =>
                                            setShowUpgradeModal(true)}
                                    />
                                )
                                : (
                                    <AutoPostView
                                        user={user}
                                        language={language}
                                        onViewPost={(post) => {
                                            setCurrentPost(post);
                                            setActiveTab("create");
                                        }}
                                        onUpgrade={() =>
                                            setShowUpgradeModal(true)}
                                    />
                                )}
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <SettingsView
                                user={user}
                                onUpgrade={() => setShowUpgradeModal(true)}
                                onSave={handleUpdateUser}
                            />
                        </div>
                    )}






                    {activeTab === "carousel" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex-1 min-h-0">
                            <Suspense
                                fallback={
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent">
                                        </div>
                                    </div>
                                }
                            >
                                {user.planTier === "free"
                                    ? (
                                        <LockedCarouselState
                                            onUpgrade={() =>
                                                setShowUpgradeModal(true)}
                                        />
                                    )
                                    : (
                                        <CarouselStudio
                                            initialContent={carouselDraftContent}
                                        />
                                    )}
                            </Suspense>
                        </div>
                    )}

                    {activeTab === "chat" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex-1 min-h-0 flex flex-col">
                            {user.planTier === "free"
                                ? (
                                    <LockedChatState
                                        onUpgrade={() =>
                                            setShowUpgradeModal(true)}
                                    />
                                )
                                : <LinkedInExpertChat />}
                        </div>
                    )}

                    {activeTab === "editor" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 h-full flex flex-col min-h-0">
                            <Suspense
                                fallback={
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                                    </div>
                                }
                            >
                                {user.planTier === "free"
                                    ? (
                                        <LockedEditorState
                                            onUpgrade={() =>
                                                setShowUpgradeModal(true)}
                                        />
                                    )
                                    : <PostEditorView />}
                            </Suspense>
                        </div>
                    )}

                    {activeTab === "audit" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex-1 min-h-0 flex flex-col">
                            <Suspense
                                fallback={
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                                    </div>
                                }
                            >
                                {user.planTier === "free"
                                    ? (
                                        <LockedAuditState
                                            onUpgrade={() =>
                                                setShowUpgradeModal(true)}
                                        />
                                    )
                                    : <LinkedInAuditView />}
                            </Suspense>
                        </div>
                    )}

                    {activeTab === "voice-lab" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex-1 min-h-0 flex flex-col">
                            <Suspense
                                fallback={
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                                    </div>
                                }
                            >
                                <VoiceLabView />
                            </Suspense>
                        </div>
                    )}

                    {activeTab === "insight-responder" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex-1 min-h-0 flex flex-col">
                            <Suspense
                                fallback={
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                                    </div>
                                }
                            >
                                <InsightResponderView />
                            </Suspense>
                        </div>
                    )}

                    {activeTab === "insight-responder" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex-1 min-h-0 flex flex-col">
                            <Suspense
                                fallback={
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                                    </div>
                                }
                            >
                                <InsightResponderView />
                            </Suspense>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showUpgradeModal && (
                <UpgradeModal
                    isOpen={showUpgradeModal}
                    onClose={() => setShowUpgradeModal(false)}
                    currentPlanId={user.planTier}
                    onUpgrade={handleUpgrade}
                />
            )}

            {showCancelModal && (
                <CancellationModal
                    isOpen={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    userEmail={user.email || ""}
                    planPrice={19}
                    language={user.language || "en"}
                />
            )}

            {levelUpData && (
                <LevelUpModal
                    onClose={() => setLevelUpData(null)}
                    data={levelUpData}
                    language={language}
                />
            )}

            <ReferralModal
                isOpen={showReferralModal}
                onClose={() => setShowReferralModal(false)}
            />
        </DashboardLayout>
    );
};

const Dashboard: React.FC = () => {
    return (
        <PostProvider>
            <DashboardContent />
        </PostProvider>
    );
};

export default Dashboard;
