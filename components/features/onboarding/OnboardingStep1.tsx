import React from 'react';
import { User, Briefcase, ArrowRight, CheckCircle2, Users2 } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep1Props {
    fullName: string;
    setFullName: (value: string) => void;
    jobTitle: string;
    setJobTitle: (value: string) => void;
    onNext: () => void;
}

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({
    fullName,
    setFullName,
    jobTitle,
    setJobTitle,
    onNext
}) => {
    const { language } = useUser();
    const t = translations[language].onboarding.step1;

    const isNameValid = fullName.trim().length > 3 && fullName.includes(' ');
    const isJobValid = jobTitle.trim().length > 2;
    const canProceed = fullName.trim() !== '' && jobTitle.trim() !== '';

    return (
        <div className="flex flex-col h-full">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-brand-600 shadow-sm border border-brand-100/50">
                    <User className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">
                    {t.title}
                </h2>
                <div className="flex items-center justify-center gap-2 py-1 px-3 bg-slate-50 w-fit mx-auto rounded-full border border-slate-100">
                    <Users2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.socialProof}</span>
                </div>
            </div>

            <div className="space-y-6 flex-1">
                {/* Full Name Field */}
                <div className="space-y-2.5 group">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.fullName}</label>
                        <AnimatePresence>
                            {isNameValid && (
                                <motion.span 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-emerald-500 flex items-center gap-1 text-[10px] font-bold"
                                >
                                    <CheckCircle2 className="w-3 h-3" />
                                    ¡Genial!
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            className={`w-full p-4.5 bg-white border rounded-2xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-slate-900 font-semibold placeholder:text-slate-300 placeholder:font-medium
                            ${isNameValid ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200/60 focus:border-brand-500'}`}
                            placeholder={t.fullNamePlaceholder}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Job Title Field */}
                <div className="space-y-2.5 group">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.jobTitle}</label>
                        <AnimatePresence>
                            {isJobValid && (
                                <motion.span 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-emerald-500 flex items-center gap-1 text-[10px] font-bold"
                                >
                                    <CheckCircle2 className="w-3 h-3" />
                                    Perfecto
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="relative">
                        <Briefcase className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-brand-500" />
                        <input
                            type="text"
                            className={`w-full pl-12 pr-4.5 py-4.5 bg-white border rounded-2xl focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-slate-900 font-semibold placeholder:text-slate-300 placeholder:font-medium
                            ${isJobValid ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200/60 focus:border-brand-500'}`}
                            placeholder={t.jobTitlePlaceholder}
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNext}
                disabled={!canProceed}
                className="w-full mt-10 py-5 bg-brand-600 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/25 hover:bg-brand-700 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
                {t.next}
                <ArrowRight className="w-5 h-5" />
            </motion.button>
        </div>
    );
};

export default OnboardingStep1;
