import React, { useState } from 'react';
import { Calendar, TrendingUp, Copy, RotateCcw, Trash2 } from 'lucide-react';
import { Post, AppLanguage, GenerationParams } from '../../../types';
import { translations } from '../../../translations';

interface HistoryCardProps {
    post: Post;
    language: AppLanguage;
    onSelect: (post: Post) => void;
    onReuse: (params: GenerationParams) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ post, language, onSelect, onReuse, onDelete }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const t = translations[language].app.history;
    const tConstants = translations[language].app.constants;

    const handleCopy = (id: string, content: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-100';
        if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-100';
        return 'text-red-600 bg-red-50 border-red-100';
    };

    const toneLabel = tConstants.tones[post.params.tone]?.label || post.params.tone;
    const frameworkLabel = tConstants.frameworks[post.params.framework]?.label || post.params.framework;
    const score = post.viralScore || 0;

    return (
        <div
            onClick={() => onSelect(post)}
            className="break-inside-avoid group bg-white rounded-2xl border border-slate-200 p-6 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1 relative overflow-hidden"
        >
            {/* Badges */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                <div className="flex gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-200 group-hover:bg-brand-50 group-hover:text-brand-700 group-hover:border-brand-200 transition-colors">
                        {toneLabel}
                    </span>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-100 group-hover:border-indigo-200 transition-colors">
                        {frameworkLabel.split(' ')[0]}
                    </span>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium whitespace-nowrap">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.createdAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' })}
                </span>
            </div>

            {/* Content */}
            <div className="mb-6">
                <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2" title={post.params.topic}>
                    {post.params.topic}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-[8] font-normal whitespace-pre-line">
                    {post.content}
                </p>
            </div>

            {/* Footer Stats & Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4">
                    {score > 0 ? (
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${getScoreColor(score)} text-xs font-bold`}>
                            <TrendingUp className="w-3.5 h-3.5" />
                            Score: {score}
                        </div>
                    ) : (
                        <span className="text-xs text-slate-400 italic">{t.noScore}</span>
                    )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={(e) => handleCopy(post.id, post.content, e)}
                        className="p-2 hover:bg-brand-50 text-slate-400 hover:text-brand-600 rounded-lg transition-colors relative"
                        title={t.copy}
                    >
                        {copiedId === post.id && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap animate-in fade-in zoom-in">
                                {t.actions.copied}
                            </span>
                        )}
                        <Copy className="w-4 h-4" />
                    </button>
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
