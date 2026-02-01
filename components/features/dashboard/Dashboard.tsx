import React, { useEffect, useState, Suspense } from "react";
import { useKeyboardShortcuts } from "../../../hooks/useKeyboardShortcuts";
import { useUser } from "../../../context/UserContext";
import { usePosts } from "../../../context/PostContext";
import { useSubscription } from "../../../hooks/useSubscription";
import { usePostGeneration } from "../../../hooks/usePostGeneration";


import TopBar from "../../navigation/TopBar";

import HistoryView from "../history/HistoryView";
import SettingsView from "../settings/SettingsView";
import LaunchpadView from "./LaunchpadView";
// HomeIcon removed if not used elsewhere, but LaunchpadView uses it? Let's check.
// Actually line 17: // Lucide imports cleaned up if unused
// If it's not used, I'll remove it.


import UpgradeModal from "../../modals/UpgradeModal";
import CancellationModal from "../../modals/CancellationModal";
import LevelUpModal from "../../modals/LevelUpModal";
import { updateUserProfile } from "../../../services/userRepository";


import LockedHistoryState from "../history/LockedHistoryState";
import LockedChatState from "../chat/LockedChatState";
import LockedEditorState from "../editor/LockedEditorState";
import LockedAuditState from "../audit/LockedAuditState";
import ReferralModal from "../../modals/ReferralModal";

import { useToast } from "../../../context/ToastContext";
import { AppTab, UserProfile, LevelUpData, ViralTone, ViralFramework, PostLength, EmojiDensity, GenerationParams } from "../../../types";
import { asPostID } from "../../../types/branded";
import { translations } from "../../../translations";
import Skeleton from "../../ui/Skeleton";
import { GlassPanel } from "../../ui/GlassPanel";
import MetaTags from "../../seo/MetaTags";
import { PageTransition } from "../../ui/PageTransition";
import ErrorBoundary from "../../ui/ErrorBoundary";


// Lazy load PostGenerator to reduce initial Dashboard bundle size
const PostCreator = React.lazy(() => import("../generation/PostGenerator"));
const CarouselStudio = React.lazy(() => import("../generation/CarouselStudio"));
const LinkedInExpertChat = React.lazy(() =>
    import("../chat/LinkedInExpertChat")
);
const PostEditorView = React.lazy(() => import("../editor/PostEditorView"));
const LinkedInAuditView = React.lazy(() =>
    import("../audit/LinkedInAuditView")
);
const VoiceLabView = React.lazy(() =>
    import("../voice-lab/VoiceLabView")
);
const InsightResponderView = React.lazy(() =>
    import("../insight-responder/InsightResponderView")
);
const AutoPostStudio = React.lazy(() => import("../autopost/AutoPostStudio"));

interface DashboardLayoutProps {
    children: React.ReactNode;
}

