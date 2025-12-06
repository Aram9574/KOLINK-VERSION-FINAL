import React from 'react';
import { AppLanguage } from '../../../types';

interface AuthVisualsProps {
    language: AppLanguage;
}

const AuthVisuals: React.FC<AuthVisualsProps> = ({ language }) => {
    return (
        <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/50 to-indigo-900/50 z-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="relative z-20 max-w-lg text-center">
                <div className="mb-8 relative group w-full max-w-[420px] mx-auto perspective-1000">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 transform rotate-3 hover:rotate-0 transition-all duration-500">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-100">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                                <div className="text-slate-900 font-bold text-sm flex items-center gap-1">
                                    Alex Rivera <span className="text-slate-400 font-normal">• 1st</span>
                                </div>
                                <div className="text-slate-500 text-xs">Founder @ Kolink • 1h • 🌐</div>
                            </div>
                            <div className="ml-auto text-brand-600 font-semibold text-sm flex items-center gap-1">
                                + Follow
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-left space-y-3 mb-4">
                            <p className="text-slate-800 text-sm leading-relaxed">
                                Deja de mirar una página en blanco. 🛑
                            </p>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                La mayoría pierde 10 horas/semana pensando qué escribir.
                                <br />
                                Mientras tanto, el top 1% usa frameworks.
                            </p>
                            <p className="text-slate-800 text-sm font-medium">
                                El Framework PAS para viralidad:
                            </p>
                            <ul className="text-sm space-y-1">
                                <li className="text-slate-600"><span className="mr-1">❌</span> <span className="font-semibold text-slate-800">Problema:</span> El bloqueo mata el impulso.</li>
                                <li className="text-slate-600"><span className="mr-1">🔥</span> <span className="font-semibold text-slate-800">Agitación:</span> La inconsistencia mata el alcance.</li>
                                <li className="text-slate-600"><span className="mr-1">✅</span> <span className="font-semibold text-slate-800">Solución:</span> Usa estructuras probadas.</li>
                            </ul>
                            <div className="text-brand-600 text-xs font-semibold pt-1">
                                #GrowthHacking #LinkedInTips #AI
                            </div>
                        </div>

                        {/* Engagement */}
                        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1">
                                <div className="flex -space-x-1">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full border border-white flex items-center justify-center">👍</div>
                                    <div className="w-4 h-4 bg-red-500 rounded-full border border-white flex items-center justify-center">❤️</div>
                                    <div className="w-4 h-4 bg-green-500 rounded-full border border-white flex items-center justify-center">👏</div>
                                </div>
                                <span className="text-slate-600 font-medium ml-1">1,243</span>
                            </div>
                            <div className="text-slate-500">
                                89 comments • 12 reposts
                            </div>
                        </div>

                        {/* Floating Success Notification */}
                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-3 flex items-center gap-3 animate-in slide-in-from-right-8 duration-700 delay-500 border border-emerald-100">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                            </div>
                            <div className="text-left">
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Alcance Potencial</div>
                                <div className="text-emerald-600 font-bold text-sm">Alto Impacto 🚀</div>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">
                    {language === 'es' ? 'Domina LinkedIn con IA' : 'Master LinkedIn with AI'}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                    {language === 'es'
                        ? 'Únete a miles de creadores que usan Kolink para generar contenido viral, programar posts y crecer su audiencia en piloto automático.'
                        : 'Join thousands of creators using Kolink to generate viral content, schedule posts, and grow their audience on autopilot.'}
                </p>
            </div>
        </div>
    );
};

export default AuthVisuals;
