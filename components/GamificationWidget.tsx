import React from 'react';
import { Flame, Trophy, Star } from 'lucide-react';
import { UserProfile } from '../types';

interface GamificationWidgetProps {
  user: UserProfile;
}

const GamificationWidget: React.FC<GamificationWidgetProps> = ({ user }) => {
  // Calculate progress to next level
  const nextLevel = user.level + 1;
  const xpForCurrentLevel = Math.pow(user.level, 2) * 100;
  const xpForNextLevel = Math.pow(nextLevel, 2) * 100;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const xpProgress = user.xp - xpForCurrentLevel;
  const percent = Math.min(100, Math.max(0, (xpProgress / xpNeeded) * 100));

  return (
    <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden group border border-slate-700">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/20 blur-2xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-brand-500/20 blur-xl rounded-full pointer-events-none"></div>

      {/* Header Stats */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-lg shadow-lg shadow-orange-500/20">
            <Trophy className="w-4 h-4 text-white fill-current" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Level {user.level}</p>
            <p className="text-sm font-bold leading-none">Creator</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg border border-white/5">
          <Flame className={`w-3.5 h-3.5 ${user.currentStreak > 0 ? 'text-orange-500 fill-current animate-pulse' : 'text-slate-500'}`} />
          <span className="text-xs font-bold">{user.currentStreak} Day Streak</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 font-medium">
            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-brand-400" /> {Math.floor(user.xp)} XP</span>
            <span>Lvl {nextLevel}</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out" 
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GamificationWidget;