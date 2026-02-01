import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface ValueMeterProps {
    score: number; // 0 to 100
    compact?: boolean;
}

const ValueMeter: React.FC<ValueMeterProps> = ({ score, compact = false }) => {
    const getLabel = () => {
        if (score >= 90) return { text: "Top 1% Authority", color: "text-emerald-500", bg: "bg-emerald-500" };
        if (score >= 75) return { text: "Thought Leader", color: "text-blue-500", bg: "bg-blue-500" };
        if (score >= 50) return { text: "Valuable Contributor", color: "text-indigo-500", bg: "bg-indigo-500" };
        return { text: "Common Comment", color: "text-slate-400", bg: "bg-slate-400" };
    };

    const label = getLabel();

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white/70 backdrop-blur-xl ${compact ? 'rounded-2xl border border-slate-200/60 p-5' : 'rounded-[40px] border border-slate-200/60 p-8'} shadow-xl shadow-slate-200/40 relative overflow-hidden group`}
        >
            {/* Dynamic Background Glow */}
            <div className={`absolute -top-32 -left-32 w-80 h-80 opacity-[0.08] rounded-full blur-3xl pointer-events-none transition-colors duration-1000 ${label.bg}`} />

            <div className={`flex ${compact ? 'items-center' : 'items-end'} justify-between ${compact ? 'mb-3' : 'mb-6'} relative z-10`}>
                <div>
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.25em]">Impacto de Autoridad</span>
                     <h4 className={`${compact ? 'text-xl' : 'text-3xl'} font-black mt-2 tracking-tight ${label.color}`}>{label.text}</h4>
                </div>
                <div className="text-right">
                    <span className={`${compact ? 'text-3xl' : 'text-5xl'} font-black text-slate-900 leading-none tracking-tighter`}>
                        {score}
                        <span className="text-sm text-slate-300 font-bold ml-1">/100</span>
                    </span>
                </div>
            </div>

            <div className={`${compact ? 'h-3' : 'h-5'} bg-slate-100/50 rounded-full overflow-hidden relative border border-slate-200/50 shadow-inner p-1`}>
                {/* Gradient Progress Bar */}
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full group-hover:brightness-110 transition-all relative overflow-hidden shadow-lg"
                >
                    {/* Inner Pulse Effect */}
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
                
                {/* Segment Markers */}
                {!compact && (
                    <>
                        <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-white/10" />
                        <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-white/10" />
                        <div className="absolute top-0 bottom-0 left-[75%] w-[1px] bg-white/10" />
                    </>
                )}
            </div>

            {!compact && (
                <p className="text-[12px] text-slate-400 mt-5 font-bold flex items-center gap-2.5 relative z-10 bg-slate-50/50 w-fit px-4 py-1.5 rounded-full border border-slate-100">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Las puntuaciones altas maximizan el Dwell Time y el alcance orgánico.
                </p>
            )}
        </motion.div>
    );
};

export default ValueMeter;
