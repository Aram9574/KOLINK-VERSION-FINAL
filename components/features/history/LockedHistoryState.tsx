import React from 'react';
import { Lock, History, Check, LineChart } from 'lucide-react';
import { useUser } from '../../../context/UserContext';

interface LockedHistoryStateProps {
    onUpgrade: () => void;
}

const LockedHistoryState: React.FC<LockedHistoryStateProps> = ({ onUpgrade }) => {
    const { language } = useUser();
    
    // Using blue/indigo theme for history/analytics
    const t = {
        title: language === 'es' ? 'Accede a tu Historial Ilimitado' : 'Access Unlimited History',
        subtitle: language === 'es' 
            ? 'No pierdas tus mejores ideas. Recupera, analiza y reutiliza tu contenido pasado.'
            : 'Don\'t lose your best ideas. Retrieve, analyze, and repurpose your past content.',
        features: [
            language === 'es' ? 'Archivo completo de posts' : 'Complete post archive',
            language === 'es' ? 'Análisis de rendimiento viral' : 'Viral performance analytics',
            language === 'es' ? 'Reutilización de contenido en 1 clic' : '1-click content repurposing',
            language === 'es' ? 'Exportación de datos' : 'Data export'
        ],
        cta: language === 'es' ? 'Ver mis Estadísticas' : 'View My Stats'
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 relative group">
                <Lock className="w-10 h-10 text-blue-600 relative z-10" />
                <div className="absolute inset-0 bg-blue-400 opacity-20 rounded-full animate-ping group-hover:animate-none"></div>
                <div className="absolute -top-2 -right-2 bg-indigo-500 rounded-full p-2 border-4 border-white">
                    <LineChart className="w-4 h-4 text-white" />
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
                        <li key={i} className="flex items-start gap-3 text-slate-700">
                            <div className="mt-0.5 min-w-5">
                                <Check className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
                            </div>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={onUpgrade}
                className="group relative px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                <div className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    {t.cta}
                </div>
            </button>
        </div>
    );
};

export default LockedHistoryState;
