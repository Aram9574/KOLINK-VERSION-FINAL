import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Trophy, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';

interface LevelUpModalProps {
    isOpen: boolean;
    newLevel: number;
    onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, newLevel, onClose }) => {
    const { language } = useUser();
    const t = translations[language].levelUp;

    useEffect(() => {
        if (isOpen) {
            // Trigger Confetti
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                
                // since particles fall down, start a bit higher than random
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="relative z-60 bg-white rounded-3xl border border-white/20 shadow-2xl overflow-hidden w-full max-w-sm text-center"
                    >
                         {/* Decorative Background */}
                         <div className="absolute inset-0 bg-gradient-to-b from-brand-50 to-white z-0" />
                         <div className="absolute top-0 inset-x-0 h-32 bg-[url('/grid-pattern.svg')] opacity-10" />

                        <div className="relative z-10 p-8 flex flex-col items-center">
                            
                            {/* Close Button */}
                            <button 
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Badge Animation */}
                            <motion.div 
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", delay: 0.2, damping: 12 }}
                                className="w-24 h-24 bg-gradient-to-br from-brand-400 to-indigo-600 rounded-full flex items-center justify-center shadow-xl shadow-brand-500/30 mb-6 relative"
                            >
                                <Trophy className="text-white w-12 h-12 relative z-10" strokeWidth={1.5} />
                                <div className="absolute inset-0 rounded-full bg-white/20 blur-md animate-pulse" />
                            </motion.div>

                            <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                {t.title}
                            </h2>
                            
                            <p className="text-slate-500 mb-6">
                                {t.subtitle.replace("{{level}}", "")}
                                <span className="font-bold text-brand-600 ml-1.5 text-lg">{newLevel}</span>
                            </p>

                            <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Sparkles className="text-amber-500 w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        {t.rewards}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                     <span className="text-sm font-medium text-slate-700">{t.bonus_credits}</span>
                                     <span className="font-bold text-emerald-600">+10 Tokens</span>
                                </div>
                            </div>

                            <button 
                                onClick={onClose}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 transition-all"
                            >
                                {t.continue}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LevelUpModal;
