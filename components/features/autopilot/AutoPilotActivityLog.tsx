import React from 'react';
import { Terminal, Zap, Loader2, Play, Eye, Trash2 } from 'lucide-react';
import { AppLanguage, Post } from '../../../types';
import { translations } from '../../../translations';

interface AutoPilotActivityLogProps {
    language: AppLanguage;
    isEnabled: boolean;
    automatedPosts: Post[];
    onForceRun: () => void;
    isGenerating: boolean;
    onViewPost?: (post: Post) => void;
    onDeletePost?: (postId: string) => void;
}

const AutoPilotActivityLog: React.FC<AutoPilotActivityLogProps> = ({
    language,
    isEnabled,
    automatedPosts,
    onForceRun,
    isGenerating,
    onViewPost,
    onDeletePost
}) => {
    const t = translations[language].app.autopilot;

    return (
        <div className="bg-white text-slate-600 rounded-3xl p-6 border border-slate-200 flex flex-col shadow-sm h-full">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                    <Terminal className="w-5 h-5 text-sky-600" />
                    {t.activity.title}
                </h3>
                {isEnabled && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                )}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto min-h-0 pr-2 custom-scrollbar font-mono text-xs">
                {/* Manual Force Run Control in Log */}
                {isEnabled && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-500 font-bold uppercase tracking-wider">{t.activity.manualOverride}</span>
                            <Zap className="w-4 h-4 text-amber-500" />
                        </div>
                        <button
                            onClick={onForceRun}
                            disabled={isGenerating}
                            className="w-full py-2.5 bg-white border border-slate-200 text-sky-700 font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-sky-50 hover:border-sky-200"
                        >
                            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                            {t.statusCard.forceRunBtn}
                        </button>
                    </div>
                )}

                {automatedPosts.length === 0 ? (
                    <div className="text-slate-400 text-center py-10 italic border-2 border-dashed border-slate-200 rounded-xl">
                        <div className="mb-2 text-slate-300">_</div>
                        {t.activity.empty}
                    </div>
                ) : (
                    automatedPosts.map(post => (
                        <div key={post.id} className="group bg-slate-50 rounded-lg p-3 border border-slate-100 hover:border-slate-300 transition-colors">
                            <div className="flex justify-between items-start mb-2 opacity-60">
                                <span className="text-sky-600 font-bold">[{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                                <span className="text-[10px] text-slate-400">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-start gap-2 mb-3">
                                <span className="text-green-600 mt-0.5 font-bold">➜</span>
                                <p className="text-slate-600 line-clamp-2 leading-relaxed">
                                    {t.activity.generatedFor} <span className="text-slate-900 font-bold">"{post.params.topic}"</span>
                                </p>
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onViewPost && onViewPost(post)}
                                    className="flex-1 py-1.5 rounded bg-white border border-slate-200 hover:border-sky-200 text-xs font-bold text-slate-500 hover:text-sky-600 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                    <Eye className="w-3 h-3" />
                                    {t.activity.viewOutput}
                                </button>
                                <button
                                    onClick={() => onDeletePost && onDeletePost(post.id)}
                                    className="px-2 py-1.5 rounded bg-white border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center shadow-sm"
                                    title={language === 'es' ? 'Eliminar' : 'Delete'}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
                {isEnabled && <div className="text-slate-400 animate-pulse">_</div>}
            </div>
        </div>
    );
};

export default AutoPilotActivityLog;
