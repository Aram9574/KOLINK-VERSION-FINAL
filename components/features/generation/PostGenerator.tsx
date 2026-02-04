import React, { useEffect, useRef, useState } from "react";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import confetti from "canvas-confetti";
import { useLocation } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import {
  AppLanguage,
  EmojiDensity,
  GenerationParams,
  PostLength,
  ViralFramework,
  ViralHook,
  ViralTone,
  Post
} from "../../../types";
import { useGeneratorForm } from "../../../hooks/useGeneratorForm";
import { useUser } from "../../../context/UserContext";
import { usePosts } from "../../../context/PostContext";
import {
  EMOJI_OPTIONS,
  FRAMEWORKS,
  HOOK_STYLES,
  LENGTH_OPTIONS,
  TONES,
} from "../../../constants";
import { fetchBrandVoices } from "../../../services/voiceRepository";

// Import V4 INVISIBLE COMPONENTS
import { StudioLayout } from "./v4/StudioLayout";
import LinkedInPreview from "./LinkedInPreview";
import { useCredits } from "../../../hooks/useCredits";
import { GamificationService } from "../../../services/gamificationService";
import { CreditService } from "../../../services/creditService";
import LevelUpModal from "../gamification/LevelUpModal";
import { ThinkingState } from "../../ui/ThinkingState";
import { analytics } from "../../../services/analyticsService";

// Helper to pick random from array
const pickRandom = <T extends { value: string }>(options: T[]): string => {
  const valid = options.filter((o) => o.value !== "random");
  if (valid.length === 0) return options[0].value;
  const index = Math.floor(Math.random() * valid.length);
  return valid[index].value;
};

interface PostGeneratorProps {
  onGenerate: (params: GenerationParams) => void;
  isGenerating: boolean;
  credits: number;
  language: AppLanguage;
  showCreditDeduction?: boolean;
  initialTopic?: string;
  initialParams?: GenerationParams | null;
  isCancelled?: boolean;
  onGoToCarousel?: (content: string) => void;
  onEdit?: (post: Post) => void;
  autoStart?: boolean;
}

