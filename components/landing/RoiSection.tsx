import React from 'react';
import { PenLine, Users, LineChart, FileText, X as XIcon, ArrowRight, Sparkles } from 'lucide-react';
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
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const costItems = [
        { 
            title: t.roi.item1Title, 
            desc: t.roi.item1Desc, 
            price: t.roi.item1Price, 
            icon: PenLine, 
            color: "text-purple-600", 
            bg: "bg-purple-50" 
        },
        { 
            title: t.roi.item2Title, 
            desc: t.roi.item2Desc, 
            price: t.roi.item2Price, 
            icon: Users, 
            color: "text-blue-600", 
            bg: "bg-blue-50" 
        },
        { 
            title: t.roi.item3Title, 
            desc: t.roi.item3Desc, 
            price: t.roi.item3Price, 
            icon: LineChart, 
            color: "text-green-600", 
            bg: "bg-green-50" 
        },
        { 
            title: t.roi.item4Title, 
            desc: t.roi.item4Desc, 
            price: t.roi.item4Price, 
            icon: FileText, 
            color: "text-amber-600", 
            bg: "bg-amber-50" 
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden" id="comparison">
            {/* Background Grid - Premium SOTA Style */}
            {/* Grid removed for cleaner dotted aesthetic */}

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold mb-6 tracking-wider uppercase"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                        {language === 'es' ? 'Matemática Simple' : 'Simple Math'}
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tightest"
                    >
                         {language === 'es' ? "No es un gasto. Es gasolina." : "It's not a cost. It's fuel."}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg max-w-2xl mx-auto"
                    >
                        {language === 'es'
                            ? "Contratar una agencia te costaría €2,500/mes. Kolink te da mejores resultados por el precio de una cena."
                            : "Hiring an agency costs €2,500/mo. Kolink gives you better results for the price of a dinner."}
                    </motion.p>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="space-y-4"
                >
                    {/* The Traditional Cost Card */}
                    <div className="card-nexus p-1 bg-white/50 backdrop-blur-xl border-slate-200/60 overflow-hidden shadow-soft-glow">
                        <div className="divide-y divide-slate-100">
                            {costItems.map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    variants={itemVariants}
                                    className="p-5 md:p-8 flex items-center justify-between group transition-all"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 ${item.bg} ${item.color} rounded-2xl transition-transform group-hover:scale-110 duration-300 shadow-sm border border-black/5`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg group-hover:text-brand-600 transition-colors uppercase tracking-tightest">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-slate-500 font-medium">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-slate-900 text-lg tabular-nums">
                                            {item.price}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Legacy Total Alert */}
                        <motion.div 
                            variants={itemVariants}
                            className="bg-red-50/50 p-6 md:p-8 flex items-center justify-between border-t border-red-100/50"
                        >
                            <div className="flex items-center gap-3 text-red-600 font-bold uppercase text-sm tracking-widest">
                                <XIcon className="w-5 h-5" />
                                {t.roi.totalLabel}
                            </div>
                            <span className="text-2xl font-bold text-red-600 line-through decoration-red-400 decoration-4 tabular-nums">
                                {t.roi.totalPrice}
                            </span>
                        </motion.div>
                    </div>

                    {/* The Premium Kolink Card */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                        className="card-nexus p-1.5 bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 shadow-[0_20px_40px_-15px_rgba(37,99,235,0.3)]"
                    >
                        <div className="bg-white/5 rounded-[0.9rem] p-8 md:p-12 relative overflow-hidden backdrop-blur-sm border border-white/10">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black mb-4 tracking-widest uppercase">
                                        {language === 'es' ? 'La Opción del Ganador' : 'Winner\'s Choice'}
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 tracking-tightest leading-tight">
                                        {t.roi.kolinkPlan}
                                    </h3>
                                    <p className="text-brand-100 font-medium text-lg opacity-90">
                                        {t.roi.kolinkLabel}
                                    </p>
                                </div>
                                <div className="text-center md:text-right flex flex-col items-center md:items-end">
                                    <div className="flex items-baseline gap-1 text-white mb-6">
                                        <span className="text-5xl md:text-7xl font-display font-bold tracking-tightest">
                                            {t.roi.kolinkPrice}
                                        </span>
                                    </div>
                                    <Link 
                                        to="/login" 
                                        className="inline-flex items-center gap-3 px-10 py-4 bg-white text-brand-700 font-bold rounded-2xl shadow-2xl hover:bg-brand-50 hover:scale-105 active:scale-95 transition-all group"
                                    >
                                        <span className="uppercase tracking-widest text-sm">{t.pricing.getStarted}</span>
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom Trust Badge */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-12 text-slate-400 text-sm font-medium"
                >
                    {language === 'es' ? 'Precios en Euro (IVA incluido). Pago seguro con Stripe.' : 'Prices in Euro (VAT included). Secure payment with Stripe.'}
                </motion.p>
            </div>
        </section>
    );
};

export default RoiSection;
