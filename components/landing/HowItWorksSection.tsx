import React from 'react';
import { PenTool, Cpu, Rocket, TrendingUp } from 'lucide-react';
import { translations } from '../../translations';
import { AppLanguage } from '../../types';

interface HowItWorksSectionProps {
    language: AppLanguage;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ language }) => {
    const t = translations[language];

    return (
        <section id="howitworks" className="py-32 bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-40 left-0 w-96 h-96 bg-brand-100/50 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob"></div>
                <div className="absolute bottom-40 right-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">{t.howItWorks.title}</h2>
                    <p className="text-slate-500 text-xl leading-relaxed">{t.howItWorks.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative items-start">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-24 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-200 to-transparent dashed-line -z-10 opacity-50"></div>

                    {/* Step 1: Input */}
                    <div className="relative group">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-brand-900/5 hover:shadow-2xl hover:shadow-brand-900/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                            {/* Visual Mockup: Input UI */}
                            <div className="h-48 bg-slate-50 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden border border-slate-100 group-hover:border-brand-100 transition-colors">
                                <div className="absolute inset-x-6 top-10 bottom-0 bg-white rounded-t-xl border border-slate-200 shadow-sm p-4">
                                    <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
                                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Tema o Idea</div>
                                            <div className="h-8 w-full bg-slate-50 rounded border border-slate-200 flex items-center px-2 text-xs text-slate-600 font-medium">
                                                Cómo la IA revoluciona el copy...
                                            </div>
                                        </div>
                                        <div className="h-8 w-full bg-brand-600 rounded flex items-center justify-center text-white text-xs font-bold shadow-md shadow-brand-500/20 hover:bg-brand-700 transition-colors cursor-pointer">
                                            Generar Ideas ✨
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-8 right-8 text-6xl font-black text-slate-100 -z-10 select-none font-display">01</div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{t.howItWorks.step1Title}</h3>
                            <p className="text-slate-500 leading-relaxed">
                                {t.howItWorks.step1Desc}
                            </p>
                        </div>
                    </div>

                    {/* Step 2: Process */}
                    <div className="relative group">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                            {/* Visual Mockup: Framework Selection */}
                            <div className="h-48 bg-indigo-50/50 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden border border-indigo-100/50 group-hover:border-indigo-200 transition-colors">
                                <div className="absolute inset-x-6 top-10 bottom-0 bg-white rounded-t-xl border border-slate-200 shadow-sm p-4">
                                    <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
                                        <div className="text-[10px] font-bold text-slate-400">Elige Estructura</div>
                                        <div className="w-12 h-1.5 bg-indigo-100 rounded-full"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-indigo-50 border-2 border-indigo-500 rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer">
                                            <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[8px]">⚡</div>
                                            <div className="text-[8px] font-bold text-indigo-700">Viral</div>
                                        </div>
                                        <div className="bg-white border border-slate-100 rounded p-2 flex flex-col items-center justify-center gap-1 opacity-60 hover:opacity-100 hover:border-slate-200 transition-all cursor-pointer">
                                            <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[8px]">📖</div>
                                            <div className="text-[8px] font-bold text-slate-500">Historia</div>
                                        </div>
                                        <div className="bg-white border border-slate-100 rounded p-2 flex flex-col items-center justify-center gap-1 opacity-60">
                                            <div className="text-[8px]">🤔</div>
                                            <div className="text-[8px] font-bold text-slate-500">Mito</div>
                                        </div>
                                        <div className="bg-white border border-slate-100 rounded p-2 flex flex-col items-center justify-center gap-1 opacity-60">
                                            <div className="text-[8px]">📊</div>
                                            <div className="text-[8px] font-bold text-slate-500">Guía</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-8 right-8 text-6xl font-black text-slate-100 -z-10 select-none font-display">02</div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{t.howItWorks.step2Title}</h3>
                            <p className="text-slate-500 leading-relaxed">
                                {t.howItWorks.step2Desc}
                            </p>
                        </div>
                    </div>

                    {/* Step 3: Result */}
                    <div className="relative group">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-green-900/5 hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                            {/* Visual Mockup: Final Post */}
                            <div className="h-48 bg-green-50/30 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden border border-green-100/50 group-hover:border-green-200 transition-colors">
                                <div className="absolute inset-x-8 top-8 bottom-0 bg-white rounded-t-xl border border-slate-200 shadow-sm p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64&q=80" className="w-full h-full object-cover opacity-80" alt="avatar" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-1.5 w-12 bg-slate-300 rounded"></div>
                                            <div className="h-1 w-8 bg-slate-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 mb-3">
                                        <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                                        <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                                        <div className="h-1.5 w-3/4 bg-slate-200 rounded"></div>
                                    </div>
                                    <div className="h-7 w-full bg-[#0A66C2] rounded flex items-center justify-center text-white text-[10px] font-bold shadow-sm hover:bg-[#004182] transition-colors cursor-pointer">
                                        Publicar en LinkedIn
                                    </div>
                                </div>

                                {/* Viral Badge */}
                                <div className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded-full shadow-md border border-green-100 flex items-center gap-1 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="text-[10px]">🚀</span>
                                    <span className="text-[10px] font-bold text-green-600">Listo para Viralizar</span>
                                </div>
                            </div>

                            <div className="absolute top-8 right-8 text-6xl font-black text-slate-100 -z-10 select-none font-display">03</div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{t.howItWorks.step3Title}</h3>
                            <p className="text-slate-500 leading-relaxed">
                                {t.howItWorks.step3Desc}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
