import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowUp, TrendingUp } from 'lucide-react';

export const AuditScoreMockup: React.FC = () => {
    const [score, setScore] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setScore(72);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-white w-full h-full min-h-[350px] flex items-center justify-center p-8 rounded-xl border border-slate-200 relative overflow-hidden font-sans">
             {/* Background Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-sm">
                {/* Score Circle */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                     <svg className="w-full h-full rotate-[-90deg]">
                         <circle
                            cx="50%" cy="50%" r="45%"
                            fill="transparent"
                            stroke="#e2e8f0"
                            strokeWidth="12"
                         />
                         <motion.circle
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: score / 100 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            cx="50%" cy="50%" r="45%"
                            fill="transparent"
                            stroke={score > 80 ? "#10b981" : score > 60 ? "#f59e0b" : "#ef4444"}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray="1"
                            strokeDashoffset="0"
                         />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-6xl font-bold font-display text-slate-800"
                        >
                             {score}
                         </motion.div>
                         <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Profile Score</span>
                     </div>
                </div>

                {/* Insights Cards */}
                <div className="w-full space-y-3">
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg"
                    >
                         <div className="p-1 bg-red-100 rounded text-red-600">
                             <AlertCircle className="w-4 h-4" />
                         </div>
                         <div className="flex-1">
                             <div className="text-sm font-bold text-slate-700">Headline Missing Keywords</div>
                             <div className="text-xs text-slate-500">Add "SaaS" or "Growth" to rank higher.</div>
                         </div>
                    </motion.div>

                    <motion.div 
                         initial={{ x: -20, opacity: 0 }}
                         animate={{ x: 0, opacity: 1 }}
                         transition={{ delay: 1.2 }}
                         className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg"
                    >
                         <div className="p-1 bg-emerald-100 rounded text-emerald-600">
                             <CheckCircle2 className="w-4 h-4" />
                         </div>
                         <div className="flex-1">
                             <div className="text-sm font-bold text-slate-700">Profile Photo</div>
                             <div className="text-xs text-slate-500">Perfect lighting and framing.</div>
                         </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
