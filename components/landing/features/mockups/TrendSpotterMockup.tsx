import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Sparkles, TrendingUp, BarChart, ArrowUpRight } from 'lucide-react';

export const TrendSpotterMockup: React.FC = () => {
    
    return (
        <div className="bg-white w-full h-full min-h-[350px] flex items-center justify-center p-8 rounded-xl border border-slate-200 font-sans overflow-hidden">
            
            <div className="w-full max-w-sm space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-brand-500" />
                        Trending in SaaS
                    </h3>
                    <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                        LIVE
                    </span>
                </div>

                <div className="space-y-3">
                    {/* News Item 1 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl group hover:border-brand-200 transition-colors cursor-pointer relative overflow-hidden"
                    >
                        <div className="flex gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded text-blue-600 flex items-center justify-center">
                                <Newspaper className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm leading-tight">AI Regulation Bill Released</h4>
                                <span className="text-[10px] text-slate-400">TechCrunch • 2h ago</span>
                            </div>
                        </div>
                        
                        {/* Insight Overlay */}
                        <div className="mt-3 pt-3 border-t border-slate-100">
                             <div className="flex items-start gap-2">
                                 <Sparkles className="w-3.5 h-3.5 text-brand-500 mt-0.5 shrink-0" />
                                 <p className="text-xs text-slate-600">
                                     <span className="font-bold text-slate-800">Your Take:</span> Argue that this will actually benefit solo founders by raising the barrier to entry for spam bots.
                                 </p>
                             </div>
                        </div>

                         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <ArrowUpRight className="w-4 h-4 text-slate-400" />
                         </div>
                    </motion.div>

                    {/* News Item 2 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                         <div className="flex gap-3 mb-2">
                            <div className="w-8 h-8 bg-purple-100 rounded text-purple-600 flex items-center justify-center">
                                <BarChart className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm leading-tight">Remote Work Statistics 2026</h4>
                                <span className="text-[10px] text-slate-400">Forbes • 5h ago</span>
                            </div>
                        </div>
                         <div className="mt-3 pt-3 border-t border-slate-100">
                             <div className="flex items-start gap-2">
                                 <Sparkles className="w-3.5 h-3.5 text-brand-500 mt-0.5 shrink-0" />
                                 <p className="text-xs text-slate-600">
                                     <span className="font-bold text-slate-800">Your Take:</span> Compare this to your own team's productivity. Use specific numbers.
                                 </p>
                             </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};
