import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { usePosts } from "../../context/PostContext";
import Sidebar from "../features/dashboard/Sidebar";
import DashboardHeader from "../features/dashboard/DashboardHeader";
import MobileBottomNav from "./MobileBottomNav";
import { AppTab, Post } from "../../types";

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
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
        <div className="flex flex-col lg:block bg-slate-50 font-sans relative selection:bg-brand-200 selection:text-brand-900 h-dvh overflow-hidden pr-safe pl-safe">
            <div className="flex h-full lg:h-screen overflow-hidden">
                {/* Sidebar */}
                <div className="hidden lg:block w-72 bg-white border-r border-slate-200 z-50 shadow-none relative">
                    <div className="h-full flex flex-col">
                        <Sidebar {...sidebarProps} />
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">
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
