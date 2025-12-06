import React from 'react';
import { Power } from 'lucide-react';
import { UserProfile, AppLanguage, AutoPilotConfig } from '../../../types';
import { translations } from '../../../translations';
import { Post } from '../../../types';

interface AutoPilotStatusProps {
    user: UserProfile;
    config: AutoPilotConfig;
    isEnabled: boolean;
    toggleSystem: () => void;
    language: AppLanguage;
    automatedPosts: Post[];
}

const AutoPilotStatus: React.FC<AutoPilotStatusProps> = ({
    user,
    config,
    isEnabled,
    toggleSystem,
    language,
    automatedPosts
}) => {
    const t = translations[language].app.autopilot;

    return (
        <div className={`rounded-3xl p-8 border transition-all duration-500 relative overflow-hidden shadow-lg group
            ${isEnabled
                ? 'bg-slate-900 border-slate-800 text-white ring-1 ring-white/10'
                : 'bg-white border-slate-200 text-slate-500'}
        `}>
            {isEnabled && (
                <>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                    {/* Radar Sweep Animation */}
                    <div className="absolute top-1/2 left-12 w-64 h-64 bg-gradient-to-t from-sky-500/20 to-transparent rounded-full blur-xl animate-[spin_4s_linear_infinite] opacity-30 origin-bottom-right"></div>
                </>
            )}

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={toggleSystem}
                        className={`w-20 h-10 rounded-full p-1 transition-all duration-300 relative
                            ${isEnabled ? 'bg-green-500 shadow-[0_0_25px_rgba(34,197,94,0.5)]' : 'bg-slate-200 hover:bg-slate-300'}
                        `}
                    >
                        <div className={`w-8 h-8 bg-white rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center ${isEnabled ? 'translate-x-10' : 'translate-x-0'}`}>
                            <Power className={`w-4 h-4 ${isEnabled ? 'text-green-500' : 'text-slate-400'}`} />
                        </div>
                    </button>
                    <div>
                        <h2 className={`text-sm font-bold uppercase tracking-widest mb-1 ${isEnabled ? 'text-green-400' : 'text-slate-400'}`}>
                            {isEnabled ? t.statusCard.active : t.statusCard.inactive}
                        </h2>
                        <p className="text-xs opacity-70 font-mono">
                            {isEnabled ? `ID: ${user.id.slice(0, 8)}... // ${t.activity.connected}` : t.activity.systemStandby}
                        </p>
                    </div>
                </div>

                <div className="flex gap-8 text-center md:text-left border-l border-white/10 pl-8 md:pl-0 md:border-l-0">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">{t.statusCard.nextRun}</p>
                        <p className={`text-xl font-display font-bold ${isEnabled ? 'text-white' : 'text-slate-900'}`}>
                            {isEnabled ? new Date(config.nextRun).toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : '--'}
                        </p>
                    </div>
                    <div className="hidden sm:block w-px bg-current opacity-10 h-10 self-center"></div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">{t.statusCard.lastRun}</p>
                        <p className={`text-xl font-display font-bold ${isEnabled ? 'text-white' : 'text-slate-900'}`}>
                            {automatedPosts.length > 0 ? new Date(automatedPosts[0].createdAt).toLocaleDateString() : '--'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoPilotStatus;
