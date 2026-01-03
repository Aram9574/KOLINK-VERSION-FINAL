import React from "react";
import { Check, Layers, Lock, Sparkles } from "lucide-react";
import { useUser } from "../../../context/UserContext";
// import { translations } from '../../../translations';

interface LockedCarouselStateProps {
    onUpgrade: () => void;
}

const LockedCarouselState: React.FC<LockedCarouselStateProps> = (
    { onUpgrade },
) => {
    const { language } = useUser();

    const t = {
        title: language === "es"
            ? "Estudio de Carruseles Viral"
            : "Viral Carousel Studio",
        subtitle: language === "es"
            ? "Convierte cualquier texto o idea en carruseles de LinkedIn de alto impacto visual en segundos."
            : "Convert any text or idea into high-impact visual LinkedIn carousels in seconds.",
        features: [
            language === "es"
                ? "Generación IA a partir de texto o borrador"
                : "AI Generation from text or draft",
            language === "es"
                ? "Plantillas virales probadas"
                : "Proven viral templates",
            language === "es"
                ? "Exportación PDF de alta resolución"
                : "High-resolution PDF export",
            language === "es"
                ? "Personalización de marca completa"
                : "Full brand customization",
        ],
        cta: language === "es" ? "Desbloquear Studio" : "Unlock Studio",
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-6 relative group">
                <Lock className="w-10 h-10 text-brand-600 relative z-10" />
                <div className="absolute inset-0 bg-brand-400 opacity-20 rounded-full animate-ping group-hover:animate-none">
                </div>
                <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-2 border-4 border-white">
                    <Layers className="w-4 h-4 text-white" />
                </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-3 font-outfit">
                {t.title}
            </h2>
            <p className="text-slate-600 max-w-lg text-lg mb-8 text-balance">
                {t.subtitle}
            </p>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/60/60 mb-8 max-w-md w-full">
                <ul className="space-y-4 text-left">
                    {t.features.map((feature, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-3 text-slate-700"
                        >
                            <div className="mt-0.5 min-w-5">
                                <Check
                                    className="w-5 h-5 text-brand-500"
                                    strokeWidth={1.5}
                                />
                            </div>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={onUpgrade}
                className="group relative px-8 py-4 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/30 hover:-translate-y-1 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {t.cta}
                </div>
            </button>
        </div>
    );
};

export default LockedCarouselState;
