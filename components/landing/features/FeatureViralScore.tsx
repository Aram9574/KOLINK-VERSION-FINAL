import React from "react";
import { BarChart3 } from "lucide-react";
import { AppLanguage } from "../../../types";
import { translations } from "../../../translations";

interface FeatureViralScoreProps {
    language: AppLanguage;
}

const FeatureViralScore: React.FC<FeatureViralScoreProps> = ({ language }) => {
    const t = translations[language];

    return (
        <div className="col-span-12 lg:col-span-6 bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-50 rounded-full blur-3xl group-hover:bg-green-100 transition-colors duration-500">
            </div>

            <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-7 h-7 fill-current" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {t.features.f3Title}
                </h3>
                <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                    {t.features.f3Desc}
                </p>

                {/* Viral Score Gauge Mockup */}
                <div className="mt-auto bg-slate-50 rounded-2xl p-5 border border-slate-100 group-hover:border-green-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {t.features.viralScore}
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse">
                            </div>
                            <span className="text-2xl font-bold text-slate-900">
                                94<span className="text-slate-400 text-sm">
                                    /100
                                </span>
                            </span>
                        </div>
                    </div>
                    {/* Progress Bar with Animation */}
                    <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden mb-6 relative">
                        <div className="absolute inset-0 bg-slate-200 w-full">
                        </div>
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 w-[94%] shadow-[0_0_15px_rgba(16,185,129,0.4)] relative rounded-full animate-[width_1s_ease-out]">
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]">
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100 group-hover:border-green-100 transition-colors">
                            <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                                {t.features.hooks}
                            </span>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-green-100 text-green-700 font-bold text-sm">
                                A+
                            </span>
                        </div>
                        <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100 group-hover:border-green-100 transition-colors">
                            <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                                {t.features.format}
                            </span>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-green-100 text-green-700 font-bold text-sm">
                                A
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureViralScore;
