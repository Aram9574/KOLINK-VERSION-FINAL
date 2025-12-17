import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { PostProvider, usePosts } from '../../../context/PostContext';
import { useSubscription } from '../../../hooks/useSubscription';
import { usePostGeneration } from '../../../hooks/usePostGeneration';
import { useAutoPilot } from '../../../hooks/useAutoPilot';
import { useUserSync } from '../../../hooks/useUserSync';

import DashboardLayout from '../../layouts/DashboardLayout';
import HistoryView from '../history/HistoryView';
import SettingsView from '../settings/SettingsView';

import AutoPilotView from '../autopilot/AutoPilotView';
import OnboardingFlow from '../onboarding/OnboardingFlow';
import UpgradeModal from '../../modals/UpgradeModal';
import CancellationModal from '../../modals/CancellationModal';
import WelcomeModal from '../../modals/WelcomeModal';
import TourGuide from './ProductTour';
import LevelUpModal from '../../modals/LevelUpModal';
import { updateUserProfile } from '../../../services/userRepository';

import { toast } from 'sonner';
import { Post, UserProfile } from '../../../types';
import { translations } from '../../../translations';
import { Suspense } from 'react';

// Lazy load PostGenerator to reduce initial Dashboard bundle size
const PostCreator = React.lazy(() => import('../generation/PostGenerator'));

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
        updatePost
    } = usePosts();

    const t = translations[language].productTour;

    // Prefetch PostGenerator for smoother experience
    useEffect(() => {
        const prefetchPostGenerator = async () => {
             try {
                 await import('../generation/PostGenerator');
             } catch (e) {
                 console.error("Error prefetching PostGenerator", e);
             }
        };
        prefetchPostGenerator();
    }, []);

    // UI State
    // Persist active tab selection
    const [activeTab, setActiveTabRaw] = useState<'create' | 'history' | 'settings' | 'autopilot'>(() => {
        const saved = localStorage.getItem('kolink_active_tab');
        if (saved === 'ideas') return 'create';
        return (saved as any) || 'create';
    });

    const setActiveTab = (tab: 'create' | 'history' | 'settings' | 'autopilot') => {
        setActiveTabRaw(tab);
        localStorage.setItem('kolink_active_tab', tab);
    };
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showCreditDeduction, setShowCreditDeduction] = useState(false);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [isTourActive, setIsTourActive] = useState(false);
    const [levelUpData, setLevelUpData] = useState<any>(null);

    // Helper for hooks
    const handleUpdateUser = async (updates: Partial<UserProfile>) => {
        // 1. Optimistic Update
        setUser(prev => ({ ...prev, ...updates }));

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
        setIsGenerating
    });

    // Effects
    useEffect(() => {
        if (user.hasOnboarded === false && !isOnboarding) {
            setIsOnboarding(true);
        }
    }, [user.hasOnboarded]);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem(`kolink_tour_seen_${user.id}`);
        // If onboarded but hasn't seen tour, show Welcome Modal first
        if (!hasSeenTour && !isOnboarding && user.hasOnboarded) {
             // Only show if not already showing tour
             if (!isTourActive) {
                 setShowWelcome(true);
             }
        }
    }, [user.id, isOnboarding, user.hasOnboarded, isTourActive]);

    // Handlers
    const handleDeletePost = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this post?')) {
            removePost(id);
            toast.success('Post deleted');
        }
    };

    const handleOnboardingComplete = async (updatedData: Partial<UserProfile>) => {
        // 1. Update DB and Local State
        await handleUpdateUser(updatedData);

        // 2. Close Onboarding
        setIsOnboarding(false);

        // 3. Refresh to verify state
        await refreshUser();

        // 4. Trigger Welcome Modal
        setShowWelcome(true);
    };

    const handleStartTour = () => {
        setShowWelcome(false);
        setIsTourActive(true);
        setActiveTab('create'); // Ensure we start at first step
    };

    const handleSkipTour = () => {
        setShowWelcome(false);
        localStorage.setItem(`kolink_tour_seen_${user.id}`, 'true');
    };

    const handleTourComplete = () => {
        setIsTourActive(false);
        localStorage.setItem(`kolink_tour_seen_${user.id}`, 'true');
    };

    // Tour Steps
    // Tour Steps with Tab Navigation
    const TOUR_STEPS = [
        { 
            targetId: 'viral-engine-view', 
            title: language === 'es' ? 'Motor Viral' : 'Viral Engine', 
            description: language === 'es' ? 'Genera tu primer post aquí con nuestra IA entrenada.' : 'Generate your first post here with our trained AI.',
            tab: 'create' as const
        },
        { 
            targetId: 'brand-voice-manager', 
            title: language === 'es' ? 'Voz de Marca' : 'Brand Voice', 
            description: language === 'es' ? 'Entrena a la IA para que suene exactamente como tú.' : 'Train the AI to sound exactly like you.',
            tab: 'settings' as const
        },
        { 
            targetId: 'autopilot-view', 
            title: 'AutoPilot', 
            description: language === 'es' ? 'Programa y automatiza tu contenido en piloto automático.' : 'Schedule and automate your content on autopilot.',
            tab: 'autopilot' as const
        },
    ];

    const handleTourStepChange = (index: number) => {
        if (index >= 0 && index < TOUR_STEPS.length) {
            const step = TOUR_STEPS[index];
            if (step.tab && step.tab !== activeTab) {
                setActiveTab(step.tab);
            }
        }
    };

    if (isOnboarding) {
        return <OnboardingFlow user={user} onComplete={handleOnboardingComplete} />;
    }

    return (
        <DashboardLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onUpgrade={() => setShowUpgradeModal(true)}
            showCreditDeduction={showCreditDeduction}
            onDeletePost={handleDeletePost}
        >
            <div className={`h-full ${activeTab === 'history' ? 'overflow-hidden' : 'overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent'}`}>
                <div className={`${activeTab === 'history' ? 'h-full ml-1' : 'max-w-7xl mx-auto p-4 lg:p-8 pb-24'}`}>
                    {activeTab === 'create' && (
                        <div id="viral-engine-view" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <Suspense fallback={
                                 <div className="flex justify-center items-center h-64">
                                     <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent"></div>
                                 </div>
                             }>
                                <PostCreator
                                    onGenerate={(params) => generatePost(params)}
                                    isGenerating={isGenerating}
                                    credits={user.credits}
                                    language={user.language || 'en'}
                                    showCreditDeduction={showCreditDeduction}
                                    initialParams={currentPost?.params}
                                    initialTopic={currentPost?.params?.topic}
                                />
                             </Suspense>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
                            <HistoryView
                                onSelect={(post) => {
                                    setCurrentPost(post);
                                    setActiveTab('create');
                                }}
                                onReuse={(params) => {
                                    setCurrentPost({
                                        id: 'draft-' + Date.now(),
                                        content: '', // Start clear for new generation
                                        params: params,
                                        createdAt: Date.now(),
                                        likes: 0,
                                        views: 0
                                    });
                                    setActiveTab('create');
                                }}
                                onDelete={handleDeletePost}
                                language={language}
                                onUpgrade={() => setShowUpgradeModal(true)}
                            />
                        </div>
                    )}



                    {activeTab === 'autopilot' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <AutoPilotView
                                user={user}
                                language={language}
                                onViewPost={(post) => {
                                    setCurrentPost(post);
                                    setActiveTab('create');
                                }}
                                onUpgrade={() => setShowUpgradeModal(true)}
                            />
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <SettingsView
                                user={user}
                                onUpgrade={() => setShowUpgradeModal(true)}
                                onSave={handleUpdateUser}
                            />
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
                    userEmail={user.email || ''}
                    planPrice={19}
                    language={user.language || 'en'}
                />
            )}

            {showWelcome && (
                <WelcomeModal
                    user={user}
                    onStartTour={handleStartTour}
                    onSkip={handleSkipTour}
                />
            )}

            {isTourActive && (
                <TourGuide
                    steps={TOUR_STEPS}
                    onComplete={handleTourComplete}
                    onStepChange={handleTourStepChange}
                    labels={t}
                />
            )}

            {levelUpData && (
                <LevelUpModal
                    onClose={() => setLevelUpData(null)}
                    data={levelUpData}
                    language={language}
                />
            )}
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
