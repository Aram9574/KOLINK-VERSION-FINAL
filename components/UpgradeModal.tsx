

import React, { useState } from 'react';
import { X, Check, Zap, Crown } from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { PLANS } from '../constants';

interface UpgradeModalProps {
    onClose: () => void;
    onUpgrade: (plan: SubscriptionPlan) => void;
    currentPlanId: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onUpgrade, currentPlanId }) => {
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <div
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden relative animate-in fade-in zoom-in duration-200 my-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 z-10 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 lg:p-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-tr from-amber-300 to-orange-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                        <Crown className="w-8 h-8 fill-current" />
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-3">Elige tu Plan Viral</h3>
                    <p className="text-slate-500 mb-8 text-lg max-w-2xl mx-auto">
                        Desbloquea modelos de IA avanzados, generaciones ilimitadas y los marcos virales secretos usados por los mejores creadores.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-10">
                        <span className={`text-sm font-bold ${billingInterval === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Mensual</span>
                        <button
                            onClick={() => setBillingInterval(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${billingInterval === 'yearly' ? 'bg-brand-600' : 'bg-slate-200'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${billingInterval === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-sm font-bold flex items-center gap-2 ${billingInterval === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
                            Anual
                            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">Ahorra 20%</span>
                        </span>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        {PLANS.map((plan) => {
                            const isCurrent = currentPlanId === plan.id;
                            const isHighlighted = plan.highlight;

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative rounded-3xl p-6 lg:p-8 border transition-all duration-300 flex flex-col
                                ${isHighlighted
                                            ? 'bg-gradient-to-br from-brand-600 to-indigo-600 text-white border-brand-500 shadow-2xl shadow-brand-900/20 scale-105 z-10 ring-1 ring-white/20'
                                            : 'bg-white text-slate-900 border-slate-200 hover:border-brand-300 hover:shadow-xl'
                                        }`}
                                >
                                    {isHighlighted && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider">
                                            Más Popular
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
                                            <p className="text-xs text-green-500 mt-1 font-medium">Facturado €{((plan.price * 0.8) * 12).toFixed(0)} anualmente</p>
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
                                        disabled={(() => {
                                            const planLevels = { free: 0, pro: 1, viral: 2 };
                                            const currentLevel = planLevels[currentPlanId as keyof typeof planLevels] || 0;
                                            const targetLevel = planLevels[plan.id as keyof typeof planLevels] || 0;
                                            return targetLevel <= currentLevel;
                                        })()}
                                        className={`w-full py-3.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2
                                    ${(() => {
                                                const planLevels = { free: 0, pro: 1, viral: 2 };
                                                const currentLevel = planLevels[currentPlanId as keyof typeof planLevels] || 0;
                                                const targetLevel = planLevels[plan.id as keyof typeof planLevels] || 0;
                                                const isDowngradeOrCurrent = targetLevel <= currentLevel;

                                                if (isDowngradeOrCurrent) return 'bg-slate-100 text-slate-400 cursor-not-allowed';
                                                if (isHighlighted) return 'bg-white text-brand-700 hover:bg-brand-50 hover:-translate-y-0.5 shadow-lg shadow-black/10';
                                                return 'bg-slate-900 hover:bg-slate-800 text-white hover:-translate-y-0.5 shadow-lg';
                                            })()}`}
                                    >
                                        {(() => {
                                            const planLevels = { free: 0, pro: 1, viral: 2 };
                                            const currentLevel = planLevels[currentPlanId as keyof typeof planLevels] || 0;
                                            const targetLevel = planLevels[plan.id as keyof typeof planLevels] || 0;

                                            if (plan.id === currentPlanId) return 'Plan Actual';
                                            if (targetLevel < currentLevel) return 'Incluido en tu Plan';
                                            return (
                                                <>
                                                    <span>Mejorar Ahora</span>
                                                    {plan.price > 0 && <Zap className={`w-4 h-4 fill-current ${isHighlighted ? 'text-brand-700' : 'text-white'}`} />}
                                                </>
                                            );
                                        })()}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <p className="text-xs text-slate-400 mt-8 max-w-xl mx-auto">
                        Pago seguro vía Stripe. Cancela cuando quieras. Al mejorar, aceptas nuestros Términos de Servicio.
                        Para planes empresariales personalizados, contacta a ventas.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;