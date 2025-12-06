import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { AppLanguage } from '../../../types';
import { translations } from '../../../translations';

interface ConfirmStepProps {
    language: AppLanguage;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmStep: React.FC<ConfirmStepProps> = ({ language, isLoading, onClose, onConfirm }) => {
    const t = translations[language].app.cancellation;

    return (
        <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <X className="w-8 h-8 text-slate-500" />
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">{t.confirm.title}</h3>
                <p className="text-slate-500 text-sm">
                    {t.confirm.subtitle}
                </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-left space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-slate-400" />
                    <span>{t.confirm.access}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-slate-400" />
                    <span>{t.confirm.data}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-red-500 font-medium">
                    <X className="w-4 h-4" />
                    <span>{t.confirm.frozen}</span>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                    {t.confirm.goBack}
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                    {isLoading ? t.confirm.canceling : t.confirm.confirmBtn}
                </button>
            </div>
        </div>
    );
};

export default ConfirmStep;
