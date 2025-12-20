import React, { useState } from "react";
import {
    Calendar,
    CheckCircle,
    Clock,
    Copy,
    FileEdit,
    RotateCcw,
    Share2,
    Star,
    Trash2,
    TrendingUp,
} from "lucide-react";
import { AppLanguage, GenerationParams, Post } from "../../../types";
import { translations } from "../../../translations";
import { toast } from "sonner";

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
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const t = translations[language].app.history;
    const tConstants = translations[language].app.constants;

    const handleCopy = (id: string, content: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        toast.success(
            language === "es" ? "Contenido copiado" : "Content copied",
        );
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(post.id, !post.isFavorite);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 bg-green-50 border-green-100";
        if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-100";
        return "text-red-600 bg-red-50 border-red-100";
    };

    const toneLabel = tConstants.tones[post.params.tone]?.label ||
        post.params.tone;
    const frameworkLabel =
        tConstants.frameworks[post.params.framework]?.label ||
        post.params.framework;
    const score = post.viralScore || 0;

    return (
        <div
            onClick={() => onSelect(post)}
            className="break-inside-avoid group bg-white rounded-2xl border border-slate-200 p-6 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1 relative overflow-hidden"
        >
            {/* Status Icons & Action */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                    onClick={handleFavoriteClick}
                    className={`p-1.5 rounded-full transition-colors ${
                        post.isFavorite
                            ? "text-amber-400 bg-amber-50 hover:bg-amber-100"
                            : "text-slate-300 hover:text-amber-400 hover:bg-slate-50"
                    }`}
                >
                    <Star
                        className={`w-4 h-4 ${
                            post.isFavorite ? "fill-current" : ""
                        }`}
                    />
                </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center mb-4 gap-2 pr-8">
                {post.status === "scheduled" && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-100">
                        <Clock className="w-3 h-3" />
                        {language === "es" ? "Prog" : "Sched"}
                    </span>
                )}
                {post.status === "draft" && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-200">
                        <FileEdit className="w-3 h-3" />
                        {language === "es" ? "Borrador" : "Draft"}
                    </span>
                )}
                <div className="flex gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-200 group-hover:bg-brand-50 group-hover:text-brand-700 group-hover:border-brand-200 transition-colors">
                        {toneLabel}
                    </span>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-100 group-hover:border-indigo-200 transition-colors">
                        {frameworkLabel.split(" ")[0]}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                    <h3
                        className="text-base font-bold text-slate-900 line-clamp-2 pr-2"
                        title={post.params.topic}
                    >
                        {post.params.topic}
                    </h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-[8] font-normal whitespace-pre-line">
                    {post.content}
                </p>
                {/* Tags (Future proofing UI) */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Stats & Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.createdAt).toLocaleDateString(
                            language === "es" ? "es-ES" : "en-US",
                            { month: "short", day: "numeric" },
                        )}
                    </span>
                    {score > 0 && (
                        <div
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${
                                getScoreColor(score)
                            } text-[10px] font-bold`}
                        >
                            <TrendingUp className="w-3 h-3" />
                            {score}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={(e) => handleCopy(post.id, post.content, e)}
                        className="p-2 hover:bg-brand-50 text-slate-400 hover:text-brand-600 rounded-lg transition-colors"
                        title={t.copy}
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    {onShare && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onShare(post);
                            }}
                            className="p-2 hover:bg-green-50 text-slate-400 hover:text-green-600 rounded-lg transition-colors lg:hidden"
                            title="Share"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onReuse(post.params);
                        }}
                        className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                        title={t.actions.reuse}
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => onDelete(post.id, e)}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                        title={t.delete}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HistoryCard;
