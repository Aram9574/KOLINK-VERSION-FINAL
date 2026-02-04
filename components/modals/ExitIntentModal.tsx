import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Rocket, Timer, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { translations } from '../../translations';

interface ExitIntentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ isOpen, onClose }) => {
    const { language } = useUser();
    const t = translations[language].exitIntentCRO;
    
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

    useEffect(() => {
        if (!isOpen) return;
        
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
    };

    const handleUpgrade = () => {
        // Redirect to billing with promo intent
        window.location.href = '/company/pricing?promo=resolution2026';
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-0 bg-transparent shadow-none">
                <DialogTitle className="sr-only">{t.title}</DialogTitle>
                <DialogDescription className="sr-only">{t.subtitle}</DialogDescription>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#7C3AED] via-[#6366F1] to-[#3B82F6] p-8 text-white shadow-2xl"
                >
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
                    >
                        <X size={20} />
                    </button>

                    {/* Decorative Elements */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-xl mb-6 shadow-xl border border-white/20"
                        >
                            <Rocket className="w-8 h-8 text-white shadow-soft-glow" />
                        </motion.div>

                        <h2 className="text-3xl font-black mb-3 tracking-tight leading-tight">
                            {t.title}
                        </h2>
                        
                        <p className="text-lg text-white/90 font-medium mb-8 leading-relaxed max-w-[90%] mx-auto">
                            {t.subtitle}
                        </p>

                        {/* Countdown Timer Table Style */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8 w-full max-w-[280px] shadow-lg">
                            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mb-3 flex items-center justify-center gap-2">
                                <Timer size={12} className="animate-pulse" />
                                {t.timerLabel}
                            </div>
                            <div className="text-4xl font-mono font-black tabular-nums tracking-wider text-white">
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        {/* Pricing Visual */}
                        <div className="flex flex-col items-center mb-8">
                            <span className="text-xl text-white/50 line-through font-bold mb-1">
                                {t.originalPrice}
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-white drop-shadow-md">
                                    {t.discountPrice}
                                </span>
                            </div>
                        </div>

                        <Button 
                            onClick={handleUpgrade}
                            className="w-full h-14 text-lg font-black bg-white text-[#3B82F6] hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl shadow-xl gap-2 mb-4"
                        >
                            <Rocket className="w-5 h-5 fill-current" />
                            {t.cta}
                        </Button>

                        <button 
                            onClick={() => window.location.href = '/company/pricing'}
                            className="flex items-center gap-1 text-sm font-bold text-white/70 hover:text-white transition-colors py-2"
                        >
                            {t.features}
                            <ChevronRight size={16} />
                        </button>

                        <button 
                            onClick={onClose}
                            className="mt-6 text-xs text-white/40 hover:text-white/60 hover:underline transition-all"
                        >
                            {t.noThanks}
                        </button>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};
