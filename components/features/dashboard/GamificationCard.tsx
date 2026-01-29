import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp, Zap } from 'lucide-react';

interface GamificationCardProps {
    user: any;
    language: 'es' | 'en';
}

export const GamificationCard: React.FC<GamificationCardProps> = ({ user, language }) => {
    // Endowed Progress: Give user a head start of 15% (for completing profile/initial setup)
    const endowedProgress = 15;
    const actualProgress = 0; // This should come from user stats/experience
    const totalProgress = Math.min(endowedProgress + actualProgress, 100);

    const level = 1;
    const nextLevel = 2;
    const pointsToNext = 150;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden group"
        >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Trophy size={80} className="text-brand-500" />
            </div>

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center text-brand-600">
                            <Star className="fill-brand-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {language === 'es' ? 'Rango: Creador Emergente' : 'Rank: Rising Creator'}
                                <span className="text-[10px] bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full uppercase tracking-tighter font-black">
                                    Nivel {level}
                                </span>
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                {language === 'es' ? 'Faltan ' : 'Only '}
                                <span className="text-brand-600 font-bold">{pointsToNext}xp</span>
                                {language === 'es' ? ' para el Nivel ' : ' until Level '} {nextLevel}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{language === 'es' ? 'Progreso' : 'Progress'}</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">{totalProgress}%</p>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex">
                    {/* Endowed Progress Section (Visual differentiation) */}
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${endowedProgress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-brand-300 dark:bg-brand-800/50 relative overflow-hidden"
                    >
                         <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </motion.div>
                    
                    {/* Actual Progress Section */}
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${actualProgress}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                        className="h-full bg-brand-600 relative"
                    >
                         <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </motion.div>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <Zap size={14} className="text-amber-500" />
                        <span>Streak: 2 {language === 'es' ? 'días' : 'days'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <TrendingUp size={14} className="text-emerald-500" />
                        <span>+12% {language === 'es' ? 'engagement' : 'engagement'}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
