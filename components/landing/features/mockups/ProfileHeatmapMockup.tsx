import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Bell, Home, Briefcase, Users } from 'lucide-react';

export const ProfileHeatmapMockup: React.FC = () => {
    const [hoveredZone, setHoveredZone] = useState<string | null>(null);

    return (
        <div className="bg-slate-100 w-full h-full min-h-[350px] flex flex-col items-center pt-8 rounded-xl border border-slate-200 relative overflow-hidden font-sans">
            
            {/* Fake Navbar */}
            <div className="w-full bg-white h-12 border-b border-slate-200 flex items-center justify-around px-4 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded"></div>
                <div className="flex gap-6 text-slate-400">
                    <Home className="w-5 h-5 text-slate-800" />
                    <Users className="w-5 h-5" />
                    <Briefcase className="w-5 h-5" />
                    <MessageSquare className="w-5 h-5" />
                    <Bell className="w-5 h-5" />
                </div>
            </div>

            {/* Profile Card */}
            <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                
                {/* Banner Zone */}
                <div 
                    className="h-24 bg-gradient-to-r from-slate-300 to-slate-400 relative group cursor-pointer"
                    onMouseEnter={() => setHoveredZone('banner')}
                    onMouseLeave={() => setHoveredZone(null)}
                >
                    <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            Low Contrast
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6 relative">
                    {/* Photo Zone */}
                    <div 
                        className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 -mt-12 mb-3 relative group cursor-pointer"
                        onMouseEnter={() => setHoveredZone('photo')}
                        onMouseLeave={() => setHoveredZone(null)}
                    >
                         <img 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover"
                        />
                         <div className="absolute inset-0 rounded-full border-2 border-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-emerald-500/10">
                             <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg transform translate-y-8">
                                 <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                 </svg>
                             </div>
                         </div>
                    </div>

                    {/* Info Zone */}
                    <div className="space-y-2">
                        <div className="h-6 w-3/4 bg-slate-800 rounded animate-pulse"></div>
                        <div 
                            className="h-4 w-full bg-slate-200 rounded relative group cursor-pointer"
                            onMouseEnter={() => setHoveredZone('headline')}
                            onMouseLeave={() => setHoveredZone(null)}
                        >
                            <div className="absolute inset-0 border-2 border-amber-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             {hoveredZone === 'headline' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-6 left-0 bg-amber-500 text-white text-xs p-2 rounded shadow-xl z-20 w-48"
                                >
                                    Tip: Add "Helping X do Y" structure.
                                </motion.div>
                            )}
                        </div>
                        <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <div className="h-8 w-24 bg-blue-600 rounded-full"></div>
                        <div className="h-8 w-24 bg-white border border-slate-400 rounded-full"></div>
                    </div>
                </div>

                 {/* Analysis Overlay */}
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur border border-slate-200 p-3 rounded-lg shadow-xl text-xs space-y-2">
                     <div className="font-bold text-slate-700 mb-1">Live Analysis</div>
                     <div className="flex items-center gap-2 text-slate-500">
                         <div className="w-2 h-2 rounded-full bg-red-500"></div> Banner
                     </div>
                     <div className="flex items-center gap-2 text-slate-500">
                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Photo
                     </div>
                     <div className="flex items-center gap-2 text-slate-500">
                         <div className="w-2 h-2 rounded-full bg-amber-500"></div> Headline
                     </div>
                 </div>
            </div>
        </div>
    );
};
