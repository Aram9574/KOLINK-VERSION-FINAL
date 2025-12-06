import React from 'react';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';

interface BillingToggleProps {
    billingInterval: 'monthly' | 'yearly';
    onChange: (interval: 'monthly' | 'yearly') => void;
}

const BillingToggle: React.FC<BillingToggleProps> = ({ billingInterval, onChange }) => {
    const { language } = useUser();
    const t = translations[language].app.upgrade;

    return (
        <div className="flex items-center justify-center gap-4 mb-10">
            <span className={`text-sm font-bold ${billingInterval === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>{t.monthly}</span>
            <button
                onClick={() => onChange(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${billingInterval === 'yearly' ? 'bg-brand-600' : 'bg-slate-200'}`}
            >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${billingInterval === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-sm font-bold flex items-center gap-2 ${billingInterval === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
                {t.yearly}
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">{t.save}</span>
            </span>
        </div>
    );
};

export default BillingToggle;
