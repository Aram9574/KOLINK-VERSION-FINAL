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
import { AppLanguage, UserProfile } from "../../../types.ts";
import FeedbackModal from "../../modals/FeedbackModal.tsx";
import { getAvatarUrl } from "../../../utils.ts";
import { motion } from "framer-motion";
import { hapticFeedback } from "../../../lib/animations.ts";

import NotificationBell from "../notifications/NotificationBell.tsx";

interface DashboardHeaderProps {
    user: UserProfile;
    language: AppLanguage;
    setLanguage: (lang: AppLanguage) => void;
    activeTab: string;
}

const DashboardHeader = (
    { user, language, setLanguage, activeTab }: DashboardHeaderProps,
) => {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    return (
        <>
            <header className="hidden lg:flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200/60/60 shadow-sm z-10">
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
                        {activeTab === "carousel" &&
                            (language === "es"
                                ? "Generador de Carrusel"
                                : "Carousel Generator")}
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <NotificationBell
                            userId={user.id}
                            language={language}
                        />

                        <motion.button
                            onClick={() => setIsFeedbackOpen(true)}
                            {...hapticFeedback}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 hover:border-violet-200 text-violet-700 rounded-full text-xs font-bold transition-all hover:shadow-sm hover:from-violet-100 hover:to-indigo-100 mr-2 group"
                        >
                            <MessageSquare className="w-3.5 h-3.5 text-violet-600 group-hover:scale-110 transition-transform" />
                            {language === "es" ? "Sugerencias" : "Feedback"}
                        </motion.button>

                        <motion.button
                            onClick={() =>
                                setLanguage(language === "en" ? "es" : "en")}
                            {...hapticFeedback}
                            className="w-9 h-9 rounded-full bg-white border border-slate-200/60/60 flex items-center justify-center hover:bg-slate-50 transition-colors text-sm shadow-sm"
                            title="Switch Language"
                        >
                            {language === "en" ? "🇺🇸" : "🇪🇸"}
                        </motion.button>
                        <div className="flex items-center gap-3 pl-3 border-l border-slate-200/60/60">
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
