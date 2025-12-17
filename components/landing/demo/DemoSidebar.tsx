import React from "react";
import {
    Bot,
    Crown,
    Gift,
    History as HistoryIcon,
    LayoutGrid,
    LogOut,
    Settings as SettingsIcon,
    Sparkles,
} from "lucide-react";
import { translations } from "../../../translations";
import { AppLanguage } from "../../../types";

interface DemoSidebarProps {
    language: AppLanguage;
    activeTab: string;
    setActiveTab: (tab: any) => void;
}

const DemoSidebar: React.FC<DemoSidebarProps> = ({
    language,
    activeTab,
    setActiveTab,
}) => {
    const t = translations[language].app.sidebar;

    // Mock user for demo
    const user = {
        name: "Alex Rivera",
        isPremium: false,
        credits: 20,
    };

    return (
        <aside className="bg-white border-r border-slate-200 flex flex-col h-full w-full md:w-64">
            <div className="p-6 flex items-center gap-3 flex-shrink-0">
                <div className="w-9 h-9 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold font-display text-xl shadow-lg shadow-brand-500/30">
                    K
                </div>
                <span className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                    Kolink
                </span>
            </div>

            {/* Mock Gamification Widget */}
            <div className="px-4 mb-2 flex-shrink-0">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-4 text-white relative overflow-hidden shadow-lg group cursor-pointer border border-indigo-400/30">
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md shadow-inner">
                                <Crown className="w-5 h-5 text-indigo-100 fill-indigo-100/20" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 mb-0.5">
                                    {language === "es" ? "Nivel 1" : "Level 1"}
                                </p>
                                <h3 className="font-display font-bold text-lg leading-none tracking-tight">
                                    {language === "es" ? "Creador" : "Creator"}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5 relative z-10">
                        <div className="flex justify-between text-xs font-medium text-indigo-100/90">
                            <span>
                                {language === "es"
                                    ? "ADN de Marca"
                                    : "Brand DNA"}
                            </span>
                            <span className="font-bold text-white">99%</span>
                        </div>
                        <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <div
                                className="h-full bg-gradient-to-r from-white/90 to-white/70 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out"
                                style={{ width: "99%" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
                <button
                    onClick={() => setActiveTab("create")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "create"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    <LayoutGrid className="w-5 h-5" />
                    {t.studio}
                </button>

                <button
                    onClick={() => setActiveTab("auditor")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "auditor"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    <Sparkles className="w-5 h-5" />
                    {language === "es"
                        ? "Auditor de Perfil"
                        : "Profile Auditor"}
                    {!user.isPremium && (
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20 ml-auto flex-shrink-0" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("autopilot")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "autopilot"
                            ? "bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    <Bot className="w-5 h-5" />
                    {t.autopilot}
                    {!user.isPremium && (
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20 ml-auto flex-shrink-0" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "history"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    <HistoryIcon className="w-5 h-5" />
                    <div className="flex-1 text-left">{t.history}</div>
                    {!user.isPremium && (
                        <div
                            className="flex-none text-amber-500 opacity-80"
                            title="Premium Feature"
                        >
                            <Crown className="w-3.5 h-3.5 fill-amber-500/10" />
                        </div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "settings"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    <SettingsIcon className="w-5 h-5" />
                    <div className="flex-1 text-left">{t.settings}</div>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-200 group">
                    <LogOut className="w-5 h-5" />
                    {t.logout}
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-200 group">
                    <Gift className="w-5 h-5 text-violet-500 group-hover:scale-110 transition-transform" />
                    <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                        {language === "es"
                            ? "Gana 1 Mes Gratis"
                            : "Get 1 Month Free"}
                    </span>
                </button>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/30 backdrop-blur-sm flex-shrink-0">
                <div className="flex items-center gap-3 px-1">
                    <img
                        src="https://picsum.photos/seed/alex/150/150"
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <p className="text-sm font-bold text-slate-900 truncate">
                                {user.name}
                            </p>
                        </div>
                        <div className="relative inline-block">
                            <p className="text-xs text-slate-500">
                                {user.credits} {t.creditsLeft}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DemoSidebar;
