import React from 'react';
import { Lock, Sparkles, Check } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';

interface LockedAuditorStateProps {
    onUpgrade: () => void;
}

const LockedAuditorState: React.FC<LockedAuditorStateProps> = ({ onUpgrade }) => {
    const { language } = useUser();
    
    // Hardcoded translations for now if not in dictionary, or use English fallback
    const t = {
        title: language === 'es' ? 'Desbloquea el Auditor de Perfil AI' : 'Unlock AI Profile Auditor',
        subtitle: language === 'es' 
            ? 'Obtén análisis de nivel experto y estrategias probadas para multiplicar tu visibilidad.'
            : 'Get expert-level analysis and proven strategies to multiply your visibility.',
        features: [
            language === 'es' ? 'Análisis de los 3 Pilares de Ingeniería de Atención' : '3 Pillars of Attention Engineering Analysis',
            language === 'es' ? 'Puntuación Viral y Diagnóstico de Impacto' : 'Viral Score & Impact Diagnosis',
            language === 'es' ? 'Roadmap paso a paso para optimizar tu perfil' : 'Step-by-step roadmap to optimize your profile',
            language === 'es' ? 'Exportación a PDF profesional' : 'Professional PDF formatting'
        ],
        cta: language === 'es' ? 'Actualizar a Pro' : 'Upgrade to Pro'
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-6 relative group">
                <Lock className="w-10 h-10 text-brand-600 relative z-10" />
                <div className="absolute inset-0 bg-brand-400 opacity-20 rounded-full animate-ping group-hover:animate-none"></div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 border-4 border-white">
                    <Sparkles className="w-4 h-4 text-brand-900" />
                </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-3 font-outfit">
                {t.title}
            </h2>
            <p className="text-slate-600 max-w-lg text-lg mb-8 text-balance">
                {t.subtitle}
            </p>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 max-w-md w-full">
                <ul className="space-y-4 text-left">
                    {t.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700">
                            <div className="mt-0.5 min-w-5">
                                <Check className="w-5 h-5 text-brand-500" strokeWidth={3} />
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

export default LockedAuditorState;
