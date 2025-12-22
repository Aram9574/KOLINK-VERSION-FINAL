import React, { useEffect, useRef, useState } from "react";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import confetti from "canvas-confetti";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertTriangle,
  Clock,
  Layout,
  Lightbulb,
  Monitor,
  Smartphone,
  TrendingUp,
} from "lucide-react";

import {
  AppLanguage,
  EmojiDensity,
  GenerationParams,
  PostLength,
  ViralFramework,
  ViralHook,
  ViralTone,
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

import GeneratorForm from "./GeneratorForm";
import LinkedInPreview from "./LinkedInPreview";

// Helper to pick random from array, excluding the 'random' option itself if present
const pickRandom = <T extends { value: string }>(options: T[]): string => {
  // Filter out the "random" option (value === 'random')
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
  onEdit?: (post: any) => void;
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
}) => {
  const { user } = useUser();
  const { params, updateParams } = useGeneratorForm({
    initialTopic,
    initialParams,
  });
  const { currentPost, updatePost } = usePosts();

  // Haptics & Feedback Logic
  const prevIsGenerating = useRef(isGenerating);

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      // Pulse haptics while generating
      interval = setInterval(async () => {
        await Haptics.impact({ style: ImpactStyle.Light });
      }, 3000);
    }

    if (prevIsGenerating.current && !isGenerating && currentPost?.content) {
      // Just finished generating successfully
      Haptics.notification({ type: NotificationType.Success });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 1000,
      });

      // Check if we need to auto-redirect to Carousel Studio
      if (params.generateCarousel && onGoToCarousel && currentPost?.content) {
        setTimeout(() => {
          onGoToCarousel(currentPost.content);
          toast.success("Redirecting to Carousel Studio...");
        }, 1500); // Small delay to let user see success confetti
      }
    }

    prevIsGenerating.current = isGenerating;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating, currentPost?.id]);

  // UI State for Preview Toggle
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor"); // For mobile only

  const handleGenerate = () => {
    const isFreeUser = user?.planTier === "free";

    // Filter options based on plan
    const availableTones = isFreeUser
      ? TONES.filter((t) => !t.isPremium)
      : TONES;
    const availableFrameworks = isFreeUser
      ? FRAMEWORKS.filter((f) => !f.isPremium)
      : FRAMEWORKS;
    const availableHooks = isFreeUser
      ? HOOK_STYLES.filter((h) => !h.isPremium)
      : HOOK_STYLES;

    // Resolve random values
    const finalParams: GenerationParams = {
      ...params,
      tone: params.tone === "random"
        ? pickRandom(availableTones) as ViralTone
        : params.tone,
      framework: params.framework === "random"
        ? pickRandom(availableFrameworks) as ViralFramework
        : params.framework,
      length: params.length === "random"
        ? pickRandom(LENGTH_OPTIONS) as PostLength
        : params.length,
      emojiDensity: params.emojiDensity === "random"
        ? pickRandom(EMOJI_OPTIONS) as EmojiDensity
        : params.emojiDensity,
      hookStyle: params.hookStyle === "random"
        ? pickRandom(availableHooks) as ViralHook
        : params.hookStyle,
    };

    onGenerate(finalParams);
    if (window.innerWidth < 1024) {
      setActiveView("preview"); // Switch to preview on mobile after generate
    }
  };

  // Auto-switch to preview if content exists (e.g. from history)
  useEffect(() => {
    if (currentPost?.content && window.innerWidth < 1024) {
      setActiveView("preview");
    }
  }, [currentPost?.id]);

  // AutoPilot: Check for redirected content
  const location = useLocation();
  useEffect(() => {
    if (location.state?.initialContent && location.state?.fromAutoPilot) {
      // Delay slightly to ensure context is ready
      setTimeout(() => {
        updatePost({
          id: Date.now().toString(), // temporary ID
          content: location.state.initialContent,
          params: params, // use current default params or passed ones
          createdAt: Date.now(),
          likes: 0,
          views: 0,
          isAutoPilot: true,
        });
        // Clear state to prevent loop if desired, though navigation usually clears it on refresh
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location.state]);

  const handleUpdateContent = (newContent: string) => {
    if (currentPost) {
      updatePost({ ...currentPost, content: newContent });
    }
  };

  const handleSchedule = (date: Date) => {
    if (currentPost) {
      updatePost({
        ...currentPost,
        status: "scheduled",
        scheduledDate: date.getTime(),
      });
      // Optionally reset or navigate? For now keeping on page but updated.
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Mobile-Only Header Toggle (Visible only on small screens) */}
      <div className="lg:hidden flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-full mb-4">
        <button
          onClick={() => setActiveView("editor")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-all ${
            activeView === "editor"
              ? "bg-white text-brand-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Layout className="w-4 h-4" />
          {language === "es" ? "Editor" : "Editor"}
        </button>
        <button
          onClick={() => setActiveView("preview")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-all ${
            activeView === "preview"
              ? "bg-white text-brand-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Monitor className="w-4 h-4" />
          {language === "es" ? "Vista Previa" : "Preview"}
        </button>
      </div>

      {/* Desktop Header Row (Aligns Title and Toggle) */}
      <div className="hidden lg:flex justify-between items-end mb-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            {language === "es" ? "Estudio" : "Studio"}
          </h1>
          <p className="text-slate-500">
            {language === "es"
              ? "Diseña tu próximo éxito viral."
              : "Design your next viral hit."}
          </p>
        </div>

        {/* View Toggle (Moved from Right Col) */}
        <div className="bg-slate-200/50 backdrop-blur-md p-1 rounded-xl inline-flex gap-1">
          <button
            onClick={() => setViewMode("desktop")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === "desktop"
                ? "bg-white shadow-sm text-slate-800"
                : "text-slate-500 hover:bg-white/50"
            }`}
          >
            <Monitor className="w-3 h-3" />
            Escritorio
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === "mobile"
                ? "bg-white shadow-sm text-slate-800"
                : "text-slate-500 hover:bg-white/50"
            }`}
          >
            <Smartphone className="w-3 h-3" />
            Móvil
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Column: Title, Form, Tips (lg:col-span-6) */}
        <div
          className={`lg:col-span-6 space-y-6 ${
            activeView === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Mobile Title (Hidden on Desktop) */}
          <div className="lg:hidden space-y-2 mb-4">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              {language === "es" ? "Estudio" : "Studio"}
            </h1>
            <p className="text-slate-500">
              {language === "es"
                ? "Diseña tu próximo éxito viral."
                : "Design your next viral hit."}
            </p>
          </div>

          <GeneratorForm
            params={params}
            onUpdateParams={updateParams}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            credits={credits}
            language={language}
            showCreditDeduction={showCreditDeduction}
            isCancelled={isCancelled}
          />
        </div>

        {/* Right Column: Preview (lg:col-span-6) */}
        <div
          className={`lg:col-span-6 flex flex-col h-full ${
            activeView === "editor" ? "hidden lg:flex" : "flex"
          }`}
        >
          <div
            className={`transition-all duration-500 ease-in-out mx-auto w-full ${
              viewMode === "mobile" ? "max-w-[375px]" : "max-w-2xl"
            }`}
          >
            <LinkedInPreview
              content={currentPost?.content || ""}
              user={user}
              isLoading={isGenerating}
              language={language}
              onUpdate={handleUpdateContent}
              onSchedule={handleSchedule}
              viralScore={currentPost?.viralScore}
              viralAnalysis={currentPost?.viralAnalysis}
              // Carousel button removed from Studio view as per request
              onEdit={onEdit ? () => onEdit(currentPost) : undefined}
              isMobilePreview={viewMode === "mobile"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostGenerator;
