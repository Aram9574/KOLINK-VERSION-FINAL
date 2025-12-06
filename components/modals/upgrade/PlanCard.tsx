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
            className={`relative rounded-3xl p-6 lg:p-8 border transition-all duration-300 flex flex-col
        ${isHighlighted
                    ? 'bg-gradient-to-br from-brand-600 to-indigo-600 text-white border-brand-500 shadow-2xl shadow-brand-900/20 scale-105 z-10 ring-1 ring-white/20'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-brand-300 hover:shadow-xl'
                }`}
        >
            {isHighlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider">
                    {t.mostPopular}
                </div>
            )}

            <div className="mb-6">
                <h4 className={`text-lg font-bold mb-2 ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h4>
                <p className={`text-sm h-10 ${isHighlighted ? 'text-brand-100' : 'text-slate-500'}`}>{plan.description}</p>
            </div>

            <div className="mb-8">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-bold">€{billingInterval === 'yearly' ? (plan.price * 0.8).toFixed(0) : plan.price}</span>
                    <span className={`text-sm font-medium ${isHighlighted ? 'text-brand-200' : 'text-slate-400'}`}>/mo</span>
                </div>
                {billingInterval === 'yearly' && plan.price > 0 && (
                    <p className="text-xs text-green-500 mt-1 font-medium">{t.billedYearly.replace('{{amount}}', '€' + ((plan.price * 0.8) * 12).toFixed(0))}</p>
                )}
            </div>

            <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                        <div className={`mt-0.5 p-0.5 rounded-full ${isHighlighted ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600'}`}>
                            <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className={`${isHighlighted ? 'text-white' : 'text-slate-600'}`}>{feature}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => {
                    console.log("Upgrade button clicked for plan:", plan.id);
                    onUpgrade(plan);
                }}
                disabled={isDowngradeOrCurrent}
                className={`w-full py-3.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2
            ${(() => {
                        if (isDowngradeOrCurrent) return 'bg-slate-100 text-slate-400 cursor-not-allowed';
                        if (isHighlighted) return 'bg-white text-brand-700 hover:bg-brand-50 hover:-translate-y-0.5 shadow-lg shadow-black/10';
                        return 'bg-slate-900 hover:bg-slate-800 text-white hover:-translate-y-0.5 shadow-lg';
                    })()}`}
            >
                {(() => {
                    if (plan.id === currentPlanId) return t.currentPlan;
                    if (targetLevel < currentLevel) return t.included;
                    return (
                        <>
                            <span>{t.upgradeNow}</span>
                            {plan.price > 0 && <Zap className={`w-4 h-4 fill-current ${isHighlighted ? 'text-brand-700' : 'text-white'}`} />}
                        </>
                    );
                })()}
            </button>
        </div>
    );
};

export default PlanCard;
