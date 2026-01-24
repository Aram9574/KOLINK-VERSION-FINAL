import React from "react";
import { Flame, Star, Trophy } from "lucide-react";
import { UserProfile } from "../../../types";

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
    <div className="card-nexus p-6 relative overflow-hidden group">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 dark:bg-indigo-500/20 blur-2xl rounded-full pointer-events-none">
      </div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-brand-500/5 dark:bg-brand-500/20 blur-xl rounded-full pointer-events-none">
      </div>

      {/* Header Stats */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-lg shadow-lg shadow-orange-500/20">
            <Trophy className="w-4 h-4 text-white fill-current" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Level {user.level}
            </p>
            <p className="text-sm font-bold leading-none">Creator</p>
          </div>
        </div>

        {/* Streak Counter */}
        {user.currentStreak > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-500/20 rounded-full">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-current animate-pulse" />
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {user.currentStreak}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative z-10">
        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-brand-500 dark:text-brand-400" />{" "}
            {Math.floor(user.xp)} XP
          </span>
          <span className="flex items-center gap-1 text-slate-400">
             <div className="w-3 h-3 rounded-full border border-slate-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
             </div>
             Unlock: Carousel Editor (Lvl {nextLevel})
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60/50 dark:border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000 ease-out"
            style={{ width: `${percent}%` }}
          >
          </div>
        </div>
        
        {/* Loss Aversion Micro-copy */}
        {user.currentStreak > 0 && (
             <p className="text-[9px] text-center mt-2 text-rose-500/80 font-medium">
                🔥 Don't lose your {user.currentStreak}-day streak!
            </p>
        )}
      </div>
    </div>
  );
};

export default GamificationWidget;