const PostGenerator: React.FC<PostGeneratorProps> = ({
  onGenerate,
  isGenerating,
  credits,
  language,
  showCreditDeduction,
  initialTopic = "",
  initialParams = null,
  isCancelled = false,
  onGoToCarousel,
  onEdit,
  autoStart = false,
}) => {
  const { user, setUser } = useUser();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const { params, updateParams } = useGeneratorForm({
    initialTopic,
    initialParams,
  });
  const { currentPost, updatePost } = usePosts();
  const { checkCredits } = useCredits();
  const toast = useToast();

  // Legacy voices load (kept for future integration)
  useEffect(() => {
    if (user?.id) fetchBrandVoices(user.id);
  }, [user?.id]);

  // Auto-Start (for Onboarding "Aha Moment")
  useEffect(() => {
    if (autoStart && !isGenerating && !currentPost?.content && credits > 0) {
        // Little delay to ensure UI is ready and transition is smooth
        const timer = setTimeout(() => {
            handleGenerate();
        }, 800);
        return () => clearTimeout(timer);
    }
  }, [autoStart]);

  // Haptics
  const prevIsGenerating = useRef(isGenerating);
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
        interval = setInterval(() => {
            Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
        }, 3000);
    }
    if (prevIsGenerating.current && !isGenerating && currentPost?.content) {
        Haptics.notification({ type: NotificationType.Success }).catch(() => {});
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 1000 });
        
        // ANALYTICS: Track success
        analytics.track('post_generated_success', {
            topic: params.topic,
            framework: params.framework,
            tone: params.tone,
            length: params.length,
            language: language,
            has_carousel: params.generateCarousel
        });

        // GAMIFICATION: Award XP
        if (user?.id) {
            GamificationService.awardXP(user.id, 'post_generated').then(res => {
                if (res.leveledUp) {
                    setNewLevel(res.newLevel || (user.level || 1) + 1);
                    setShowLevelUp(true);
                }
                // Update local state with new XP/Level
                if (setUser) {
                    setUser(prev => ({ 
                        ...prev, 
                        xp: (prev.xp || 0) + res.xpAdded, 
                        level: res.newLevel || prev.level 
                    }));
                }
            });
        }

        if (params.generateCarousel && onGoToCarousel) {
            setTimeout(() => {
                onGoToCarousel(currentPost.content);
                toast.success("Redirecting to Carousel Studio...", "Redirigiendo");
            }, 1000);
        }
    }
    prevIsGenerating.current = isGenerating;
    return () => clearInterval(interval);
  }, [isGenerating, currentPost?.id]);

  const handleGenerate = async () => {
    if (!checkCredits(1)) return;
    
    // Secure Deduction
    if (user?.id) {
        const success = await CreditService.deductCredits(user.id, 1, 'generation');
        if (!success) {
            toast.error(language === 'es' ? 'Error de créditos' : 'Credit error', "Error");
            return;
        }
    }
    try {
      const isFreeUser = user?.planTier === "free";
      // Auto-resolve randoms
      const finalParams: GenerationParams = {
        ...params,
        tone: params.tone === "random" ? pickRandom(isFreeUser ? TONES.filter(t => !t.isPremium) : TONES) as ViralTone : params.tone,
        framework: params.framework === "random" ? pickRandom(isFreeUser ? FRAMEWORKS.filter(f => !f.isPremium) : FRAMEWORKS) as ViralFramework : params.framework,
        length: params.length === "random" ? pickRandom(LENGTH_OPTIONS) as PostLength : params.length,
        emojiDensity: params.emojiDensity === "random" ? pickRandom(EMOJI_OPTIONS) as EmojiDensity : params.emojiDensity,
        hookStyle: params.hookStyle === "random" ? pickRandom(isFreeUser ? HOOK_STYLES.filter(h => !h.isPremium) : HOOK_STYLES) as ViralHook : params.hookStyle,
        outputLanguage: language, // Explicitly pass the selected language
      };
      
      console.log("PostGenerator V4: invoking generate", finalParams);
      onGenerate(finalParams);
    } catch (e) {
      console.error("Generator error", e);
      toast.error("Error starting generation", "Error");
    }
  };

  // Content updating
  const handleUpdateContent = (newContent: string) => {
    if (currentPost) updatePost({ ...currentPost, content: newContent });
  };

  const handleSchedule = (date: Date) => {
    if (currentPost) updatePost({ ...currentPost, status: "scheduled", scheduledDate: date.getTime() });
  };

  // V4 INVISIBLE ASSEMBLY
  return (
    <>
        <LevelUpModal 
            isOpen={showLevelUp} 
            newLevel={newLevel} 
            onClose={() => setShowLevelUp(false)} 
        />
        <StudioLayout
            params={params}
            onUpdateParams={updateParams}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            credits={credits}
            language={language}
        >
            {/* Thinking State UX (Action 2 de AI Product Skill) */}
            {isGenerating && (!currentPost?.content || currentPost.content.trim().length === 0) ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 h-full flex items-center justify-center">
                    <ThinkingState language={language === 'es' ? 'es' : 'en'} />
                </div>
            ) : (
                /* Only pass children if there is content to show */
                ((currentPost?.content && currentPost.content.replace(/<[^>]*>/g, '').trim().length > 0) || isGenerating) && (
                    <LinkedInPreview
                    content={currentPost?.content || ""}
                    user={user}
                    isLoading={isGenerating}
                    language={language}
                    onUpdate={handleUpdateContent}
                    onSchedule={handleSchedule}
                    viralScore={currentPost?.viralScore}
                    viralAnalysis={currentPost?.viralAnalysis}
                    onEdit={onEdit ? () => onEdit(currentPost) : undefined}
                    isMobilePreview={false} 
                    generationParams={params}
                    postId={currentPost?.id}
                />
            ))}
        </StudioLayout>
    </>
  );
};

export default PostGenerator;
