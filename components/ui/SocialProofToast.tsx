import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Users, TrendingUp } from 'lucide-react';

interface SocialProofToastProps {
    language: 'es' | 'en';
}

export const SocialProofToast: React.FC<SocialProofToastProps> = ({ language }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');

    const messages = {
        es: [
            "12 personas crearon un post viral hace 5 min",
            "4 CEOs optimizaron su perfil hoy",
            "34 ganchos generados en la última hora",
            "Nuevo usuario de Madrid acaba de unirse a Viral"
        ],
        en: [
            "12 people created a viral post 5 min ago",
            "4 CEOs optimized their profile today",
            "34 hooks generated in the last hour",
            "New user from London just joined Viral"
        ]
    };

    useEffect(() => {
        // Show after 5 seconds
        const timer = setTimeout(() => {
            const randomMsg = messages[language][Math.floor(Math.random() * messages[language].length)];
            setMessage(randomMsg);
            setIsVisible(true);

            // Hide after 6 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 6000);
        }, 5000);

        return () => clearTimeout(timer);
    }, [language]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.9 }}
                    className="fixed bottom-24 left-6 z-[100] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xl flex items-center gap-3 max-w-xs"
                >
                    <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 shrink-0">
                        <Users size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Social Proof</p>
                        <p className="text-[13px] text-slate-900 dark:text-white font-semibold leading-snug">
                            {message}
                        </p>
                    </div>
                    <div className="absolute top-2 right-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
