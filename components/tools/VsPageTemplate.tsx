import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, XCircle, ArrowRight, TrendingUp, Zap, Layout } from 'lucide-react';
import { COMPARISONS } from '@/data/comparisons';
import { motion } from 'framer-motion';

import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';

const VsPageTemplate = () => {
    const { language } = useUser();
    const t = translations[language]?.toolsPage?.vsPage || translations['en'].toolsPage.vsPage;

    const { competitorSlug } = useParams();
    const navigate = useNavigate();

    const data = useMemo(() => 
        COMPARISONS.find(c => c.slug === competitorSlug), 
    [competitorSlug]);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900">{t.notFound}</h1>
                    <Link to="/tools" className="text-brand-600 hover:underline mt-2 inline-block">{t.returnTools}</Link>
                </div>
            </div>
        );
    }

    const title = (language === 'es' && data.titleEs) ? data.titleEs : data.title;
    const description = (language === 'es' && data.descriptionEs) ? data.descriptionEs : data.description;
    const pros = (language === 'es' && data.prosEs) ? data.prosEs : data.pros;
    const cons = (language === 'es' && data.consEs) ? data.consEs : data.cons;

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Helmet>
                <title>{data.title} | Kolink</title>
                <meta name="description" content={data.description} />
            </Helmet>

            {/* Navbar */}
            <header className="p-6 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold tracking-tighter">Kolink.</Link>
                    <Link to="/login" className="px-5 py-2 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition">{t.startTrial}</Link>
                </div>
            </header>

            {/* Hero */}
            <section className="pt-20 pb-16 px-6 text-center max-w-5xl mx-auto">
                <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-slate-500 font-bold text-sm mb-6 uppercase tracking-wider">
                    Kolink vs {data.competitorName}
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 mb-6 leading-tight">
                    {t.switchHeadline} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">{t.switchHeadlineHighlight}</span>.
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
                    {description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/login" className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-500 transition-all shadow-xl shadow-brand-500/20">
                        {t.startTrial}
                    </Link>
                    <Link to="/tools" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
                        {t.seeAllTools}
                    </Link>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-20 bg-slate-50 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                        <div className="grid grid-cols-3 bg-slate-900 text-white p-6 font-bold text-lg">
                            <div className="col-span-1">{t.feature}</div>
                            <div className="col-span-1 text-center text-brand-400">Kolink</div>
                            <div className="col-span-1 text-center text-slate-400 opacity-60">{data.competitorName}</div>
                        </div>
                        
                        <div className="divide-y divide-slate-100">
                            {data.features.map((feature, i) => {
                                const featureName = (language === 'es' && feature.nameEs) ? feature.nameEs : feature.name;
                                const kolinkVal = (language === 'es' && feature.kolinkEs) !== undefined ? feature.kolinkEs : feature.kolink;
                                const compVal = (language === 'es' && feature.competitorEs) !== undefined ? feature.competitorEs : feature.competitor;

                                return (
                                <div key={i} className="grid grid-cols-3 p-6 hover:bg-slate-50 transition-colors items-center">
                                    <div className="font-semibold text-slate-700">{featureName}</div>
                                    <div className="text-center font-bold text-slate-900 flex justify-center">
                                        {kolinkVal === true ? <CheckCircle2 className="text-green-500" /> : kolinkVal}
                                    </div>
                                    <div className="text-center text-slate-500 flex justify-center">
                                        {compVal === true ? <CheckCircle2 className="text-slate-400" /> : 
                                         compVal === false ? <XCircle className="text-slate-300" /> :
                                         compVal}
                                    </div>
                                </div>
                            )})}
                        </div>

                         <div className="grid grid-cols-3 bg-slate-50 p-6 border-t border-slate-200 text-lg">
                            <div className="font-bold text-slate-900 self-center">{t.monthlyCost}</div>
                            <div className="text-center font-black text-3xl text-green-600">
                                {data.pricing.kolink}
                            </div>
                            <div className="text-center font-bold text-xl text-slate-400 line-through self-center">
                                {data.pricing.competitor}
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center mt-6 text-sm text-slate-500 font-medium">
                        {t.pricesDisclaimer}
                    </div>
                </div>
            </section>

            {/* Why Switch */}
            <section className="py-20 px-6 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">{t.whySwitch}</h2>
                        <div className="space-y-6">
                            {pros.map((pro, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-green-50/50 border border-green-100"
                                >
                                    <div className="p-2 bg-green-100 text-green-700 rounded-lg shrink-0">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{pro}</h3>
                                        <p className="text-slate-600 text-sm mt-1">
                                            {t.designedFor}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 to-slate-900" />
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-6 text-slate-200 border-b border-white/10 pb-4">
                                {t.theGap} {data.competitorName}
                            </h3>
                            <div className="space-y-4">
                                {cons.map((con, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-300">
                                        <XCircle className="text-red-400 shrink-0" size={18} />
                                        <span>{con}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <div className="text-4xl font-black text-white mb-2">{data.pricing.savings}</div>
                                <div className="text-slate-400 uppercase text-xs font-bold tracking-widest">{t.savings}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-slate-900 text-center px-6">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                   {t.readyHeadline}
                </h2>
                <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:scale-105 transition-transform">
                    {t.tryFree} <ArrowRight size={20} />
                </Link>
                <p className="text-slate-500 mt-6 text-sm">{t.noCard}</p>
            </section>
        </div>
    );
};

export default VsPageTemplate;
