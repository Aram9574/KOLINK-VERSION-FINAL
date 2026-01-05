
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, Plus, X } from "lucide-react";

import { fetchPillars, updatePillars, ContentPillar } from "../../../services/strategyRepository.ts";
import { toast } from "sonner";

interface PillarsConfigProps {
    userId: string;
}

const PillarsConfig: React.FC<PillarsConfigProps> = ({ userId }) => {
    const [pillars, setPillars] = useState<ContentPillar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchPillars(userId);
            if (data.length > 0) {
                 setPillars(data);
            } else {
                // Initialize with defaults if empty
                setPillars([
                    { id: crypto.randomUUID(), user_id: userId, pillar_name: "IA e Innovación", weight: 40 },
                    { id: crypto.randomUUID(), user_id: userId, pillar_name: "Productividad", weight: 30 },
                    { id: crypto.randomUUID(), user_id: userId, pillar_name: "Crecimiento", weight: 30 }
                ]);
            }
            setLoading(false);
        };
        load();
    }, [userId]);

    const handleWeightChange = (id: string, newWeight: number) => {
        setPillars(prev => prev.map(p => p.id === id ? { ...p, weight: newWeight } : p));
        // Note: Real-time saving on slider drag can be heavy. A debounce or "Save" button is better.
        // We'll trust the user to hit a save, or implement auto-save debounce later if requested.
        // For now, let's add a visible Save button for clarity/safety.
    };

    const handleDelete = (id: string) => {
        setPillars(prev => prev.filter(p => p.id !== id));
    };

    const handleSave = async () => {
        try {
            await updatePillars(userId, pillars);
            toast.success("Estrategia guardada");
        } catch (e) {
            toast.error("Error al guardar");
        }
    }

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
                <div className="flex gap-2">
                     <button onClick={handleSave} className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg hover:bg-brand-700 transition-colors">
                        Guardar Cambios
                    </button>
                    {/* Add Pillar Button Logic (omitted for brevity, can be added) */}
                    <button className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors">
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[200px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                {loading ? (
                    <div className="text-center py-8 text-slate-400 text-xs">Cargando estrategia...</div>
                ) : (
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
                                    {pillar.pillar_name || "Sin título"}
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
                )}
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
