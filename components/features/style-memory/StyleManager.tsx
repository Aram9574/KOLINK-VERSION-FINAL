import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Brain, Loader2 } from 'lucide-react';
import { getStyleMemories, deleteStyleMemory, StyleMemory } from '../../../services/styleRepository';
import { toast } from 'sonner';
import { es } from '../../../translations/es';
import { format } from 'date-fns';
import { es as esLocale } from 'date-fns/locale';

interface StyleManagerProps {
    language: 'es' | 'en';
}

const StyleManager: React.FC<StyleManagerProps> = ({ language }) => {
    const [styles, setStyles] = useState<StyleMemory[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    
    const t = language === 'es' ? es.styleManager : {
        title: "AI Style Memory",
        subtitle: "These are the examples the AI uses to mimic your voice.",
        empty: "No styles saved yet. Save your best posts from the editor.",
        deleteConfirm: "Delete this style?",
        deleteSuccess: "Style deleted",
        added: "Added on",
        content: "Content",
        source: "Source"
    };

    useEffect(() => {
        loadStyles();
    }, []);

    const loadStyles = async () => {
        try {
            const data = await getStyleMemories();
            setStyles(data);
        } catch (error) {
            console.error(error);
            toast.error(language === 'es' ? "Error al cargar estilos" : "Error loading styles");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t.deleteConfirm)) return;
        setDeletingId(id);
        try {
            await deleteStyleMemory(id);
            setStyles(styles.filter(s => s.id !== id));
            toast.success(t.deleteSuccess);
        } catch (error) {
           toast.error(language === 'es' ? "Error al eliminar estilo" : "Error deleting style");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-purple-50 rounded-2xl">
                    <Brain strokeWidth={1.5} className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{t.title}</h2>
                    <p className="text-sm text-slate-500">{t.subtitle}</p>
                </div>
            </div>

            {loading ? (
                 <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
                 </div>
            ) : styles.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">{t.empty}</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    <AnimatePresence>
                        {styles.map((style) => (
                            <motion.div
                                key={style.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative"
                            >
                                <div className="pr-12">
                                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                                        {style.content}
                                    </p>
                                    <div className="mt-3 flex items-center gap-3 text-xs text-slate-400 font-medium">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 uppercase tracking-wider text-[10px]">
                                            {style.metadata?.source || "MANUAL"}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {style.created_at && format(new Date(style.created_at), "d MMM yyyy", { locale: language === 'es' ? esLocale : undefined })}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(style.id)}
                                    disabled={deletingId === style.id}
                                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                    title={language === 'es' ? "Eliminar" : "Delete"}
                                >
                                    {deletingId === style.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default StyleManager;
