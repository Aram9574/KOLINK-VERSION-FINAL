import React from 'react';
import { Link } from 'react-router-dom';
import { NICHES } from '../../data/niches';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const NicheLinks: React.FC<{ language: string }> = ({ language }) => {
    const isEs = language === 'es';
    
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-display font-bold text-slate-900 mb-4 tracking-tight"
                    >
                        {isEs ? "Soluciones por Industria" : "Solutions by Industry"}
                    </motion.h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {isEs 
                          ? "Herramientas gratuitas de IA optimizadas para tu nicho específico. Elige tu industria y empieza a dominar LinkedIn." 
                          : "Free AI tools optimized for your specific niche. Choose your industry and start dominating LinkedIn."}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {NICHES.map((niche, idx) => (
                        <motion.div
                            key={niche.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link 
                                to={`/tools/${niche.slug}`}
                                className="group block p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/5 transition-all"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="px-2 py-1 bg-brand-50 text-brand-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                        Nicho
                                    </div>
                                    <ArrowUpRight className="text-slate-300 group-hover:text-brand-500 transition-colors" size={18} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand-600 transition-colors leading-tight">
                                    {niche.title}
                                </h3>
                                <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                                    {niche.metaDescription.split('.')[0]}.
                                </p>
                                <div className="mt-4 flex items-center gap-1 text-brand-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Sparkles size={12} />
                                    {isEs ? "Probar herramienta" : "Try tool"}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
                
                <div className="mt-16 p-8 bg-brand-600 rounded-[2rem] text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={120} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 relative z-10">
                        {isEs ? "¿No ves tu industria?" : "Don't see your industry?"}
                    </h3>
                    <p className="mb-8 opacity-90 max-w-xl mx-auto relative z-10">
                        {isEs 
                          ? "Nuestro motor de IA de Kolink Pro puede adaptarse a CUALQUIER nicho mediante el entrenamiento de ADN de Marca." 
                          : "Our Kolink Pro AI engine can adapt to ANY niche using Brand DNA training."}
                    </p>
                    <Link 
                        to="/login"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-brand-600 rounded-xl font-bold hover:bg-brand-50 transition-colors relative z-10"
                    >
                        {isEs ? "Descubre Kolink Pro" : "Discover Kolink Pro"}
                        <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};
