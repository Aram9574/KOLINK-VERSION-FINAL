import React, { useState } from 'react';
import { UserProfile, AppLanguage } from '../../../types';
import { translations } from '../../../translations';
import { CreditCard, ChevronRight, Zap, Target } from 'lucide-react';
import { PLANS } from '../../../constants';
import CancellationModal from '../../modals/CancellationModal';
import { motion } from 'framer-motion';

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
        <div className="space-y-8">
            {/* Header section removed - handled by parent */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Plan Card */}
                <section className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{language === 'es' ? 'Plan Actual' : 'Current Plan'}</h3>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${user.planTier !== 'free' ? 'bg-amber-100/50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {currentPlan.name}
                        </span>
                    </div>
                    
                    <div className="space-y-1">
                        <p className="text-2xl font-display font-bold text-slate-900">{isUnlimited ? (language === 'es' ? 'Ilimitado' : 'Unlimited') : `${user.credits} Créditos`}</p>
                        <p className="text-sm text-slate-500 font-medium">
                            {isUnlimited 
                                ? (language === 'es' ? 'Sin restricciones de creación.' : 'No creation restrictions.') 
                                : `Disponibles para este ciclo.`}
                        </p>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={onUpgrade} 
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:shadow-sm transition-all group"
                        >
                            <span>{t.manageSub}</span>
                            <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </section>

                {/* Usage Stats Card */}
                <section className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm group hover:bg-white transition-colors">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.currentUsage}</h3>
                        <Target size={16} className="text-slate-300" />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-end justify-between text-sm font-bold">
                            <span className="text-slate-900">{progressPercent.toFixed(0)}%</span>
                            <span className="text-slate-400 font-medium">{isUnlimited ? '∞' : effectiveMax} {language === 'es' ? 'Total' : 'Total'}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${isUnlimited
                                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse'
                                        : 'bg-gradient-to-r from-brand-500 to-indigo-500'
                                    }`}
                            ></motion.div>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-right italic">
                        {isUnlimited 
                            ? (language === 'es' ? 'Poder absoluto activado' : 'Absolute power activated') 
                            : `Reseteo: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`
                        }
                    </p>
                </section>
            </div>

            {/* Cancellation / Invoices Section */}
            <section className="pt-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{language === 'es' ? 'Gestión de Cuenta' : 'Account Management'}</h3>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
                    <div className="space-y-1">
                        <p className="font-bold text-slate-900">{language === 'es' ? 'Suscripción' : 'Subscription'}</p>
                        <p className="text-xs text-slate-500">{language === 'es' ? 'Gestiona tus facturas y el estado de tu suscripción.' : 'Manage your invoices and subscription status.'}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {user.planTier !== 'free' && !user.cancelAtPeriodEnd && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="flex-1 md:flex-none px-6 py-2.5 text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-all shadow-sm"
                            >
                                {language === 'es' ? 'Cancelar Suscripción' : 'Cancel Subscription'}
                            </button>
                        )}

                        {user.cancelAtPeriodEnd && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl text-xs font-bold animate-pulse">
                                <Zap size={14} className="fill-current" />
                                <span>{language === 'es' ? 'Cancela al final del periodo' : 'Cancels at period end'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <CancellationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                userEmail={user.email || ''}
                userId={user.id}
                subscriptionId={user.subscriptionId}
                language={language}
                planPrice={PLANS.find(p => p.id === user.planTier)?.price || 0}
                onCancelSuccess={() => {
                    onSave({ cancelAtPeriodEnd: true });
                }}
            />
        </div>
    );
};

export default BillingSettings;
