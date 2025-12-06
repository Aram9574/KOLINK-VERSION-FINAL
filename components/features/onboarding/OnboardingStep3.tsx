import React from 'react';
import { Globe, Check, ArrowRight, MessageCircle, Users, Youtube, Search } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';

interface OnboardingStep3Props {
    selectedSources: string[];
    toggleSource: (id: string) => void;
    onNext: () => void;
}

const SOURCES = [
    { id: 'linkedin', icon: <Globe className="w-5 h-5" /> },
    { id: 'twitter', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'friend', icon: <Users className="w-5 h-5" /> },
    { id: 'youtube', icon: <Youtube className="w-5 h-5" /> },
    { id: 'google', icon: <Search className="w-5 h-5" /> },
    { id: 'other', icon: <ArrowRight className="w-5 h-5" /> },
];

const OnboardingStep3: React.FC<OnboardingStep3Props> = ({ selectedSources, toggleSource, onNext }) => {
    const { language } = useUser();
    const t = translations[language].onboarding.step3;

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-sm">
                    <Globe className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">{t.title}</h2>
                <p className="text-slate-500">{t.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {SOURCES.map((source) => {
                    const isSelected = selectedSources.includes(source.id);
                    const label = t.sources[source.id as keyof typeof t.sources];

                    return (
                        <button
                            key={source.id}
                            onClick={() => toggleSource(source.id)}
                            className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col items-center justify-center gap-2 relative
                      ${isSelected
                                    ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white stroke-[3]" />
                                </div>
                            )}
                            <div className={`${isSelected ? 'text-brand-600' : 'text-slate-400'}`}>
                                {source.icon}
                            </div>
                            <span className="text-sm font-bold">{label}</span>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={onNext}
                disabled={selectedSources.length === 0}
                className="w-full mt-8 py-4 bg-brand-600 text-white font-bold rounded-xl shadow-xl shadow-brand-500/20 hover:bg-brand-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {t.start}
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default OnboardingStep3;
