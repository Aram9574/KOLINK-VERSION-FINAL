import React, { useState } from 'react';
import { UserProfile, AppLanguage } from '../../../types';
import { translations } from '../../../translations';
import { CreditCard, ChevronRight } from 'lucide-react';
import { PLANS } from '../../../constants';
import CancellationModal from '../../modals/CancellationModal';

interface BillingSettingsProps {
    user: UserProfile;
    language: AppLanguage;
    onUpgrade: () => void;
    onSave: (updates: Partial<UserProfile>) => void;
}

const BillingSettings: React.FC<BillingSettingsProps> = ({ user, language, onUpgrade, onSave }) => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const t = translations[language].app.settings;

    const currentPlan = PLANS.find(p => p.id === user.planTier) || PLANS[0];
    const isUnlimited = currentPlan.credits === -1;

    // Dynamic Credit Max Logic
    const planCredits = currentPlan.credits === -1 ? 1000 : currentPlan.credits;
    const userMaxCredits = user.maxCredits || 0;
    const effectiveMax = Math.max(planCredits, userMaxCredits, user.credits);

    const progressPercent = isUnlimited ? 100 : Math.min(100, (user.credits / effectiveMax) * 100);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="p-2 bg-amber-50 rounded-lg">
                        <CreditCard className="w-5 h-5 text-amber-600" />
                    </div>
                    {t.billingTitle}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${user.planTier !== 'free' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {currentPlan.name} Plan
                </span>
            </div>

            <div className="max-w-2xl mx-auto mb-8 relative z-10">
                {/* Current Plan Card */}
                <div className="bg-slate-50/80 rounded-xl p-6 border border-slate-200 flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">{t.currentUsage}</p>
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-3xl font-display font-bold text-slate-900">{isUnlimited ? '∞' : user.credits}</span>
                            <span className="text-sm font-medium text-slate-400">/ {isUnlimited ? '∞' : effectiveMax} credits</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                            <div className="bg-gradient-to-r from-brand-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-500">
                            {isUnlimited ? 'You are unstoppable.' : `Resets on ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`}
                        </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/60 flex flex-col gap-2">
                        <button onClick={onUpgrade} className="text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1">
                            {t.manageSub} <ChevronRight className="w-4 h-4" />
                        </button>

                        {user.planTier !== 'free' && !user.cancelAtPeriodEnd && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="text-xs font-medium text-slate-400 hover:text-red-500 hover:underline flex items-center gap-1 w-fit transition-colors"
                            >
                                Cancelar Suscripción
                            </button>
                        )}

                        {user.cancelAtPeriodEnd && (
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit">
                                Cancels at period end
                            </span>
                        )}
                    </div>
                </div>


            </div>

            <CancellationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                userEmail={user.email || ''}
                subscriptionId={user.subscriptionId}
                language={language}
                planPrice={PLANS.find(p => p.id === user.planTier)?.price || 0}
                onCancelSuccess={() => {
                    // Refresh user profile or show success message
                    onSave({ cancelAtPeriodEnd: true }); // Optimistic update
                }}
            />
        </div>
    );
};

export default BillingSettings;
