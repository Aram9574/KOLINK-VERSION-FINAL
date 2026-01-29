import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import Navbar from '../Navbar';
import Footer from '../Footer';
import { Pricing } from '../../ui/pricing-cards';
import TestimonialsSection from '../../ui/testimonial-v2';
import LogoTicker from '../../ui/LogoTicker';
import Section from '../../ui/Section';
import { useUser } from '../../../context/UserContext';
import ROICalculator from './ROICalculator';
import { translations } from '../../../translations';
import {
    Tooltip
} from "../../ui/Tooltip";

const PricingPage: React.FC = () => {
    const { language, setLanguage, user } = useUser();
    const t = translations[language].pricingPage;

    const scrollToSection = (e: any, id: string) => {
        const el = document.getElementById(id);
        if(el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="font-sans selection:bg-brand-200 selection:text-brand-900 bg-white">
            <Helmet>
                <title>Planes y Precios | Kolink - Inversión que se Paga Sola</title>
                <meta name="description" content="Elige el plan perfecto para escalar tu marca personal en LinkedIn. Desde generación de contenido con IA hasta automatización total. Prueba gratis sin riesgo." />
                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            "name": "Kolink AI",
                            "applicationCategory": "BusinessApplication",
                            "operatingSystem": "All",
                            "offers": {
                                "@type": "AggregateOffer",
                                "lowPrice": "0",
                                "highPrice": "49",
                                "priceCurrency": "EUR",
                                "offerCount": "3",
                                "offers": [
                                    {
                                        "@type": "Offer",
                                        "name": "Starter Free",
                                        "price": "0",
                                        "priceCurrency": "EUR",
                                        "description": "Plan gratuito para probar la viralidad."
                                    },
                                    {
                                        "@type": "Offer",
                                        "name": "Creator Pro",
                                        "price": "15",
                                        "priceCurrency": "EUR",
                                        "description": "IAT ilimitada y automatización."
                                    },
                                    {
                                        "@type": "Offer",
                                        "name": "Viral Authority",
                                        "price": "49",
                                        "priceCurrency": "EUR",
                                        "description": "Para agencias y equipos."
                                    }
                                ]
                            }
                        }
                    `}
                </script>
            </Helmet>

            <Navbar 
                language={language} 
                setLanguage={setLanguage} 
                user={user} 
                activeSection="" 
                scrollToSection={scrollToSection} 
            />

            <main className="pt-24">
                {/* Hero Minimalista */}
                <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-12">
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-wider mb-8"
                    >
                        {t.badge}
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-display font-bold text-slate-900 tracking-tight mb-6"
                    >
                        {t.titleLine1}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">{t.titleLine2}</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600 max-w-2xl mx-auto font-medium"
                    >
                        {t.subtitle}
                    </motion.p>
                </section>

                {/* ROI Calculator */}
                <ROICalculator />

                {/* Pricing Cards */}
                <Pricing currentPlanId={undefined} hideHeader={true} />

                {/* Social Proof Ticker */}
                <div className="border-t border-slate-100">
                     <LogoTicker label={t.logosLabel} />
                </div>

                {/* Comparison Table */}
                <Section id="comparison" className="py-24 bg-slate-50/50">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.comparisonTitle}</h2>
                            <p className="text-slate-600">{t.comparisonSubtitle}</p>
                        </div>

                        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 bg-white">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200">
                                        <th className="p-6 text-left text-sm font-bold text-slate-500 w-1/3">{t.table.feature}</th>
                                        <th className="p-6 text-center text-sm font-bold text-slate-900 w-1/5">{t.table.free}</th>
                                        <th className="p-6 text-center text-sm font-bold text-brand-600 w-1/5 bg-brand-50/30">{t.table.pro}</th>
                                        <th className="p-6 text-center text-sm font-bold text-indigo-600 w-1/5">{t.table.viral}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {/* Categoría: Generación */}
                                    <tr className="bg-slate-50/30"><td colSpan={4} className="p-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{t.table.catGeneration}</td></tr>
                                    <ComparisonRow feature={t.table.credits} free={t.table.creditsFree} pro={t.table.creditsPro} viral={t.table.creditsViral} />
                                    <ComparisonRow feature={t.table.model} free={t.table.modelFree} pro={t.table.modelPro} viral={t.table.modelViral} />
                                    <ComparisonRow feature={t.table.carousel} free={false} pro={true} viral={true} />
                                    <ComparisonRow feature={t.table.voice} free={false} pro={true} viral={true} highlight />
                                    
                                    {/* Categoría: Crecimiento */}
                                    <tr className="bg-slate-50/30"><td colSpan={4} className="p-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{t.table.catGrowth}</td></tr>
                                    <ComparisonRow feature={t.table.scheduling} free={false} pro={true} viral={true} />
                                    <ComparisonRow feature={t.table.queue} free={false} pro={false} viral={true} tooltip={t.table.queueTooltip} />
                                    <ComparisonRow feature={t.table.insight} free={false} pro={false} viral={true} tooltip={t.table.insightTooltip} />
                                    <ComparisonRow feature={t.table.audit} free={t.table.auditFree} pro={t.table.auditPro} viral={t.table.auditViral} />

                                    {/* Categoría: Soporte */}
                                    <tr className="bg-slate-50/30"><td colSpan={4} className="p-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{t.table.catSupport}</td></tr>
                                    <ComparisonRow feature={t.table.community} free={false} pro={true} viral={true} />
                                    <ComparisonRow feature={t.table.support} free={t.table.supportFree} pro={t.table.supportPro} viral={t.table.supportViral} />
                                    <ComparisonRow feature={t.table.watermark} free={false} pro={true} viral={true} />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Section>

                {/* Testimonials */}
                <TestimonialsSection />

                {/* FAQ Section */}
                <Section id="faq" className="py-24">
                     <div className="container mx-auto px-4 max-w-3xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-display text-slate-900 mb-4">{t.faqTitle}</h2>
                            <p className="text-slate-600">{t.faqSubtitle}</p>
                        </div>
                        <div className="space-y-4">
                            <FAQItem q="¿Puedo cancelar en cualquier momento?" a="Sí, absolutamente. No creemos en las ataduras. Puedes cancelar tu suscripción desde tu panel de control con un solo clic y tendrás acceso hasta el final de tu periodo de facturación." />
                            <FAQItem q="¿Qué pasa si se me acaban los créditos?" a="Si estás en el plan Pro y necesitas más, puedes comprar paquetes de créditos extra o hacer un upgrade al plan Viral para tener créditos ilimitados. Te avisaremos cuando te queden poco." />
                            <FAQItem q="¿Es seguro conectar mi LinkedIn?" a="La seguridad es nuestra prioridad #1. Usamos la API oficial de LinkedIn y nunca almacenamos tu contraseña. Tus datos están encriptados y tú tienes el control total." />
                            <FAQItem q="¿Funcionará para mi industria?" a="Kolink es agnóstico a la industria. Nuestra IA analiza TU perfil y TU sector para adaptarse. Funciona para abogados, desarrolladores, marketers, fundadores y más." />
                            <FAQItem q="¿Hay garantía de devolución?" a="Sí. Si en los primeros 30 días sientes que Kolink no te ha ahorrado al menos 10 horas de trabajo, te devolvemos el 100% de tu dinero. Sin preguntas." />
                        </div>
                     </div>
                </Section>

                {/* Final CTA (Risk Reversal) */}
                <section className="py-24 px-4 bg-slate-900 text-center relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />
                     
                     <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-brand-400 border border-slate-700 text-sm font-bold animate-pulse">
                            <Sparkles className="w-4 h-4" />
                            {t.cta.badge}
                         </div>
                         <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight whitespace-pre-line">
                             {t.cta.title}
                         </h2>
                         <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                             {t.cta.subtitle}
                         </p>
                         <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                             <Link to="/login" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-xl hover:bg-brand-50 transition-all text-lg flex items-center justify-center gap-2">
                                 {t.cta.buttonPrimary}
                                 <ArrowRight className="w-5 h-5" />
                             </Link>
                             <Link to="/trust" className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:bg-slate-700 transition-all text-lg flex items-center justify-center gap-2">
                                 {t.cta.buttonSecondary}
                             </Link>
                         </div>
                         <p className="text-xs text-slate-500 uppercase tracking-widest font-bold pt-6">
                            {t.cta.noCard}
                         </p>
                     </div>
                </section>

                <Footer language={language} scrollToSection={scrollToSection} />
            </main>
        </div>
    );
};

// --- Sub-Components ---

const ComparisonRow = ({ feature, free, pro, viral, highlight = false, tooltip = "" }: { feature: string, free: boolean | string, pro: boolean | string, viral: boolean | string, highlight?: boolean, tooltip?: string }) => {
    
    const renderCell = (value: boolean | string, isPro: boolean = false) => {
        if (typeof value === 'boolean') {
            return value ? (
                <div className="flex justify-center">
                    <div className={`p-1 rounded-full ${isPro ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-700'}`}>
                        <Check className="w-4 h-4" />
                    </div>
                </div>
            ) : (
                <div className="flex justify-center">
                    <X className="w-4 h-4 text-slate-300" />
                </div>
            );
        }
        return <span className={isPro ? 'font-bold text-brand-700' : 'text-slate-600'}>{value}</span>;
    };

    return (
        <tr className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${highlight ? 'bg-brand-50/10' : ''}`}>
            <td className="p-6 text-sm font-medium text-slate-700 flex items-center gap-2">
                {feature}
                {tooltip && (
                    <Tooltip>
                        {tooltip}
                    </Tooltip>
                )}
            </td>
            <td className="p-6 text-center text-sm">{renderCell(free)}</td>
            <td className="p-6 text-center text-sm bg-brand-50/10 border-x border-brand-100/20">{renderCell(pro, true)}</td>
            <td className="p-6 text-center text-sm">{renderCell(viral)}</td>
        </tr>
    );
};

const FAQItem = ({ q, a }: { q: string, a: string }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="border border-slate-200 rounded-2xl p-6 bg-white hover:border-brand-200 transition-colors"
        >
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-500" />
                {q}
            </h3>
            <p className="text-slate-600 leading-relaxed pl-5">
                {a}
            </p>
        </motion.div>
    );
};

export default PricingPage;
