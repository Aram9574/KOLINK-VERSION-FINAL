
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Check, X, Sparkles, BarChart2 } from "lucide-react";

interface Node {
    id: string;
    day: string;
    date: string;
    status: 'pending_approval' | 'scheduled' | 'posted' | 'empty';
    pillar?: string;
    content?: string;
    authorityScore?: number;
}

const StrategyTimeline: React.FC = () => {
    // Mock Data for "Vision" phase
    const [nodes, setNodes] = useState<Node[]>([
        { id: "1", day: "Lun", date: "Oct 24", status: "posted", pillar: "Tendencias IA", authorityScore: 92 },
        { id: "2", day: "Mar", date: "Oct 25", status: "scheduled", pillar: "Historia Personal", authorityScore: 88 },
        { id: "3", day: "Mie", date: "Oct 26", status: "pending_approval", pillar: "Productividad", content: "🚀 3 Herramientas que uso a diario...\n\n1. Obsidian\n2. Raycast\n3. Kolink\n\n¿Cuál es tu stack?", authorityScore: 75 },
        { id: "4", day: "Jue", date: "Oct 27", status: "pending_approval", pillar: "Tendencias IA", content: "El futuro de la IA Agéntica no es el reemplazo, es la aumentación.", authorityScore: 85 },
        { id: "5", day: "Vie", date: "Oct 28", status: "empty" },
    ]);

    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    const handleApprove = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNodes(prev => prev.map(n => n.id === id ? { ...n, status: "scheduled" } : n));
        // Add haptic logic here if needed
    };

    return (
        <div className="col-span-12 mt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="text-brand-600" size={20} />
                Línea de Tiempo Estratégica
            </h3>
            
            <div className="flex gap-4 overflow-x-auto pb-8 pt-2 px-2 scrollbar-hide snap-x">
                {nodes.map((node) => (
                    <motion.div
                        layoutId={`node-${node.id}`}
                        key={node.id}
                        onClick={() => node.status !== 'empty' && setSelectedNode(node.id)}
                        className={`
                            relative min-w-[140px] h-[180px] rounded-2xl p-4 flex flex-col justify-between cursor-pointer border backdrop-blur-md transition-all group snap-center
                            ${node.status === 'empty' ? "bg-slate-50 border-dashed border-slate-300 opacity-60" : ""}
                            ${node.status === 'scheduled' ? "bg-emerald-50/50 border-emerald-200 shadow-lg shadow-emerald-100/50" : ""}
                            ${node.status === 'pending_approval' ? "bg-white/80 border-amber-200 shadow-lg shadow-amber-100/50 ring-1 ring-amber-100" : ""}
                            ${node.status === 'posted' ? "bg-slate-50 border-slate-200 grayscale" : ""}
                        `}
                    >
                        {/* Day Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">{node.day}</span>
                                <span className="block text-lg font-bold text-slate-900">{node.date.split(" ")[1]}</span>
                            </div>
                            {node.authorityScore && (
                                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${node.authorityScore > 80 ? "bg-emerald-100 text-emerald-700" : "bg-brand-100 text-brand-700"}`}>
                                    <BarChart2 size={10} />
                                    {node.authorityScore}%
                                </div>
                            )}
                        </div>

                        {/* Content Preview / Status */}
                        <div className="flex-1 mt-4">
                            {node.status === 'empty' ? (
                                <div className="h-full flex items-center justify-center">
                                    <Sparkles className="text-slate-300" />
                                </div>
                            ) : (
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 mb-1 block">{node.pillar}</span>
                                    <p className="text-xs text-slate-800 line-clamp-3 leading-relaxed">
                                        {node.content || "Generando insights..."}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Area */}
                        {node.status === 'pending_approval' && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => handleApprove(node.id, e)}
                                className="mt-3 w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/10"
                            >
                                <Check size={12} /> Aprobar
                            </motion.button>
                        )}
                         {node.status === 'scheduled' && (
                            <div className="mt-3 w-full py-2 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center justify-center gap-2">
                                <Check size={12} /> Programado
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Expansion Modal (Simplified for layout) */}
            <AnimatePresence>
                 {selectedNode && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm" onClick={() => setSelectedNode(null)}>
                         <motion.div 
                            layoutId={`node-${selectedNode}`}
                            className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Vista Previa</h3>
                                <button onClick={() => setSelectedNode(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={16} /></button>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[120px] mb-6">
                                <p className="text-slate-800 whitespace-pre-wrap">
                                    {nodes.find(n => n.id === selectedNode)?.content || "No hay contenido disponible."}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50" onClick={() => setSelectedNode(null)}>Editar</button>
                                <button className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700" onClick={() => {
                                     // Approve logic
                                     setSelectedNode(null);
                                     setNodes(prev => prev.map(n => n.id === selectedNode ? { ...n, status: "scheduled" } : n));
                                }}>Agendar (1-Tap)</button>
                            </div>
                         </motion.div>
                     </div>
                 )}
            </AnimatePresence>
        </div>
    );
};

export default StrategyTimeline;
