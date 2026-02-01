import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface AIFeedbackButtonsProps {
    postId?: string; // Nuevo
    inputContext: any;
    outputContent: string;
    metadata?: any;
    className?: string;
}

import { usePostFeedback } from '../../hooks/usePostFeedback';

export const AIFeedbackButtons: React.FC<AIFeedbackButtonsProps> = ({
    postId,
    inputContext,
    outputContent,
    metadata,
    className = ""
}) => {
    const { user } = useUser();
    const { submitFeedback, isSubmitting } = usePostFeedback();
    const [status, setStatus] = useState<'idle' | 'submitted'>('idle');
    const [rating, setRating] = useState<1 | -1 | null>(null);

    const handleFeedback = async (val: 1 | -1) => {
        if (!user?.id || isSubmitting || status === 'submitted') return;
        if (!postId) {
            console.warn("Feedback attempt without postId");
            return;
        }

        setRating(val);
        const success = await submitFeedback(postId, val === 1 ? 'positive' : 'negative');

        if (success) {
            setStatus('submitted');
        } else {
            setRating(null);
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
                            disabled={isSubmitting}
                            onClick={() => handleFeedback(1)}
                            className={`p-1.5 rounded-lg border transition-all ${
                                rating === 1 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                : 'bg-white border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100'
                            }`}
                        >
                            <ThumbsUp className={`w-4 h-4 ${isSubmitting && rating === 1 ? 'animate-pulse' : ''}`} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={isSubmitting}
                            onClick={() => handleFeedback(-1)}
                            className={`p-1.5 rounded-lg border transition-all ${
                                rating === -1 
                                ? 'bg-rose-50 border-rose-200 text-rose-600' 
                                : 'bg-white border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100'
                            }`}
                        >
                            <ThumbsDown className={`w-4 h-4 ${isSubmitting && rating === -1 ? 'animate-pulse' : ''}`} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
