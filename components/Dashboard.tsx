import React, { useState, useEffect } from 'react';
import {
    Zap,
    Menu,
    X,
    LogOut,
    ChevronRight,
    Smartphone,
    Monitor,
    Lightbulb,
    Clock,
    TrendingUp,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { Post, GenerationParams, UserProfile, SubscriptionPlan, AppLanguage, AutoPilotConfig, ViralFramework, PostLength, EmojiDensity } from '../types';
import { ALGORITHM_TIPS_CONTENT } from '../constants';
import { generateViralPost } from '../services/geminiService';
import { deductUserCredit, updateUserProfile, fetchUserPosts, fetchUserProfile, supabase } from '../services/supabaseClient';
import { processGamification, calculateLevel } from '../services/gamificationEngine';
import PostGenerator from '../components/PostGenerator';
import LinkedInPreview from '../components/LinkedInPreview';
import HistoryView from '../components/HistoryView';
import SettingsView from '../components/SettingsView';
import LevelUpModal from '../components/LevelUpModal';
import UpgradeModal from '../components/UpgradeModal';
import Sidebar from '../components/Sidebar';
import OnboardingFlow from '../components/OnboardingFlow';
import ProductTour, { TourStep } from '../components/ProductTour';
import BugReporter from '../components/BugReporter';
import IdeaGenerator from '../components/IdeaGenerator';
import AutoPilotView from '../components/AutoPilotView';
import { translations } from '../translations';

interface DashboardProps {
    user: UserProfile;
    setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
    language: AppLanguage;
    setLanguage: (lang: AppLanguage) => void;
    onLogout: () => void;
}

const getTourSteps = (lang: AppLanguage): TourStep[] => {
    const t = translations[lang].app.sidebar;
    return [
        {
            targetId: 'tour-sidebar',
            title: lang === 'es' ? 'Tu Centro de Comando' : 'Your Command Center',
            description: lang === 'es' ? 'Accede a tu panel, historial y configuración desde la barra de navegación.' : 'Access your dashboard, history, and settings from the navigation bar.',
            position: 'right'
        },
        {
            targetId: 'tour-generator',
            title: lang === 'es' ? 'El Motor Viral' : 'The Viral Engine',
            description: lang === 'es' ? 'Aquí ocurre la magia. Elige tu tema, tono y estructura para arquitectar el post perfecto.' : 'Magic happens here. Choose your topic, tone, and structure to architect the perfect post.',
            position: 'right'
        },
        {
            targetId: 'tour-credits',
            title: lang === 'es' ? 'Gestiona tus Créditos' : 'Manage Your Credits',
            description: lang === 'es' ? 'Lleva el control de tus generaciones aquí. Mejora a Premium para acceso ilimitado.' : 'Track your generations here. Upgrade to Premium for unlimited access.',
            position: 'right'
        },
        {
            targetId: 'tour-preview',
            title: lang === 'es' ? 'Vista Previa en Vivo' : 'Live Preview',
            description: lang === 'es' ? 'Mira exactamente cómo lucirá tu post en LinkedIn antes de publicar.' : 'See exactly how your post will look on LinkedIn before publishing.',
            position: 'left'
        }
    ];
};

const Dashboard: React.FC<DashboardProps> = ({ user, setUser, language, setLanguage, onLogout }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'create' | 'history' | 'settings' | 'ideas' | 'autopilot'>('create');
    const [isPublishing, setIsPublishing] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showCreditDeduction, setShowCreditDeduction] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    const [prefilledTopic, setPrefilledTopic] = useState<string>('');
    const [prefilledParams, setPrefilledParams] = useState<GenerationParams | null>(null);

    const [isOnboarding, setIsOnboarding] = useState(false);
    const [isTourActive, setIsTourActive] = useState(false);

    const [levelUpData, setLevelUpData] = useState<{ leveledUp: boolean, newLevel: number, newAchievements: string[] } | null>(null);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    // Ref to track the ID of a newly generated post to enforce its display
    const justGeneratedPostId = React.useRef<string | null>(null);

    // Blocking loader removed to improve perceived performance. 
    // We now rely on optimistic data from App.tsx or skeleton states within components.

    useEffect(() => {
        // Enforce display of newly generated post
        if (justGeneratedPostId.current && posts.length > 0) {
            const targetPost = posts.find(p => p.id === justGeneratedPostId.current);
            if (targetPost && currentPost?.id !== targetPost.id) {
                console.log("Enforcing display of generated post:", targetPost.id);
                setCurrentPost(targetPost);
                // Clear the ref so we don't block navigation to other posts later
                justGeneratedPostId.current = null;
            }
        }
    }, [posts, currentPost]);

    useEffect(() => {
        // Fallback: If we are in 'create' mode, have posts, but no currentPost is selected,
        // automatically select the most recent one.
        // CRITICAL: Do NOT do this if we are currently generating or recovering a session!
        const isRecovering = !!localStorage.getItem('kolink_is_generating');

        if (activeTab === 'create' && posts.length > 0 && !isGenerating && !isRecovering) {
            const latestPost = posts[0];
            const isBrandNew = (Date.now() - latestPost.createdAt) < 10000; // Created in last 10s

            // Scenario 1: No post selected -> Select latest
            if (!currentPost) {
                console.log("Fallback: Setting currentPost to latest history item");
                setCurrentPost(latestPost);
            }
            // Scenario 2: Brand new post exists but not selected -> Force select
            else if (isBrandNew && currentPost.id !== latestPost.id) {
                console.log("Auto-switching to brand new post:", latestPost.id);
                setCurrentPost(latestPost);
                // Also update the ref to prevent fighting
                justGeneratedPostId.current = null;
            }
        }
    }, [activeTab, currentPost, posts, isGenerating]);

    // Persist activeTab
    useEffect(() => {
        const savedTab = localStorage.getItem('kolink_active_tab');
        if (savedTab) {
            setActiveTab(savedTab as any);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('kolink_active_tab', activeTab);
    }, [activeTab]);

    // Persist currentPost ID
    useEffect(() => {
        const savedPostId = localStorage.getItem('kolink_current_post_id');
        // Only restore if we have posts and NO current post selected
        if (savedPostId && posts.length > 0 && !currentPost) {
            const savedPost = posts.find(p => p.id === savedPostId);
            if (savedPost) {
                setCurrentPost(savedPost);
            }
        }
    }, [posts, currentPost]); // Run when posts load or currentPost changes

    useEffect(() => {
        if (currentPost) {
            localStorage.setItem('kolink_current_post_id', currentPost.id);
        } else {
            localStorage.removeItem('kolink_current_post_id');
        }
    }, [currentPost]);

    useEffect(() => {
        // Load history from local storage on mount (User scoped)
        if (user.id) {
            const storageKey = `kolink_history_${user.id}`;
            const savedHistory = localStorage.getItem(storageKey);
            if (savedHistory) {
                try {
                    setPosts(JSON.parse(savedHistory));
                } catch (e) {
                    console.error('Failed to parse history', e);
                }
            } else {
                // If no local history for this user, start empty (don't show previous user's data)
                setPosts([]);
            }
        }

        // THEN fetch from DB
        if (user.id && !user.id.startsWith('mock-')) {
            fetchUserPosts(user.id).then(dbPosts => {
                // Always update state with DB source of truth
                setPosts(dbPosts || []);
                const storageKey = `kolink_history_${user.id}`;
                localStorage.setItem(storageKey, JSON.stringify(dbPosts || []));
            });
        }
    }, [user.id]);

    useEffect(() => {
        // Sync local onboarding state with user profile
        // If user HAS onboarded (true), force false.
        // If user HAS NOT onboarded (false), force true.
        // If undefined (loading), do nothing.
        if (user.hasOnboarded === true) {
            setIsOnboarding(false);
        } else if (user.hasOnboarded === false && user.id && !user.id.startsWith('mock-')) {
            // Only trigger onboarding if we have a real user ID and they explicitly haven't onboarded
            setIsOnboarding(true);
        }
    }, [user.hasOnboarded, user.id]);

    useEffect(() => {
        const trackSession = async () => {
            if (!user.id || user.id.startsWith('mock-')) return;
            let deviceId = localStorage.getItem('kolink_device_id');
            if (!deviceId) {
                deviceId = crypto.randomUUID();
                localStorage.setItem('kolink_device_id', deviceId);
            }
            try {
                await supabase.functions.invoke('track-session', {
                    body: { device_id: deviceId }
                });
            } catch (error) {
                console.error('Failed to track session:', error);
            }
        };
        trackSession();

        // RECOVERY MECHANISM: Check if a generation was interrupted (e.g. by reload)
        const checkRecovery = async () => {
            const genTimestamp = localStorage.getItem('kolink_is_generating');
            if (genTimestamp && user.id) {
                const startTime = parseInt(genTimestamp);
                // If generation started less than 5 minutes ago
                if (Date.now() - startTime < 5 * 60 * 1000) {
                    console.log("Attempting to recover interrupted generation...");
                    setIsGenerating(true); // Show loading state while recovering

                    // Wait a bit to ensure DB consistency if it just finished
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    try {
                        const { data: latestPosts } = await supabase
                            .from('posts')
                            .select('*')
                            .eq('user_id', user.id)
                            .order('created_at', { ascending: false })
                            .limit(1);

                        if (latestPosts && latestPosts.length > 0) {
                            const recoveredPost = latestPosts[0];
                            const postTime = new Date(recoveredPost.created_at).getTime();

                            // If the post was created AFTER the generation started
                            if (postTime > startTime) {
                                toast.success("¡Post recuperado! Se generó mientras no estabas.");

                                // Map DB post to frontend Post type
                                const mappedPost: Post = {
                                    id: recoveredPost.id,
                                    content: recoveredPost.content,
                                    params: recoveredPost.generation_params || {},
                                    createdAt: postTime,
                                    likes: 0,
                                    views: 0,
                                    isAutoPilot: false,
                                    viralScore: recoveredPost.viral_score,
                                    viralAnalysis: recoveredPost.viral_analysis
                                };

                                setCurrentPost(mappedPost);
                                setPosts(prev => {
                                    // Avoid duplicates
                                    if (prev.some(p => p.id === mappedPost.id)) return prev;
                                    return [mappedPost, ...prev];
                                });
                                localStorage.removeItem('kolink_is_generating');
                            }
                        }
                    } catch (e) {
                        console.error("Recovery failed", e);
                    } finally {
                        setIsGenerating(false);
                        // Clear flag if it's too old or we checked
                        if (Date.now() - startTime > 60000) {
                            localStorage.removeItem('kolink_is_generating');
                        }
                    }
                } else {
                    // Too old, clear it
                    localStorage.removeItem('kolink_is_generating');
                }
            }
        };

        checkRecovery();
    }, [user.id]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTipIndex(prev => (prev + 1) % 10);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

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

    const savePostToHistory = (post: Post) => {
        setPosts(prev => {
            const newPosts = [post, ...prev];
            if (user.id) {
                localStorage.setItem(`kolink_history_${user.id}`, JSON.stringify(newPosts));
            }
            return newPosts;
        });
    };

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
            tone: 'Professional',
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
                tone: config.tone || 'Professional',
                framework: [ViralFramework.PAS, ViralFramework.CONTRARIAN, ViralFramework.STORY][Math.floor(Math.random() * 3)],
                length: PostLength.MEDIUM,
                creativityLevel: 60,
                emojiDensity: EmojiDensity.MODERATE,
                includeCTA: true
            };

            try {
                const generatedResult = await generateViralPost(params, updatedUser);
                // Edge Function already deducted credit, so we just update local state
                currentCredits--;

                const newPost: Post = {
                    id: generatedResult.id || Date.now().toString() + '-' + i, // Use real ID if available
                    content: generatedResult.content,
                    params: params,
                    createdAt: Date.now(),
                    likes: 0,
                    views: 0,
                    isAutoPilot: true,
                    viralScore: generatedResult.viralScore,
                    viralAnalysis: generatedResult.viralAnalysis
                };
                newPosts.push(newPost);
                updatedUser = { ...updatedUser, credits: currentCredits };
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

        // 2. Calculate new user state (Gamification, etc.)
        const lastPost = newPosts[newPosts.length - 1];
        const allPostsWithNew = [...newPosts, ...posts];
        const gamificationResult = processGamification(updatedUser, lastPost, allPostsWithNew);
        const additionalXP = (newPosts.length - 1) * 50;
        const totalNewXP = gamificationResult.newXP + additionalXP;
        const nextRun = calculateNextRun(user.autoPilot);

        const finalUserData = {
            ...user,
            credits: currentCredits,
            xp: totalNewXP,
            level: calculateLevel(totalNewXP),
            currentStreak: gamificationResult.newStreak,
            lastPostDate: Date.now(),
            unlockedAchievements: [...user.unlockedAchievements, ...gamificationResult.newAchievements],
            autoPilot: { ...user.autoPilot, nextRun }
        };

        // 3. Update User State immediately
        setUser(finalUserData);

        // 4. Background Sync (Only sync non-credit fields, as credits were handled by Edge Function)
        (async () => {
            try {
                // We do NOT call deductUserCredit here anymore because the Edge Function does it.

                // Sync User Profile (Gamification & Autopilot schedule)
                // Note: We send credits: currentCredits just to be safe/consistent, 
                // but the DB source of truth was already updated by the Edge Function.
                await handleUpdateUser({
                    autoPilot: finalUserData.autoPilot,
                    credits: currentCredits,
                    xp: totalNewXP,
                    level: finalUserData.level,
                    lastPostDate: finalUserData.lastPostDate
                });
            } catch (syncError) {
                console.error("Background sync failed:", syncError);
                toast.error("Tu post se generó, pero hubo un error al sincronizar con la nube.");
            }
        })();
    };

    const handleGenerate = async (params: GenerationParams, isAutoPilot = false) => {
        if (user.credits <= 0 || user.cancelAtPeriodEnd) {
            if (!isAutoPilot && !user.cancelAtPeriodEnd) setShowUpgradeModal(true);
            return;
        }

        setIsGenerating(true);
        localStorage.setItem('kolink_is_generating', Date.now().toString());
        if (!isAutoPilot) setShowCreditDeduction(false);

        try {
            const result = await generateViralPost(params, user);
            // Credit deduction is handled by the Edge Function 'generate-viral-post'
            // We only need to update the local state optimistically
            const newCreditCount = Math.max(0, user.credits - 1);

            // Update local state
            setUser(prev => prev ? { ...prev, credits: newCreditCount } : null);

            // If credits dropped to 0, prompt for upgrade
            if (newCreditCount === 0 && !user.cancelAtPeriodEnd) {
                setTimeout(() => setShowUpgradeModal(true), 1500); // Small delay for better UX
            }

            const newPost: Post = {
                id: Date.now().toString(),
                content: result.content,
                params: params,
                createdAt: Date.now(),
                likes: 0,
                views: 0,
                isAutoPilot,
                viralScore: result.viralScore,
                viralAnalysis: result.viralAnalysis
            };

            const updatedPosts = [newPost, ...posts];
            savePostToHistory(newPost);

            try {
                const gamificationResult = processGamification(user, newPost, updatedPosts);

                setUser(prev => ({
                    ...prev,
                    credits: Math.max(0, newCreditCount),
                    xp: gamificationResult.newXP,
                    level: gamificationResult.newLevel,
                    currentStreak: gamificationResult.newStreak,
                    lastPostDate: Date.now(),
                    unlockedAchievements: [...prev.unlockedAchievements, ...gamificationResult.newAchievements]
                }));

                if (!isAutoPilot) {
                    setShowCreditDeduction(true);
                    setTimeout(() => setShowCreditDeduction(false), 2500);
                }

                if (!isAutoPilot && (gamificationResult.leveledUp || gamificationResult.newAchievements.length > 0)) {
                    setLevelUpData({
                        leveledUp: gamificationResult.leveledUp,
                        newLevel: gamificationResult.newLevel,
                        newAchievements: gamificationResult.newAchievements
                    });
                }

                // Persist gamification updates to DB
                if (!isAutoPilot) {
                    handleUpdateUser({
                        xp: gamificationResult.newXP,
                        level: gamificationResult.newLevel,
                        currentStreak: gamificationResult.newStreak,
                        lastPostDate: Date.now(),
                        unlockedAchievements: [...user.unlockedAchievements, ...gamificationResult.newAchievements]
                    });

                    // Show XP Toast
                    const xpGained = gamificationResult.newXP - user.xp;
                    console.log("XP Debug:", { oldXP: user.xp, newXP: gamificationResult.newXP, xpGained });

                    if (xpGained > 0) {
                        console.log("Triggering XP Toast");
                        toast.success(`+${xpGained} XP`, {
                            description: "¡Sigue así para subir de nivel!",
                            icon: "⭐"
                        });
                    }

                    // Force fetch latest profile to ensure UI sync
                    fetchUserProfile(user.id).then(updatedProfile => {
                        if (updatedProfile) {
                            console.log("Refreshed profile from DB:", updatedProfile);
                            setUser(prev => ({ ...prev, ...updatedProfile }));
                        }
                    });
                }
            } catch (gamificationError) {
                console.error("Gamification error:", gamificationError);
                // Still update credits if gamification fails
                setUser(prev => prev ? { ...prev, credits: Math.max(0, newCreditCount) } : null);
            }

            // Refresh history
            setPrefilledParams(null);

            // CRITICAL: Finalize state updates at the very end to ensure consistency
            console.log("Finalizing generation, setting current post:", newPost.id);
            setCurrentPost(newPost);
            localStorage.setItem('kolink_current_post_id', newPost.id);
            justGeneratedPostId.current = newPost.id;
            setActiveTab('create');

            // Scroll to top to ensure preview is visible
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error("Failed to generate", error);
            if (!isAutoPilot) toast.error("Error al generar contenido. Por favor revisa tu conexión.");
        } finally {
            setIsGenerating(false);
            localStorage.removeItem('kolink_is_generating');
        }
    };

    const handleDeletePost = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newPosts = posts.filter(p => p.id !== id);
        setPosts(newPosts);
        localStorage.setItem('kolink_history', JSON.stringify(newPosts));
        if (currentPost?.id === id) {
            setCurrentPost(null);
        }
    };

    const handleUpdatePostContent = (newContent: string) => {
        if (!currentPost) return;
        const updatedPost = { ...currentPost, content: newContent };
        setCurrentPost(updatedPost);
        const updatedPosts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
        setPosts(updatedPosts);
        localStorage.setItem('kolink_history', JSON.stringify(updatedPosts));
    };

    const handlePublish = async () => {
        if (!currentPost) return;

        setIsPublishing(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const providerToken = session?.provider_token;

            if (!providerToken) {
                toast.error("No se detectó conexión con LinkedIn. Por favor inicia sesión nuevamente con LinkedIn.");
                return;
            }

            const { data, error } = await supabase.functions.invoke('publish-to-linkedin', {
                body: {
                    content: currentPost.content,
                    providerToken: providerToken,
                    visibility: 'PUBLIC'
                }
            });

            if (error) throw error;

            if (data && !data.success) {
                throw new Error(data.error || "Error desconocido al publicar");
            }

            toast.success("¡Post publicado exitosamente en LinkedIn!");
            // Optional: Mark post as published in DB?
        } catch (error: any) {
            console.error("Publishing error:", error);
            toast.error(error.message || "Error al publicar en LinkedIn");
        } finally {
            setIsPublishing(false);
        }
    };

    const handleUpgrade = async (plan: SubscriptionPlan) => {
        console.log("handleUpgrade called for:", plan);
        if (plan.id === 'free') return;

        const toastId = toast.loading("Iniciando pasarela de pago...");

        try {
            console.log("Invoking create-checkout-session with priceId:", plan.stripePriceId);
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: { priceId: plan.stripePriceId }
            });

            console.log("Checkout session response:", { data, error });

            if (error) throw error;

            if (data?.error) {
                throw new Error(data.error);
            }

            if (data?.url) {
                console.log("Redirecting to Stripe:", data.url);
                window.location.href = data.url;
            } else {
                throw new Error("No URL returned from checkout session");
            }
        } catch (e: any) {
            console.error("Checkout failed", e);
            toast.dismiss(toastId);
            toast.error("Error al iniciar pago: " + (e.message || "Desconocido"));
        }
    };

    const handleOnboardingComplete = (updatedUser: Partial<UserProfile>) => {
        handleUpdateUser({ ...updatedUser, hasOnboarded: true });
        setIsOnboarding(false);
        setIsTourActive(true);
    };

    const handleUpdateUser = async (updates: Partial<UserProfile>) => {
        if (updates.language && updates.language !== language) {
            setLanguage(updates.language);
        }
        setUser(prev => ({ ...prev, ...updates }));
        try {
            await updateUserProfile(user.id, updates);
        } catch (e) {
            console.error("Background update failed", e);
        }
    };

    const handleUseIdea = (idea: string) => {
        setPrefilledTopic(idea);
        setPrefilledParams(null);
        setActiveTab('create');
    };

    const handleReusePost = (params: GenerationParams) => {
        setPrefilledParams(params);
        setPrefilledTopic('');
        setActiveTab('create');
    };

    const sidebarProps = {
        user,
        posts,
        currentPost,
        activeTab,
        setActiveTab,
        onSelectPost: (post: Post) => {
            setCurrentPost(post);
            setActiveTab('create');
        },
        onDeletePost: handleDeletePost,
        onLogout,
        onUpgrade: () => setShowUpgradeModal(true),
        onSettingsClick: () => setActiveTab('settings'),
        language,
        showCreditDeduction
    };

    const TIP_ICONS = [
        <Clock className="w-4 h-4" />,
        <Clock className="w-4 h-4" />,
        <AlertTriangle className="w-4 h-4" />,
        <TrendingUp className="w-4 h-4" />,
        <Smartphone className="w-4 h-4" />,
        <Zap className="w-4 h-4" />,
        <Monitor className="w-4 h-4" />,
        <TrendingUp className="w-4 h-4" />,
        <AlertTriangle className="w-4 h-4" />,
        <Lightbulb className="w-4 h-4" />
    ];

    const currentTipsContent = language === 'es' ? ALGORITHM_TIPS_CONTENT.es : ALGORITHM_TIPS_CONTENT.en;
    const activeTipContent = currentTipsContent[currentTipIndex];
    const activeTipIcon = TIP_ICONS[currentTipIndex % TIP_ICONS.length];

    return (
        <div className="flex flex-col lg:block bg-slate-50 font-sans relative selection:bg-brand-200 selection:text-brand-900 h-screen overflow-hidden">
            <Helmet>
                <title>Dashboard - Kolink</title>
                <meta name="description" content="Gestiona tus posts, analiza el rendimiento y crea nuevo contenido viral." />
            </Helmet>
            <BugReporter language={language} />

            {isOnboarding && (
                <OnboardingFlow
                    user={user}
                    onComplete={handleOnboardingComplete}
                />
            )}

            {isTourActive && (
                <ProductTour
                    isActive={isTourActive}
                    onClose={() => setIsTourActive(false)}
                    steps={getTourSteps(language)}
                />)}

            {levelUpData && (
                <LevelUpModal
                    data={levelUpData}
                    onClose={() => setLevelUpData(null)}
                />
            )}

            {showUpgradeModal && (
                <UpgradeModal
                    onClose={() => setShowUpgradeModal(false)}
                    onUpgrade={handleUpgrade}
                    currentPlanId={user.planTier}
                />
            )}

            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-400/20 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900">
                    <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-500/30">K</div>
                    Kolink
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-600">
                    {sidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            <div className={`lg:hidden fixed inset-y-0 left-0 z-40 w-72 shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar {...sidebarProps} />
            </div>

            <div className="hidden lg:flex fixed inset-y-0 left-0 z-50 h-full group pointer-events-none">
                <div className="w-6 h-full pointer-events-auto cursor-pointer bg-transparent hover:bg-slate-400/5 transition-colors duration-300 flex flex-col items-center justify-center backdrop-blur-[1px]">
                    <div className="w-1 h-16 bg-slate-300/60 rounded-full group-hover:bg-brand-500 group-hover:h-24 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"></div>
                    <ChevronRight className="w-4 h-4 text-brand-500 mt-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-75" />
                </div>

                <div className="w-72 h-full pointer-events-auto shadow-2xl -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col overflow-hidden rounded-r-2xl border-r border-slate-200/50">
                    <Sidebar {...sidebarProps} />
                </div>
            </div>

            <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 h-full relative z-0 w-full lg:pl-8">
                {activeTab === 'settings' ? (
                    <div className="max-w-5xl mx-auto p-6 lg:p-12">
                        <SettingsView
                            user={user}
                            onUpgrade={() => setShowUpgradeModal(true)}
                            onSave={handleUpdateUser}
                            key={language}
                        />
                    </div>
                ) : activeTab === 'history' ? (
                    <div className="h-full">
                        <HistoryView
                            posts={posts}
                            onSelect={(post) => {
                                setCurrentPost(post);
                                setActiveTab('create');
                            }}
                            onReuse={handleReusePost}
                            onDelete={handleDeletePost}
                            language={language}
                        />
                    </div>
                ) : activeTab === 'autopilot' ? (
                    <div className="h-full overflow-y-auto">
                        <AutoPilotView
                            user={user}
                            language={language}
                            onUpdateConfig={(config) => handleUpdateUser({ autoPilot: config })}
                            posts={posts}
                            onForceRun={triggerAutoPilotRun}
                            isGenerating={isGenerating}
                            onViewPost={(post) => {
                                setCurrentPost(post);
                                setActiveTab('create');
                            }}
                        />
                    </div>
                ) : activeTab === 'ideas' ? (
                    <div className="h-full overflow-y-auto">
                        <IdeaGenerator
                            user={user}
                            language={language}
                            onSelectIdea={handleUseIdea}
                        />
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                        <div className={`lg:col-span-5 space-y-6 ${activeTab === 'create' ? 'block' : 'hidden'}`}>
                            <div className="space-y-2 mb-4">
                                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                                    {language === 'es' ? 'Estudio' : 'Studio'}
                                </h1>
                                <p className="text-slate-500">
                                    {language === 'es' ? 'Diseña tu próximo éxito viral.' : 'Design your next viral hit.'}
                                </p>
                            </div>

                            <PostGenerator
                                onGenerate={handleGenerate}
                                isGenerating={isGenerating}
                                credits={user.credits}
                                language={language}
                                showCreditDeduction={showCreditDeduction}
                                key={prefilledTopic || (prefilledParams ? 'reuse' : 'default')}
                                initialTopic={prefilledTopic}
                                initialParams={prefilledParams}
                                isCancelled={user.cancelAtPeriodEnd}
                            />

                            <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-4 text-sm text-indigo-900/80 backdrop-blur-sm transition-all duration-500 relative overflow-hidden group hover:bg-indigo-50 hover:shadow-sm">
                                <div key={currentTipIndex} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <p className="font-bold mb-1 flex items-center gap-2 text-indigo-700">
                                        <div className="p-1 bg-indigo-200 rounded-md">
                                            {activeTipIcon}
                                        </div>
                                        Hack #{currentTipIndex + 1}: {activeTipContent.title}
                                    </p>
                                    <p className="opacity-90 leading-relaxed pl-8">
                                        {activeTipContent.desc}
                                    </p>
                                </div>
                                <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-200 w-full">
                                    <div className="h-full bg-indigo-500 animate-[progress_10s_linear_infinite] origin-left"></div>
                                </div>
                                <style>{`
                            @keyframes progress {
                                0% { width: 0% }
                                100% { width: 100% }
                            }
                        `}</style>
                            </div>
                        </div>

                        <div className="lg:col-span-7 flex flex-col h-full lg:pl-8">
                            <div className="bg-slate-200/50 backdrop-blur-md p-1 rounded-xl mb-6 inline-flex self-center lg:self-end gap-1">
                                <button
                                    onClick={() => setPreviewMode('desktop')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${previewMode === 'desktop'
                                        ? 'bg-white shadow-sm text-slate-800'
                                        : 'text-slate-500 hover:bg-white/50'
                                        }`}
                                >
                                    <Monitor className="w-3 h-3" />
                                    Escritorio
                                </button>
                                <button
                                    onClick={() => setPreviewMode('mobile')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${previewMode === 'mobile'
                                        ? 'bg-white shadow-sm text-slate-800'
                                        : 'text-slate-500 hover:bg-white/50'
                                        }`}
                                >
                                    <Smartphone className="w-3 h-3" />
                                    Móvil
                                </button>
                            </div>

                            <div className={`transition-all duration-500 ease-in-out mx-auto w-full ${previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-xl'
                                }`}>
                                <LinkedInPreview
                                    key={currentPost?.id || 'empty'}
                                    content={currentPost?.content || ''}
                                    user={user}
                                    isLoading={isGenerating}
                                    language={language}
                                    onUpdate={handleUpdatePostContent}
                                    viralScore={currentPost?.viralScore}
                                    viralAnalysis={currentPost?.viralAnalysis}
                                />

                                {currentPost && (
                                    <div className="mt-6 w-full grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
                                        <button className="py-3.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all text-sm flex items-center justify-center gap-2 shadow-sm">
                                            <LogOut className="w-4 h-4" />
                                            Guardar Borrador
                                        </button>
                                        <button
                                            onClick={handlePublish}
                                            disabled={isPublishing}
                                            className="py-3.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-brand-500/30 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                                        >
                                            {isPublishing ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Zap className="w-4 h-4 fill-current" />
                                            )}
                                            {isPublishing ? 'Publicando...' : 'Publicar en LinkedIn'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
