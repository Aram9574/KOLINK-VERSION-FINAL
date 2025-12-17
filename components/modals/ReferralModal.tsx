import React, { useState } from 'react';
import { X, Gift, Copy, Check, Users } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose }) => {
    const { user, language } = useUser();
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://kolink.app';
    const referralLink = `${origin}/?ref=${user.id}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const t = {
        title: language === 'es' ? '¡Invita y Gana 1 Mes Gratis!' : 'Invite & Earn 1 Free Month!',
        subtitle: language === 'es' 
            ? 'Por cada amigo que se suscriba al plan Pro, te regalamos 1 mes de acceso.'
            : 'For every friend who subscribes to Pro, you get 1 month free.',
        howItWorks: language === 'es' ? 'Cómo funciona:' : 'How it works:',
        step1: language === 'es' ? 'Comparte tu enlace único' : 'Share your unique link',
        step2: language === 'es' ? 'Tu amigo se registra y suscribe' : 'Friend signs up & subscribes',
        step3: language === 'es' ? 'Recibes €19 en créditos (1 mes Pro)' : 'You get €19 credits (1 month Pro)',
        copy: language === 'es' ? 'Copiar Enlace' : 'Copy Link',
        copied: language === 'es' ? '¡Copiado!' : 'Copied!',
        yourLink: language === 'es' ? 'Tu enlace de referidos:' : 'Your referral link:',
        stats: language === 'es' ? 'Tus Referidos:' : 'Your Referrals:'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                        <Gift className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 font-display">{t.title}</h2>
                    <p className="text-white/90 text-sm leading-relaxed max-w-xs mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                <div className="p-6">
                    {/* Link Box */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                            {t.yourLink}
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 font-mono truncate">
                                {referralLink}
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`px-4 py-2 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${
                                    copied ? 'bg-green-500' : 'bg-slate-900 hover:bg-slate-800'
                                }`}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? t.copied : t.copy}
                            </button>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-4 mb-6">
                        <h3 className="font-bold text-slate-900 text-sm">{t.howItWorks}</h3>
                        <div className="grid gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 border border-violet-100">
                                <div className="w-6 h-6 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                <span className="text-sm text-slate-700 font-medium">{t.step1}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 border border-violet-100">
                                <div className="w-6 h-6 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                <span className="text-sm text-slate-700 font-medium">{t.step2}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                                <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                <span className="text-sm text-emerald-800 font-bold">{t.step3}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferralModal;
