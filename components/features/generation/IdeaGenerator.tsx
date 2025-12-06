import React from 'react';
import { UserProfile, AppLanguage } from '../../../types';
import { Rocket, Sparkles, Construction } from 'lucide-react';

interface IdeaGeneratorProps {
    user: UserProfile;
    language: AppLanguage;
    onSelectIdea: (idea: string) => void;
}

const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({ user, language }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl overflow-hidden relative">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 text-center max-w-md">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 mb-8">
                    <Rocket className="w-12 h-12 text-white animate-pulse" />
                </div>

                <div className="flex items-center justify-center space-x-2 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
                        {language === 'es' ? 'Próximamente' : 'Coming Soon'}
                    </span>
                    <Sparkles className="w-5 h-5 text-amber-400" />
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    {language === 'es' ? 'Generador de Ideas Viral 2.0' : 'Viral Idea Generator 2.0'}
                </h2>

                <p className="text-slate-600 mb-8 leading-relaxed">
                    {language === 'es'
                        ? 'Estamos afinando los últimos detalles de nuestro motor de IA (Gemini Pro 3) para traerte las ideas más explosivas del mercado.'
                        : 'We are fine-tuning our AI engine (Gemini Pro 3) to bring you the most explosive ideas in the market.'}
                </p>

                <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                    <Construction className="w-4 h-4 mr-2" />
                    {language === 'es' ? 'En construcción' : 'Under Construction'}
                </div>
            </div>
        </div>
    );
};

export default IdeaGenerator;