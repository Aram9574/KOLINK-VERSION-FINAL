import React, { useState } from 'react';
import { X, AlertTriangle, Gift, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';
import { AppLanguage } from '../types';
import { supabase } from '../services/supabaseClient';

interface CancellationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCancelSuccess: () => void;
    planName: string;
    planPrice: number;
    language: AppLanguage;
}

type Step = 'reason' | 'offer_30' | 'offer_50' | 'confirm';



const CancellationModal: React.FC<CancellationModalProps> = ({ isOpen, onClose, onCancelSuccess, planName, planPrice, language }) => {
    const [step, setStep] = useState<Step>('reason');
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const t = translations[language].app.cancellation;

    const REASONS = [
        { id: 'expensive', label: t.reasons.expensive },
        { id: 'usage', label: t.reasons.usage },
        { id: 'alternative', label: t.reasons.alternative },
        { id: 'features', label: t.reasons.features },
        { id: 'other', label: t.reasons.other }
    ];

    if (!isOpen) return null;

    const handleApplyCoupon = async (couponId: string) => {
        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No session');

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    action: 'apply_coupon',
                    couponId
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to apply coupon');

            onClose();
            alert(language === 'es' ? '¡Descuento aplicado con éxito!' : 'Discount applied successfully!');
        } catch (error: any) {
            console.error('Error applying coupon:', error);
            alert(error.message || 'Failed to apply discount. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async () => {
        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No session');

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    action: 'cancel',
                    reason
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to cancel subscription');

            onCancelSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error canceling subscription:', error);
            alert(error.message || 'Failed to cancel subscription. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderReasonStep = () => (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{t.title}</h3>
                <p className="text-slate-500 text-sm">{t.subtitle}</p>
            </div>

            <div className="space-y-3">
                {REASONS.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => setReason(r.label)}
                        className={`w-full p-3 text-left rounded-xl border transition-all text-sm font-medium ${reason === r.label
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                            }`}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                    {t.keepPlan}
                </button>
                <button
                    onClick={() => {
                        if (reason) setStep('offer_30');
                    }}
                    disabled={!reason}
                    className="flex-1 px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t.continue}
                </button>
            </div>
        </div>
    );

    const renderOffer30Step = () => (
        <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                <Gift className="w-8 h-8 text-amber-600" />
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">{t.offer30.title}</h3>
                <p className="text-slate-500">
                    {t.offer30.subtitle}
                </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                    {t.offer30.badge}
                </div>
                <p className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-2">{t.offer30.discountText}</p>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-3xl font-bold text-slate-900">€{(planPrice * 0.7).toFixed(2)}</span>
                    <span className="text-lg text-slate-400 line-through">€{planPrice}</span>
                    <span className="text-sm text-slate-500">/mo</span>
                </div>
                <button
                    onClick={() => handleApplyCoupon('RETENTION_30')}
                    disabled={isLoading}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
                >
                    {isLoading ? t.offer30.applying : t.offer30.claimBtn}
                </button>
            </div>

            <button
                onClick={() => setStep('offer_50')}
                className="text-sm text-slate-400 hover:text-slate-600 font-medium"
            >
                {t.offer30.reject}
            </button>
        </div>
    );

    const renderOffer50Step = () => (
        <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                <ShieldCheck className="w-8 h-8 text-red-600" />
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">{t.offer50.title}</h3>
                <p className="text-slate-500">
                    {t.offer50.subtitle}
                </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                    {t.offer50.badge}
                </div>
                <p className="text-sm font-bold text-red-800 uppercase tracking-wider mb-2">{t.offer50.discountText}</p>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-3xl font-bold text-slate-900">€{(planPrice * 0.5).toFixed(2)}</span>
                    <span className="text-lg text-slate-400 line-through">€{planPrice}</span>
                    <span className="text-sm text-slate-500">/mo</span>
                </div>
                <button
                    onClick={() => handleApplyCoupon('RETENTION_50')}
                    disabled={isLoading}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all transform hover:-translate-y-0.5"
                >
                    {isLoading ? t.offer50.applying : t.offer50.claimBtn}
                </button>
            </div>

            <button
                onClick={() => setStep('confirm')}
                className="text-sm text-slate-400 hover:text-slate-600 font-medium"
            >
                {t.offer50.reject}
            </button>
        </div>
    );

    const renderConfirmStep = () => (
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
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                    {isLoading ? t.confirm.canceling : t.confirm.confirmBtn}
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 relative overflow-hidden animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {step === 'reason' && renderReasonStep()}
                {step === 'offer_30' && renderOffer30Step()}
                {step === 'offer_50' && renderOffer50Step()}
                {step === 'confirm' && renderConfirmStep()}
            </div>
        </div>
    );
};

export default CancellationModal;
