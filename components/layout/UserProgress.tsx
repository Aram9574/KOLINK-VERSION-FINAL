import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Flame, ChevronRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { GamificationService } from '../../services/gamificationService';
import { translations } from '../../translations';

interface UserProgressProps {
    className?: string;
}

const UserProgress: React.FC<UserProgressProps> = ({ className = "" }) => {
    const { user, language } = useUser();
    
    // Safety check for translations
    const t = translations[language]?.levelUp?.widget || { 
        level: 'Level', xp: 'XP', to_next_level: 'to level up', credits: 'Credits' 
    };

    if (!user) return null;

    // Default values if data missing
    const xp = user.xp || 0;
    const level = user.level || 1;
    const credits = user.credits ?? 0;
    const streak = user.currentStreak || 0;

    const { progress, nextLevelXp } = GamificationService.getProgress(xp, level);

    return (
        <div className={`bg-white/50 backdrop-blur-md rounded-xl border border-slate-200/60 p-4 shadow-sm ${className}`}>
            
            {/* Header: Level & Streak */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center">
                         <span className="font-bold text-brand-600 text-sm">{level}</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            {t.level}
                        </p>
                        <p className="text-xs font-bold text-slate-700">Explorador</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-md border border-orange-100" title="Daily Streak">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span className="text-xs font-bold text-orange-700">{streak}</span>
                </div>
            </div>

            {/* XP Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-[10px] font-medium text-slate-400 mb-1.5">
                    <span>{t.xp}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-brand-400 to-indigo-500 rounded-full"
                    />
                </div>
                <p className="text-[9px] text-right mt-1 text-slate-400">
                    {Math.floor(nextLevelXp - xp)} XP {t.to_next_level}
                </p>
            </div>

            {/* Credits Balance */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-slate-100 text-slate-500">
                        <Zap size={14} className="fill-slate-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {t.credits}
                        </p>
                        <p className="text-sm font-bold text-slate-900 leading-none mt-0.5">
                            {credits === -1 ? '∞' : credits}
                        </p>
                    </div>
                </div>

                <button className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors shadow-sm hover:shadow-md">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default UserProgress;
