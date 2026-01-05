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
    MessageCircle,
    Settings as SettingsIcon,
    FileText,
    Fingerprint,
    X,
    Sparkles,
} from "lucide-react";
import { AppLanguage, AppTab, Post, UserProfile } from "../../../types.ts";
import GamificationWidget from "./GamificationWidget.tsx";
import History from "../history/History.tsx";
import { translations } from "../../../translations.ts";

import { useUser } from "../../../context/UserContext.tsx";
import { getAvatarUrl } from "../../../utils.ts";
import { motion } from "framer-motion";
import { hapticFeedback } from "../../../lib/animations.ts";

interface SidebarProps {
    posts: Post[];
    currentPost: Post | null;
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
    onSelectPost: (post: Post) => void;
    onDeletePost: (id: string, e: React.MouseEvent) => void;
    onUpgrade: () => void;
    onSettingsClick: () => void;
    onReferral?: () => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
    className?: string;
    showCreditDeduction?: boolean;
}

const Sidebar = ({
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
    isCollapsed = false,
    onToggleCollapse,
}: SidebarProps) => {
    const { user, language, logout } = useUser();
    const t = translations[language].app.sidebar;

    return (
        <aside
            id="tour-sidebar"
            className={`bg-slate-50/80 backdrop-blur-md border-r-[0.5px] border-slate-200/60 flex flex-col h-full shadow-none transition-all duration-300 ${className}`}
        >
            <div className={`p-6 flex items-center justify-between flex-shrink-0 ${isCollapsed ? "px-4" : ""}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 transition-transform duration-300 hover:scale-105 flex-shrink-0">
                        <img
                            src="/logo.png"
                            alt="Kolink Logo"
                            className="w-full h-full object-cover scale-110 rounded-xl shadow-soft-glow"
                        />
                    </div>
                    {!isCollapsed && (
                        <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-display font-bold text-2xl text-slate-900 tracking-tight whitespace-nowrap"
                        >
                            Kolink
                        </motion.span>
                    )}
                </div>
                {!isCollapsed && onToggleCollapse && (
                    <button 
                        onClick={onToggleCollapse}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 group transition-colors"
                        title="Collapse Sidebar"
                    >
                        <X className="w-4 h-4 group-hover:scale-90 transition-transform" />
                    </button>
                )}
                {isCollapsed && onToggleCollapse && (
                    <button 
                        onClick={onToggleCollapse}
                        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 shadow-sm hover:text-slate-900 z-[60]"
                    >
                        <Bot className="w-3 h-3 rotate-180" />
                    </button>
                )}
            </div>

            {!isCollapsed && (
                <div className="px-4 mb-2 flex-shrink-0">
                    <GamificationWidget user={user} />
                </div>
            )}

            <div className={`flex-1 ${isCollapsed ? "px-2" : "px-4"} py-2 space-y-1 overflow-y-auto no-scrollbar`}>
                <motion.button
                    onClick={() => setActiveTab("create")}
                    {...hapticFeedback}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "create"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                    title={isCollapsed ? t.studio : ""}
                >
                    <LayoutGrid className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && t.studio}
                </motion.button>

                <motion.button
                    onClick={() => setActiveTab("audit")}
                    {...hapticFeedback}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "audit"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                    title={isCollapsed ? t.audit : ""}
                >
                    <FileText className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && t.audit}
                    {!isCollapsed && !user.isPremium && (
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20 ml-auto flex-shrink-0" />
                    )}
                </motion.button>

                <motion.button
                    onClick={() => setActiveTab("voice-lab")}
                    {...hapticFeedback}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "voice-lab"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                    title={isCollapsed ? (language === "es" ? "Laboratorio de Voz" : "Voice Lab") : ""}
                >
                    <Fingerprint className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (language === "es" ? "Laboratorio de Voz" : "Voice Lab")}
                    {!isCollapsed && !user.isPremium && (
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20 ml-auto flex-shrink-0" />
                    )}
                </motion.button>

                <motion.button
                    onClick={() => setActiveTab("insight-responder")}
                    {...hapticFeedback}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "insight-responder"
                            ? "bg-brand-50 text-indigo-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                    title={isCollapsed ? (language === "es" ? "Insight Responder" : "Insight Responder") : ""}
                >
                    <MessageCircle className="w-5 h-5 flex-shrink-0 text-indigo-500" />
                    {!isCollapsed && (language === "es" ? "Insight Responder" : "Insight Responder")}
                    {!isCollapsed && !user.isPremium && (
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20 ml-auto flex-shrink-0" />
                    )}
                </motion.button>

                <motion.button
                    onClick={() => setActiveTab("chat")}
                    {...hapticFeedback}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "chat"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                    title={isCollapsed ? "Nexus AI" : ""}
                >
                    <MessageSquareText className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && "Nexus AI"}
                    {!isCollapsed && !user.isPremium && (
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20 ml-auto flex-shrink-0" />
                    )}
                </motion.button>

                <motion.button
                    onClick={() => setActiveTab("editor")}
                    {...hapticFeedback}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "editor"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                    title={isCollapsed ? translations[language].app.sidebar.editor : ""}
                >
                    <Edit3 className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && translations[language].app.sidebar.editor}
                    {!isCollapsed && !user.isPremium && (
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20 ml-auto flex-shrink-0" />
                    )}
                </motion.button>

                <motion.button
                    onClick={() => setActiveTab("carousel")}
                    {...hapticFeedback}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "carousel"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                    title={isCollapsed ? (language === "es" ? "Generador de Carrusel" : "Carousel Generator") : ""}
                >
                    <Crown className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (language === "es" ? "Generador de Carrusel" : "Carousel Generator")}
                    {!isCollapsed && !user.isPremium && (
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20 ml-auto flex-shrink-0" />
                    )}
                </motion.button>

                <motion.button
                    onClick={() => setActiveTab("autopilot")}
                    {...hapticFeedback}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "autopilot"
                            ? "bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                    title={isCollapsed ? t.autopilot : ""}
                >
                    <Bot className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && t.autopilot}
                    {!isCollapsed && !user.isPremium && (
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20 ml-auto flex-shrink-0" />
                    )}
                </motion.button>
                <motion.button
                    onClick={() => setActiveTab("history")}
                    {...hapticFeedback}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "history"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                    title={isCollapsed ? t.history : ""}
                >
                    <HistoryIcon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <div className="flex-1 text-left">{t.history}</div>}
                    {!isCollapsed && !user.isPremium && (
                        <div
                            className="flex-none text-amber-500 opacity-80"
                            title="Premium Feature"
                        >
                            <Crown className="w-3.5 h-3.5 fill-amber-500/10" />
                        </div>
                    )}
                </motion.button>
                <motion.button
                    onClick={() => setActiveTab("settings")}
                    {...hapticFeedback}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                        activeTab === "settings"
                            ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200"
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                    title={isCollapsed ? t.settings : ""}
                >
                    <SettingsIcon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <div className="flex-1 text-left">{t.settings}</div>}
                </motion.button>

                <motion.button
                    onClick={onReferral}
                    {...hapticFeedback}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-200 group`}
                    title={isCollapsed ? (language === "es" ? "Gana 1 Mes Gratis" : "Get 1 Month Free") : ""}
                >
                    <Gift className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    {!isCollapsed && (
                        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                            {language === "es"
                                ? "Gana 1 Mes Gratis"
                                : "Get 1 Month Free"}
                        </span>
                    )}
                </motion.button>

                <motion.button
                    onClick={logout}
                    {...hapticFeedback}
                    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-200`}
                    title={isCollapsed ? t.logout : ""}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && t.logout}
                </motion.button>
            </div>

            <div className={`p-4 border-t border-slate-200/60 transition-all duration-300 ${isCollapsed ? "px-2" : "bg-slate-50/30 backdrop-blur-sm"} flex-shrink-0`}>
                {!isCollapsed && !user.isPremium && (
                    <motion.div
                        onClick={onUpgrade}
                        {...hapticFeedback}
                        className="glass dark:bg-slate-900 rounded-xl p-5 text-slate-900 dark:text-white mb-5 relative overflow-hidden group cursor-pointer border border-slate-200/60 dark:border-slate-800 shadow-soft-glow transition-transform hover:-translate-y-1"
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
                            <button 
                                type="button"
                                className="text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity w-full"
                            >
                                {t.upgradeNow}
                            </button>
                        </div>
                    </motion.div>
                )}

                <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-1"}`}>
                    <img
                        src={getAvatarUrl(user)}
                        alt="User"
                        className={`w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover transition-all ${isCollapsed ? "scale-90" : ""}`}
                    />
                    {!isCollapsed && (
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
                    )}
                    {!isCollapsed && (
                        <div className="flex gap-1">
                            <motion.button
                                onClick={onSettingsClick}
                                {...hapticFeedback}
                                className={`p-2 hover:bg-slate-200 rounded-full transition-colors ${
                                    activeTab === "settings"
                                        ? "text-brand-600 bg-brand-50"
                                        : "text-slate-400"
                                }`}
                            >
                                <SettingsIcon className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                onClick={logout}
                                {...hapticFeedback}
                                className="p-2 hover:bg-red-50 rounded-full transition-colors text-slate-400 hover:text-red-500"
                                title={t.logout}
                            >
                                <LogOut className="w-4 h-4" />
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
