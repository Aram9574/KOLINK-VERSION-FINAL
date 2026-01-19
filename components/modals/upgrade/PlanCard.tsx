import React from 'react';
import { Check, Zap } from 'lucide-react';
import { SubscriptionPlan } from '../../../types';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';

interface PlanCardProps {
    plan: SubscriptionPlan;
    currentPlanId: string;
    billingInterval: 'monthly' | 'yearly';
    onUpgrade: (plan: SubscriptionPlan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, currentPlanId, billingInterval, onUpgrade }) => {
    const { language } = useUser();
    const t = translations[language].app.upgrade;

    const isCurrent = currentPlanId === plan.id;
    const isHighlighted = plan.highlight;

    const planLevels = { free: 0, pro: 1, viral: 2 };
    const currentLevel = planLevels[currentPlanId as keyof typeof planLevels] || 0;
    const targetLevel = planLevels[plan.id as keyof typeof planLevels] || 0;
    const isDowngradeOrCurrent = targetLevel <= currentLevel;

    return (
        <div
            className={`relative rounded-xl p-6 border transition-all duration-300 flex flex-col h-full
        ${isHighlighted
                    ? 'bg-gradient-to-br from-brand-600 to-indigo-600 text-white border-brand-500 shadow-xl shadow-brand-900/20 scale-100 md:scale-105 z-10 ring-1 ring-white/20'
                    : 'bg-white text-slate-900 border-slate-200/60 hover:border-brand-300 hover:shadow-lg'
                }`}
        >
            {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-lg tracking-wider">
                    {t.mostPopular}
                </div>
            )}

            <div className="mb-4 text-center">
                <h4 className={`text-lg font-bold ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h4>
                <p className={`text-xs mt-1 min-h-[40px] ${isHighlighted ? 'text-brand-100' : 'text-slate-500'}`}>{plan.description}</p>
            </div>

            <div className="mb-6 text-center border-b border-white/10 pb-6 border-slate-200/60/60">
                <div className="flex items-center justify-center gap-0.5">
                    <span className="text-5xl font-display font-bold tracking-tight">€{billingInterval === 'yearly' ? (plan.price * 0.8).toFixed(0) : plan.price}</span>
                    <span className={`text-base font-medium mb-1 ${isHighlighted ? 'text-brand-200' : 'text-slate-400'}`}>/mes</span>
                </div>
                {billingInterval === 'yearly' && plan.price > 0 && (
                    <p className="text-[10px] text-green-400 mt-1 font-bold bg-green-500/10 inline-block px-2 py-0.5 rounded-full">{t.billedYearly.replace('{{amount}}', '€' + ((plan.price * 0.8) * 12).toFixed(0))}</p>
                )}
            </div>

            <div className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-left">
                        <div className={`mt-0.5 p-0.5 rounded-full flex-shrink-0 ${isHighlighted ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600'}`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className={`leading-relaxed ${isHighlighted ? 'text-white/90' : 'text-slate-600'}`}>{feature}</span>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onUpgrade(plan);
                }}
                disabled={isDowngradeOrCurrent}
                className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2
            ${(() => {
                        if (isDowngradeOrCurrent) return 'bg-slate-100 text-slate-400 cursor-not-allowed';
                        if (isHighlighted) return 'bg-white text-brand-700 hover:bg-brand-50 hover:-translate-y-0.5 shadow-lg shadow-black/10';
                        return 'bg-slate-900 hover:bg-slate-800 text-white hover:-translate-y-0.5 shadow-md';
                    })()}`}
            >
                {(() => {
                    if (plan.id === currentPlanId) return t.currentPlan;
                    if (targetLevel < currentLevel) return t.included;
                    return (
                        <>
                            <span>{t.upgradeNow}</span>
                            {plan.price > 0 && <Zap className={`w-3.5 h-3.5 fill-current ${isHighlighted ? 'text-brand-700' : 'text-white'}`} />}
                        </>
                    );
                })()}
            </button>
        </div>
    );
};

export default PlanCard;
