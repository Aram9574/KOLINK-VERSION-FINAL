import React from "react";
import { BrainCircuit, Check, Fingerprint } from "lucide-react";
import { AppLanguage } from "../../../types";
import { translations } from "../../../translations";

interface FeatureBrandVoiceProps {
    language: AppLanguage;
}

const FeatureBrandVoice: React.FC<FeatureBrandVoiceProps> = ({ language }) => {
    const t = translations[language];

    return (
        <div className="col-span-12 lg:col-span-6 bg-gradient-to-br from-indigo-700 to-purple-800 text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group shadow-2xl shadow-indigo-900/20 ring-1 ring-white/10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 mix-blend-overlay">
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md border border-white/20 shadow-lg shadow-indigo-500/20">
                        <Fingerprint className="w-7 h-7" />
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-2">
                        <BrainCircuit className="w-3 h-3 text-purple-300" />
                        <span className="text-purple-100">
                            {t.features.brandVoice.aiModel}
                        </span>
                    </div>
                </div>

                <h3 className="text-2xl font-bold mb-4">
                    {t.features.f2Title}
                </h3>
                <p className="text-indigo-100/80 leading-relaxed mb-8 text-lg">
                    {t.features.f2Desc}
                </p>

                {/* Visual Mock: Input -> AI -> Output */}
                <div className="space-y-4 bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                    <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
                            {t.features.brandVoice.you}
                        </div>
                        <div className="flex-1 flex gap-1 items-center h-8">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-white/20 rounded-full animate-pulse"
                                    style={{
                                        height: Math.random() * 16 + 8 + "px",
                                        animationDelay: i * 0.1 + "s",
                                    }}
                                >
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/30 shrink-0">
                            AI
                        </div>
                        <div className="h-0.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-1/2 bg-purple-400 rounded-full animate-[width_2s_ease-in-out_infinite]">
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-white text-indigo-700 flex items-center justify-center font-bold shadow-lg shrink-0 border-2 border-indigo-100">
                            <Check className="w-4 h-4" />
                        </div>
                        <div className="px-3 py-2 bg-white text-indigo-900 text-xs font-medium rounded-lg shadow-sm flex-1">
                            {t.features.brandVoice.match}{" "}
                            <span className="text-green-500 font-bold ml-1">
                                99%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureBrandVoice;
