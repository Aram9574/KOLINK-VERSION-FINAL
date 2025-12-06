import React from 'react';
import { Target, Check, ArrowRight, User, Building2, Briefcase, UserPlus, Rocket } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';

interface OnboardingStep2Props {
    usageIntent: string[];
    toggleUsage: (id: string) => void;
    onNext: () => void;
}

const USAGE_INTENTS = [
    { id: 'personal_brand', icon: <User className="w-5 h-5" /> },
    { id: 'company', icon: <Building2 className="w-5 h-5" /> },
    { id: 'agency', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'sales', icon: <Target className="w-5 h-5" /> },
    { id: 'job_hunt', icon: <UserPlus className="w-5 h-5" /> },
    { id: 'content_creator', icon: <Rocket className="w-5 h-5" /> },
];

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ usageIntent, toggleUsage, onNext }) => {
    const { language } = useUser();
    const t = translations[language].onboarding.step2;

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-sm">
                    <Target className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">{t.title}</h2>
                <p className="text-slate-500">{t.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {USAGE_INTENTS.map((intent) => {
                    const isSelected = usageIntent.includes(intent.id);
                    const intentData = t.intents[intent.id as keyof typeof t.intents];

                    return (
                        <button
                            key={intent.id}
                            onClick={() => toggleUsage(intent.id)}
                            className={`p-4 rounded-xl border text-left transition-all duration-200 relative group
                      ${isSelected
                                    ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                                    <Check className="w-3 h-3 text-white stroke-[3]" />
                                </div>
                            )}
                            <div className={`mb-2 ${isSelected ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                {intent.icon}
                            </div>
                            <p className="text-sm font-bold mb-0.5">{intentData.label}</p>
                            <p className="text-xs opacity-70 font-medium">{intentData.desc}</p>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={onNext}
                disabled={usageIntent.length === 0}
                className="w-full mt-8 py-4 bg-brand-600 text-white font-bold rounded-xl shadow-xl shadow-brand-500/20 hover:bg-brand-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {t.next}
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default OnboardingStep2;
