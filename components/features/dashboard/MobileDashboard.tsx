import React, { useState, useEffect } from 'react';
import { useUser } from "../../../context/UserContext";
import { PostProvider, usePosts } from "../../../context/PostContext";
import { useSubscription } from "../../../hooks/useSubscription";
import { usePostGeneration } from "../../../hooks/usePostGeneration";
import { useUserSync } from "../../../hooks/useUserSync";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Loader2 } from "lucide-react";

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
import ReferralModal from "../../modals/ReferralModal";
import { toast } from "sonner";
import { AppLanguage, AppTab, UserProfile } from "../../../types";
import { translations } from "../../../translations";
import { Suspense } from "react";

// Lazy load PostGenerator
const PostCreator = React.lazy(() => import("../generation/PostGenerator"));

const MobileDashboardContent: React.FC = () => {
    const { user, refreshUser, setUser, language, setLanguage, logout } =
        useUser();
    const {
        posts,
        setPosts,
        currentPost,
        setCurrentPost,
        isGenerating,
        setIsGenerating,
        addPost, // eslint-disable-line
        removePost,
        updatePost, // eslint-disable-line
    } = usePosts();

    // Prefetch PostGenerator
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
    const [activeTab, setActiveTabRaw] = useState<AppTab>(() => {
        const saved = localStorage.getItem("kolink_active_tab");
        if (saved === "ideas") return "create";
        return (saved as any) || "create";
    });

    const setActiveTab = (tab: AppTab) => {
        setActiveTabRaw(tab);
        localStorage.setItem("kolink_active_tab", tab);
    };

    // Modals
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showCreditDeduction, setShowCreditDeduction] = useState(false);
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [levelUpData, setLevelUpData] = useState<any>(null);

    // Pull to Refresh State
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [startY, setStartY] = useState(0);

    const REFRESH_THRESHOLD = 80;

    const handleTouchStart = (e: React.TouchEvent) => {
        if (activeTab === "history") return; // History has its own scrolling sometimes
        const scrollContainer = e.currentTarget;
        if (scrollContainer.scrollTop === 0) {
            setStartY(e.touches[0].pageY);
        } else {
            setStartY(-1);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startY === -1 || isRefreshing) return;
        const currentY = e.touches[0].pageY;
        const distance = currentY - startY;
        if (distance > 0) {
            setPullDistance(Math.min(distance * 0.5, REFRESH_THRESHOLD + 20));
            if (distance * 0.5 >= REFRESH_THRESHOLD) {
                // Potential vibration on threshold?
                // We'll do it on release to avoid constant vibrations
            }
        }
    };

    const handleTouchEnd = async () => {
        if (pullDistance >= REFRESH_THRESHOLD && !isRefreshing) {
            setIsRefreshing(true);
            setPullDistance(REFRESH_THRESHOLD);

            await Haptics.impact({ style: ImpactStyle.Medium });

            try {
                await refreshUser();
                // If history view had a manual refresh we'd call it here
                toast.success(language === "es" ? "Actualizado" : "Refreshed");
            } catch (error) {
                console.error("Refresh failed", error);
            } finally {
                setTimeout(() => {
                    setIsRefreshing(false);
                    setPullDistance(0);
                }, 1000);
            }
        } else {
            setPullDistance(0);
        }
        setStartY(-1);
    };

    // Helpers
    const handleUpdateUser = async (updates: Partial<UserProfile>) => {
        setUser((prev) => ({ ...prev, ...updates }));
        if (user.id) {
            try {
                await updateUserProfile(user.id, updates);
            } catch (error) {
                console.error("Failed to persist user updates:", error);
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
            <div className="h-full flex flex-col bg-slate-50">
                <div
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={`flex-1 relative ${
                        activeTab === "history"
                            ? "overflow-hidden"
                            : "overflow-y-auto"
                    }`}
                >
                    {/* Pull to Refresh Indicator */}
                    <div
                        className="absolute left-0 right-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden transition-all duration-200"
                        style={{
                            height: `${pullDistance}px`,
                            opacity: pullDistance / REFRESH_THRESHOLD,
                        }}
                    >
                        <div
                            className={`transition-transform duration-200 ${
                                isRefreshing ? "animate-spin" : ""
                            }`}
                        >
                            <Loader2
                                className="text-brand-600"
                                style={{
                                    transform: `rotate(${pullDistance * 2}deg)`,
                                }}
                            />
                        </div>
                    </div>

                    <div
                        className="pb-24 pt-safe pr-safe pl-safe safe-area-inset-bottom h-full"
                        style={{
                            transform: `translateY(${pullDistance}px)`,
                            transition: isRefreshing
                                ? "transform 0.2s"
                                : "none",
                        }}
                    >
                        {activeTab === "create" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="px-6 pt-6 pb-2">
                                    <h1 className="text-3xl font-display font-bold text-slate-900 leading-tight">
                                        {language === "es"
                                            ? "Estudio"
                                            : "Studio"}
                                    </h1>
                                    <p className="text-slate-500 text-sm mt-1">
                                        {language === "es"
                                            ? "Crea contenido viral con IA."
                                            : "Create viral content with AI."}
                                    </p>
                                </div>
                                <div className="px-4 py-4">
                                    <Suspense
                                        fallback={
                                            <div className="h-64 flex items-center justify-center">
                                                Loading...
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
                                            initialTopic={currentPost?.params
                                                ?.topic}
                                        />
                                    </Suspense>
                                </div>
                            </div>
                        )}

                        {activeTab === "history" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {user.planTier === "free"
                                    ? (
                                        <LockedHistoryState
                                            onUpgrade={() =>
                                                setShowUpgradeModal(true)}
                                        />
                                    )
                                    : (
                                        <div className="p-2">
                                            <div className="px-4 pt-4 pb-2">
                                                <h1 className="text-3xl font-display font-bold text-slate-900 leading-tight">
                                                    {language === "es"
                                                        ? "Historial"
                                                        : "History"}
                                                </h1>
                                                <p className="text-slate-500 text-sm mt-1">
                                                    {language === "es"
                                                        ? "Tus creaciones pasadas."
                                                        : "Your past creations."}
                                                </p>
                                            </div>
                                            <div className="p-2">
                                                <HistoryView
                                                    onSelect={(post) => {
                                                        setCurrentPost(post);
                                                        setActiveTab("create");
                                                    }}
                                                    onReuse={(params) => {
                                                        setCurrentPost({
                                                            id: "draft-" +
                                                                Date.now(),
                                                            content: "",
                                                            params: params,
                                                            createdAt: Date
                                                                .now(),
                                                            likes: 0,
                                                            views: 0,
                                                        });
                                                        setActiveTab("create");
                                                    }}
                                                    onDelete={handleDeletePost}
                                                    language={language}
                                                    onUpgrade={() =>
                                                        setShowUpgradeModal(
                                                            true,
                                                        )}
                                                />
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}

                        {activeTab === "autopilot" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="px-6 pt-6 pb-2">
                                    <h1 className="text-3xl font-display font-bold text-slate-900 leading-tight">
                                        {language === "es"
                                            ? "AutoPilot"
                                            : "AutoPilot"}
                                    </h1>
                                    <p className="text-slate-500 text-sm mt-1">
                                        {language === "es"
                                            ? "Automatización inteligente."
                                            : "Smart automation."}
                                    </p>
                                </div>
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
                                <div className="px-6 pt-6 pb-2">
                                    <h1 className="text-3xl font-display font-bold text-slate-900 leading-tight">
                                        {language === "es"
                                            ? "Ajustes"
                                            : "Settings"}
                                    </h1>
                                    <p className="text-slate-500 text-sm mt-1">
                                        {language === "es"
                                            ? "Gestiona tu cuenta."
                                            : "Manage your account."}
                                    </p>
                                </div>
                                <div className="px-4 py-4">
                                    <SettingsView
                                        user={user}
                                        onUpgrade={() =>
                                            setShowUpgradeModal(true)}
                                        onSave={handleUpdateUser}
                                        onLogout={logout}
                                    />
                                </div>
                            </div>
                        )}


                    </div>
                </div>
            </div>

            {
                /* Modals reused from web because they are generally responsive enough,
                or we can create Mobile specific modals if needed later */
            }
            {showUpgradeModal && (
                <UpgradeModal
                    isOpen={showUpgradeModal}
                    onClose={() => setShowUpgradeModal(false)}
                    currentPlanId={user.planTier}
                    onUpgrade={handleUpgrade}
                />
            )}

            {/* ... Other modals */}
        </DashboardLayout>
    );
};

const MobileDashboard: React.FC = () => {
    return (
        <PostProvider>
            <MobileDashboardContent />
        </PostProvider>
    );
};

export default MobileDashboard;
