import React from 'react';
import { motion } from 'framer-motion';

interface ValueMeterProps {
    score: number; // 0 to 100
}

const ValueMeter: React.FC<ValueMeterProps> = ({ score }) => {
    // Determine context based on score
    const getLabel = () => {
        if (score >= 90) return { text: "Top 1% Authority", color: "text-emerald-600" };
        if (score >= 75) return { text: "Thought Leader", color: "text-blue-600" };
        if (score >= 50) return { text: "Valuable Contributor", color: "text-indigo-600" };
        return { text: "Common Comment", color: "text-slate-500" };
    };

    const label = getLabel();

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-end mb-2">
                <div>
                     <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Authority Impact</span>
                     <h4 className={`text-lg font-bold ${label.color}`}>{label.text}</h4>
                </div>
                <span className="text-2xl font-black text-slate-900">{score}<span className="text-sm text-slate-400 font-normal">/100</span></span>
            </div>

            <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative">
                {/* Gradient Bar */}
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-emerald-400 rounded-full"
                />
                
                {/* Tick Marks */}
                <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-white/50" />
                <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-white/50" />
                <div className="absolute top-0 bottom-0 left-[75%] w-[1px] bg-white/50" />
            </div>

            <p className="text-xs text-slate-400 mt-2 text-right">
                Higher scores indicate deeper insight and better networking potential.
            </p>
        </div>
    );
};

export default ValueMeter;
