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
        <div className="space-y-8 text-center px-4">
            {/* Header */}
            <div className="space-y-4">
                <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto shadow-sm`}>
                    <Icon className={`w-8 h-8 ${iconColor}`} strokeWidth={1.5} />
                </div>
                <div>
                    <h3 className="text-2xl font-display font-semibold text-slate-900">{offerData.title}</h3>
                    <p className="text-slate-500 font-medium text-sm mt-2 max-w-sm mx-auto">
                        {offerData.subtitle}
                    </p>
                </div>
            </div>

            {/* Premium Offer Card */}
            <div className="bg-white border text-left border-amber-100 rounded-xl p-6 shadow-xl shadow-amber-900/5 relative overflow-hidden group hover:border-amber-200 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-50"></div>

                <div className="relative z-10 flex items-center justify-between mb-6">
                    <div>
                        <span className={`inline-flex items-center px-2.5 py-1rounded-full text-xs font-bold uppercase tracking-wide ${badgeBg} text-white rounded-md`}>
                            {offerData.badge}
                        </span>
                        <p className="text-slate-500 text-xs mt-2 font-medium uppercase tracking-wider">{offerData.discountText}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                            <span className="text-4xl font-display font-bold text-slate-900">€{(planPrice * discount).toFixed(0)}</span>
                            <span className="text-slate-400 font-medium line-through decoration-slate-300">€{planPrice}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">/mes por 6 meses</span>
                    </div>
                </div>

                <div className="relative z-10">
                    <button
                        onClick={() => onApplyCoupon(couponId)}
                        disabled={isLoading}
                        className={`w-full py-3.5 ${btnBg} text-white font-bold rounded-xl shadow-lg ${shadowColor} transition-all hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2`}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            offerData.claimBtn
                        )}
                    </button>
                    <p className="text-[10px] text-slate-400 text-center mt-3 font-medium">
                        Se aplica en tu próxima factura. Cancela cuando quieras.
                    </p>
                </div>
            </div>

            <button
                onClick={onReject}
                className="text-slate-400 hover:text-slate-600 font-medium text-sm hover:underline transition-all"
            >
                {offerData.reject}
            </button>
        </div>
    );
};

export default OfferStep;
