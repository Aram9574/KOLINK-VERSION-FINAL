import React from "react";
import { Check, CheckCircle2, Send, Target } from "lucide-react";
import { AppLanguage } from "../../../types";
import { translations } from "../../../translations";

interface FeatureWorkflowProps {
    language: AppLanguage;
}

const FeatureWorkflow: React.FC<FeatureWorkflowProps> = ({ language }) => {
    const t = translations[language];

    return (
        <div className="col-span-12 lg:col-span-12 bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:rotate-12 transition-transform">
                    <Target className="w-7 h-7 fill-current" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {t.features.speedTitle}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-8 text-lg">
                    {t.features.speedDesc}
                </p>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-amber-50/50 group-hover:border-amber-100 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-700">
                            {t.features.noWritersBlock}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-amber-50/50 group-hover:border-amber-100 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-700">
                            {t.features.mobileOptimized}
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-1/2 bg-slate-50/80 rounded-3xl border border-slate-100 p-6 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,transparent)]">
                </div>

                {/* Timeline Mock */}
                <div className="space-y-6 relative z-10">
                    <div className="flex gap-4 items-start opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-500">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex shrink-0 flex items-center justify-center text-xs font-bold text-slate-400 shadow-sm">
                                1
                            </div>
                            <div className="w-0.5 h-full bg-slate-200"></div>
                        </div>
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 w-full mt-1">
                            <div className="h-2 w-1/3 bg-slate-200 rounded mb-2">
                            </div>
                            <div className="h-2 w-2/3 bg-slate-100 rounded">
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white flex shrink-0 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 z-10">
                                <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-lg border border-amber-100 w-full animate-in slide-in-from-bottom-2 duration-700">
                            <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
                                <div className="h-2 w-20 bg-amber-100 rounded-full">
                                </div>
                                <span className="text-[10px] uppercase font-bold text-amber-500">
                                    {t.features.readyToPost}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-100 rounded-full">
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full">
                                </div>
                                <div className="h-2 w-3/4 bg-slate-100 rounded-full">
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                    <Send className="w-3 h-3" /> Post
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureWorkflow;
