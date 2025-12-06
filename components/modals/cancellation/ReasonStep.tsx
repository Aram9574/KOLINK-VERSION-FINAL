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
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{t.title}</h3>
                <p className="text-slate-500 text-sm">{t.subtitle}</p>
            </div>

            <div className="space-y-3">
                {REASONS.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => setReason(r.label)}
                        className={`w-full p-3 text-left rounded-xl border transition-all text-sm font-medium ${reason === r.label
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                            }`}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                    {t.keepPlan}
                </button>
                <button
                    onClick={onNext}
                    disabled={!reason}
                    className="flex-1 px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t.continue}
                </button>
            </div>
        </div>
    );
};

export default ReasonStep;
