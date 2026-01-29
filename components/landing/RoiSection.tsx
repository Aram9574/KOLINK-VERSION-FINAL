import React from 'react';
import { PenLine, Users, LineChart, FileText, X as XIcon, ArrowRight, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { translations } from '../../translations.ts';
import { AppLanguage } from '../../types.ts';

interface RoiSectionProps {
    language: AppLanguage;
}

const RoiSection: React.FC<RoiSectionProps> = ({ language }) => {
    const t = translations[language];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 70,
                damping: 20
            }
        }
    };

    const costItems = [
        { 
            title: t.roi.item1Title, 
            desc: t.roi.item1Desc, 
            price: t.roi.item1Price, 
            icon: PenLine, 
            color: "text-slate-500", 
            bg: "bg-slate-50" 
        },
        { 
            title: t.roi.item2Title, 
            desc: t.roi.item2Desc, 
            price: t.roi.item2Price, 
            icon: Users, 
            color: "text-slate-500", 
            bg: "bg-slate-50" 
        },
        { 
            title: t.roi.item3Title, 
            desc: t.roi.item3Desc, 
            price: t.roi.item3Price, 
            icon: LineChart, 
            color: "text-slate-500", 
            bg: "bg-slate-50" 
        },
        { 
            title: t.roi.item4Title, 
            desc: t.roi.item4Desc, 
            price: t.roi.item4Price, 
            icon: FileText, 
            color: "text-slate-500", 
            bg: "bg-slate-50" 
        }
    ];

    return (
        <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden" id="comparison">
            {/* Background Atmosphere */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-400/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-400/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-brand-600 text-[11px] font-black mb-8 tracking-widest uppercase shadow-sm"
                    >
                        <Sparkles className="w-3.5 h-3.5 fill-brand-100" />
                        {t.roi.badge}
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-6 tracking-tight leading-[1.05]"
                    >
                        {t.roi.mainTitle}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        {t.roi.mainDesc}
                    </motion.p>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start"
                >
                    {/* The Old Way - Agency Card */}
                    <motion.div 
                        variants={cardVariants}
                        className="bg-white rounded-[2rem] border border-slate-200 p-2 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-slate-300 transition-colors"
                    >
                        <div className="bg-slate-50 rounded-[1.5rem] p-8 md:p-10 h-full flex flex-col relative overflow-hidden">
                             {/* Grayscale overlay on hover to emphasize boringness */}
                            <div className="absolute inset-0 bg-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            
                            <div className="mb-8 relative z-10">
                                <h3 className="text-xl font-bold text-slate-900 mb-2 font-display uppercase tracking-wider">{t.comparison.genericHeader}</h3>
                                <p className="text-slate-500 text-sm font-medium">{t.roi.title}</p>
                            </div>

                            <div className="space-y-6 flex-grow relative z-10">
                                {costItems.map((item, idx) => (
                                    <div key={idx} className="flex items-start justify-between gap-4 py-4 border-b border-slate-200/60 last:border-0">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                                <XIcon className="w-3 h-3 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-1">{item.title}</p>
                                                <p className="text-xs text-slate-400 font-medium max-w-[200px]">{item.desc}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-slate-400 text-sm">{item.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between relative z-10">
                                <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{t.roi.totalLabel}</span>
                                <span className="text-2xl font-black text-slate-400 line-through decoration-red-400/50 decoration-2">{t.roi.totalPrice}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* The New Way - Kolink Card */}
                    <motion.div 
                        variants={cardVariants}
                        className="rounded-[2.5rem] p-[3px] bg-gradient-to-br from-indigo-500 via-brand-500 to-violet-600 shadow-2xl shadow-brand-500/20 relative group hover:shadow-brand-500/30 hover:scale-[1.01] transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-white/20 blur-xl group-hover:blur-2xl transition-all opacity-50" />
                        
                        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-[2.3rem] p-8 md:p-12 h-full flex flex-col relative overflow-hidden">
                            {/* Animated Background Mesh */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow" />
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/3" />

                            <div className="mb-auto relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-[10px] font-black tracking-widest uppercase shadow-inner shadow-brand-500/10">
                                        <Sparkles className="w-3 h-3 text-brand-400" />
                                        {t.roi.winnerLabel}
                                    </div>
                                </div>
                                
                                <h3 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tight">
                                    Kolink <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-indigo-300">Pro</span>
                                </h3>
                                
                                <p className="text-brand-100/80 font-medium text-lg max-w-sm leading-relaxed mb-10">
                                    {t.roi.kolinkLabel}
                                </p>

                                <div className="space-y-4 mb-12">
                                     {[
                                        t.roi.item1Title,
                                        t.roi.item2Title,
                                        t.roi.item3Title,
                                        t.roi.item4Title,
                                        "IA SOTA (GPT-4o, Claude 3.5)",
                                        "Soporte Prioritario"
                                     ].map((feature, i) => (
                                         <div key={i} className="flex items-center gap-3">
                                             <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/40">
                                                 <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                             </div>
                                             <span className="text-slate-200 font-bold text-sm tracking-wide">{feature}</span>
                                         </div>
                                     ))}
                                </div>
                            </div>

                            <div className="relative z-10 mt-8 pt-8 border-t border-white/10">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div>
                                        <span className="block text-xs font-black uppercase text-brand-300/60 tracking-widest mb-1">{t.roi.kolinkPlan}</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl lg:text-6xl font-black text-white tracking-tighter">{t.roi.kolinkPrice}</span>
                                        </div>
                                    </div>
                                    <Link 
                                        to="/login"
                                        className="inline-flex w-full md:w-auto items-center justify-center gap-2 px-8 py-4 bg-white text-brand-950 font-black rounded-2xl hover:bg-brand-50 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-900/50 group"
                                    >
                                        <span className="uppercase tracking-widest text-xs">{t.pricing.getStarted}</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-16 text-slate-400 text-xs font-bold uppercase tracking-widest"
                >
                    {t.roi.footerNote}
                </motion.p>
            </div>
        </section>
    );
};

export default RoiSection;
