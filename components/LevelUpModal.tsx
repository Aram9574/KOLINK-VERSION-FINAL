import React, { useEffect } from 'react';
import { X, Trophy, Star, Zap } from 'lucide-react';
import { Achievement } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface LevelUpModalProps {
  onClose: () => void;
  data: {
    leveledUp: boolean;
    newLevel: number;
    newAchievements: string[];
  };
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ onClose, data }) => {
  useEffect(() => {
    // Auto close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const unlockedBadges = data.newAchievements
    .map(id => ACHIEVEMENTS.find(a => a.id === id))
    .filter((a): a is Achievement => !!a);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-8 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Confetti background effect (simulated with CSS gradients) */}
            <div className="absolute inset-0 bg-[radial-gradient(#eef2ff_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <div className="relative z-10">
                {data.leveledUp && (
                    <div className="mb-6">
                         <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-brand-400 to-indigo-600 rounded-2xl rotate-3 shadow-lg shadow-brand-500/40 flex items-center justify-center mb-4 animate-bounce">
                            <Star className="w-10 h-10 text-white fill-white" />
                         </div>
                         <h2 className="text-3xl font-display font-bold text-slate-900 mb-1">Level Up!</h2>
                         <p className="text-slate-500 font-medium">You are now Level <span className="text-brand-600 font-bold">{data.newLevel}</span></p>
                    </div>
                )}

                {unlockedBadges.length > 0 && (
                    <div className="space-y-4">
                        {!data.leveledUp && (
                             <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                <Trophy className="w-8 h-8 text-amber-600" />
                             </div>
                        )}
                        <h3 className="text-xl font-bold text-slate-800">Achievements Unlocked</h3>
                        <div className="grid gap-3">
                            {unlockedBadges.map(badge => (
                                <div key={badge.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 text-left">
                                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                        <Zap className="w-4 h-4 fill-current" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">{badge.title}</p>
                                        <p className="text-xs text-slate-500">+{badge.xpReward} XP</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button 
                    onClick={onClose}
                    className="mt-8 w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg"
                >
                    Awesome!
                </button>
            </div>
        </div>
    </div>
  );
};

export default LevelUpModal;