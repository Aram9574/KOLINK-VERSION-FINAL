import React from 'react';
import { motion } from 'framer-motion';
import { 
    Undo, 
    Redo, 
    Eraser, 
    Bold as BoldIcon, 
    Italic as ItalicIcon, 
    Strikethrough, 
    Underline, 
    Code, 
    Type, 
    List, 
    ListOrdered, 
    Zap, 
    Smile 
} from 'lucide-react';
import { hapticFeedback } from '../../../../lib/animations';

interface EditorToolbarProps {
    onUndo: () => void;
    onRedo: () => void;
    onClearAll: () => void;
    onFormat: (type: "bold" | "italic" | "strike" | "underline" | "code") => void;
    onClearFormatting: () => void;
    onInjectText: (text: string) => void;
    historyIndex: number;
    historyLength: number;
    showEmojiPicker: boolean;
    setShowEmojiPicker: (show: boolean) => void;
    commonEmojis: string[];
    emojiPickerRef: React.RefObject<HTMLDivElement>;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
    onUndo,
    onRedo,
    onClearAll,
    onFormat,
    onClearFormatting,
    onInjectText,
    historyIndex,
    historyLength,
    showEmojiPicker,
    setShowEmojiPicker,
    commonEmojis,
    emojiPickerRef
}) => {
    return (
        <div className="h-12 border-b border-slate-200/60 flex items-center px-4 bg-white gap-0.5 shrink-0 overflow-x-auto no-scrollbar">
            <motion.button
                type="button"
                onClick={onUndo}
                disabled={historyIndex <= 0}
                {...hapticFeedback}
                className={`p-2 rounded-lg transition-colors ${
                    historyIndex > 0
                        ? "text-slate-600 hover:bg-slate-100 active:bg-slate-200"
                        : "text-slate-300 cursor-not-allowed"
                }`}
                aria-label="Undo"
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </motion.button>
            <motion.button
                type="button"
                onClick={onRedo}
                disabled={historyIndex >= historyLength - 1}
                {...hapticFeedback}
                className={`p-2 rounded-lg transition-colors ${
                    historyIndex < historyLength - 1
                        ? "text-slate-600 hover:bg-slate-100 active:bg-slate-200"
                        : "text-slate-300 cursor-not-allowed"
                }`}
                aria-label="Redo"
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </motion.button>
            <motion.button
                type="button"
                onClick={onClearAll}
                {...hapticFeedback}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
                title="Clear All"
            >
                <Eraser className="w-4 h-4" />
            </motion.button>
            <div className="w-px h-6 bg-slate-100 mx-2" />

            <motion.button
                type="button"
                onClick={() => onFormat("bold")}
                {...hapticFeedback}
                className="p-2 hover:bg-slate-50 rounded-lg text-brand-600 font-bold"
                title="Bold"
            >
                <BoldIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
                type="button"
                onClick={() => onFormat("italic")}
                {...hapticFeedback}
                className="p-2 hover:bg-slate-50 rounded-lg text-brand-600 italic"
                title="Italic"
            >
                <ItalicIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
                type="button"
                onClick={() => onFormat("strike")}
                {...hapticFeedback}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
                title="Strikethrough"
            >
                <Strikethrough className="w-4 h-4" />
            </motion.button>
            <motion.button
                type="button"
                onClick={() => onFormat("underline")}
                {...hapticFeedback}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
                title="Underline"
            >
                <Underline className="w-4 h-4" />
            </motion.button>
            <motion.button
                type="button"
                onClick={() => onFormat("code")}
                {...hapticFeedback}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
                title="Code"
            >
                <Code className="w-4 h-4" />
            </motion.button>
            <motion.button
                type="button"
                onClick={onClearFormatting}
                {...hapticFeedback}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-300"
                title="Clear Formatting"
            >
                <Type className="w-4 h-4" />
            </motion.button>

            <div className="w-px h-6 bg-slate-100 mx-2" />
            <motion.button
                type="button"
                onClick={() => onInjectText("• ")}
                {...hapticFeedback}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
            >
                <List className="w-4 h-4" />
            </motion.button>
            <motion.button
                type="button"
                onClick={() => onInjectText("1. ")}
                {...hapticFeedback}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
            >
                <ListOrdered className="w-4 h-4" />
            </motion.button>

            <div className="w-px h-6 bg-slate-100 mx-2" />
            <motion.button
                type="button"
                {...hapticFeedback}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
                onClick={() => onInjectText("⚡ ")}
            >
                <Zap className="w-4 h-4" />
            </motion.button>
            <motion.button
                type="button"
                {...hapticFeedback}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 rotate-45"
                onClick={() => onInjectText("🚀 ")}
            >
                <Zap className="w-4 h-4 rotate-45" />
            </motion.button>
            <motion.button
                type="button"
                {...hapticFeedback}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 -rotate-45"
                onClick={() => onInjectText("🔥 ")}
            >
                <Zap className="w-4 h-4 -rotate-45" />
            </motion.button>

            <div className="w-px h-6 bg-slate-100 mx-2" />
            <div className="relative" ref={emojiPickerRef}>
                <motion.button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    {...hapticFeedback}
                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
                >
                    <Smile className="w-4 h-4" />
                </motion.button>
                {showEmojiPicker && (
                    <div className="absolute top-full mt-2 left-0 bg-white border border-slate-200/60 rounded-xl shadow-2xl p-3 z-[100] grid grid-cols-4 gap-2 w-56">
                        {commonEmojis.map((emoji) => (
                            <motion.button
                                type="button"
                                key={emoji}
                                onClick={() => {
                                    onInjectText(emoji);
                                    setShowEmojiPicker(false);
                                }}
                                {...hapticFeedback}
                                className="text-xl p-2 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                {emoji}
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditorToolbar;
