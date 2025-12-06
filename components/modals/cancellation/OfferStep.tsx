import React from 'react';
import { Gift, ShieldCheck } from 'lucide-react';
import { AppLanguage } from '../../../types';
import { translations } from '../../../translations';

interface OfferStepProps {
    language: AppLanguage;
    planPrice: number;
    discountType: '30' | '50';
    isLoading: boolean;
    onApplyCoupon: (couponId: string) => void;
    onReject: () => void;
}

const OfferStep: React.FC<OfferStepProps> = ({ language, planPrice, discountType, isLoading, onApplyCoupon, onReject }) => {
    const t = translations[language].app.cancellation;
    const is30 = discountType === '30';
    const offerData = is30 ? t.offer30 : t.offer50;
    const discount = is30 ? 0.7 : 0.5;
    const couponId = is30 ? 'RETENTION_30' : 'RETENTION_50';
    const Icon = is30 ? Gift : ShieldCheck;
    const iconColor = is30 ? 'text-amber-600' : 'text-red-600';
    const iconBg = is30 ? 'bg-amber-100' : 'bg-red-100';
    const gradient = is30 ? 'from-amber-50 to-orange-50' : 'from-red-50 to-pink-50';
    const borderColor = is30 ? 'border-amber-100' : 'border-red-100';
    const badgeBg = is30 ? 'bg-amber-500' : 'bg-red-500';
    const textColor = is30 ? 'text-amber-800' : 'text-red-800';
    const btnBg = is30 ? 'bg-amber-500 hover:bg-amber-600' : 'bg-red-500 hover:bg-red-600';
    const shadowColor = is30 ? 'shadow-amber-500/20' : 'shadow-red-500/20';


    return (
        <div className="space-y-6 text-center">
            <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-2 ${is30 ? 'animate-bounce' : 'animate-pulse'}`}>
                <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">{offerData.title}</h3>
                <p className="text-slate-500">
                    {offerData.subtitle}
                </p>
            </div>

            <div className={`bg-gradient-to-br ${gradient} border ${borderColor} rounded-2xl p-6 relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 ${badgeBg} text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl`}>
                    {offerData.badge}
                </div>
                <p className={`text-sm font-bold ${textColor} uppercase tracking-wider mb-2`}>{offerData.discountText}</p>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-3xl font-bold text-slate-900">€{(planPrice * discount).toFixed(2)}</span>
                    <span className="text-lg text-slate-400 line-through">€{planPrice}</span>
                    <span className="text-sm text-slate-500">/mo</span>
                </div>
                <button
                    onClick={() => onApplyCoupon(couponId)}
                    disabled={isLoading}
                    className={`w-full py-3 ${btnBg} text-white font-bold rounded-xl shadow-lg ${shadowColor} transition-all transform hover:-translate-y-0.5`}
                >
                    {isLoading ? offerData.applying : offerData.claimBtn}
                </button>
            </div>

            <button
                onClick={onReject}
                className="text-sm text-slate-400 hover:text-slate-600 font-medium"
            >
                {offerData.reject}
            </button>
        </div>
    );
};

export default OfferStep;
