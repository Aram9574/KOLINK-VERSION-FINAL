import React, { useEffect, useMemo, useState } from "react";
import { AppLanguage, UserProfile, ViralAnalysis } from "../../../types";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    AlertCircle,
    Check,
    ChevronDown,
    ChevronUp,
    Clock,
    Globe,
    Linkedin,
    MessageCircle,
    MoreHorizontal,
    PenSquare,
    Plus,
    Repeat,
    Send,
    Sparkles, // Added for the button
    ThumbsUp,
    TrendingUp,
    Zap,
} from "lucide-react";
import { translations } from "../../../translations";
import { supabase } from "../../../services/supabaseClient";
import { toast } from "sonner";
import { Haptics, NotificationType } from "@capacitor/haptics";
import confetti from "canvas-confetti";
import ScheduleModal from "../../modals/ScheduleModal";
import { getAvatarUrl } from "../../../utils";

interface LinkedInPreviewProps {
    content: string;
    user: UserProfile;
    isLoading: boolean;
    language?: AppLanguage;
    onUpdate?: (newContent: string) => void;
    onSchedule?: (date: Date) => void;
    onConvertToCarousel?: () => void;
    viralScore?: number;
    viralAnalysis?: ViralAnalysis;
}

const LinkedInPreview: React.FC<LinkedInPreviewProps> = (
    {
        content = "",
        user,
        isLoading,
        language = "en",
        onUpdate,
        onSchedule,
        onConvertToCarousel,
        viralScore,
        viralAnalysis,
    },
) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(content || "");
    const [showAudit, setShowAudit] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isScheduling, setIsScheduling] = useState(false);

    const t = translations[language].app.preview;
    const navigate = useNavigate();

    // Sync edit content if prop changes
    useEffect(() => {
        setEditContent(content || "");
    }, [content]);

    // Function to handle "See more" logic roughly
    const truncatedContent = useMemo(() => {
        if (!content) return "";
        const lines = content.split("\n");
        if (lines.length > 5) {
            return lines.slice(0, 3).join("\n") + "...";
        }
        if (content.length > 210) {
            return content.slice(0, 210) + "...";
        }
        return content;
    }, [content]);

    const displayContent = isExpanded ? (content || "") : truncatedContent;
    const safeContent = content || "";
    const needsSeeMore = safeContent.length > 210 ||
        safeContent.split("\n").length > 5;

    const handleSave = () => {
        if (onUpdate) {
            onUpdate(editContent);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditContent(content);
        setIsEditing(false);
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            let providerToken = session?.provider_token;

            // FALLBACK FOR MOBILE: If session doesn't have it, check localStorage
            if (!providerToken) {
                providerToken = localStorage.getItem("linkedin_provider_token");
                console.log(
                    "Using provider_token from localStorage fallback:",
                    !!providerToken,
                );
            }

            if (!providerToken) {
                toast.error(
                    "No se detectó conexión con LinkedIn. Por favor inicia sesión nuevamente con LinkedIn.",
                );
                return;
            }

            const { data, error } = await supabase.functions.invoke(
                "publish-to-linkedin",
                {
                    body: {
                        content: displayContent,
                        providerToken: providerToken,
                        visibility: "PUBLIC",
                    },
                },
            );

            if (error) throw error;

            if (data && !data.success) {
                throw new Error(data.error || "Error desconocido al publicar");
            }

            // Success feedback
            await Haptics.notification({
                type: NotificationType.Success,
            });
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                zIndex: 1000,
            });

            toast.success("¡Post publicado exitosamente en LinkedIn!");
        } catch (error: any) {
            console.error("Publishing error:", error);
            await Haptics.notification({
                type: NotificationType.Error,
            });
            toast.error(error.message || "Error al publicar en LinkedIn");
        } finally {
            setIsPublishing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
        if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    const getScoreGradient = (score: number) => {
        if (score >= 80) return "from-green-400 to-green-600";
        if (score >= 50) return "from-amber-400 to-amber-600";
        return "from-red-400 to-red-600";
    };

    if (isLoading) {
        return (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm w-full max-w-xl mx-auto p-4 animate-pulse">
                <div className="flex space-x-3 mb-4">
                    <div className="rounded-full bg-slate-200 h-12 w-12"></div>
                    <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    if (!content) {
        return (
            <div
                id="tour-preview"
                className="bg-white/40 backdrop-blur-md border border-white/50 border-dashed rounded-xl h-96 flex flex-col items-center justify-center text-slate-400 w-full max-w-xl mx-auto"
            >
                <div className="bg-indigo-50 p-5 rounded-full mb-4 shadow-sm animate-bounce duration-1000">
                    <Send className="w-8 h-8 text-brand-400 ml-1 mt-1" />
                </div>
                <p className="font-medium">{t.placeholder}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full max-w-xl mx-auto">
            {/* VIRAL SCORECARD (NEW) */}
            {viralScore !== undefined && (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-in slide-in-from-top-4 duration-500">
                    <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => setShowAudit(!showAudit)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 flex items-center justify-center">
                                {/* Circular Progress SVG */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r="24"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="transparent"
                                        className="text-slate-100"
                                    />
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r="24"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="transparent"
                                        className={`${
                                            getScoreColor(viralScore).split(
                                                " ",
                                            )[0]
                                        }`}
                                        strokeDasharray={150.79}
                                        strokeDashoffset={150.79 -
                                            (150.79 * viralScore) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span
                                    className={`absolute text-sm font-bold ${
                                        getScoreColor(viralScore).split(" ")[0]
                                    }`}
                                >
                                    {viralScore}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                    {t.viralPotential}
                                    {viralScore > 80 && (
                                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">
                                            {t.high}
                                        </span>
                                    )}
                                </h4>
                                <p className="text-xs text-slate-500">
                                    {t.aiEstimate}
                                </p>
                            </div>
                        </div>
                        <div className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-400">
                            {showAudit
                                ? <ChevronUp className="w-4 h-4" />
                                : <ChevronDown className="w-4 h-4" />}
                        </div>
                    </div>

                    {/* Detailed Breakdown */}
                    {showAudit && viralAnalysis && (
                        <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50/50">
                            <div className="grid grid-cols-3 gap-2 mt-4 mb-4">
                                <ScoreBar
                                    label={t.hook}
                                    score={viralAnalysis.hookScore}
                                />
                                <ScoreBar
                                    label={t.readability}
                                    score={viralAnalysis.readabilityScore}
                                />
                                <ScoreBar
                                    label={t.value}
                                    score={viralAnalysis.valueScore}
                                />
                            </div>

                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-3 items-start">
                                <div className="p-1.5 bg-amber-100 rounded-md text-amber-600 mt-0.5">
                                    <Zap className="w-3.5 h-3.5 fill-current" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-amber-700 mb-0.5">
                                        {t.proTip}
                                    </p>
                                    <p className="text-xs text-amber-900 leading-relaxed font-medium">
                                        {viralAnalysis.feedback}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div
                id="tour-preview"
                className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-500 ease-in-out relative group"
            >
                {/* Control Toolbar - Matching Reference Design */}
                <div className="bg-slate-50/30 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex space-x-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]">
                            </div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]">
                            </div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]">
                            </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">
                            PREVIEW
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {/* Convert to Carousel Button - Premium Feature */}
                        {!isEditing && onConvertToCarousel && (
                            <button
                                onClick={onConvertToCarousel}
                                className="px-3 h-9 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-bold hover:shadow-lg hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap"
                                title="Transform this post into a viral carousel"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">
                                    {language === "es"
                                        ? "Convertir a Carrusel"
                                        : "Convert to Carousel"}
                                </span>
                                <span className="md:hidden">
                                    {language === "es"
                                        ? "Carrusel"
                                        : "Carousel"}
                                </span>
                            </button>
                        )}

                        {isEditing
                            ? (
                                <div className="flex items-center gap-1.5 animate-in zoom-in-95 duration-200">
                                    <button
                                        onClick={handleCancel}
                                        className="px-3 h-9 rounded-lg text-[11px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
                                    >
                                        {t.cancel}
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-3 h-9 rounded-lg bg-brand-600 text-white text-[11px] font-bold hover:bg-brand-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        {t.save}
                                    </button>
                                </div>
                            )
                            : (
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-3 h-9 rounded-lg bg-white border border-slate-200 text-blue-600 text-[11px] font-bold hover:border-blue-300 hover:bg-blue-50/30 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                                    >
                                        <PenSquare className="w-3.5 h-3.5" />
                                        {t.edit}
                                    </button>
                                    <button
                                        onClick={() => setIsScheduling(true)}
                                        className="px-3 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                                    >
                                        <Clock className="w-3.5 h-3.5" />
                                        {language === "es"
                                            ? "Programar"
                                            : "Schedule"}
                                    </button>
                                    {/* Removed the top Publish button as per instructions */}
                                </div>
                            )}
                    </div>
                </div>

                {/* Post Header */}
                <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex space-x-3">
                            <div className="relative">
                                <img
                                    src={getAvatarUrl(user)}
                                    alt={user?.name || "User"}
                                    className="w-12 h-12 rounded-full object-cover border border-slate-100"
                                />
                                {user.isPremium && (
                                    <div className="absolute -bottom-1 -right-1 bg-amber-400 border-2 border-white w-4 h-4 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full">
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-1">
                                    <span className="font-bold text-slate-900 text-sm hover:text-blue-600 hover:underline cursor-pointer">
                                        {user.name}
                                    </span>
                                    <span className="text-slate-500 text-xs">
                                        • 1st
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px] sm:max-w-xs">
                                    {user.headline}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                    <span>1h</span>
                                    <span>•</span>
                                    <Globe className="w-3 h-3 text-slate-500" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="text-brand-600 font-bold text-sm hover:bg-blue-50 px-3 py-1 rounded-full transition-colors flex items-center gap-1">
                                <Plus className="w-4 h-4" />
                                {t.follow}
                            </button>
                            <button className="text-slate-500 hover:bg-slate-100 p-2 rounded-full transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Post Body */}
                    {isEditing
                        ? (
                            <div className="relative">
                                <textarea
                                    value={editContent}
                                    onChange={(e) =>
                                        setEditContent(e.target.value)}
                                    className="w-full min-h-[250px] text-[14px] text-slate-900 leading-normal font-normal border-2 border-brand-300 rounded-lg p-3 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none resize-y bg-white transition-all"
                                    autoFocus
                                    placeholder="Type your post content here..."
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium bg-white/80 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                                    {editContent.length} chars
                                </div>
                            </div>
                        )
                        : (
                            <div className="text-[14px] text-slate-900 whitespace-pre-wrap leading-normal font-normal break-words">
                                {displayContent}
                                {!isExpanded && needsSeeMore && (
                                    <button
                                        onClick={() => setIsExpanded(true)}
                                        className="text-slate-500 hover:text-brand-600 hover:underline ml-1 font-medium cursor-pointer"
                                    >
                                        {t.seeMore}
                                    </button>
                                )}
                            </div>
                        )}
                </div>

                {/* Engagement Metrics */}
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1 group cursor-pointer">
                        <div className="flex -space-x-1">
                            <div className="w-4 h-4 rounded-full bg-[#1485BD] flex items-center justify-center z-10 ring-1 ring-white">
                                <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
                            </div>
                            <div className="w-4 h-4 rounded-full bg-[#D14836] flex items-center justify-center ring-1 ring-white">
                                <span className="text-[8px] text-white">
                                    ❤️
                                </span>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-[#6DAE4F] flex items-center justify-center ring-1 ring-white">
                                <span className="text-[8px] text-white">
                                    👏
                                </span>
                            </div>
                        </div>
                        <span className="hover:text-blue-600 hover:underline ml-1 group-hover:text-blue-600">
                            1,243
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <span className="hover:text-blue-600 hover:underline cursor-pointer">
                            89 comments
                        </span>
                        <span>•</span>
                        <span className="hover:text-blue-600 hover:underline cursor-pointer">
                            12 reposts
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-2 py-1 flex items-center justify-between">
                    <ActionButton
                        icon={<ThumbsUp className="w-5 h-5 stroke-[1.5]" />}
                        label="Like"
                    />
                    <ActionButton
                        icon={
                            <MessageCircle className="w-5 h-5 stroke-[1.5]" />
                        }
                        label="Comment"
                    />
                    <ActionButton
                        icon={<Repeat className="w-5 h-5 stroke-[1.5]" />}
                        label="Repost"
                    />
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#0077b5] text-white font-black text-sm hover:bg-[#006097] transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {isPublishing
                            ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )
                            : (
                                <div className="bg-white p-0.5 rounded-sm">
                                    <Linkedin className="w-4 h-4 text-[#0077b5] fill-[#0077b5]" />
                                </div>
                            )}
                        <span className="uppercase tracking-wider">
                            {isPublishing
                                ? (language === "es"
                                    ? "Publicando..."
                                    : "Publishing...")
                                : (language === "es" ? "COMPARTIR" : "SHARE")}
                        </span>
                    </button>
                </div>
            </div>

            <ScheduleModal
                isOpen={isScheduling}
                onClose={() => setIsScheduling(false)}
                onConfirm={(date) => {
                    if (onSchedule) onSchedule(date);
                    setIsScheduling(false);
                    toast.success(
                        language === "es"
                            ? "Publicación programada"
                            : "Post scheduled",
                    );
                }}
                language={language}
            />
        </div>
    );
};

const ScoreBar: React.FC<{ label: string; score: number }> = (
    { label, score },
) => {
    let colorClass = "bg-red-500";
    if (score >= 80) colorClass = "bg-green-500";
    else if (score >= 50) colorClass = "bg-amber-500";

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                <span>{label}</span>
                <span
                    className={score >= 50 ? "text-slate-700" : "text-red-500"}
                >
                    {score}
                </span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${colorClass}`}
                    style={{ width: `${score}%` }}
                >
                </div>
            </div>
        </div>
    );
};

const ActionButton: React.FC<
    {
        icon: React.ReactNode;
        label: string;
        onClick?: () => void;
        className?: string;
    }
> = (
    { icon, label, onClick, className = "" },
) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center gap-2 px-2 sm:px-4 py-3.5 rounded-lg hover:bg-slate-100 flex-1 text-slate-500 font-semibold text-sm transition-all duration-200 group active:scale-95 active:bg-slate-200 ${className}`}
    >
        <span
            className={`group-hover:scale-110 transition-transform duration-200 ${
                className ? "" : "group-hover:text-slate-700"
            }`}
        >
            {icon}
        </span>
        <span className="hidden sm:inline group-hover:text-slate-700">
            {label}
        </span>
    </button>
);

export default LinkedInPreview;
