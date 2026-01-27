import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Magnet, Anchor, MessageSquare, AlertCircle, HelpCircle } from 'lucide-react';

interface HookTemplate {
    id: string;
    category: string;
    label: string;
    icon: React.ReactNode;
    hooks: string[];
}

const HOOK_TEMPLATES: HookTemplate[] = [
    {
        id: 'fear',
        category: 'Fear/Urgency',
        label: 'Miedo/Urgencia',
        icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
        hooks: [
            "El error #1 que está matando tu crecimiento en LinkedIn...",
            "Deja de hacer esto si no quieres perder clientes en 2026.",
            "La mayoría de los fundadores fallan porque ignoran esto:"
        ]
    },
    {
        id: 'curiosity',
        category: 'Curiosity',
        label: 'Curiosidad',
        icon: <HelpCircle className="w-4 h-4 text-amber-500" />,
        hooks: [
            "¿Por qué el 90% del contenido de IA suena igual?",
            "El secreto para escribir posts virales no es el algoritmo.",
            "Cómo pasé de 0 a 10k seguidores sin gastar un euro."
        ]
    },
    {
        id: 'authority',
        category: 'Authority',
        label: 'Autoridad',
        icon: <Anchor className="w-4 h-4 text-indigo-500" />,
        hooks: [
            "Probé 50 herramientas de IA y esta es la única que importa.",
            "Después de analizar 1,000 carruseles virales, aprendí esto:",
            "La guía definitiva para escalar tu marca personal en 30 días."
        ]
    }
];

interface HookLibraryProps {
    onSelect: (hook: string) => void;
}

export const HookLibrary: React.FC<HookLibraryProps> = ({ onSelect }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Magnet className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Hook Library</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {HOOK_TEMPLATES.map((category) => (
                    <div key={category.id} className="bg-white rounded-xl border border-slate-200/60 p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            {category.icon}
                            <span className="text-xs font-bold text-slate-700">{category.label}</span>
                        </div>
                        <div className="space-y-2">
                            {category.hooks.map((hook, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ y: -1, x: 2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onSelect(hook)}
                                    className="w-full text-left text-[11px] text-slate-500 hover:text-brand-600 hover:bg-brand-50 p-2 rounded-lg border border-transparent hover:border-brand-200 transition-all line-clamp-2 bg-white"
                                >
                                    {hook}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
