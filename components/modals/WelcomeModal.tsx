import React from 'react';
import { UserProfile } from '../../types';
import { ArrowRight, X } from 'lucide-react';
import { translations } from '../../translations';

interface WelcomeModalProps {
    user: UserProfile;
    onStartTour: () => void;
    onSkip: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ user, onStartTour, onSkip }) => {
    // Determine language (default to en)
    const lang = user.language || 'en';
    
    // Labels based on language
    const content = lang === 'es' ? {
        title: `¡Hola ${user.name.split(' ')[0]}! 👋`,
        subtitle: "Bienvenido a KOLINK",
        description: "Estás a punto de desatar tu potencial viral en LinkedIn. Déjame enseñarte las herramientas clave para empezar.",
        start: "Empezar Tour Rápido",
        skip: "Saltar introducción"
    } : {
        title: `Hello ${user.name.split(' ')[0]}! 👋`,
        subtitle: "Welcome to KOLINK",
        description: "You're about to unleash your viral potential on LinkedIn. Let me show you the key tools to get started.",
        start: "Start Quick Tour",
        skip: "Skip introduction"
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-500" />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-8 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 text-center border border-slate-200/60/60">
                
                {/* Decorative Icon Blob */}
                <div className="mx-auto mb-6 w-20 h-20 bg-brand-50 rounded-xl flex items-center justify-center relative">
                     <div className="absolute inset-0 bg-brand-100/50 rounded-xl blur-xl animate-pulse"></div>
                     <span className="text-4xl relative z-10">🚀</span>
                </div>

                <div className="space-y-2 mb-8">
                     <h2 className="text-3xl font-display font-bold text-slate-900">
                         {content.title}
                     </h2>
                     <p className="text-brand-600 font-medium tracking-wide uppercase text-xs">
                         {content.subtitle}
                     </p>
                     <p className="text-slate-500 text-lg leading-relaxed mt-4">
                         {content.description}
                     </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onStartTour}
                        className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-brand-500/25 hover:-translate-y-0.5"
                    >
                        {content.start}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    <button
                        onClick={onSkip}
                        className="w-full py-3 text-slate-400 font-medium text-sm hover:text-slate-600 transition-colors"
                    >
                        {content.skip}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
