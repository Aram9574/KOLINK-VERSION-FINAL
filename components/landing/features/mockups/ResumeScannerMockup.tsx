import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, AlertTriangle, CheckCircle2, Upload } from 'lucide-react';

export const ResumeScannerMockup: React.FC = () => {
    const [scanState, setScanState] = useState<'idle' | 'scanning' | 'results'>('idle');

    useEffect(() => {
        // Loop the animation
        const interval = setInterval(() => {
            setScanState('scanning');
            setTimeout(() => setScanState('results'), 2000);
            setTimeout(() => setScanState('idle'), 6000);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-slate-900 w-full h-full min-h-[350px] flex items-center justify-center p-8 rounded-xl border border-slate-700 relative overflow-hidden font-sans">
             {/* Background */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

             <div className="flex gap-8 relative z-10 w-full max-w-2xl justify-center items-center">
                 
                 {/* Resume Document */}
                 <motion.div 
                    className="w-48 bg-white h-64 rounded shadow-xl p-4 flex flex-col gap-2 relative overflow-hidden"
                    animate={scanState === 'scanning' ? { scale: 0.95, opacity: 0.8 } : { scale: 1, opacity: 1 }}
                >
                     <div className="h-3 w-1/2 bg-slate-800 rounded mb-2"></div>
                     <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                     <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                     <div className="h-1.5 w-3/4 bg-slate-200 rounded mb-4"></div>
                     
                     <div className="h-2 w-1/3 bg-slate-400 rounded mb-1"></div>
                     <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                     <div className="h-1.5 w-full bg-slate-200 rounded"></div>

                     {/* Scanner Line */}
                     {scanState === 'scanning' && (
                         <motion.div 
                            initial={{ top: 0 }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 1.5, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-brand-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] z-20"
                         />
                     )}
                 </motion.div>

                 {/* Results Panel */}
                 <div className="w-64 space-y-3">
                     {scanState === 'results' ? (
                         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                             <div className="p-4 bg-slate-800 rounded-xl border border-slate-600 shadow-xl mb-3">
                                 <div className="flex justify-between items-center mb-2">
                                     <span className="text-slate-400 text-xs uppercase font-bold">ATS Score</span>
                                     <span className="text-2xl font-bold text-emerald-400">85/100</span>
                                 </div>
                                 <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                     <div className="w-[85%] h-full bg-emerald-500"></div>
                                 </div>
                             </div>

                             <div className="space-y-2">
                                 <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 flex items-start gap-3">
                                     <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                     <div>
                                         <div className="text-sm font-bold text-slate-200">Missing Keyword</div>
                                         <div className="text-xs text-slate-400">Add "Project Management"</div>
                                     </div>
                                 </div>
                                 <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 flex items-start gap-3">
                                     <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                     <div>
                                         <div className="text-sm font-bold text-slate-200">Impact Verbs</div>
                                         <div className="text-xs text-slate-400">Good use of "Led", "Scaled"</div>
                                     </div>
                                 </div>
                             </div>
                         </motion.div>
                     ) : (
                         <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-slate-500 gap-2"
                        >
                             <Search className="w-8 h-8 opacity-50" />
                             <span className="text-sm font-medium">Waiting for analysis...</span>
                         </motion.div>
                     )}
                 </div>
             </div>
        </div>
    );
};
