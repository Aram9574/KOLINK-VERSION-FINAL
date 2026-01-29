import React from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    History,
    ChevronDown,
    FileText,
    Layout
} from 'lucide-react';
import { hapticFeedback } from '../../../../lib/animations';
import { Post } from '../../../../types';

interface EditorHeaderProps {
    postTitle: string;
    setPostTitle: (title: string) => void;
    onSave: () => void;
    showDraftsMenu: boolean;
    setShowDraftsMenu: (show: boolean) => void;
    drafts: Post[];
    onSelectDraft: (post: Post) => void;
    placeholder: string;
    saveLabel: string;
    openDraftLabel: string;
    draftsLabel: string;
    noDraftsLabel: string;
    language: string;
    isSplitView: boolean;
    onToggleSplitView: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
    postTitle,
    setPostTitle,
    onSave,
    showDraftsMenu,
    setShowDraftsMenu,
    drafts,
    onSelectDraft,
    placeholder,
    saveLabel,
    openDraftLabel,
    draftsLabel,
    noDraftsLabel,
    language,
    isSplitView,
    onToggleSplitView
}) => {
    return (
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
            {/* LEFT: Title & Save Status */}
            <div className="flex items-center gap-4 flex-1">
                <div className="relative group">
                    <input
                        type="text"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder={placeholder}
                        className="text-base font-bold text-slate-900 placeholder:text-slate-400 bg-transparent border-none focus:ring-0 p-0 w-[240px] truncate"
                    />
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all duration-300 group-hover:w-full" />
                </div>
                
                <div className="h-4 w-[1px] bg-slate-200" />
                
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    {/* Replaced unsaved indicator with cleaner auto-save text */}
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Saved
                </span>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-2">
                 {/* SPLIT VIEW TOGGLE */}
                 <button
                    onClick={onToggleSplitView}
                    className={`p-2 rounded-lg transition-colors hidden md:flex items-center gap-2 text-xs font-bold ${
                        isSplitView 
                        ? "bg-brand-50 text-brand-600" 
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    }`}
                    title={language === 'es' ? 'Vista Dividida' : 'Split View'}
                >
                    <Layout className="w-4 h-4" />
                    <span className="hidden lg:inline">{language === 'es' ? 'Dividir' : 'Split'}</span>
                </button>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                <motion.button
                    type="button"
                    onClick={onSave}
                    {...hapticFeedback}
                    className="btn-nexus-primary flex items-center gap-2 text-sm"
                >
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">
                        {saveLabel}
                    </span>
                </motion.button>
                <div className="w-px h-4 bg-slate-200" />
                <div className="relative">
                    <motion.button
                        type="button"
                        onClick={() => setShowDraftsMenu(!showDraftsMenu)}
                        {...hapticFeedback}
                        className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                    >
                        <History className="w-4 h-4" />
                        <span className="hidden sm:inline">
                            {openDraftLabel}
                        </span>
                        <ChevronDown
                            className={`w-3 h-3 ml-1 transition-transform ${
                                showDraftsMenu ? "rotate-180" : ""
                            }`}
                        />
                    </motion.button>

                    {showDraftsMenu && (
                        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200/60 rounded-xl shadow-2xl z-[50] overflow-hidden animate-nexus-in">
                            <div className="p-3 border-b border-slate-200/60 bg-slate-50">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {draftsLabel} ({drafts.length})
                                </h3>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {drafts.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400">
                                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">
                                            {noDraftsLabel}
                                        </p>
                                    </div>
                                ) : (
                                    drafts.map((draft) => (
                                        <motion.button
                                            type="button"
                                            key={draft.id}
                                            onClick={() => onSelectDraft(draft)}
                                            {...hapticFeedback}
                                            className="w-full text-left p-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group"
                                        >
                                            <p className="font-medium text-slate-700 text-sm truncate group-hover:text-brand-600 transition-colors">
                                                {draft.params?.topic || (language === "es" ? "Sin título" : "Untitled")}
                                            </p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs text-slate-400 truncate max-w-[150px]">
                                                    {draft.content.substring(0, 30)}...
                                                </p>
                                                <span className="text-[10px] text-slate-300 font-medium">
                                                    {new Date(draft.createdAt).toLocaleDateString(
                                                        language === "es" ? "es-ES" : "en-US",
                                                        { month: "short", day: "numeric" }
                                                    )}
                                                </span>
                                            </div>
                                        </motion.button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditorHeader;
