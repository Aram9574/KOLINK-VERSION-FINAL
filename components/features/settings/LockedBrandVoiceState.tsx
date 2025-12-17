import React from 'react';
import { Lock, Mic, Check, Zap } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';

interface LockedBrandVoiceStateProps {
    onUpgrade: () => void;
}

const LockedBrandVoiceState: React.FC<LockedBrandVoiceStateProps> = ({ onUpgrade }) => {
    const { language } = useUser();
    
    // Using amber theme for brand voice (creativity)
    const t = {
        title: language === 'es' ? 'Clona tu Voz de Marca' : 'Clone Your Brand Voice',
        subtitle: language === 'es' 
            ? 'Entrena a la IA para escribir exactamente como tú. Coherencia total, cero esfuerzo.'
            : 'Train AI to write exactly like you. Total consistency, zero effort.',
        features: [
            language === 'es' ? 'Análisis de estilo de escritura con IA' : 'AI writing style analysis',
            language === 'es' ? 'Voces ilimitadas (Personal, Empresa, etc.)' : 'Unlimited voices (Personal, Company, etc.)',
            language === 'es' ? 'Detección automática de tono y matices' : 'Auto-detection of tone and nuance',
            language === 'es' ? 'Aplicable a todos los formatos virales' : 'Applies to all viral formats'
        ],
        cta: language === 'es' ? 'Crear mi Voz Digital' : 'Create My Digital Voice'
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-5 relative group">
                <Lock className="w-8 h-8 text-amber-600 relative z-10" />
                <div className="absolute inset-0 bg-amber-400 opacity-20 rounded-full animate-ping group-hover:animate-none"></div>
                <div className="absolute -top-1.5 -right-1.5 bg-orange-500 rounded-full p-1.5 border-2 border-white">
                    <Mic className="w-3 h-3 text-white" />
                </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">
                {t.title}
            </h3>
            <p className="text-slate-500 max-w-md text-sm mb-6 text-balance leading-relaxed">
                {t.subtitle}
            </p>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6 max-w-sm w-full">
                <ul className="space-y-3 text-left">
                    {t.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-slate-600 text-sm">
                            <div className="mt-0.5 min-w-4">
                                <Check className="w-4 h-4 text-amber-500" strokeWidth={3} />
                            </div>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={onUpgrade}
                className="group relative px-6 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-all shadow-md hover:shadow-amber-500/20 hover:-translate-y-0.5 overflow-hidden w-full sm:w-auto"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    {t.cta}
                </div>
            </button>
        </div>
    );
};

export default LockedBrandVoiceState;
