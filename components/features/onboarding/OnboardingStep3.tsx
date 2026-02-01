import React from 'react';
import { Globe, Check, ArrowRight, MessageCircle, Users, Youtube, Search, Rocket } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';
import { motion, AnimatePresence } from 'framer-motion';

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
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-sm">
                    <Globe className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">{t.title}</h2>
                <p className="text-slate-500">{t.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SOURCES.map((source) => {
                    const isSelected = selectedSources.includes(source.id);
                    const label = t.sources[source.id as keyof typeof t.sources];

                    return (
                        <motion.button
                            key={source.id}
                            whileHover={{ y: -2, backgroundColor: 'var(--slate-50)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleSource(source.id)}
                            className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col items-center justify-center gap-2 relative group
                      ${isSelected
                                    ? 'bg-brand-50 border-brand-500 text-brand-700 ring-4 ring-brand-500/10'
                                    : 'bg-white border-slate-200/60 text-slate-600 hover:border-slate-300'}`}
                        >
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute top-2 right-2 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center shadow-md shadow-brand-500/20"
                                    >
                                        <Check className="w-3 h-3 text-white stroke-[3]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-brand-100 text-brand-600' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
                                {source.icon}
                            </div>
                            <span className="text-xs font-bold text-center">{label}</span>
                        </motion.button>
                    );
                })}
            </div>

            <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNext}
                disabled={selectedSources.length === 0}
                className="w-full mt-10 py-5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/25 hover:from-brand-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
                {t.start}
                <Rocket className="w-5 h-5" />
            </motion.button>
        </div>
    );
};

export default OnboardingStep3;
