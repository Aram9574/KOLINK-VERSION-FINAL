import React, { useEffect, useState } from "react";
import {
    AlertTriangle,
    Clock,
    Lightbulb,
    MessageSquare,
    Monitor,
    Smartphone,
    TrendingUp,
    Zap,
} from "lucide-react";
import { AppLanguage, UserProfile } from "../../../types";
import FeedbackModal from "../../modals/FeedbackModal";
import { getAvatarUrl } from "../../../utils";

import NotificationBell from "../notifications/NotificationBell";

interface DashboardHeaderProps {
    user: UserProfile;
    language: AppLanguage;
    setLanguage: (lang: AppLanguage) => void;
    activeTab: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = (
    { user, language, setLanguage, activeTab },
) => {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    return (
        <>
            <header className="hidden lg:flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-display font-bold text-slate-900">
                        {activeTab === "create" &&
                            (language === "es" ? "Estudio" : "Studio")}
                        {activeTab === "history" &&
                            (language === "es" ? "Historial" : "History")}
                        {activeTab === "settings" &&
                            (language === "es" ? "Ajustes" : "Settings")}
                        {activeTab === "ideas" && (language === "es"
                            ? "Generador de Ideas"
                            : "Idea Generator")}
                        {activeTab === "autopilot" && "AutoPilot"}
                    </h1>
                    {activeTab === "create" && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold border border-brand-100 animate-in fade-in slide-in-from-left-4 duration-500">
                            <Zap className="w-3 h-3 fill-current" />
                            {language === "es"
                                ? "Modo Turbo Activo"
                                : "Turbo Mode Active"}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <NotificationBell
                            userId={user.id}
                            language={language}
                        />

                        <button
                            onClick={() => setIsFeedbackOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 hover:border-violet-200 text-violet-700 rounded-full text-xs font-bold transition-all hover:shadow-sm hover:from-violet-100 hover:to-indigo-100 mr-2 group"
                        >
                            <MessageSquare className="w-3.5 h-3.5 text-violet-600 group-hover:scale-110 transition-transform" />
                            {language === "es" ? "Sugerencias" : "Feedback"}
                        </button>

                        <button
                            onClick={() =>
                                setLanguage(language === "en" ? "es" : "en")}
                            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-sm shadow-sm"
                            title="Switch Language"
                        >
                            {language === "en" ? "🇺🇸" : "🇪🇸"}
                        </button>
                        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-slate-900">
                                    {user.name || "User"}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {user.email}
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 p-0.5 shadow-md">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                    <img
                                        src={getAvatarUrl(user)}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                language={language}
                user={user}
            />
        </>
    );
};

export default DashboardHeader;
