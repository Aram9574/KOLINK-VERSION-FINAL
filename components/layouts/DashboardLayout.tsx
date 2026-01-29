import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useUser } from "../../context/UserContext.tsx";
import { usePosts } from "../../context/PostContext.tsx";
import Sidebar from "../features/dashboard/Sidebar.tsx";
import DashboardHeader from "../features/dashboard/DashboardHeader.tsx";
import MobileBottomNav from "./MobileBottomNav.tsx";
import { AppTab, Post } from "../../types.ts";
import SmartCursor from "../ui/SmartCursor.tsx";
import { InfiniteGrid } from "../ui/infinite-grid-integration.tsx";
import { SocialProofToast } from "../ui/SocialProofToast";

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

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem("kolink_sidebar_collapsed");
        return saved === "true";
    });

    const toggleSidebar = () => {
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem("kolink_sidebar_collapsed", String(newState));
    };

    return (
        <div className="bg-slate-50 relative selection:bg-brand-200 selection:text-brand-900 h-dvh overflow-hidden pr-safe pl-safe">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30 select-none overflow-hidden">
                <InfiniteGrid />
            </div>
            <SmartCursor />
            <div className="flex h-full lg:h-screen overflow-hidden">
                {/* Sidebar */}
                <div 
                    className={`hidden lg:block transition-all duration-300 ease-in-out ${
                        isSidebarCollapsed ? "w-20" : "w-72"
                    } border-r-[0.5px] border-slate-200/60 z-50 shadow-none relative`}
                >
                    <div className="h-full flex flex-col">
                        <Sidebar 
                            {...sidebarProps} 
                            isCollapsed={isSidebarCollapsed} 
                            onToggleCollapse={toggleSidebar} 
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-transparent">
                    <div className="hidden lg:block">
                        <DashboardHeader
                            user={user}
                            language={language}
                            setLanguage={setLanguage}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </div>

                    {/* Content Body */}
                    <div className={`flex-1 overflow-hidden relative ${activeTab === 'create' ? 'p-0' : 'p-4 lg:p-8'}`}>
                        <div className="h-full w-full mx-auto">
                            {children}
                        </div>
                    </div>
                </main>

                <MobileBottomNav
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>
            <SocialProofToast language={language as 'es' | 'en'} />
        </div>
    );
};

export default DashboardLayout;
