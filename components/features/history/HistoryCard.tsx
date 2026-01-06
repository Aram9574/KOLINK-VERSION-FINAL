import React, { useState } from "react";
import {
    Calendar,
    Clock,
    Copy,
    FileEdit,
    RotateCcw,
    Share2,
    Star,
    Trash2,
    TrendingUp,
    MoreVertical,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLanguage, GenerationParams, Post } from "../../../types";
import { translations } from "../../../translations";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";

interface HistoryCardProps {
    post: Post;
    language: AppLanguage;
    onSelect: (post: Post) => void;
    onReuse: (params: GenerationParams) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
    onToggleFavorite: (id: string, isFavorite: boolean) => void;
    onShare?: (post: Post) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
    post,
    language,
    onSelect,
    onReuse,
    onDelete,
    onToggleFavorite,
    onShare,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    
    const t = translations[language].app.history;
    const tConstants = translations[language].app.constants;

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(post.content);
        setIsCopied(true);
        toast.success(language === "es" ? "Copiado a la bóveda" : "Copied to vault");
        setTimeout(() => setIsCopied(null), 2000); // Fixed below: transition state
    };

    // Correcting the setTimeout state update
    React.useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(post.id, !post.isFavorite);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-600 bg-emerald-50/50 border-emerald-100";
        if (score >= 50) return "text-amber-600 bg-amber-50/50 border-amber-100";
        return "text-rose-600 bg-rose-50/50 border-rose-100";
    };

    const toneLabel = tConstants.tones[post.params.tone]?.label || post.params.tone;
    const frameworkLabel = tConstants.frameworks[post.params.framework]?.label || post.params.framework;
    const score = post.viralScore || 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(post)}
            className="group relative flex flex-col h-full bg-white/40 backdrop-blur-md border border-slate-200/60 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 hover:bg-white/60"
        >
            {/* Action Bar (Only visible on hover or if menu open) */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                <button
                    onClick={handleFavoriteClick}
                    className={cn(
                        "p-2 rounded-full transition-all duration-200",
                        post.isFavorite 
                            ? "text-amber-400 bg-amber-50 border border-amber-100 shadow-sm" 
                            : "text-slate-400 hover:text-amber-400 hover:bg-white border border-transparent opacity-0 group-hover:opacity-100"
                    )}
                >
                    <Star className={cn("w-4 h-4", post.isFavorite && "fill-current")} />
                </button>
                
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-100 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-30 p-1"
                            >
                                <button
                                    onClick={(e) => { handleCopy(e); setIsMenuOpen(false); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                                >
                                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {t.copy}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onReuse(post.params);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    {t.actions.reuse}
                                </button>
                                <div className="h-px bg-slate-100 my-1" />
                                <button
                                    onClick={(e) => { onDelete(post.id, e); setIsMenuOpen(false); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    {t.delete}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1">
                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.status === "scheduled" && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50/50 text-blue-600 border border-blue-100 rounded-lg text-[10px] font-bold tracking-tight">
                            <Clock className="w-3 h-3" />
                            {language === "es" ? "PROGRAMADO" : "SCHEDULED"}
                        </div>
                    )}
                    {post.status === "draft" && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold tracking-tight">
                            <FileEdit className="w-3 h-3" />
                            {language === "es" ? "BORRADOR" : "DRAFT"}
                        </div>
                    )}
                    <div className="inline-flex items-center px-2.5 py-1 bg-white/50 text-slate-500 border border-slate-200/60 rounded-lg text-[10px] font-bold tracking-tight shadow-sm">
                        {toneLabel.toUpperCase()}
                    </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 leading-tight pr-6 group-hover:text-slate-800">
                    {post.params.topic}
                </h3>
                
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-[6] font-normal whitespace-pre-line mb-4 transition-colors group-hover:text-slate-600">
                    {post.content}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 bg-slate-50/80 text-[10px] font-medium text-slate-400 border border-slate-100 rounded-md"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-slate-100/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString(
                            language === "es" ? "es-ES" : "en-US",
                            { month: "short", day: "numeric" },
                        )}
                    </span>
                    
                    {score > 0 && (
                        <div className={cn(
                            "flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold shadow-sm",
                            getScoreColor(score)
                        )}>
                            <TrendingUp className="w-3 h-3" />
                            {score}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-300 group-hover:text-slate-400 transition-colors uppercase tracking-widest">
                        {frameworkLabel.split(" ")[0]}
                    </span>
                </div>
            </div>

            {/* Subtle Overlay Border for Selection */}
            <div className="absolute inset-0 border-2 border-brand-500/0 rounded-2xl pointer-events-none group-active:border-brand-500/10 transition-colors" />
        </motion.div>
    );
};

export default HistoryCard;
