import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { usePosts } from '../../context/PostContext';
import Sidebar from '../features/dashboard/Sidebar';
import DashboardHeader from '../features/dashboard/DashboardHeader';
import InsightWidget from '../features/dashboard/InsightWidget';
import { Post } from '../../types';

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeTab: 'create' | 'history' | 'settings' | 'ideas' | 'autopilot' | 'auditor';
    setActiveTab: (tab: 'create' | 'history' | 'settings' | 'ideas' | 'autopilot' | 'auditor') => void;
    onUpgrade: () => void;
    showCreditDeduction: boolean;
    onDeletePost: (id: string, e: React.MouseEvent) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    activeTab,
    setActiveTab,
    onUpgrade,
    showCreditDeduction,
    onDeletePost
}) => {
    const { user, language, setLanguage } = useUser();
    const { posts, currentPost, setCurrentPost } = usePosts();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarProps = {
        posts,
        currentPost,
        activeTab,
        setActiveTab,
        onSelectPost: (post: Post) => {
            setCurrentPost(post);
            setActiveTab('create');
        },
        onDeletePost,
        onUpgrade,
        onSettingsClick: () => setActiveTab('settings'),
        showCreditDeduction
    };

    return (
        <div className="flex flex-col lg:block bg-slate-50 font-sans relative selection:bg-brand-200 selection:text-brand-900 h-screen overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between z-20 relative shadow-sm">
                <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900">
                    <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm shadow-md">K</div>
                    Kolink
                </div>
                <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Menu className="w-6 h-6 text-slate-600" />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSidebarOpen(false)} />
            )}

            <div className="flex h-full lg:h-screen overflow-hidden">
                {/* Sidebar */}
                <div className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:transform-none lg:relative lg:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="h-full flex flex-col">
                        <div className="lg:hidden p-4 flex justify-end">
                            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>
                        <Sidebar {...sidebarProps} />
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50/50">
                    <DashboardHeader
                        user={user}
                        language={language}
                        setLanguage={setLanguage}
                        activeTab={activeTab}
                    />

                    {/* Content Body */}
                    <div className="flex-1 overflow-hidden relative">
                        {children}
                    </div>

                    {/* Floating Insight Widget */}
                    <InsightWidget language={language} />
                </main>
            </div>
        </div >
    );
};

export default DashboardLayout;
