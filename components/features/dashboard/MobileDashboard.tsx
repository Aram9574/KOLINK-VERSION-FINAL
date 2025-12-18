import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { usePosts } from "../../../context/PostContext";
import { useSubscription } from "../../../hooks/useSubscription";
import { usePostGeneration } from "../../../hooks/usePostGeneration";
import { useUserSync } from "../../../hooks/useUserSync";

import DashboardLayout from "../../layouts/DashboardLayout";
import HistoryView from "../history/HistoryView";
import SettingsView from "../settings/SettingsView";

import AutoPilotView from "../autopilot/AutoPilotView";
import OnboardingFlow from "../onboarding/OnboardingFlow";
import UpgradeModal from "../../modals/UpgradeModal";
import CancellationModal from "../../modals/CancellationModal";
import WelcomeModal from "../../modals/WelcomeModal";
import TourGuide from "./ProductTour";
import LevelUpModal from "../../modals/LevelUpModal";
import { updateUserProfile } from "../../../services/userRepository";
import ProfileAuditor from "../auditor/ProfileAuditor";
import LockedAuditorState from "../auditor/LockedAuditorState";
import LockedAutoPilotState from "../autopilot/LockedAutoPilotState";
import LockedHistoryState from "../history/LockedHistoryState";
import ReferralModal from "../../modals/ReferralModal";
import { toast } from "sonner";
import { UserProfile } from "../../../types";
import { translations } from "../../../translations";
import { Suspense } from "react";

// Lazy load PostGenerator
const PostCreator = React.lazy(() => import("../generation/PostGenerator"));

const MobileDashboard: React.FC = () => {
    const { user, refreshUser, setUser, language, setLanguage } = useUser();
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

    const t = translations[language].productTour;

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
    const [activeTab, setActiveTabRaw] = useState<
        "create" | "history" | "settings" | "autopilot" | "auditor" | "ideas"
    >(() => {
        const saved = localStorage.getItem("kolink_active_tab");
        if (saved === "ideas") return "create";
        return (saved as any) || "create";
    });

    const setActiveTab = (
        tab:
            | "create"
            | "history"
            | "settings"
            | "autopilot"
            | "auditor"
            | "ideas",
    ) => {
        setActiveTabRaw(tab);
        localStorage.setItem("kolink_active_tab", tab);
    };

    // Modals
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showCreditDeduction, setShowCreditDeduction] = useState(false);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [isTourActive, setIsTourActive] = useState(false);
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [levelUpData, setLevelUpData] = useState<any>(null);

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

    // Onboarding Effect
    useEffect(() => {
        if (user.hasOnboarded === false && !isOnboarding) {
            setIsOnboarding(true);
        }
    }, [user.hasOnboarded]);

    // Tour Effect
    useEffect(() => {
        const hasSeenTour = localStorage.getItem(`kolink_tour_seen_${user.id}`);
        if (!hasSeenTour && !isOnboarding && user.hasOnboarded) {
            if (!isTourActive) {
                setShowWelcome(true);
            }
        }
    }, [user.id, isOnboarding, user.hasOnboarded, isTourActive]);

    // Handlers
    const handleDeletePost = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this post?")) {
            removePost(id);
            toast.success("Post deleted");
        }
    };

    const handleOnboardingComplete = async (
        updatedData: Partial<UserProfile>,
    ) => {
        await handleUpdateUser(updatedData);
        setIsOnboarding(false);
        await refreshUser();
        setShowWelcome(true);
    };

    const handleStartTour = () => {
        setShowWelcome(false);
        setIsTourActive(true);
        setActiveTab("create");
    };

    const handleSkipTour = () => {
        setShowWelcome(false);
        localStorage.setItem(`kolink_tour_seen_${user.id}`, "true");
    };

    const handleTourComplete = () => {
        setIsTourActive(false);
        localStorage.setItem(`kolink_tour_seen_${user.id}`, "true");
    };

    // Tour Config
    const TOUR_STEPS = [
        {
            targetId: "viral-engine-view",
            title: language === "es" ? "Motor Viral" : "Viral Engine",
            description: language === "es"
                ? "Genera tu primer post aquí con nuestra IA entrenada."
                : "Generate your first post here with our trained AI.",
            tab: "create" as const,
        },
        // ... (Other steps)
    ];

    const handleTourStepChange = (index: number) => {
        // ... logic
    };

    if (isOnboarding) {
        return (
            <OnboardingFlow user={user} onComplete={handleOnboardingComplete} />
        );
    }

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
                {/* Mobile Specific Header/Content Wrapper */}

                <div
                    className={`flex-1 ${
                        activeTab === "history"
                            ? "overflow-hidden"
                            : "overflow-y-auto"
                    }`}
                >
                    {/* Mobile Padding & Layout Adjustments */}
                    <div className="pb-24 pt-safe safe-area-inset-bottom">
                        {
                            /*
                            MOBILE SPECIFIC UI DIFFERENCES WILL GO HERE
                            For now, mirroring structure but ready for deviation
                        */
                        }

                        {activeTab === "create" && (
                            <div className="px-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                        )}

                        {activeTab === "history" && (
                            <div className="h-full">
                                {user.planTier === "free"
                                    ? (
                                        <LockedHistoryState
                                            onUpgrade={() =>
                                                setShowUpgradeModal(true)}
                                        />
                                    )
                                    : (
                                        <div className="p-2">
                                            <HistoryView
                                                onSelect={(post) => {
                                                    setCurrentPost(post);
                                                    setActiveTab("create");
                                                }}
                                                onReuse={(params) => {
                                                    // reuse logic...
                                                    setActiveTab("create");
                                                }}
                                                onDelete={handleDeletePost}
                                                language={language}
                                                onUpgrade={() =>
                                                    setShowUpgradeModal(true)}
                                            />
                                        </div>
                                    )}
                            </div>
                        )}

                        {/* Other tabs... */}
                        {activeTab === "settings" && (
                            <div className="p-4">
                                <SettingsView
                                    user={user}
                                    onUpgrade={() => setShowUpgradeModal(true)}
                                    // wrapper for mobile saving feedback if needed
                                    onSave={handleUpdateUser}
                                />
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

export default MobileDashboard;
