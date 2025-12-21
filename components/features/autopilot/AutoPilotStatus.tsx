import React from "react";
import {
    Activity,
    History as HistoryIcon,
    Power,
    Timer,
    Zap,
} from "lucide-react";
import { AppLanguage, AutoPilotConfig, UserProfile } from "../../../types";
import { translations } from "../../../translations";
import { Post } from "../../../types";

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
    automatedPosts,
}) => {
    const t = translations[language].app.autopilot;

    return (
        <div
            className={`relative rounded-[2.5rem] p-8 border transition-all duration-700 overflow-hidden shadow-2xl group
            ${
                isEnabled
                    ? "bg-white border-sky-100 text-slate-900 ring-4 ring-sky-500/5"
                    : "bg-white/70 backdrop-blur-xl border-white/40 text-slate-500"
            }
        `}
        >
            {/* Background Animations for Active State */}
            {isEnabled && (
                <>
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_0%,rgba(56,189,248,0.1),transparent_50%)]">
                    </div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/20 rounded-full blur-[80px] animate-pulse">
                    </div>

                    {/* Radar Sweep / Scanner Effect */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-sky-400/30 to-transparent animate-[shimmer_3s_infinite] skew-x-12">
                        </div>
                    </div>

                    {/* Circular Pulse */}
                    <div className="absolute top-1/2 left-10 w-4 h-4 bg-green-500 rounded-full blur-md animate-ping opacity-50">
                    </div>
                </>
            )}

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-8">
                    {/* Elite Toggle Switch */}
                    <div className="flex flex-col items-center gap-3">
                        <button
                            onClick={toggleSystem}
                            className={`w-24 h-12 rounded-full p-1.5 transition-all duration-500 relative ring-1
                                ${
                                isEnabled
                                    ? "bg-green-500/10 ring-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                                    : "bg-slate-200 ring-slate-300"
                            }
                            `}
                        >
                            <div
                                className={`w-9 h-9 border rounded-full shadow-lg transition-all duration-500 flex items-center justify-center
                                ${
                                    isEnabled
                                        ? "translate-x-12 bg-green-500 border-green-400"
                                        : "translate-x-0 bg-white border-slate-200"
                                }
                            `}
                            >
                                <Power
                                    className={`w-4 h-4 transition-colors ${
                                        isEnabled
                                            ? "text-white"
                                            : "text-slate-400"
                                    }`}
                                />
                            </div>
                        </button>
                        <span
                            className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                                isEnabled ? "text-green-400" : "text-slate-400"
                            }`}
                        >
                            {isEnabled
                                ? t.statusCard.systemLive
                                : t.statusCard.systemOff}
                        </span>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Activity
                                className={`w-4 h-4 ${
                                    isEnabled
                                        ? "text-sky-400"
                                        : "text-slate-300"
                                }`}
                            />
                            <h2
                                className={`text-sm font-bold uppercase tracking-widest ${
                                    isEnabled
                                        ? "text-sky-300"
                                        : "text-slate-400"
                                }`}
                            >
                                {isEnabled
                                    ? t.statusCard.active
                                    : t.statusCard.inactive}
                            </h2>
                        </div>
                        <p
                            className={`text-xs font-mono transition-opacity duration-500 ${
                                isEnabled
                                    ? "opacity-60 text-sky-800"
                                    : "opacity-40 text-slate-500"
                            }`}
                        >
                            {isEnabled
                                ? `OP_SIG: ${
                                    user.id?.slice(0, 8).toUpperCase() || "AUTH"
                                } // ${t.statusCard.cloudSyncOk}`
                                : t.statusCard.systemStandby}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-6 md:items-end">
                    <div className="space-y-1 text-center md:text-right">
                        <div className="flex items-center gap-2 mb-1 justify-center md:justify-end">
                            <Timer className="w-3.5 h-3.5 opacity-40" />
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                                {t.statusCard.nextRun}
                            </p>
                        </div>
                        <p className="text-2xl font-display font-bold tabular-nums text-slate-900">
                            {isEnabled
                                ? new Date(config.nextRun).toLocaleDateString(
                                    undefined,
                                    {
                                        weekday: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    },
                                )
                                : "--:--"}
                        </p>
                    </div>

                    <div className="space-y-1 text-center md:text-right">
                        <div className="flex items-center gap-2 mb-1 justify-center md:justify-end">
                            <HistoryIcon className="w-3.5 h-3.5 opacity-40" />
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                                {t.statusCard.lastRun}
                            </p>
                        </div>
                        <p className="text-2xl font-display font-bold tabular-nums text-slate-900">
                            {automatedPosts.length > 0
                                ? new Date(automatedPosts[0].createdAt)
                                    .toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                    })
                                : "--"}
                        </p>
                    </div>
                </div>
            </div>

            {isEnabled && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-[10px] font-mono text-sky-600/70">
                        <Zap className="w-3 h-3 animate-pulse" />
                        <span>
                            {t.statusCard.neuralProcessing}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutoPilotStatus;
