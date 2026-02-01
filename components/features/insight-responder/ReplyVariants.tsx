import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Edit3, MessageSquare, Zap, Link2, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../../../context/UserContext';
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
    compact?: boolean;
}

const ReplyVariants: React.FC<ReplyVariantsProps> = ({ variants, onCopy, compact = false }) => {
    const { user } = useUser();
    
    const handleSendToEditor = (content: string) => {
        localStorage.setItem("kolink_post_editor_content", content);
        const event = new CustomEvent('kolink-switch-tab', { detail: 'editor' });
        window.dispatchEvent(event);
        toast.success("¡Enviado al Editor de Posts!");
    };

    const handleSaveSnippet = async (content: string) => {
        if (!user) return;
        const result = await createSnippet(user.id, content);
        if (result) {
            toast.success("¡Guardado como Snippet!");
        } else {
            toast.error("Error al guardar el snippet.");
        }
    };

    const getIcon = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('challenger') || t.includes('análisis')) return <Zap className="w-4 h-4 text-purple-600" />;
        if (t.includes('catalyst') || t.includes('experto')) return <MessageSquare className="w-4 h-4 text-blue-600" />;
        return <Link2 className="w-4 h-4 text-emerald-600" />;
    };

    const getColors = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('challenger') || t.includes('análisis')) return "bg-purple-100/50 border-purple-200/50 text-purple-700";
        if (t.includes('catalyst') || t.includes('experto')) return "bg-blue-100/50 border-blue-200/50 text-blue-700";
        return "bg-emerald-100/50 border-emerald-200/50 text-emerald-700";
    };

    if (!variants || variants.length === 0) return null;

    return (
        <div className={compact ? "space-y-4" : "grid grid-cols-1 md:grid-cols-3 gap-6"}>
            {variants.map((variant, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                    whileHover={{ y: -5 }}
                    className="group bg-white/70 backdrop-blur-xl rounded-[32px] border border-slate-200/60 p-7 hover:border-blue-300/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all relative overflow-hidden flex flex-col"
                >
                    {/* Glass Shine Effect */}
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-0" />

                    <div className="flex justify-between items-start mb-5 relative z-10">
                        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getColors(variant.type)} shadow-sm`}>
                            {getIcon(variant.type)}
                            {variant.type}
                        </div>
                        <div className="flex items-center gap-1.5">
                             <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleSaveSnippet(variant.content)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm"
                                title="Guardar como Snippet"
                            >
                                <Bookmark className="w-4 h-4" />
                            </motion.button>
                            {variant.score && (
                                <div className="text-[10px] font-black text-slate-500 bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-inner">
                                    {variant.score}
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-slate-800 text-sm leading-relaxed mb-6 relative z-10 font-medium select-text flex-1">
                        {variant.content}
                    </p>

                    <div className="mt-auto space-y-5 relative z-10">
                         <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100/50 shadow-inner group/reason">
                            <span className="text-[9px] font-black uppercase text-blue-500 tracking-[0.15em] block mb-1.5">Estrategia Kolink:</span>
                            <p className="text-[11px] text-slate-500 font-bold leading-normal italic">
                                "{variant.reasoning}"
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <motion.button 
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    navigator.clipboard.writeText(variant.content);
                                    onCopy(variant.content);
                                    toast.success("¡Copiado con éxito! 🛡️");
                                }}
                                className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Copy className="w-4 h-4" />
                                Copiar
                            </motion.button>
                             <motion.button 
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSendToEditor(variant.content)}
                                className="flex-1 py-3.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                            >
                                <Edit3 className="w-4 h-4" />
                                Editar
                            </motion.button>
                        </div>
                    </div>

                    {/* Decorative radial gradient */}
                    <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
                </motion.div>
            ))}
        </div>
    );
};

export default ReplyVariants;
