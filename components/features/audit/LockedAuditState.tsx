import React from "react";
import { Crown, Lock, Search, Sparkles } from "lucide-react";
import { translations } from "../../../translations";
import { useUser } from "../../../context/UserContext";

interface LockedAuditStateProps {
    onUpgrade: () => void;
}

const LockedAuditState: React.FC<LockedAuditStateProps> = ({ onUpgrade }) => {
    const { language } = useUser();
    const t = translations[language].app.sidebar;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 m-4 lg:m-8 overflow-hidden relative group">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />

            <div className="relative z-10 max-w-md mx-auto">
                <div className="mb-8 relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-500/40 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <Search className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                        <Lock className="w-5 h-5 text-white fill-current" />
                    </div>
                </div>

                <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 tracking-tight">
                    {language === "es"
                        ? "Auditoría de Perfil Profesional"
                        : "Professional Profile Audit"}
                </h2>

                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    {language === "es"
                        ? "Optimiza tu perfil de LinkedIn con nuestra IA avanzada. Detecta brechas, mejora tu SEO y aumenta tu visibilidad ante reclutadores."
                        : "Optimize your LinkedIn profile with our advanced AI. Detect gaps, improve your SEO, and increase your visibility to recruiters."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
                    {[
                        {
                            es: "Análisis de SEO",
                            en: "SEO Analysis",
                            icon: (
                                <Sparkles className="w-4 h-4 text-brand-500" />
                            ),
                        },
                        {
                            es: "Optimización de Titular",
                            en: "Headline Optimization",
                            icon: (
                                <Sparkles className="w-4 h-4 text-brand-500" />
                            ),
                        },
                        {
                            es: "Detección de Brechas",
                            en: "Gap Detection",
                            icon: (
                                <Sparkles className="w-4 h-4 text-brand-500" />
                            ),
                        },
                        {
                            es: "Sugerencias de Contenido",
                            en: "Content Suggestions",
                            icon: (
                                <Sparkles className="w-4 h-4 text-brand-500" />
                            ),
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 bg-white/80 p-3 rounded-xl border border-slate-100 shadow-sm"
                        >
                            {feature.icon}
                            <span className="text-sm font-semibold text-slate-700">
                                {language === "es" ? feature.es : feature.en}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onUpgrade}
                    className="w-full py-4 px-8 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 group/btn"
                >
                    <Crown className="w-5 h-5 text-amber-400 fill-current" />
                    {t.upgradeNow}
                    <Sparkles className="w-5 h-5 text-amber-400 group-hover/btn:scale-125 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default LockedAuditState;
