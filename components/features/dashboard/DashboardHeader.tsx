import React from 'react';
import { Bell, HelpCircle, Coins, Trophy } from 'lucide-react';
import { AppTab } from '../../../types';
import { useUser } from '../../context/UserContext';
import { translations } from '../../../translations';

interface HeaderProps {
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
    user: any;
}

const DashboardHeader: React.FC<HeaderProps> = ({ activeTab }) => {
    const { credits, language } = useUser();
    const t = translations[language];

    const getTitle = () => {
        switch (activeTab) {
            case 'dashboard': return t.dashboard.header.dashboard;
            case 'create': return t.dashboard.header.create;
            case 'history': return t.dashboard.header.history;
            case 'settings': return t.dashboard.header.settings;
            case 'carousel': return t.dashboard.header.carousel;
            case 'voice-lab': return t.dashboard.header.voice;
            case 'audit': return t.dashboard.header.audit;
            case 'chat': return t.dashboard.header.chat;
            case 'autopilot': return t.dashboard.header.autopost;
            case 'insight-responder': return t.dashboard.header.responder;
            case 'editor': return t.dashboard.header.editor;
            default: return 'Dashboard';
        }
    };

    return (
        <div className="h-20 w-full flex items-center px-8 relative z-40">
            {/* Floating Glass Header Container */}
            <div className="w-full h-14 glass-panel rounded-2xl flex items-center justify-between px-6 shadow-sm">
                
                <h1 className="font-display font-bold text-lg text-slate-800 tracking-tight">
                    {getTitle()}
                </h1>

                <div className="flex items-center gap-4">
                    {/* Credits Pill */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50/50 border border-slate-200/60 rounded-full">
                        <Coins size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-slate-700">{credits || 0} {t.dashboard.header.credits}</span>
                    </div>

                    {/* Level Badge (New) */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 border border-indigo-200/60 rounded-full text-indigo-700">
                         <Trophy size={14} className="fill-indigo-100" />
                         <span className="text-xs font-bold">{t.dashboard.header.level} 5</span>
                    </div>

                    <div className="h-6 w-px bg-slate-200/60 mx-1" />

                    <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors relative">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </button>

                    <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                        <HelpCircle size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
