import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import { feedbackRepository } from '../../services/feedbackRepository';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';

interface AIFeedbackButtonsProps {
    inputContext: any;
    outputContent: string;
    metadata?: any;
    className?: string;
}

export const AIFeedbackButtons: React.FC<AIFeedbackButtonsProps> = ({
    inputContext,
    outputContent,
    metadata,
    className = ""
}) => {
    const { user } = useUser();
    const toast = useToast();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
    const [rating, setRating] = useState<1 | -1 | null>(null);

    const handleFeedback = async (val: 1 | -1) => {
        if (!user?.id || status === 'submitting' || status === 'submitted') return;

        setStatus('submitting');
        setRating(val);

        const { success } = await feedbackRepository.submitAIFeedback({
            user_id: user.id,
            input_context: inputContext,
            output_content: outputContent,
            rating: val,
            metadata: metadata || {}
        });

        if (success) {
            setStatus('submitted');
            toast.success("¡Gracias! Tu feedback ayuda a entrenar mi IA.", "Feedback recibido");
        } else {
            setStatus('idle');
            setRating(null);
            toast.error("No se pudo enviar el feedback. Reintenta luego.", "Error");
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <AnimatePresence mode="wait">
                {status === 'submitted' ? (
                    <motion.div
                        key="thanks"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-emerald-600 font-medium text-xs bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100"
                    >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>¡Feedback enviado!</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="buttons"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5"
                    >
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Feedback:</span>
                        
                        <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={status === 'submitting'}
                            onClick={() => handleFeedback(1)}
                            className={`p-1.5 rounded-lg border transition-all ${
                                rating === 1 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                : 'bg-white border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100'
                            }`}
                        >
                            <ThumbsUp className={`w-4 h-4 ${status === 'submitting' && rating === 1 ? 'animate-pulse' : ''}`} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={status === 'submitting'}
                            onClick={() => handleFeedback(-1)}
                            className={`p-1.5 rounded-lg border transition-all ${
                                rating === -1 
                                ? 'bg-rose-50 border-rose-200 text-rose-600' 
                                : 'bg-white border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100'
                            }`}
                        >
                            <ThumbsDown className={`w-4 h-4 ${status === 'submitting' && rating === -1 ? 'animate-pulse' : ''}`} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
