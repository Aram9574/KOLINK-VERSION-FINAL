import React from 'react';
import { AppLanguage } from '../../../types';

interface AuthVisualsProps {
    language: AppLanguage;
}

const AuthVisuals: React.FC<AuthVisualsProps> = ({ language }) => {
    return (
        <div className="hidden lg:flex flex-1 bg-[#0B1120] relative overflow-hidden items-center justify-center p-16">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/30 rounded-full blur-[128px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[128px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 w-full max-w-xl">
                {/* Main Visual */}
                <div className="relative mb-12 group perspective-1000">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl transform transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1">
                        
                        {/* Abstract AI UI */}
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                                        AI
                                    </div>
                                    <div>
                                        <div className="text-white font-medium text-sm">Kolink Engine v4</div>
                                        <div className="text-slate-400 text-xs">Viral Architecture Optimized</div>
                                    </div>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                                </div>
                            </div>

                            {/* Analyzing Animation */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs text-slate-400 uppercase tracking-widest font-semibold">
                                    <span>{language === 'es' ? 'Analizando Tendencias' : 'Analyzing Trends'}</span>
                                    <span className="text-brand-400">98%</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-[98%] bg-gradient-to-r from-brand-500 to-indigo-400 rounded-full animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>

                            {/* Generated Content Blurb */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                                <div className="flex gap-2">
                                    <div className="w-16 h-2 bg-slate-700 rounded-full" />
                                    <div className="w-8 h-2 bg-slate-800 rounded-full" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-full h-2 bg-slate-700/50 rounded-full" />
                                    <div className="w-[90%] h-2 bg-slate-700/50 rounded-full" />
                                    <div className="w-[75%] h-2 bg-slate-700/50 rounded-full" />
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -right-6 top-20 bg-white shadow-xl rounded-lg p-3 flex items-center gap-3 animate-in slide-in-from-left-4 fade-in duration-1000 delay-300 border border-slate-100">
                                <div className="p-2 bg-emerald-50 rounded-md text-emerald-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase">Engagement</div>
                                    <div className="text-slate-900 font-bold text-sm">+340% Boost</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                        {language === 'es' ? 'Tu ventaja injusta.' : 'Your unfair advantage.'}
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
                        {language === 'es'
                            ? 'El sistema impulsado por IA que convierte a profesionales en líderes de opinión.'
                            : 'The AI-powered system that turns professionals into thought leaders.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthVisuals;
