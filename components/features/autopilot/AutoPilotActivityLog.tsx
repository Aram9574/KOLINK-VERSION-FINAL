import React from "react";
import {
    BarChart3,
    Calendar,
    ChevronRight,
    Clock,
    Eye,
    LayoutGrid,
    Loader2,
    Play,
    Terminal,
    Trash2,
    Zap,
} from "lucide-react";
import { AppLanguage, Post } from "../../../types";
import { translations } from "../../../translations";

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
    onDeletePost,
}) => {
    const t = translations[language].app.autopilot;

    return (
        <div className="bg-white text-slate-600 rounded-[2.5rem] p-6 border border-slate-200 flex flex-col shadow-sm h-full relative overflow-hidden group/console">
            <div className="relative z-20 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 shrink-0 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 uppercase tracking-[0.2em]">
                            <Terminal className="w-4 h-4 text-sky-600" />
                            {t.activity.title}
                        </h3>
                        {isEnabled && (
                            <div className="flex items-center gap-2 text-[10px] text-green-600 font-mono font-bold">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75">
                                    </span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500">
                                    </span>
                                </span>
                                {t.console.liveMonitoring}: [{t.console.ready}]
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto min-h-0 pr-2 custom-scrollbar font-mono text-[11px]">
                    {/* Manual Override Section */}
                    {isEnabled && (
                        <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 mb-6 group/override">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600">
                                    {t.activity.manualOverride}
                                </span>
                                <Zap className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                            </div>
                            <button
                                onClick={onForceRun}
                                disabled={isGenerating}
                                className="w-full h-10 bg-sky-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-sky-700 shadow-sm active:scale-95 translate-z-0"
                            >
                                {isGenerating
                                    ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    )
                                    : <Play className="w-3 h-3 fill-current" />}
                                <span className="text-xs">
                                    {t.statusCard.forceRunBtn}
                                </span>
                            </button>
                        </div>
                    )}

                    {automatedPosts.length === 0
                        ? (
                            <div className="text-slate-400 text-center py-16 italic border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                <div className="mb-4 text-slate-200 flex justify-center">
                                    <Zap className="w-8 h-8 opacity-20" />
                                </div>
                                <p className="text-[10px] uppercase tracking-widest px-8">
                                    {t.activity.empty}
                                </p>
                                <p className="text-[9px] mt-2 opacity-30">
                                    {t.console.awaitingSignal}
                                </p>
                            </div>
                        )
                        : (
                            <div className="space-y-3">
                                {automatedPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="group/item bg-slate-50/50 rounded-2xl p-4 border border-slate-100 hover:border-sky-100 transition-all hover:bg-white"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-sky-100 flex items-center justify-center border border-sky-200">
                                                    <Calendar className="w-3 h-3 text-sky-600" />
                                                </div>
                                                <span className="text-sky-600 font-bold">
                                                    {new Date(post.createdAt)
                                                        .toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "2-digit",
                                                                minute:
                                                                    "2-digit",
                                                            },
                                                        )}
                                                </span>
                                            </div>
                                            <span className="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                                {new Date(post.createdAt)
                                                    .toLocaleDateString(
                                                        undefined,
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                        },
                                                    )}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]">
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-slate-400 text-[10px] uppercase tracking-wide">
                                                    {t.console.outputGenerated}
                                                </p>
                                                <p className="text-slate-600 line-clamp-2 leading-relaxed italic text-[11px]">
                                                    "{post.params.topic}"
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onViewPost &&
                                                    onViewPost(post)}
                                                className="flex-1 h-9 rounded-xl bg-white border border-slate-200 hover:border-sky-200 text-[10px] font-bold text-slate-600 hover:text-sky-600 transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-sky-600 transition-colors" />
                                                {t.activity.viewOutput}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onDeletePost &&
                                                    onDeletePost(post.id)}
                                                className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center shadow-sm"
                                                title={language === "es"
                                                    ? "Eliminar"
                                                    : "Delete"}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    {isEnabled && (
                        <div className="pt-4 flex items-center gap-2 text-sky-600/50">
                            <span className="w-1.5 h-1.5 bg-sky-600/50 rounded-full animate-pulse">
                            </span>
                            <span className="animate-pulse">
                                {t.console.awaitingCycle}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AutoPilotActivityLog;
