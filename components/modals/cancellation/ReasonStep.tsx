import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { AppLanguage } from '../../../types';
import { translations } from '../../../translations';

interface ReasonStepProps {
    language: AppLanguage;
    reason: string;
    setReason: (reason: string) => void;
    onClose: () => void;
    onNext: () => void;
}

const ReasonStep: React.FC<ReasonStepProps> = ({ language, reason, setReason, onClose, onNext }) => {
    const t = translations[language].app.cancellation;

    const REASONS = [
        { id: 'expensive', label: t.reasons.expensive },
        { id: 'usage', label: t.reasons.usage },
        { id: 'alternative', label: t.reasons.alternative },
        { id: 'features', label: t.reasons.features },
        { id: 'other', label: t.reasons.other }
    ];

    return (
        <div className="space-y-8">
            <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-sm">
                    <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{t.title}</h3>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">{t.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {REASONS.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => setReason(r.label)}
                        className={`group w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between
                        ${reason === r.label
                                ? 'border-red-500 bg-red-50/50 text-red-700 shadow-sm'
                                : 'border-slate-100 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <span className="font-medium">{r.label}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                            ${reason === r.label ? 'border-red-500 bg-red-500' : 'border-slate-300 group-hover:border-slate-400'}`}>
                            {reason === r.label && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                    </button>
                ))}
            </div>

            <div className="space-y-3 pt-2">
                <button
                    onClick={onClose}
                    className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:-translate-y-0.5"
                >
                    {t.keepPlan}
                </button>
                <button
                    onClick={onNext}
                    disabled={!reason}
                    className="w-full py-3 text-slate-500 font-medium hover:text-red-600 transition-colors text-sm disabled:opacity-50 disabled:hover:text-slate-500"
                >
                    {t.continue}
                </button>
            </div>
        </div>
    );
};

export default ReasonStep;
