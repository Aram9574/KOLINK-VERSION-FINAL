import React from 'react';
import { Bot, X as XIcon, Sparkles, Check, CheckCircle2, TrendingUp, MoreHorizontal } from 'lucide-react';
import { translations } from '../../translations.ts';
import { AppLanguage } from '../../types.ts';

interface MockContent {
    badPost: string;
    goodPostHook: string;
    goodPostBody: string;
}

interface ComparisonSectionProps {
    language: AppLanguage;
    mockContent: MockContent;
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ language, mockContent }) => {
    const t = translations[language];

    return (
        <section className="py-32 bg-transparent overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">{t.comparison.title}</h2>
                    <p className="text-slate-500 text-xl">{t.comparison.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch relative">

                    {/* Floating VS Badge */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-xl border-4 border-slate-50 font-black text-slate-900 text-lg">
                        VS
                    </div>

                    {/* Generic AI Card */}
                    <div className="card-premium p-8 lg:p-10 flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                        <div className="mb-8 relative z-10">
                            <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 mb-6 shadow-sm">
                                <Bot className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-700 mb-2">{t.comparison.genericHeader}</h3>
                            <p className="text-slate-500">{t.comparison.genericSub}</p>
                        </div>

                        {/* Visual Abstract: Bad Post */}
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-8 relative">
                            {/* User Header */}
                            <div className="flex items-center gap-3 mb-3 opacity-50">
                                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                                <div className="h-2 w-20 bg-slate-200 rounded"></div>
                            </div>
                            {/* Wall of Text */}
                            <p className="text-xs text-slate-500 leading-relaxed text-justify line-clamp-6">
                                {mockContent.badPost}
                            </p>
                            {/* Badge Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-[1px]">
                                <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100 text-xs font-bold flex items-center gap-1.5 shadow-sm transform -rotate-6">
                                    <XIcon className="w-3.5 h-3.5" />
                                    {t.comparison.genericVisualLabel}
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto space-y-4">
                            <div className="flex items-start gap-3 text-slate-500">
                                <XIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="block font-bold text-slate-700 text-sm">{t.features.roboticTone}</span>
                                    <span className="text-xs">{t.comparison.toneBad}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-slate-500">
                                <XIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="block font-bold text-slate-700 text-sm">{t.features.zeroStructure}</span>
                                    <span className="text-xs">{t.comparison.hookBad}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-slate-500">
                                <XIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="block font-bold text-slate-700 text-sm">{t.features.hardToPrompt}</span>
                                    <span className="text-xs">{t.comparison.promptBad}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolink Card - UPDATED: White background with gradient glow instead of dark theme */}
                    <div className="card-premium p-8 lg:p-10 flex flex-col relative overflow-hidden shadow-2xl shadow-brand-900/10 group ring-4 ring-brand-50">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-100/50 to-indigo-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="mb-8 relative z-10">
                            {/* Updated Bubble Color - Lighter Style */}
                            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
                                <Sparkles className="w-7 h-7 fill-current" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.comparison.kolinkHeader}</h3>
                            <p className="text-slate-500">{t.comparison.kolinkSub}</p>
                        </div>

                        {/* Visual Abstract: Structured Post (Sneak Peek) */}
                        <div className="bg-white rounded-xl border border-indigo-50 p-5 mb-8 shadow-xl shadow-indigo-100/50 relative overflow-hidden group-hover:-translate-y-1 transition-transform duration-500">
                            {/* Decoration */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-brand-50 to-transparent rounded-bl-full pointer-events-none"></div>

                            {/* User Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src="https://picsum.photos/seed/alex/100/100" alt="User" className="w-8 h-8 rounded-full border border-indigo-100" />
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-bold text-slate-900">Alex Rivera</span>
                                            <div className="w-3 h-3 bg-brand-500 rounded-full flex items-center justify-center">
                                                <Check className="w-2 h-2 text-white stroke-[3]" />
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-slate-400">1h • 🌐</div>
                                    </div>
                                </div>
                                <MoreHorizontal className="w-4 h-4 text-slate-400" />
                            </div>

                            {/* Structured Content */}
                            <div className="space-y-3">
                                <p className="text-sm font-bold text-slate-900 leading-snug">
                                    {mockContent.goodPostHook}
                                </p>
                                <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                                    {mockContent.goodPostBody}
                                </div>

                                {/* Visual List */}
                                <div className="space-y-1.5 mt-2 pl-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                                        <span className="text-green-500">✅</span> {t.comparison.visualList1}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                                        <span className="text-green-500">✅</span> {t.comparison.visualList2}
                                    </div>
                                </div>
                            </div>

                            {/* Engagement Fake Stats */}
                            <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between text-[10px] text-slate-400 font-medium">
                                <div className="flex items-center gap-1">
                                    <div className="flex -space-x-1">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                                        <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                                    </div>
                                    <span>1,420 likes</span>
                                </div>
                                <span>84 comments</span>
                            </div>

                            {/* Floating Success Badge */}
                            <div className="absolute bottom-16 right-4 bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100 text-[10px] font-bold flex items-center gap-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 translate-y-2 group-hover:translate-y-0 transform">
                                <TrendingUp className="w-3 h-3" /> {t.comparison.viralBadge}
                            </div>
                        </div>

                        <div className="mt-auto space-y-4 relative z-10">
                            <div className="flex items-start gap-3">
                                <div className="p-0.5 bg-brand-100 rounded-full text-brand-600 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900 text-sm">{t.comparison.feature1Title}</span>
                                    <span className="text-xs text-slate-500">{t.comparison.toneGood}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-0.5 bg-brand-100 rounded-full text-brand-600 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900 text-sm">{t.comparison.feature2Title}</span>
                                    <span className="text-xs text-slate-500">{t.comparison.hookGood}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-0.5 bg-brand-100 rounded-full text-brand-600 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900 text-sm">{t.comparison.feature3Title}</span>
                                    <span className="text-xs text-slate-500">{t.comparison.promptGood}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ComparisonSection;
