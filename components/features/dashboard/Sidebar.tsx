import React from "react";
import {
    Bot,
    Crown,
    Edit3,
    Gift,
    History as HistoryIcon,
    LayoutGrid,
    Lightbulb,
    LogOut,
    MessageSquareText,
    Settings as SettingsIcon,
    Sparkles,
    FileText,
} from "lucide-react";
import { AppLanguage, AppTab, Post, UserProfile } from "../../../types";
import GamificationWidget from "./GamificationWidget";
import History from "../history/History";
import { translations } from "../../../translations";

import { useUser } from "../../../context/UserContext";
import { getAvatarUrl } from "../../../utils";

interface SidebarProps {
    posts: Post[];
    currentPost: Post | null;
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
    onSelectPost: (post: Post) => void;
    onDeletePost: (id: string, e: React.MouseEvent) => void;
    onUpgrade: () => void;
    onSettingsClick: () => void;
    className?: string;
    showCreditDeduction?: boolean;
    onReferral?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    posts,
    currentPost,
    activeTab,
    setActiveTab,
    onSelectPost,
    onDeletePost,
    onUpgrade,
    onSettingsClick,
    className = "",
    showCreditDeduction = false,
    onReferral,
}) => {
    const { user, language, logout } = useUser();
    const t = translations[language].app.sidebar;

    return (
        <aside
            id="tour-sidebar"
            className={`bg-white border-r border-slate-200 flex flex-col h-full ${className}`}
        >
            <div className="p-6 flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 transition-transform duration-300 hover:scale-105">
                    <img
                        src="/brand-logo.jpg"
                        alt="Kolink Logo"
                        className="w-full h-full object-contain rounded-xl shadow-lg shadow-brand-500/20"
                    />
                </div>
                <span className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                    Kolink
                </span>
            </div>

            <div className="px-4 mb-2 flex-shrink-0">
                <GamificationWidget user={user} />
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
                    onClick={() => setActiveTab("audit")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "audit"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    <FileText className="w-5 h-5" />
                    {t.audit}
                    {!user.isPremium && (
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20 ml-auto flex-shrink-0" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("chat")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "chat"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    <MessageSquareText className="w-5 h-5" />
                    Nexus AI
                    {!user.isPremium && (
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20 ml-auto flex-shrink-0" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("editor")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "editor"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    <Edit3 className="w-5 h-5" />
                    {translations[language].app.sidebar.editor}
                    {!user.isPremium && (
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20 ml-auto flex-shrink-0" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("carousel")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "carousel"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    <Crown className="w-5 h-5" />
                    {language === "es"
                        ? "Generador de Carrusel"
                        : "Carousel Generator"}
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

                <button
                    onClick={onReferral}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-200 group"
                >
                    <Gift className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                        {language === "es"
                            ? "Gana 1 Mes Gratis"
                            : "Get 1 Month Free"}
                    </span>
                </button>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    {t.logout}
                </button>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/30 backdrop-blur-sm flex-shrink-0">
                {!user.isPremium && (
                    <div
                        onClick={onUpgrade}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-5 text-slate-900 dark:text-white mb-5 relative overflow-hidden group cursor-pointer border border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-200/50 transition-transform hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Crown className="w-20 h-20 rotate-12 translate-x-4 -translate-y-4" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <h4 className="font-bold text-sm">
                                    {t.goPremium}
                                </h4>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-300 mb-3 leading-relaxed">
                                {t.unlockDesc}
                            </p>
                            <button className="text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity w-full">
                                {t.upgradeNow}
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 px-1">
                    <img
                        src={getAvatarUrl(user)}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <p className="text-sm font-bold text-slate-900 truncate">
                                {user.name}
                            </p>
                            {user.isPremium && (
                                <Crown className="w-3 h-3 text-amber-500 fill-current" />
                            )}
                        </div>
                        {!user.isPremium && (
                            <div className="relative inline-block">
                                <p
                                    id="tour-credits"
                                    className={`text-xs transition-all duration-300 ${
                                        showCreditDeduction
                                            ? "text-red-600 font-bold scale-105"
                                            : "text-slate-500"
                                    }`}
                                >
                                    {user.credits} {t.creditsLeft}
                                </p>
                                {showCreditDeduction && (
                                    <div className="absolute -top-4 left-0 text-xs font-bold text-red-600 animate-bounce whitespace-nowrap">
                                        -1
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={onSettingsClick}
                            className={`p-2 hover:bg-slate-200 rounded-full transition-colors ${
                                activeTab === "settings"
                                    ? "text-brand-600 bg-brand-50"
                                    : "text-slate-400"
                            }`}
                        >
                            <SettingsIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors text-slate-400 hover:text-red-500"
                            title={t.logout}
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
