import React from 'react';
import { AlertTriangle, Wallet, Clock, ArrowLeftRight, Star, MessageSquare } from 'lucide-react';
import { AppLanguage } from '../../../types';
import { translations } from '../../../translations';

interface ReasonStepProps {
    language: AppLanguage;
    reason: string;
    setReason: (reason: string) => void;
    onClose: () => void;
    onNext: () => void;
}

const ReasonStepV2: React.FC<ReasonStepProps> = ({ language, reason, setReason, onClose, onNext }) => {
    const t = translations[language].app.cancellation;

    const REASONS = [
        { id: 'expensive', label: t.reasons.expensive, icon: Wallet },
        { id: 'usage', label: t.reasons.usage, icon: Clock },
        { id: 'alternative', label: t.reasons.alternative, icon: ArrowLeftRight },
        { id: 'features', label: t.reasons.features, icon: Star },
        { id: 'other', label: t.reasons.other, icon: MessageSquare }
    ];

    return (
        <div className="space-y-8 p-1">
            <div className="text-center space-y-4 mb-8">
                <div className="w-16 h-16 bg-white border border-slate-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <AlertTriangle className="w-8 h-8 text-slate-900" strokeWidth={1.5} />
                </div>
                <div>
                    <h3 className="text-2xl font-display font-semibold text-slate-900">{t.title}</h3>
                    <p className="text-slate-500 text-sm mt-1">{t.subtitle}</p>
                </div>
            </div>

            <div className="space-y-2.5">
                {REASONS.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => setReason(r.label)}
                        className={`w-full p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group
                        ${reason === r.label
                                ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <r.icon className={`w-5 h-5 ${reason === r.label ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} strokeWidth={1.5} />
                            <span className="font-medium text-sm">{r.label}</span>
                        </div>
                        {reason === r.label && <div className="w-2 h-2 bg-white rounded-full mr-2" />}
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

export default ReasonStepV2;
