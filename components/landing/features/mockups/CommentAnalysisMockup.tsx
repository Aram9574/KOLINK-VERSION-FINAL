import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, User, Zap, Eye, BarChart3, TrendingUp } from 'lucide-react';

export const CommentAnalysisMockup: React.FC = () => {
    const [analyzing, setAnalyzing] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnalyzing(true);
            setProgress(0);
            
            let p = 0;
            const timer = setInterval(() => {
                p += 5;
                if (p <= 100) setProgress(p);
                else {
                    clearInterval(timer);
                    setAnalyzing(false);
                    setTimeout(() => {
                        // Reset loop
                    }, 3000);
                }
            }, 50);

        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white w-full h-full min-h-[350px] flex items-center justify-center p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden font-sans">
            
            {/* Simulated Post Card */}
            <div className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-xl p-4 relative z-10">
                <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate-300"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-2.5 w-1/3 bg-slate-400 rounded"></div>
                        <div className="h-2 w-1/4 bg-slate-300 rounded"></div>
                    </div>
                </div>
                <div className="space-y-2 mb-4">
                    <div className="h-2 w-full bg-slate-300 rounded"></div>
                    <div className="h-2 w-full bg-slate-300 rounded"></div>
                    <div className="h-2 w-2/3 bg-slate-300 rounded"></div>
                </div>

                {/* Analysis Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm border-t border-brand-100 rounded-b-xl overflow-hidden transition-all duration-500"
                     style={{ height: '60%' }}>
                    
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-brand-600 uppercase flex items-center gap-1">
                                <Zap className="w-3 h-3" /> AI Analysis
                            </span>
                            <span className="text-xs text-slate-400">{progress}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-brand-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Insights List */}
                        <div className="space-y-2">
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: progress > 30 ? 1 : 0, x: progress > 30 ? 0 : -10 }}
                                className="flex items-center gap-2 text-xs text-slate-600"
                            >
                                <Eye className="w-3 h-3 text-purple-500" />
                                <span>Topic: <strong>SaaS Growth</strong> detected.</span>
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: progress > 60 ? 1 : 0, x: progress > 60 ? 0 : -10 }}
                                className="flex items-center gap-2 text-xs text-slate-600"
                            >
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                                <span>Sentiment: <strong>Controversial</strong>. High engagement opportunity.</span>
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: progress > 90 ? 1 : 0, x: progress > 90 ? 0 : -10 }}
                                className="flex items-center gap-2 text-xs text-slate-600"
                            >
                                <MessageSquare className="w-3 h-3 text-blue-500" />
                                <span>Strategy: <strong>Ask a follow-up question</strong>.</span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scanning Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 pointer-events-none" />
        </div>
    );
};
