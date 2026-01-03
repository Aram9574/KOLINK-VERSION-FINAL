import React from 'react';
import { User, Briefcase, ArrowRight } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';

interface OnboardingStep1Props {
    firstName: string;
    setFirstName: (value: string) => void;
    lastName: string;
    setLastName: (value: string) => void;
    jobTitle: string;
    setJobTitle: (value: string) => void;
    onNext: () => void;
}

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({
    firstName,
    setFirstName,
    lastName,
    setLastName,
    jobTitle,
    setJobTitle,
    onNext
}) => {
    const { language } = useUser();
    const t = translations[language].onboarding.step1;

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-sm">
                    <User className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">{t.title}</h2>
                <p className="text-slate-500">{t.subtitle}</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">{t.firstName}</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-white border border-slate-200/60/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-slate-900 font-medium"
                            placeholder={t.firstNamePlaceholder}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">{t.lastName}</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-white border border-slate-200/60/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-slate-900 font-medium"
                            placeholder={t.lastNamePlaceholder}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">{t.jobTitle}</label>
                    <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200/60/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-slate-900 font-medium"
                            placeholder={t.jobTitlePlaceholder}
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={onNext}
                disabled={!firstName || !lastName || !jobTitle}
                className="w-full mt-8 py-4 bg-brand-600 text-white font-bold rounded-xl shadow-xl shadow-brand-500/20 hover:bg-brand-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {t.next}
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default OnboardingStep1;
