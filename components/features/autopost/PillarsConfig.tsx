
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, Plus, X } from "lucide-react";

interface Pillar {
    id: string;
    topic: string;
    weight: number;
}

const PillarsConfig: React.FC = () => {
    const [pillars, setPillars] = useState<Pillar[]>([
        { id: "1", topic: "IA e Innovación", weight: 40 },
        { id: "2", topic: "Trucos de Productividad", weight: 30 },
        { id: "3", topic: "Crecimiento Personal", weight: 30 },
    ]);

    const handleWeightChange = (id: string, newWeight: number) => {
        setPillars(prev => prev.map(p => p.id === id ? { ...p, weight: newWeight } : p));
    };

    const handleDelete = (id: string) => {
        setPillars(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="h-full bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Sliders size={18} className="text-brand-600" />
                        Pilares de Contenido
                    </h3>
                    <p className="text-sm text-slate-500">Define tu estrategia de contenido automatizado.</p>
                </div>
                <button className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors">
                    <Plus size={18} />
                </button>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[200px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                <AnimatePresence initial={false}>
                    {pillars.map((pillar) => (
                        <motion.div
                            key={pillar.id}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="group flex items-center gap-4 p-3 rounded-xl bg-white/50 border border-slate-200/60 hover:border-brand-200/60 transition-colors"
                        >
                             {/* Badge */}
                            <div className="bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-md text-xs border border-slate-200">
                                {pillar.topic}
                            </div>
                            
                            {/* Slider */}
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Peso de Impacto</span>
                                    <span>{pillar.weight}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={pillar.weight}
                                    onChange={(e) => handleWeightChange(pillar.id, Number(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-600 hover:accent-brand-500"
                                />
                            </div>

                            {/* Delete */}
                            <button 
                                onClick={() => handleDelete(pillar.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Total Indicator */}
            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                 <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Asignación Total</span>
                 <span className={`text-sm font-bold ${pillars.reduce((a,b)=>a+b.weight,0) === 100 ? "text-emerald-600" : "text-amber-500"}`}>
                    {pillars.reduce((a,b)=>a+b.weight,0)}%
                 </span>
            </div>
        </div>
    );
};

export default PillarsConfig;
