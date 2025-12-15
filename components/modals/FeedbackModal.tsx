import React, { useState } from 'react';
import { X, MessageSquare, Bug, Lightbulb, Send, CheckCircle, Sparkles } from 'lucide-react';
import { AppLanguage, UserProfile } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: AppLanguage;
    user: any; // Using any for auth user object, or specifically typed if available
}

type FeedbackType = 'bug' | 'feature' | 'other';

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, language, user }) => {
    const [type, setType] = useState<FeedbackType | null>(null);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!type || !message.trim()) return;
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('feedback')
                .insert([
                    {
                        user_id: user?.id,
                        type,
                        message,
                        status: 'new'
                    }
                ]);

            if (error) throw error;

            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setMessage('');
                setType(null);
            }, 3000);
        } catch (error) {
            console.error('Error sending feedback:', error);
            setIsSubmitting(false);
            // Optional: Show error state
        }
    };

    const t = {
        title: language === 'es' ? 'Tu opinión importa' : 'Your Feedback Matters',
        desc: language === 'es' ? '¿Cómo podemos mejorar tu experiencia hoy?' : 'How can we improve your experience today?',
        bug: language === 'es' ? 'Reportar un Error' : 'Report a Bug',
        bugDesc: language === 'es' ? 'Algo no funciona como debería.' : 'Something is not working as expected.',
        feature: language === 'es' ? 'Sugerir Función' : 'Suggest a Feature',
        featureDesc: language === 'es' ? 'Tengo una idea genial para la app.' : 'I have a great idea for the app.',
        other: language === 'es' ? 'Otro Asunto' : 'Other Inquiries',
        placeholder: language === 'es' ? 'Cuéntanos más detalles...' : 'Tell us more details...',
        submit: language === 'es' ? 'Enviar Comentarios' : 'Send Feedback',
        success: language === 'es' ? '¡Gracias! Hemos recibido tu mensaje.' : 'Thanks! We received your message.',
        successDesc: language === 'es' ? 'Tu feedback nos ayuda a construir algo mejor.' : 'Your feedback helps us build something better.'
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/20">

                {/* Header with Gradient */}
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">
                    <div className="absolute top-0 right-0 p-4">
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Decorative blurred blobs */}
                    <div className="absolute top-[-50%] left-[-20%] w-64 h-64 bg-brand-500/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-50%] right-[-10%] w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 border border-white/10 backdrop-blur-md">
                            <Sparkles className="w-6 h-6 text-brand-300" />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">{t.title}</h3>
                        <p className="text-slate-300 mt-2 font-medium">{t.desc}</p>
                    </div>
                </div>

                <div className="p-8">
                    {isSuccess ? (
                        <div className="py-8 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4">
                            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50/50">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">{t.success}</h3>
                            <p className="text-slate-500">{t.successDesc}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Option Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setType('bug')}
                                    className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 outline-none ${type === 'bug'
                                        ? 'border-red-200 bg-red-50/50 ring-2 ring-red-100 ring-offset-1'
                                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`p-2.5 w-fit rounded-xl mb-3 transition-colors ${type === 'bug' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-red-500 group-hover:shadow-sm'}`}>
                                        <Bug className="w-5 h-5" />
                                    </div>
                                    <div className="font-bold text-slate-800 text-sm mb-0.5">{t.bug}</div>
                                    <div className="text-xs text-slate-500 font-medium opacity-80">{t.bugDesc}</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setType('feature')}
                                    className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 outline-none ${type === 'feature'
                                        ? 'border-amber-200 bg-amber-50/50 ring-2 ring-amber-100 ring-offset-1'
                                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`p-2.5 w-fit rounded-xl mb-3 transition-colors ${type === 'feature' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-amber-500 group-hover:shadow-sm'}`}>
                                        <Lightbulb className="w-5 h-5" />
                                    </div>
                                    <div className="font-bold text-slate-800 text-sm mb-0.5">{t.feature}</div>
                                    <div className="text-xs text-slate-500 font-medium opacity-80">{t.featureDesc}</div>
                                </button>
                            </div>

                            {/* Text Area (Revealed on selection) */}
                            <div className={`transition-all duration-500 overflow-hidden ${type ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                        {type === 'feature' ? (language === 'es' ? 'Detalla tu idea:' : 'Detail your idea:') :
                                            type === 'bug' ? (language === 'es' ? 'Describe el problema:' : 'Describe the issue:') :
                                                (language === 'es' ? 'Mensaje:' : 'Message:')}
                                    </label>
                                    <textarea
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={t.placeholder}
                                        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 resize-none text-slate-700 placeholder:text-slate-400 font-medium transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className={`transition-all duration-300 ${type ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !message.trim()}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            {t.submit}
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
