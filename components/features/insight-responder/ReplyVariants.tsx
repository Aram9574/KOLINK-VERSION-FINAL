import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Edit3, MessageSquare, Zap, Link2, ArrowRight, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { usePosts } from '../../../context/PostContext';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { createSnippet } from '../../../services/postRepository';

interface ReplyOption {
    type: string;
    content: string;
    score: number;
    reasoning: string;
}

interface ReplyVariantsProps {
    variants: ReplyOption[];
    onCopy: (content: string) => void;
}

const ReplyVariants: React.FC<ReplyVariantsProps> = ({ variants, onCopy }) => {
    const { user } = useUser();
    
    // We can use navigation state or local storage to pass data
    // Assuming we have a way to set "Draft" in context or just pass content via query param/localStorage.
    // The previous PostEditorView reads from localStorage: "kolink_post_editor_content"
    
    const handleSendToEditor = (content: string) => {
        localStorage.setItem("kolink_post_editor_content", content);
        
        // Dispatch event to switch tab to editor
        const event = new CustomEvent('kolink-switch-tab', { detail: 'editor' });
        window.dispatchEvent(event);
        
        toast.success("Sent to Post Editor!");
    };

    const handleSaveSnippet = async (content: string) => {
        if (!user) return;
        const result = await createSnippet(user.id, content);
        if (result) {
            toast.success("Saved as snippet!");
        } else {
            toast.error("Failed to save snippet.");
        }
    };

    const getIcon = (type: string) => {
        if (type.includes('Deep') || type.includes('Data')) return <Zap className="w-4 h-4 text-purple-600" />;
        if (type.includes('Question') || type.includes('Engagement')) return <MessageSquare className="w-4 h-4 text-blue-600" />;
        return <Link2 className="w-4 h-4 text-emerald-600" />;
    };

    const getColors = (type: string) => {
        if (type.includes('Deep') || type.includes('Data')) return "bg-purple-50 border-purple-100 text-purple-900";
        if (type.includes('Question') || type.includes('Engagement')) return "bg-blue-50 border-blue-100 text-blue-900";
        return "bg-emerald-50 border-emerald-100 text-emerald-900";
    };

    if (!variants || variants.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {variants.map((variant, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white/80 backdrop-blur-md rounded-xl border border-slate-200/60 p-5 hover:border-indigo-300/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all relative overflow-hidden flex flex-col h-full ring-1 ring-slate-900/5"
                >
                    <div className="bg-gradient-to-br from-white/40 to-transparent absolute inset-0 pointer-events-none" />

                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold border ${getColors(variant.type)}`}>
                            {getIcon(variant.type)}
                            {variant.type}
                        </div>
                        <div className="flex items-center gap-1">
                             <button
                                onClick={() => handleSaveSnippet(variant.content)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Save as Snippet"
                            >
                                <Bookmark className="w-3.5 h-3.5" />
                            </button>
                            {variant.score && (
                                <div className="text-xs font-extrabold text-slate-300 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                    {variant.score}
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-slate-700 text-sm leading-relaxed mb-4 relative z-10 font-medium select-text flex-1">
                        {variant.content}
                    </p>

                    <div className="mt-auto space-y-3 relative z-10">
                         <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                            <p className="text-[10px] text-slate-500 leading-tight">
                                <span className="font-bold text-slate-700 block mb-0.5">Why this works:</span> 
                                {variant.reasoning}
                            </p>
                        </div>

                        <div className="flex gap-2 pt-1">
                            <p className="text-[10px] text-slate-500 leading-tight">
                                <span className="font-bold text-slate-700 block mb-0.5">Why this works:</span> 
                                {variant.reasoning}
                            </p>
                        </div>

                        <div className="flex gap-2 pt-1">
                             <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(variant.content);
                                    onCopy(variant.content);
                                }}
                                className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                Copy
                            </button>
                             <button 
                                onClick={() => handleSendToEditor(variant.content)}
                                className="flex-1 py-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                Edit
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default ReplyVariants;
