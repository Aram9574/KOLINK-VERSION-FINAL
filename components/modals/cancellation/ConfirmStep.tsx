import React from 'react';
import { X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AppLanguage } from '../../../types';
import { translations } from '../../../translations';

interface ConfirmStepProps {
    language: AppLanguage;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userCreatedAt?: string;
}

const ConfirmStep: React.FC<ConfirmStepProps> = ({ language, isLoading, onClose, onConfirm, userCreatedAt }) => {
    const t = translations[language].app.cancellation;

    return (
        <div className="space-y-8 text-center px-4">
            <div className="space-y-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-sm">
                    <AlertTriangle className="w-8 h-8 text-red-600" strokeWidth={1.5} />
                </div>
                <div>
                    <h3 className="text-2xl font-display font-semibold text-slate-900">{t.confirm.title}</h3>
                    <p className="text-slate-500 font-medium text-sm mt-2 max-w-xs mx-auto">
                        {t.confirm.subtitle}
                    </p>
                </div>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-xl text-left space-y-4 border border-slate-200/60/60">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-display">Lo que perderás</h4>
                <div className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="mt-0.5 p-0.5 bg-slate-200 rounded-full shrink-0 text-slate-600">
                        <X className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="font-medium text-slate-600 leading-snug">{t.confirm.access}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="mt-0.5 p-0.5 bg-slate-200 rounded-full shrink-0 text-slate-600">
                        <X className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="font-medium text-slate-600 leading-snug">{t.confirm.data}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-amber-700 font-semibold bg-amber-50 p-3 rounded-lg border border-amber-100/50">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{t.confirm.frozen}</span>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    onClick={onClose}
                    className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20 active:scale-95"
                >
                    {t.confirm.goBack}
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="w-full py-3 bg-white text-slate-400 font-bold rounded-xl border border-slate-200/60/60 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all disabled:opacity-50 text-sm"
                >
                    {isLoading ? t.confirm.canceling : t.confirm.confirmBtn}
                </button>
            </div>
        </div>
    );
};

export default ConfirmStep;
