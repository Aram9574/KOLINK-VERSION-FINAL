import React from 'react';
import { ArrowRight, Globe, ExternalLink } from 'lucide-react';
import { IdeaResult } from '../../../../services/geminiService';
import { AppLanguage } from '../../../../types';
import { translations } from '../../../../translations';

interface IdeaResultsProps {
    language: AppLanguage;
    ideas: IdeaResult | null;
    loading: boolean;
    onSelectIdea: (idea: string) => void;
}

const IdeaResults: React.FC<IdeaResultsProps> = ({ language, ideas, loading, onSelectIdea }) => {
    const t = translations[language].app.ideas;

    if (loading && !ideas) {
        return (
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 flex-1 w-full">
                <div className="grid md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse flex flex-col justify-center p-6 space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-100 rounded w-full"></div>
                            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                            <div className="mt-auto h-10 bg-slate-100 rounded-xl w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!ideas) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 flex-1 w-full">
            <div className="space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-500 pb-20">
                <div className="grid md:grid-cols-2 gap-6">
                    {ideas.ideas.map((idea, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-50 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>

                            <div className="mb-6 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                        {t.angle} {idx + 1}
                                    </span>
                                </div>
                                <p className="text-lg font-medium text-slate-800 leading-relaxed group-hover:text-slate-900 transition-colors">
                                    "{idea.replace(/"/g, '')}"
                                </p>
                            </div>
                            <button
                                onClick={() => onSelectIdea(idea)}
                                className="w-full py-3.5 bg-slate-50 text-slate-600 font-bold rounded-xl border border-slate-200 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                {t.useThis}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Grounding Sources - Only show if available */}
                {ideas.sources && ideas.sources.length > 0 && (
                    <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm relative overflow-hidden">

                        <div className="flex items-center gap-2 mb-4 relative z-10">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                <Globe className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{t.sources}</h4>
                                <p className="text-[10px] text-slate-500">{t.realTimeData}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
                            {ideas.sources.map((source, idx) => (
                                <a
                                    key={idx}
                                    href={source.uri}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex flex-col p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all h-full"
                                >
                                    <span className="text-xs font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                                        {source.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-auto pt-2">
                                        <ExternalLink className="w-3 h-3" />
                                        {new URL(source.uri).hostname}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IdeaResults;
