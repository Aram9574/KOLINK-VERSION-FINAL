import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Calendar, Clock, MoreHorizontal, GripVertical, CheckCircle2 } from 'lucide-react';

export const SchedulingCalendarMockup: React.FC = () => {
    const [items, setItems] = useState([
        { id: "1", content: "Growth Hacks for 2026", time: "09:00 AM", type: "carousel", status: "scheduled" },
        { id: "2", content: "My biggest failure...", time: "02:00 PM", type: "text", status: "scheduled" },
        { id: "3", content: "Why I switched to Next.js", time: "10:00 AM", type: "image", status: "draft" }
    ]);

    return (
        <div className="bg-white w-full h-full min-h-[400px] flex flex-col rounded-xl border border-slate-200 overflow-hidden font-sans">
            {/* Header */}
            <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50/50">
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Calendar className="w-5 h-5 text-brand-600" />
                    <span>October 2026</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-xs font-bold text-slate-500">D</div>
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-brand-600/20">W</div>
                    <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-xs font-bold text-slate-500">M</div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 p-6 bg-slate-50/30">
                <div className="grid grid-cols-7 gap-4 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                    <div>Sun</div>
                </div>
                
                {/* Simplified Week View */}
                <div className="grid grid-cols-7 gap-4 h-full">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-3 h-full group relative">
                             {/* Day Background */}
                            <div className={`absolute inset-0 rounded-xl ${i===2 ? 'bg-brand-50/50' : 'bg-transparent'} group-hover:bg-slate-100/50 transition-colors -z-10`} />
                            
                            <div className={`text-center py-2 text-sm font-medium ${i===2 ? 'text-brand-600' : 'text-slate-500'}`}>
                                {24 + i}
                            </div>

                            {/* Scheduled Items simulation */}
                            {i === 0 && (
                                <motion.div 
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="p-3 bg-white rounded-lg shadow-sm border border-slate-200 border-l-4 border-l-blue-500 text-xs"
                                >
                                    <div className="font-bold text-slate-700 mb-1">Carousel</div>
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <Clock className="w-3 h-3" /> 09:00
                                    </div>
                                </motion.div>
                            )}

                            {i === 2 && (
                                <>
                                    <motion.div 
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="p-3 bg-brand-600 rounded-lg shadow-lg shadow-brand-600/20 text-xs text-white transform scale-105"
                                    >
                                        <div className="font-bold mb-1 flex items-center justify-between">
                                            Thread
                                            <CheckCircle2 className="w-3 h-3 text-brand-200" />
                                        </div>
                                        <div className="flex items-center gap-1 text-brand-100">
                                            <Clock className="w-3 h-3" /> 11:30
                                        </div>
                                    </motion.div>
                                     <motion.div 
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="p-3 bg-white opacity-60 rounded-lg border border-dashed border-slate-300 text-xs flex items-center justify-center gap-1 text-slate-400"
                                    >
                                        <Clock className="w-3 h-3" /> Smart Slot
                                    </motion.div>
                                </>
                            )}
                             
                             {/* Add Button */}
                            <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-full py-2 rounded border border-dashed border-slate-300 text-slate-400 text-xs font-bold text-center cursor-pointer hover:bg-white hover:border-brand-300 hover:text-brand-500 transition-all">
                                    + Add Post
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
