import React from "react";
import { 
    LayoutTemplate, 
    Palette, 
    Type, 
    Image as ImageIcon, 
    Settings,
    Sparkles,
    Shapes
} from "lucide-react";
import { motion } from "framer-motion";

interface EditorSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: "generate", icon: Sparkles, label: "AI Generator" },
        { id: "templates", icon: LayoutTemplate, label: "Templates" },
        { id: "palette", icon: Palette, label: "Colors" },
        { id: "text", icon: Type, label: "Text" },
        { id: "elements", icon: Shapes, label: "Elements" },
        { id: "images", icon: ImageIcon, label: "Images" },
        { id: "settings", icon: Settings, label: "Settings" },
    ];

    return (
        <div className="w-full fixed bottom-0 left-0 h-16 bg-slate-900 border-t border-slate-800 md:h-full md:w-20 md:static md:flex-col md:border-r-0 md:border-t-0 flex items-center justify-between md:py-6 z-40 select-none">
            
            {/* Logo Area */}
            <div className="hidden md:flex flex-col items-center gap-1 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 ring-1 ring-white/10">
                     <Sparkles className="w-5 h-5 text-white" fill="currentColor" />
                </div>
            </div>
            
            {/* Tabs */}
            <div className="flex flex-row md:flex-col gap-1 w-full px-2 justify-evenly md:justify-start flex-1 md:gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(activeTab === tab.id ? "" : tab.id)}
                        className={`group relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px] md:min-w-0 md:w-full md:aspect-square ${
                            activeTab === tab.id
                                ? "text-white"
                                : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                        }`}
                        title={tab.label}
                    >
                        <div className={`p-2 rounded-lg transition-all duration-300 ${
                             activeTab === tab.id ? "bg-brand-600 shadow-lg shadow-brand-500/40 translate-y-[-2px]" : "bg-transparent"
                        }`}>
                            <tab.icon className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                        </div>
                        <span className={`text-[9px] md:text-[10px] font-medium leading-none mt-1.5 transition-colors ${
                            activeTab === tab.id ? "text-white" : "text-slate-500 group-hover:text-slate-400"
                        }`}>{tab.label}</span>
                        
                        {/* Active Indicator Line (Desktop Left) */}
                        {activeTab === tab.id && (
                             <motion.div 
                                layoutId="sidebar-active-indicator"
                                className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-r-full shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Bottom Avatar / User Info */}
            <div className="hidden md:flex flex-col items-center mt-auto pb-4 gap-4">
                <div className="w-8 h-px bg-slate-800" />
                 <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-slate-700">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default EditorSidebar;
