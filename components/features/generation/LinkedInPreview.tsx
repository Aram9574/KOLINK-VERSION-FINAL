import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "../../ui/Skeleton";
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
    Sparkles,
    ThumbsUp,
    TrendingUp,
    Zap,
    Image as ImageIcon,
    X
} from "lucide-react";
import { translations } from "../../../translations";
import { supabase } from "../../../services/supabaseClient";
import { useToasts } from "../../ui/toast";
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
    onEdit?: () => void;
    showEditButton?: boolean;
    isMobilePreview?: boolean;
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
        onEdit,
        showEditButton = true,
        isMobilePreview = false,
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
    const toasts = useToasts();

    const t = translations[language].app.preview;
    const navigate = useNavigate();

    // Sync edit content if prop changes
    useEffect(() => {
        setEditContent(content || "");
    }, [content]);

    // Simplified content handling - always expanded
    const displayContent = content || "";

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

    const handlePublish = () => {
        const textToCopy = displayContent || "";
        navigator.clipboard.writeText(textToCopy).then(() => {
            toasts.success(
                language === "es"
                    ? "Texto copiado. Ahora pégalo en LinkedIn."
                    : "Text copied. Now paste it on LinkedIn.",
            );
            // Open LinkedIn in a new tab
            window.open("https://www.linkedin.com/feed/", "_blank");
        }).catch(() => {
            toasts.error(
                language === "es"
                    ? "Error al copiar el texto"
                    : "Failed to copy text",
            );
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
        if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    if (isLoading) {
        return (
            <div className="bg-white w-full max-w-xl mx-auto p-4 animate-pulse">
                <div className="flex space-x-3 mb-4">
                    <Skeleton className="rounded-full h-12 w-12 bg-slate-100" />
                    <div className="flex-1 space-y-2 py-1">
                        <Skeleton className="h-4 w-1/2 bg-slate-100 rounded" />
                        <Skeleton className="h-3 w-1/3 bg-slate-100 rounded" />
                    </div>
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full bg-slate-100 rounded" />
                    <Skeleton className="h-4 w-full bg-slate-100 rounded" />
                    <Skeleton className="h-4 w-3/4 bg-slate-100 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-100/50 pb-20"> {/* Wrapper with slight bg for contrast if needed, padding for scrolling */}
            



            {/* NATIVE FEED ITEM CONTAINER */}
            <div className="bg-white w-full border-t border-b border-slate-200 mb-2">
                
                {/* 1. Header (Author) */}
                <div className="px-4 pt-3 flex items-start gap-3">
                     <img
                        src={getAvatarUrl(user)}
                        alt={user?.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-100"
                    />
                    <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-slate-900 truncate decoration-1 hover:underline cursor-pointer">
                                {user.name}
                            </span>
                            <span className="text-slate-400 text-xs">• 1st</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{user.headline}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[11px] text-slate-400">2h • </span>
                            <Globe className="w-3 h-3 text-slate-400" />
                        </div>
                    </div>
                     <button className="text-brand-600 font-semibold text-sm flex items-center gap-1 hover:bg-brand-50 rounded px-2 py-1 -mr-2 transition-colors">
                        <Plus className="w-4 h-4" />
                        Follow
                     </button>
                </div>

                {/* 2. Content */}
                <div className="px-4 py-3 text-[14px] leading-[1.4] text-slate-900 whitespace-pre-wrap font-normal">
                    {isEditing ? (
                        <div className="relative">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full min-h-[150px] p-2 border-2 border-brand-500 rounded-lg focus:outline-none bg-white text-slate-900"
                                autoFocus
                            />
                            <div className="absolute bottom-2 right-2 flex gap-2">
                                <button onClick={handleCancel} className="bg-white shadow text-slate-600 px-3 py-1 rounded-full text-xs font-bold border">Cancel</button>
                                <button onClick={handleSave} className="bg-brand-600 shadow text-white px-3 py-1 rounded-full text-xs font-bold">Done</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                             <span dir="ltr">{displayContent || "Start writing to see your preview..."}</span>
                        </div>
                    )}
                </div>

                {/* 3. Media Placeholder (Optional, implied if none) */}
                {/* If we had images, they would go here. For now, text only. */}

                {/* 4. Engagement Counts */}
                <div className="px-4 flex items-center justify-between py-2 border-b border-slate-100/80">
                    {/* Reactions */}
                    <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                             <img src="https://static.licdn.com/aero-v1/sc/h/8ekq8gho1ruaf8i7f86vd1ftt" alt="Like" className="w-4 h-4 z-20" />
                             <img src="https://static.licdn.com/aero-v1/sc/h/cpho5fghnpbn55ccy2dk94of9" alt="Clap" className="w-4 h-4 z-10" />
                             <img src="https://static.licdn.com/aero-v1/sc/h/b1dl5jk88euc7e9ri50xy5qo8" alt="Heart" className="w-4 h-4 z-0" />
                        </div>
                        <span className="text-[11px] text-slate-500 hover:text-blue-600 hover:underline cursor-pointer ml-1">458</span>
                    </div>
                    {/* Comments/Reposts */}
                    <div className="text-[11px] text-slate-500 hover:text-blue-600 hover:underline cursor-pointer">
                        42 comments • 6 reposts
                    </div>
                </div>

                {/* 5. Action Buttons (Native Mobile Row) */}
                <div className="px-2 flex items-center justify-between py-1">
                     <NativeActionButton 
                        icon={<ThumbsUp className="w-5 h-5 -scale-x-100" />} 
                        label="Like" 
                     />
                     <NativeActionButton 
                        icon={<MessageCircle className="w-5 h-5" />} 
                        label="Comment" 
                     />
                     <NativeActionButton 
                        icon={<Repeat className="w-5 h-5" />} 
                        label="Repost" 
                     />
                     <NativeActionButton 
                        icon={<Send className="w-5 h-5 -rotate-45 translate-y-[-2px] translate-x-[2px]" />} 
                        label="Send" 
                     />
                </div>
            </div>

            {/* FLOATING ACTION BUTTON FOR PUBLISHING / ADMIN */}
            <div className="sticky bottom-4 left-0 right-0 flex justify-center gap-3 px-4 z-20">
                <button 
                    onClick={() => onEdit && onEdit()} 
                    className="bg-white text-slate-600 shadow-lg border border-slate-200 px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold hover:scale-105 active:scale-95 transition-all"
                >
                    <PenSquare className="w-4 h-4" />
                    Edit
                </button>
                <button 
                    onClick={handlePublish}
                    className="bg-[#0a66c2] text-white shadow-lg shadow-blue-900/20 px-6 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold hover:scale-105 active:scale-95 transition-all"
                >
                    <Send className="w-4 h-4" />
                    {language === "es" ? "Publicar en LinkedIn" : "Post to LinkedIn"}
                </button>
            </div>

            <ScheduleModal
                isOpen={isScheduling}
                onClose={() => setIsScheduling(false)}
                onConfirm={(date) => {
                    if (onSchedule) onSchedule(date);
                    setIsScheduling(false);
                    toasts.success(t.scheduled);
                }}
                language={language}
            />
        </div>
    );
};

const NativeActionButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <button className="flex flex-col items-center justify-center py-2 px-1 flex-1 active:bg-slate-100 rounded-lg transition-colors group">
         <div className="text-slate-500 group-hover:text-slate-700 transition-colors">
            {icon}
         </div>
         <span className="text-[10px] font-medium text-slate-500 mt-0.5 group-hover:text-slate-700">{label}</span>
    </button>
);

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

export default LinkedInPreview;
