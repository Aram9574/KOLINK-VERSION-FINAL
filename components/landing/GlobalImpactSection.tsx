
import React from "react";
import { motion } from "framer-motion";
import { useUser } from "../../context/UserContext";
import { translations } from "../../translations";

const WorldMapSvg = () => (
  <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20">
    <path
      d="M234.3,382.6c-4.4,0-8.9.1-13.3.3-19.6.9-38.3,5.5-56.1,13.8.3-2.5.5-5 .8-7.5 1.6-13.8 4.2-27.4 7.7-40.8 1.9-7.2 4-14.3 6.3-21.4 3.7-11.2 8-22.1 12.9-32.8 1.8-4 3.7-8 5.7-11.9 2.1-4.2 4.3-8.3 6.6-12.4 1.1-2 2.3-4 3.5-5.9 8.2-13.6 17.8-26.3 28.6-38 1.8-1.9 3.6-3.8 5.5-5.6 9.8-9.4 20.3-18 31.5-25.9 11.2-7.9 23-14.9 35.3-21.1 1.5-.8 3-1.5 4.6-2.2 6.5-3.1 13.1-5.9 19.9-8.4 13.6-5 27.8-8.9 42.4-11.7 14.6-2.8 29.6-4.4 44.8-4.9 7.6-.2 15.2-.2 22.9.2 15.2.7 30.2 2.6 44.8 5.9 14.6 3.3 28.7 7.9 42.3 13.7 6.8 2.9 13.3 6.2 19.8 9.8 1.6.9 3.2 1.8 4.7 2.7 12.2 6.8 23.9 14.6 34.9 23.4 11 8.8 21.3 18.4 30.8 28.9 1.9 2.1 3.7 4.2 5.5 6.4 10.6 12.8 19.9 26.8 27.9 41.8 1.2 2.2 2.3 4.5 3.4 6.7 2.2 4.4 4.3 8.9 6.2 13.4 4.7 11.2 8.7 22.8 12.1 34.6 2.1 7.3 3.9 14.8 5.5 22.3 3.2 14.8 5.6 29.8 7 45 .3 2.7.5 5.3.7 8-17.6-9.1-36-14.2-55.5-15.3-4.4-.2-8.8-.4-13.3-.4H234.3z"
      fill="currentColor"
    />
     {/* Abstract representation, simplified for aesthetic */}
     <circle cx="200" cy="150" r="10" fill="currentColor" />
     <circle cx="800" cy="150" r="10" fill="currentColor" />
     <circle cx="500" cy="300" r="10" fill="currentColor" />
  </svg>
);

const GlobalImpactSection = () => {
    const { language } = useUser();
    const t = translations[language].about.global;

    const locations = [
        { top: "30%", left: "20%" }, // US
        { top: "40%", left: "48%" }, // Europe
        { top: "60%", left: "70%" }, // Asia
        { top: "70%", left: "30%" }, // South America
        { top: "35%", left: "25%" }, // US East
        { top: "38%", left: "50%" }, // UK
    ];

    return (
        <section className="py-32 bg-slate-50 relative overflow-hidden">
             {/* Map Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none text-slate-900">
                <div className="w-[1200px]">
                    <WorldMapSvg />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                         <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1.5 rounded-full bg-brand-100/50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            Global
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6">{t.title}</h2>
                        <h3 className="text-2xl text-slate-400 font-serif italic mb-8">{t.subtitle}</h3>
                        <p className="text-lg text-slate-600 leading-relaxed mb-12 max-w-md">{t.description}</p>
                        
                        <div className="flex gap-8 md:gap-16 border-t border-slate-200 pt-8">
                            {t.stats.map((stat: any, idx: number) => (
                                <div key={idx}>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-[400px] bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-800">
                         {/* Stylized Abstract Map Dots */}
                         <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-slate-900" />
                         
                         {locations.map((loc, idx) => (
                             <motion.div
                                key={idx}
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ delay: idx * 0.2, type: "spring" }}
                                style={{ top: loc.top, left: loc.left }}
                                className="absolute w-4 h-4"
                             >
                                 <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75 animate-ping"></span>
                                 <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-500 border-2 border-slate-900"></span>
                             </motion.div>
                         ))}

                         {/* Connecting lines SVG overlay */}
                         <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <motion.path 
                                d="M200 150 Q 400 50 480 200" 
                                fill="none" 
                                stroke="url(#gradient-line)" 
                                strokeWidth="2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 0.3 }}
                                transition={{ duration: 2, delay: 1 }}
                            />
                            <defs>
                                <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                                    <stop offset="50%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                         </svg>
                         
                         <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-white text-xs font-mono">LIVE: New user joined from Barcelona, ES</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GlobalImpactSection;
