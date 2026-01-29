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
    Quote,
    Rocket,
    Brain,
    Loader2
} from 'lucide-react';
import { hapticFeedback } from '../../../../lib/animations';
import LinkedInPreview from '../../generation/LinkedInPreview';
import { ViralResultCard } from './ViralResultCard';

interface EditorSidebarProps {
    activeTab: "preview" | "hooks" | "endings" | "snippets" | "viral";
    setActiveTab: (tab: "preview" | "hooks" | "endings" | "snippets" | "viral") => void;
    previewContent: string;
    user: any;
    hooks: string[];
    endings: string[];
    snippets: any[];
    isGenerating: boolean;
    onInjectText: (text: string) => void;
    onGenerateHook: () => void;
    onGenerateEnding: () => void;
    // Viral Analysis Props
    isAnalyzingViral: boolean;
    viralResult: any | null;
    onAnalyzeViral: () => void;
    language: string;
    labels: {
        tabs: any;
        preview: any;
        hooks: any;
        endings: any;
        snippets: any;
        viral?: any;
    };
    isSplitView?: boolean;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
    activeTab,
    setActiveTab,
    previewContent,
    user,
    hooks,
    endings,
    snippets,
    isGenerating,
    onInjectText,
    onGenerateHook,
    onGenerateEnding,
    isAnalyzingViral,
    viralResult,
    onAnalyzeViral,
    language,
    labels,
    isSplitView = false
}) => {
    const tabs = [
        { id: "preview", icon: Eye, label: labels.tabs.preview },
        { id: "hooks", icon: Sparkles, label: labels.tabs.hooks },
        { id: "endings", icon: Zap, label: labels.tabs.endings },
        { id: "snippets", icon: Bookmark, label: labels.tabs.snippets },
        { id: "viral", icon: Rocket, label: "Viral" }
    ].filter(tab => !(isSplitView && tab.id === "preview"));

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
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-50 rounded-lg text-brand-600 text-[10px] font-bold uppercase tracking-wider">
                                        <Eye className="w-3 h-3" />
                                        {labels.preview.live}
                                    </div>
                                </div>
                                <div>
                                    <LinkedInPreview 
                                        content={previewContent}
                                        user={user}
                                        isLoading={false}
                                        language={language as any}
                                        showEditButton={false}
                                    />
                                </div>
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

                    {activeTab === "viral" && (
                        <motion.div
                            key="viral"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col gap-4">
                                {!viralResult && !isAnalyzingViral && (
                                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
                                        <Brain className="w-12 h-12 text-slate-300 mx-auto mb-4" strokeWidth={1} />
                                        <h3 className="text-base font-bold text-slate-800 mb-2">
                                            {language === 'es' ? 'Analizador Viral' : 'Viral Analyzer'}
                                        </h3>
                                        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                                            {language === 'es' 
                                                ? 'Deja que nuestra IA 2026 analice tu borrador y descubra tu potencial real.' 
                                                : 'Let our 2026 AI analyze your draft and discover your real potential.'}
                                        </p>
                                        <motion.button
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={onAnalyzeViral}
                                            disabled={!previewContent.trim()}
                                            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <Zap size={18} fill="currentColor" />
                                            <span>{language === 'es' ? 'Analizar Post' : 'Analyze Post'}</span>
                                        </motion.button>
                                    </div>
                                )}

                                {isAnalyzingViral && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center animate-pulse">
                                        <Loader2 className="w-10 h-10 text-brand-500 mx-auto mb-4 animate-spin" />
                                        <p className="text-sm font-medium text-slate-600">
                                            {language === 'es' ? 'Escaneando marcos virales...' : 'Scanning viral frameworks...'}
                                        </p>
                                    </div>
                                )}

                                {viralResult && !isAnalyzingViral && (
                                    <div className="space-y-6">
                                        <ViralResultCard 
                                            result={viralResult} 
                                            language={language} 
                                            onClose={() => onAnalyzeViral()} // can be used to re-analyze or clear
                                        />
                                        
                                        <motion.button
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            onClick={onAnalyzeViral}
                                            className="w-full py-2.5 text-slate-400 hover:text-brand-600 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <RefreshCcw size={14} />
                                            {language === 'es' ? 'Volver a Analizar' : 'Analyze Again'}
                                        </motion.button>
                                    </div>
                                )}
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
