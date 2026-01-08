import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Eye, 
    Sparkles, 
    Zap, 
    Bookmark, 
    ChevronRight, 
    Plus, 
    RefreshCcw,
    Quote
} from 'lucide-react';
import { hapticFeedback } from '../../../../lib/animations';

interface EditorSidebarProps {
    activeTab: "preview" | "hooks" | "endings" | "snippets";
    setActiveTab: (tab: "preview" | "hooks" | "endings" | "snippets") => void;
    previewContent: string;
    hooks: string[];
    endings: string[];
    snippets: any[];
    isGenerating: boolean;
    onInjectText: (text: string) => void;
    onGenerateHook: () => void;
    onGenerateEnding: () => void;
    language: string;
    labels: {
        tabs: any;
        preview: any;
        hooks: any;
        endings: any;
        snippets: any;
    };
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
    activeTab,
    setActiveTab,
    previewContent,
    hooks,
    endings,
    snippets,
    isGenerating,
    onInjectText,
    onGenerateHook,
    onGenerateEnding,
    language,
    labels
}) => {
    const tabs = [
        { id: "preview", icon: Eye, label: labels.tabs.preview },
        { id: "hooks", icon: Sparkles, label: labels.tabs.hooks },
        { id: "endings", icon: Zap, label: labels.tabs.endings },
        { id: "snippets", icon: Bookmark, label: labels.tabs.snippets }
    ];

    return (
        <div className="w-[420px] bg-slate-50/50 border-l border-slate-200/60 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex p-2 bg-white border-b border-slate-200/60 sticky top-0 z-10 shrink-0">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <motion.button
                            type="button"
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            {...hapticFeedback}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all relative
                                ${isActive ? "text-brand-600 bg-brand-50 shadow-sm" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}
                            `}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "text-brand-600" : "text-slate-400"}`} />
                            <span className="hidden sm:inline">{tab.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="active-tab"
                                    className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-500 rounded-full"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-nexus">
                <AnimatePresence mode="wait">
                    {activeTab === "preview" && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-50 rounded-lg text-brand-600 text-[10px] font-bold uppercase tracking-wider">
                                        <Eye className="w-3 h-3" />
                                        {labels.preview.live}
                                    </div>
                                </div>
                                <div 
                                    className="whitespace-pre-wrap text-[15px] leading-[1.6] text-slate-700 min-h-[300px] font-nexus"
                                    dangerouslySetInnerHTML={{ __html: previewContent }}
                                />
                            </div>
                            <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-4 flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                    <Sparkles className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">{labels.preview.tipTitle}</h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        {labels.preview.tipDesc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "hooks" && (
                        <motion.div
                            key="hooks"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-brand-500" />
                                    {labels.hooks.title}
                                </h3>
                                <motion.button
                                    type="button"
                                    onClick={onGenerateHook}
                                    disabled={isGenerating}
                                    {...hapticFeedback}
                                    className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                >
                                    <RefreshCcw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                </motion.button>
                            </div>
                            
                            {hooks.length > 0 ? (
                                hooks.map((hook, i) => (
                                    <motion.button
                                        type="button"
                                        key={i}
                                        onClick={() => onInjectText(hook)}
                                        {...hapticFeedback}
                                        className="w-full bg-white border border-slate-200/60 rounded-xl p-4 text-left hover:border-brand-500 hover:shadow-md transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus className="w-4 h-4 text-brand-500" />
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed italic group-hover:text-slate-900 transition-colors">
                                            "{hook}"
                                        </p>
                                    </motion.button>
                                ))
                            ) : (
                                <div className="py-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
                                    <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-4 opacity-50" />
                                    <p className="text-sm text-slate-400 max-w-[200px] mx-auto">
                                        {labels.hooks.empty}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "endings" && (
                        <motion.div
                            key="endings"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                             <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    {labels.endings.title}
                                </h3>
                                <motion.button
                                    type="button"
                                    onClick={onGenerateEnding}
                                    disabled={isGenerating}
                                    {...hapticFeedback}
                                    className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                >
                                    <RefreshCcw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                </motion.button>
                            </div>

                            {endings.length > 0 ? (
                                endings.map((ending, i) => (
                                    <motion.button
                                        type="button"
                                        key={i}
                                        onClick={() => onInjectText("\n\n" + ending)}
                                        {...hapticFeedback}
                                        className="w-full bg-white border border-slate-200/60 rounded-xl p-4 text-left hover:border-brand-500 hover:shadow-md transition-all group overflow-hidden"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-brand-50 transition-colors">
                                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium group-hover:text-slate-900 transition-colors">
                                                {ending}
                                            </p>
                                        </div>
                                    </motion.button>
                                ))
                            ) : (
                                <div className="py-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
                                    <Zap className="w-10 h-10 text-slate-300 mx-auto mb-4 opacity-50" />
                                    <p className="text-sm text-slate-400 max-w-[200px] mx-auto">
                                        {labels.endings.empty}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "snippets" && (
                        <motion.div
                            key="snippets"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <Bookmark className="w-4 h-4 text-indigo-500" />
                                    {labels.snippets.title}
                                </h3>
                            </div>

                            {snippets.length > 0 ? (
                                snippets.map((snippet) => (
                                    <motion.button
                                        type="button"
                                        key={snippet.id}
                                        onClick={() => onInjectText(snippet.content)}
                                        {...hapticFeedback}
                                        className="w-full bg-white border border-slate-200/60 rounded-xl p-4 text-left hover:border-brand-500 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                {snippet.category || "General"}
                                            </div>
                                            <Bookmark className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                        </div>
                                        <h4 className="text-[13px] font-bold text-slate-800 group-hover:text-brand-600 transition-colors mb-1">
                                            {snippet.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                            {snippet.content}
                                        </p>
                                    </motion.button>
                                ))
                            ) : (
                                <div className="py-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
                                    <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-4 opacity-50" />
                                    <p className="text-sm text-slate-400 max-w-[200px] mx-auto">
                                        {labels.snippets.empty}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EditorSidebar;
