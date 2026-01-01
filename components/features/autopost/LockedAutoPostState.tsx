import React from 'react';
import { Lock, Zap, Check, Rocket } from 'lucide-react';
import { useUser } from '../../../context/UserContext';

interface LockedAutoPostStateProps {
    onUpgrade: () => void;
}

const LockedAutoPostState: React.FC<LockedAutoPostStateProps> = ({ onUpgrade }) => {
    const { language } = useUser();
    
    const t = {
        title: language === 'es' ? 'Activa el Piloto Automático' : 'Activate AutoPost',
        subtitle: language === 'es' 
            ? 'Deja que la IA gestione tu presencia en LinkedIn 24/7. Programa, publica y crece mientras duermes.'
            : 'Let AI manage your LinkedIn presence 24/7. Schedule, post, and grow while you sleep.',
        features: [
            language === 'es' ? 'Programación inteligente de contenido' : 'Smart content scheduling',
            language === 'es' ? 'Generación automática basada en tendencias' : 'Auto-generation based on trends',
            language === 'es' ? 'Mantenimiento de racha diario' : 'Daily streak maintenance',
            language === 'es' ? 'Ahorra +10 horas semanales' : 'Save +10 hours weekly'
        ],
        cta: language === 'es' ? 'Desbloquear AutoPost' : 'Unlock AutoPost'
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 relative group">
                <Lock className="w-10 h-10 text-purple-600 relative z-10" />
                <div className="absolute inset-0 bg-purple-400 opacity-20 rounded-full animate-ping group-hover:animate-none"></div>
                <div className="absolute -top-2 -right-2 bg-brand-400 rounded-full p-2 border-4 border-white">
                    <Rocket className="w-4 h-4 text-white" />
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
                                <Check className="w-5 h-5 text-purple-500" strokeWidth={3} />
                            </div>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={onUpgrade}
                className="group relative px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    {t.cta}
                </div>
            </button>
        </div>
    );
};

export default LockedAutoPostState;
