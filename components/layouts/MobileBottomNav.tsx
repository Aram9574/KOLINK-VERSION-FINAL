import React from "react";
import {
    Bot,
    Crown,
    History as HistoryIcon,
    LayoutGrid,
    Settings,
    Sparkles,
} from "lucide-react";
import { useUser } from "../../context/UserContext";
import { translations } from "../../translations";
import { Post } from "../../types";

interface MobileBottomNavProps {
    activeTab:
        | "create"
        | "history"
        | "settings"
        | "autopilot"
        | "auditor"
        | "ideas";
    setActiveTab: (
        tab:
            | "create"
            | "history"
            | "settings"
            | "autopilot"
            | "auditor"
            | "ideas",
    ) => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
    activeTab,
    setActiveTab,
}) => {
    const { user, language } = useUser();
    const t = translations[language].app.sidebar;

    const navItems = [
        {
            id: "create" as const,
            icon: LayoutGrid,
            label: t.studio,
        },
        {
            id: "history" as const,
            icon: HistoryIcon,
            label: t.history,
        },
        {
            id: "autopilot" as const,
            icon: Bot,
            label: t.autopilot,
            isPremium: true,
        },
        {
            id: "auditor" as const,
            icon: Sparkles,
            label: language === "es" ? "Auditor" : "Auditor",
            isPremium: true,
        },
        {
            id: "settings" as const,
            icon: Settings,
            label: t.settings,
        },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 mb-2 ${
                                isActive
                                    ? "text-brand-600"
                                    : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            <div
                                className={`relative p-1 rounded-lg transition-all ${
                                    isActive ? "bg-brand-50" : ""
                                }`}
                            >
                                <Icon
                                    className={`w-6 h-6 ${
                                        isActive ? "stroke-[2.5px]" : "stroke-2"
                                    }`}
                                />
                                {item.isPremium && !user.isPremium && (
                                    <Crown className="absolute -top-1 -right-1 w-3 h-3 text-amber-500 fill-amber-500" />
                                )}
                            </div>
                            <span
                                className={`text-[10px] font-medium leading-none ${
                                    isActive
                                        ? "text-brand-600"
                                        : "text-slate-500"
                                }`}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
