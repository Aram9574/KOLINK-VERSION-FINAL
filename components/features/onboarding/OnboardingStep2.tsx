import React from 'react';
import { Target, Check, ArrowRight, User, Building2, Briefcase, UserPlus, Rocket } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';
import { motion, AnimatePresence } from 'framer-motion';

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
                <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-sm">
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
                        <motion.button
                            key={intent.id}
                            whileHover={{ y: -2, backgroundColor: 'var(--slate-50)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleUsage(intent.id)}
                            className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group
                      ${isSelected
                                    ? 'bg-brand-50 border-brand-500 text-brand-700 ring-4 ring-brand-500/10 shadow-sm'
                                    : 'bg-white border-slate-200/60 text-slate-600 hover:border-slate-300'}`}
                        >
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        className="absolute top-3 right-3 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/20"
                                    >
                                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className={`mb-3 p-2 w-fit rounded-lg transition-colors ${isSelected ? 'bg-brand-100 text-brand-600' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
                                {intent.icon}
                            </div>
                            <p className="text-sm font-bold mb-1">{intentData.label}</p>
                            <p className="text-xs opacity-70 font-medium leading-relaxed">{intentData.desc}</p>
                        </motion.button>
                    );
                })}
            </div>

            <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNext}
                disabled={usageIntent.length === 0}
                className="w-full mt-10 py-5 bg-brand-600 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/25 hover:bg-brand-700 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
                {t.next}
                <ArrowRight className="w-5 h-5" />
            </motion.button>
        </div>
    );
};

export default OnboardingStep2;
