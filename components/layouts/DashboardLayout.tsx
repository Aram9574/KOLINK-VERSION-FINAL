import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { usePosts } from "../../context/PostContext";
import Sidebar from "../features/dashboard/Sidebar";
import DashboardHeader from "../features/dashboard/DashboardHeader";
import InsightWidget from "../features/dashboard/InsightWidget";
import MobileBottomNav from "./MobileBottomNav";
import { Post } from "../../types";

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeTab:
        | "create"
        | "history"
        | "settings"
        | "ideas"
        | "autopilot"
        | "auditor";
    setActiveTab: (
        tab:
            | "create"
            | "history"
            | "settings"
            | "ideas"
            | "autopilot"
            | "auditor",
    ) => void;
    onUpgrade: () => void;
    showCreditDeduction: boolean;
    onDeletePost: (id: string, e: React.MouseEvent) => void;
    onReferral?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    activeTab,
    setActiveTab,
    onUpgrade,
    showCreditDeduction,
    onDeletePost,
    onReferral,
}) => {
    const { user, language, setLanguage } = useUser();
    const { posts, currentPost, setCurrentPost } = usePosts();

    const sidebarProps = {
        posts,
        currentPost,
        activeTab,
        setActiveTab,
        onSelectPost: (post: Post) => {
            setCurrentPost(post);
            setActiveTab("create");
        },
        onDeletePost,
        onUpgrade,
        onSettingsClick: () => setActiveTab("settings"),
        showCreditDeduction,
        onReferral,
    };

    return (
        <div className="flex flex-col lg:block bg-slate-50 font-sans relative selection:bg-brand-200 selection:text-brand-900 h-screen overflow-hidden">
            {/* Mobile Header - Removed in favor of Bottom Nav integration within views, or kept minimal if needed */}
            {/* Keeping minimal header for Logo if desired, or removing entirely to gain space */}
            <div className="lg:hidden bg-white border-b border-slate-200 p-3 flex items-center justify-center z-20 relative shadow-sm sticky top-0">
                <div className="flex items-center gap-2 font-display font-bold text-lg text-slate-900">
                    <div className="w-7 h-7 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xs shadow-md">
                        K
                    </div>
                    Kolink
                </div>
            </div>

            <div className="flex h-full lg:h-screen overflow-hidden">
                {/* Sidebar */}
                <div className="hidden lg:block w-72 bg-white border-r border-slate-200 z-50 shadow-none relative">
                    <div className="h-full flex flex-col">
                        <Sidebar {...sidebarProps} />
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50/50">
                    <div className="hidden lg:block">
                        <DashboardHeader
                            user={user}
                            language={language}
                            setLanguage={setLanguage}
                            activeTab={activeTab}
                        />
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 overflow-hidden relative">
                        {children}
                    </div>

                    {/* Floating Insight Widget */}
                    <div className="mb-20 lg:mb-0">
                        <InsightWidget language={language} />
                    </div>
                </main>

                <MobileBottomNav
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>
        </div>
    );
};

export default DashboardLayout;