import { InfiniteGrid } from "../../ui/infinite-grid-integration";

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
    children
}) => {
    // Other props removed as they are unused in this layout
    return (
        <PageTransition>
            <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden relative">
                {/* Ambient Background Grid */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    <InfiniteGrid />
                </div>

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                    <main className="flex-1 overflow-hidden relative">
                        {children}
                    </main>
                </div>
            </div>
        </PageTransition>
    );
};

const Dashboard: React.FC = () => {
    // Hooks
    const { user, language, refreshUser } = useUser();
    const t = translations[language];
    const { currentPost, setCurrentPost, removePost } = usePosts();
    const toast = useToast();

    // Dynamic Title Logic
    const getPageTitle = (tab: AppTab) => {
        const titles: Record<string, string> = {
            home: "Command Center",
            create: "Viral Engine",
            editor: "Post Editor",
            history: "Mission Log",
            settings: "Settings",
            chat: "Expert Chat",
            audit: "Profile Audit",
            "voice-lab": "Voice Lab",
            "insight-responder": "Insight Responder",
            autopilot: "Autopilot",
            carousel: "Carousel Studio"
        };
        return titles[tab] || "Dashboard";
    };

    // ... existing code ...
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
    const [activeTab, setActiveTab] = useState<AppTab>("home");

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
    const [levelUpData, setLevelUpData] = useState<LevelUpData | null>(null);
    const [carouselDraftContent, setCarouselDraftContent] = useState<string>(
        "",
    );

    // Helper for hooks
    const handleUpdateUser = async (updates: Partial<UserProfile>) => {
        // 1. Optimistic Update
        // setUser((prev) => ({ ...prev, ...updates })); // Removed setUser from useUser

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
    // useUserSync({ user, setUser, language, setLanguage }); // Removed setUser and setLanguage from useUser
    const { handleUpgrade } = useSubscription();

    const { 
        handleGenerate: generatePost, 
        isGenerating, 
        autoStartGeneration,
        setAutoStartGeneration 
    } = usePostGeneration({
        user,
        currentPost,
        setCurrentPost,
        setActiveTab: (tab: AppTab) => setActiveTab(tab),
        handleUpdateUser,
        setShowUpgradeModal,
        setShowCreditDeduction,
        setLevelUpData,
    });



    // Effects

    // Handle Keyboard Shortcuts
    useKeyboardShortcuts({ onNavigate: setActiveTab });

    // Handle Stripe Success Redirect and Onboarding Actions
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        
        // Handle Stripe
        if (queryParams.has("session_id")) {
            console.log("Stripe session detected, refreshing user...");
            refreshUser().then(() => {
                toast.success(
                    t.app.preview.scheduled,
                    "Éxito"
                );
                window.history.replaceState({}, "", window.location.pathname);
            });
        }

        // Handle Onboarding "First Post" Action
        if (queryParams.get("action") === "first-post") {
            const topic = queryParams.get("topic");
            if (topic) {
                // Pre-fill the generator
                setCurrentPost({
                    id: asPostID("draft-onboarding-" + Date.now()),
                    content: "",
                    params: {
                        topic: decodeURIComponent(topic),
                        // Default options for a quick win
                        tone: ViralTone.PROFESSIONAL,
                        length: PostLength.MEDIUM,
                        framework: ViralFramework.PAS,
                        audience: "General",
                        creativityLevel: 50,
                        emojiDensity: EmojiDensity.MODERATE,
                        hashtagCount: 3,
                        includeCTA: true,
                    },
                    createdAt: Date.now(),
                    likes: 0,
                    views: 0
                });
                
                // Navigate to create tab
                setActiveTab("create");
                
                // Show success toast
                toast.success(
                    language === 'es' ? '¡Perfil listo! Creemos tu primer post.' : 'Profile ready! Let\'s draft your first post.',
                    language === 'es' ? 'Bienvenido a bordo' : 'Welcome aboard'
                );
                
                // Clean URL
                window.history.replaceState({}, "", window.location.pathname);
                
                // Trigger Auto-Start
                setAutoStartGeneration(true);
            }
        }
    }, [refreshUser, language, t, setAutoStartGeneration, setCurrentPost, setActiveTab, toast]);

    // Handlers
    const handleDeletePost = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (globalThis.confirm(t.common.confirmDelete)) {
            removePost(id);
            toast.success(t.common.postDeleted, t.common.success);
        }
    };

    return (
        <DashboardLayout>
            <MetaTags 
                title={getPageTitle(activeTab)} 
                noIndex={true} // Dashboard is private
            />
            <div
                className="h-full w-full flex flex-col"
            >
                <TopBar 
                    activeTab={activeTab} 
                    onNavigate={(tab: any) => setActiveTab(tab as AppTab)} 
                    onUpgrade={() => setShowUpgradeModal(true)} 
                />
                
                <div
                    className={`${
                        ["home", "create", "history", "editor", "chat", "carousel", "voice-lab", "audit", "insight-responder", "autopilot"].includes(
                                activeTab,
                            )
                            ? "flex-1 flex flex-col min-h-0 overflow-hidden"
                            : "max-w-7xl mx-auto p-4 lg:p-8 pb-24 flex-1 overflow-y-auto"
                    } ${activeTab === "home" ? "overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent h-screen" : "w-full"}`}
                >
                    {activeTab === "home" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ErrorBoundary variant="minimal">
                                <LaunchpadView 
                                    user={user} 
                                    onSelectTool={(tab: AppTab) => setActiveTab(tab)} 
                                />
                            </ErrorBoundary>
                        </div>
                    )}

                    {activeTab === "create" && (
                        <div
                            id="viral-engine-view"
                            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                        >
                            <div className="w-full">
                                <ErrorBoundary variant="full">
                                    <Suspense
                                        fallback={
                                            <div className="flex flex-col gap-6 p-8 w-full max-w-4xl mx-auto">
                                                <Skeleton className="h-12 w-3/4" />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Skeleton className="h-64 rounded-xl" />
                                                    <Skeleton className="h-64 rounded-xl" />
                                                </div>
                                                <Skeleton className="h-12 w-full rounded-xl" />
                                            </div>
                                        }
                                    >
                                        <PostCreator
                                            onGenerate={(params: GenerationParams) =>
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
                                            autoStart={autoStartGeneration}
                                        />
                                    </Suspense>
                                </ErrorBoundary>
                            </div>
                        </div>
                    )}

                    {activeTab === "history" && (
                        <GlassPanel className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
                            <ErrorBoundary variant="minimal">
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
                                            onReuse={(params: GenerationParams) => {
                                                setCurrentPost({
                                                    id: asPostID("draft-" + Date.now()),
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
                            </ErrorBoundary>
                        </GlassPanel>
                    )}



                    {activeTab === "autopilot" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto">
                            <ErrorBoundary variant="full">
                                <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Command Center...</div>}>
                                    <AutoPostStudio
                                        user={user}
                                        language={language}
                                        onViewPost={(post) => {
                                            setCurrentPost(post);
                                            setActiveTab("create");
                                        }}
                                        onUpgrade={() => setShowUpgradeModal(true)}
                                    />
                                </Suspense>
                            </ErrorBoundary>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <GlassPanel className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <SettingsView
                                user={user}
                                onUpgrade={() => setShowUpgradeModal(true)}
                                onSave={handleUpdateUser}
                            />
                        </GlassPanel>
                    )}







                    {activeTab === "chat" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex-1 min-h-0 flex flex-col">
                            <ErrorBoundary variant="full">
                                {user.planTier === "free"
                                    ? (
                                        <LockedChatState
                                            onUpgrade={() =>
                                                setShowUpgradeModal(true)}
                                        />
                                    )
                                    : <LinkedInExpertChat />}
                            </ErrorBoundary>
                        </div>
                    )}

                    {activeTab === "editor" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 h-full flex flex-col min-h-0">
                            <ErrorBoundary variant="full">
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
                            </ErrorBoundary>
                        </div>
                    )}

                    {activeTab === "audit" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex-1 min-h-0 flex flex-col">
                            <ErrorBoundary variant="full">
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
                            </ErrorBoundary>
                        </div>
                    )}

                    {activeTab === "voice-lab" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex-1 min-h-0 flex flex-col">
                            <ErrorBoundary variant="full">
                                <Suspense
                                    fallback={
                                        <div className="flex-1 flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                                        </div>
                                    }
                                >
                                    <VoiceLabView />
                                </Suspense>
                            </ErrorBoundary>
                        </div>
                    )}

                    {activeTab === "carousel" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex-1 min-h-0">
                            <ErrorBoundary variant="full">
                                <Suspense
                                    fallback={
                                        <div className="flex-1 flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                                        </div>
                                    }
                                >
                                    <CarouselStudio 
                                        hideHeader 
                                        initialContent={carouselDraftContent} 
                                    />
                                </Suspense>
                            </ErrorBoundary>
                        </div>
                    )}

                    {activeTab === "insight-responder" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex-1 min-h-0 flex flex-col">
                            <ErrorBoundary variant="full">
                                <Suspense
                                    fallback={
                                        <div className="flex-1 flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                                        </div>
                                    }
                                >
                                    <InsightResponderView />
                                </Suspense>
                            </ErrorBoundary>
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

export default Dashboard;
