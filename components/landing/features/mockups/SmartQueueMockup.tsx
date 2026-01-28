import React from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, GripVertical, CheckCircle2, Zap } from 'lucide-react';

export const SmartQueueMockup: React.FC = () => {
    return (
        <div className="bg-slate-50 w-full h-full min-h-[350px] flex flex-col p-6 rounded-xl border border-slate-200 lg:flex-row gap-6">
            
            {/* Left: Queue Settings */}
            <div className="lg:w-1/3 space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-1">Queue Logic</h3>
                    <p className="text-xs text-slate-500 mb-4">How should we fill empty slots?</p>
                    
                    <div className="flex items-center justify-between p-3 bg-brand-50 rounded-lg border border-brand-100 mb-2">
                        <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-brand-600" />
                            <span className="text-sm font-bold text-brand-700">Auto-Recycle</span>
                        </div>
                        <div className="w-10 h-5 bg-brand-600 rounded-full relative cursor-pointer">
                            <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1"></div>
                        </div>
                    </div>
                    
                    <p className="text-xs text-slate-400">
                        Automatically reposts your top performing content from 6+ months ago when your queue is empty.
                    </p>
                </div>
            </div>

            {/* Right: The Queue */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-700">Upcoming Posts</h3>
                    <span className="text-xs font-medium text-slate-400">Next 48 Hours</span>
                </div>

                <div className="space-y-3 relative z-10">
                    {/* Item 1 */}
                    <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
                         <div className="text-slate-300 cursor-move"><GripVertical className="w-4 h-4" /></div>
                         <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                             Car
                         </div>
                         <div className="flex-1">
                             <div className="text-sm font-bold text-slate-700 truncate w-32 sm:w-auto">How to define your ICP</div>
                             <div className="text-xs text-slate-400 flex items-center gap-1">
                                 <Clock className="w-3 h-3" /> Today, 2:00 PM <span className="text-brand-600 font-bold bg-brand-50 px-1 rounded ml-2 text-[10px]">Best Time</span>
                             </div>
                         </div>
                         <button className="text-xs font-bold text-slate-400 hover:text-brand-600">Edit</button>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
                         <div className="text-slate-300 cursor-move"><GripVertical className="w-4 h-4" /></div>
                         <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-xs uppercase">
                             Txt
                         </div>
                         <div className="flex-1">
                             <div className="text-sm font-bold text-slate-700 truncate w-32 sm:w-auto">Contrarian take on AI</div>
                             <div className="text-xs text-slate-400 flex items-center gap-1">
                                 <Clock className="w-3 h-3" /> Tomorrow, 9:00 AM
                             </div>
                         </div>
                         <button className="text-xs font-bold text-slate-400 hover:text-brand-600">Edit</button>
                    </div>

                     {/* Item 3 (Recycled) */}
                     <motion.div 
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3 p-3 bg-brand-50/50 border border-brand-100 border-dashed rounded-lg"
                    >
                         <div className="text-brand-300"><RefreshCw className="w-4 h-4" /></div>
                         <div className="flex-1">
                             <div className="text-sm font-medium text-brand-800 flex items-center gap-2">
                                <Zap className="w-3 h-3" /> Auto-filled from archives
                             </div>
                             <div className="text-xs text-brand-600/70 truncate w-48">"Why consistency beats intensity..."</div>
                         </div>
                    </motion.div>
                </div>
                
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-500/5 to-transparent rounded-bl-full pointer-events-none" />
            </div>
        </div>
    );
};
