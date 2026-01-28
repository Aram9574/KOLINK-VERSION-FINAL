
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, Sparkles, Check } from 'lucide-react';

export const TemplatesMockup: React.FC = () => {
    const templates = [
        { name: "La Lista Contraria", type: "Viral", category: "Growth" },
        { name: "Historia Vulnerable", type: "Personal", category: "Storytelling" },
        { name: "Análisis de Experto", type: "Educativo", category: "Tech" },
        { name: "El Mito vs Realidad", type: "Viral", category: "Psychology" },
    ];

    return (
        <div className="w-full h-full min-h-[350px] bg-slate-900 rounded-2xl border border-slate-700 p-6 flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 z-10">
                <div className="flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-brand-400" />
                    <span className="font-bold text-lg">Biblioteca de Viralidad</span>
                </div>
                <div className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                    50+ Plantillas
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 z-10">
                {templates.map((t, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all group ${
                            i === 0 
                                ? "bg-brand-500/10 border-brand-500/50 shadow-lg shadow-brand-500/10" 
                                : "bg-slate-800 border-slate-700 hover:border-slate-500"
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-1.5 rounded-lg ${i === 0 ? 'bg-brand-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                <FileText className="w-4 h-4" />
                            </div>
                            {i === 0 && <Check className="w-4 h-4 text-brand-400" />}
                        </div>
                        <h4 className={`font-bold text-sm mb-1 ${i === 0 ? 'text-white' : 'text-slate-200'}`}>{t.name}</h4>
                        <div className="flex gap-2">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/30 text-slate-400 border border-slate-700/50">{t.type}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/30 text-slate-400 border border-slate-700/50">{t.category}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Floating "Applying" Badge */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-bold z-20"
            >
                <Check className="w-4 h-4" />
                Plantilla Aplicada
            </motion.div>

             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/20 blur-[80px] rounded-full pointer-events-none" />
        </div>
    );
};
