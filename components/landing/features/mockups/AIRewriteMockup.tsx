
import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, RefreshCw, Zap, AlignLeft } from 'lucide-react';

export const AIRewriteMockup: React.FC = () => {
    return (
        <div className="w-full h-full min-h-[350px] bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-center relative shadow-sm">
            
            {/* Control Bar */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-xl rounded-full px-4 py-2 flex items-center gap-4 z-20">
                <button className="flex flex-col items-center gap-1 group">
                     <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center transition-colors group-hover:bg-brand-100">
                        <Wand2 className="w-4 h-4" />
                     </div>
                     <span className="text-[9px] font-bold text-slate-500 uppercase">Improve</span>
                </button>
                <div className="w-px h-6 bg-slate-100" />
                <button className="flex flex-col items-center gap-1 group opacity-60">
                     <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4" />
                     </div>
                     <span className="text-[9px] font-bold text-slate-400 uppercase">Rewrite</span>
                </button>
                 <div className="w-px h-6 bg-slate-100" />
                <button className="flex flex-col items-center gap-1 group opacity-60">
                     <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                     </div>
                     <span className="text-[9px] font-bold text-slate-400 uppercase">Shorten</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="space-y-6 mt-8">
                {/* Original (Faded) */}
                <motion.div 
                    initial={{ opacity: 1 }}
                    whileInView={{ opacity: 0.3 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="p-4 rounded-xl border border-red-100 bg-red-50/50"
                >
                    <div className="text-xs text-red-400 font-bold mb-1 uppercase tracking-wider">Antes</div>
                    <p className="text-slate-600 text-sm line-through decoration-red-300">
                        Creo que es importante ser constante en LinkedIn para tener buenos resultados y clientes.
                    </p>
                </motion.div>

                {/* Arrow */}
                <div className="flex justify-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center border border-brand-200"
                    >
                        <Wand2 className="w-4 h-4" />
                    </motion.div>
                </div>

                {/* Improved (Highlighted) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="p-5 rounded-xl border border-brand-200 bg-brand-50 shadow-sm relative"
                >
                    <div className="absolute -top-3 -right-2 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        Más Viral
                    </div>
                    <div className="text-xs text-brand-600 font-bold mb-2 uppercase tracking-wider">Después (Polémico)</div>
                    <p className="text-slate-900 font-medium text-lg leading-snug">
                        La constancia en LinkedIn está sobrevalorada. <br/>
                        <span className="text-brand-600 bg-brand-100/50 px-1 rounded">Lo que necesitas es obsesión.</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
