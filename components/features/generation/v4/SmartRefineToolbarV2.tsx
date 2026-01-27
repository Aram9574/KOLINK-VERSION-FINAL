import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Globe, MessageSquare, RefreshCw, X, Maximize2, Minimize2, CheckCheck, Smile } from 'lucide-react';

interface SmartRefineToolbarProps {
    isVisible: boolean;
    onClose: () => void;
    onApply: (instruction: string) => void;
    selectedText?: string;
}

const REFINE_OPTIONS = [
    { id: 'punchier', label: 'Punchier', icon: <Zap className="w-3.5 h-3.5" />, instruction: 'Make this text more punchy, concise and high-impact.' },
    { id: 'professional', label: 'Formal', icon: <MessageSquare className="w-3.5 h-3.5" />, instruction: 'Rewrite this with a more professional and corporate tone.' },
    { id: 'expand', label: 'Expand', icon: <Maximize2 className="w-3.5 h-3.5" />, instruction: 'Expand this content with more details, examples, and depth.' },
    { id: 'shorten', label: 'Shorten', icon: <Minimize2 className="w-3.5 h-3.5" />, instruction: 'Condense this text to be ultra-concise.' },
    { id: 'grammar', label: 'Fix Grammar', icon: <CheckCheck className="w-3.5 h-3.5" />, instruction: 'Fix all grammar, spelling, and punctuation errors. maintain the tone.' },
    { id: 'emojify', label: 'Emojify', icon: <Smile className="w-3.5 h-3.5" />, instruction: 'Add relevant emojis to emphasize key points, but dont overdo it.' },
    { id: 'translate_en', label: 'To English', icon: <Globe className="w-3.5 h-3.5" />, instruction: 'Translate this text to fluent English.' },
    { id: 'translate_es', label: 'A Español', icon: <Globe className="w-3.5 h-3.5" />, instruction: 'Translate this text to fluent Spanish.' },
    { id: 'hooks', label: 'Viral Hook', icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />, instruction: 'Replace the start with a high-converting viral hook.' },
];

export const SmartRefineToolbar: React.FC<SmartRefineToolbarProps> = ({ isVisible, onClose, onApply, selectedText }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="absolute z-50 bottom-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-max max-w-full"
                >
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient-x">
                        <div className="px-3 border-r border-white/10 mr-1 hidden md:block shrink-0">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Refine</span>
                        </div>

                        {REFINE_OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => onApply(opt.instruction)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-white transition-all group shrink-0"
                            >
                                <span className="text-white/60 group-hover:text-brand-400">
                                    {opt.icon}
                                </span>
                                <span className="text-xs font-medium whitespace-nowrap">{opt.label}</span>
                            </button>
                        ))}

                        <div className="w-[1px] h-6 bg-white/10 mx-1 shrink-0" />

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-colors shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
