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
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 text-slate-900 dark:text-white relative overflow-hidden group border border-slate-200/60/60 dark:border-slate-800 shadow-sm shadow-slate-200/50">
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
      </div>

      {/* Progress Bar */}
      <div className="relative z-10">
        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-brand-500 dark:text-brand-400" />{" "}
            {Math.floor(user.xp)} XP
          </span>
          <span>Lvl {nextLevel}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60/50 dark:border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000 ease-out"
            style={{ width: `${percent}%` }}
          >
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationWidget;
