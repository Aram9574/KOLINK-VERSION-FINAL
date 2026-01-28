
import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { featuresData } from '../../../data/features';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useUser } from '../../../context/UserContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { PostEditorMockup } from './mockups/PostEditorMockup';
import { RealPreviewMockup } from './mockups/RealPreviewMockup';
import { TemplatesMockup } from './mockups/TemplatesMockup';
import { AIRewriteMockup } from './mockups/AIRewriteMockup';
import { CarouselEditorMockup } from './mockups/CarouselEditorMockup';
import { BrandKitMockup } from './mockups/BrandKitMockup';
import { AIContentMockup } from './mockups/AIContentMockup';
import { SchedulingCalendarMockup } from './mockups/SchedulingCalendarMockup';
import { SmartQueueMockup } from './mockups/SmartQueueMockup';
import { AuditScoreMockup } from './mockups/AuditScoreMockup';
import { ProfileHeatmapMockup } from './mockups/ProfileHeatmapMockup';
import { JobMatcherMockup } from './mockups/JobMatcherMockup';
import { ResumeScannerMockup } from './mockups/ResumeScannerMockup';
import { CommentAnalysisMockup } from './mockups/CommentAnalysisMockup';
import { ReplyGeneratorMockup } from './mockups/ReplyGeneratorMockup';
import { TrendSpotterMockup } from './mockups/TrendSpotterMockup';
import { IdeaDeckMockup } from './mockups/IdeaDeckMockup';

const MOCKUP_COMPONENTS: Record<string, React.FC> = {
    'PostEditorMockup': PostEditorMockup,
    'RealPreviewMockup': RealPreviewMockup,
    'TemplatesMockup': TemplatesMockup,
    'AIRewriteMockup': AIRewriteMockup,
    'CarouselEditorMockup': CarouselEditorMockup,
    'BrandKitMockup': BrandKitMockup,
    'AIContentMockup': AIContentMockup,
    'SchedulingCalendarMockup': SchedulingCalendarMockup,
    'SmartQueueMockup': SmartQueueMockup,
    'AuditScoreMockup': AuditScoreMockup,
    'ProfileHeatmapMockup': ProfileHeatmapMockup,
    'JobMatcherMockup': JobMatcherMockup,
    'ResumeScannerMockup': ResumeScannerMockup,
    'CommentAnalysisMockup': CommentAnalysisMockup,
    'ReplyGeneratorMockup': ReplyGeneratorMockup,
    'TrendSpotterMockup': TrendSpotterMockup,
    'IdeaDeckMockup': IdeaDeckMockup,
};

const FeatureLandingPage: React.FC = () => {
    const { featureSlug } = useParams<{ featureSlug: string }>();
    const { language, setLanguage, user } = useUser();
    
    // Get feature data
    const data = featureSlug ? featuresData[featureSlug] : undefined;
    
    // Redirect if feature doesn't exist
    if (!data) {
        return <Navigate to="/" replace />;
    }

    const scrollToSection = (e: any, id: string) => {
        // Placeholder for compatibility with Navbar props
        const el = document.getElementById(id);
        if(el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="font-sans selection:bg-brand-200 selection:text-brand-900 bg-white relative overflow-hidden">
            <Helmet>
                <title>{data.hero.title} | Kolink</title>
                <meta name="description" content={data.hero.subtitle} />
            </Helmet>
 
            {/* Premium Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-[-10%] w-[50%] h-[500px] bg-brand-100/30 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] left-[-10%] w-[40%] h-[600px] bg-pink-100/20 blur-[120px] rounded-full" />
            </div>

            <Navbar 
                language={language} 
                setLanguage={setLanguage} 
                user={user} 
                activeSection="" 
                scrollToSection={scrollToSection} 
            />

            <main className="pt-24 pb-20">
                {/* Hero Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20 lg:mb-28">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
                    
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-wider mb-6"
                        >
                            {data.hero.badge}
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-6xl font-display font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]"
                        >
                            {data.hero.title}
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
                        >
                            {data.hero.subtitle}
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link 
                                to={data.cta.link || "/login"}
                                className="w-full sm:w-auto px-8 py-4 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-600/20 hover:bg-brand-700 hover:shadow-brand-600/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
                            >
                                {data.hero.cta}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Hero Image / Mockup */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-16 mx-auto max-w-5xl rounded-2xl border border-slate-200/60 shadow-2xl overflow-hidden bg-slate-50 aspect-video flex items-center justify-center relative group"
                    >
                         {/* Dynamic Component or Image */}
                         {MOCKUP_COMPONENTS[data.hero.image] ? (
                             React.createElement(MOCKUP_COMPONENTS[data.hero.image])
                         ) : data.hero.image.startsWith("/") ? (
                             <img src={data.hero.image} alt="Feature Preview" className="w-full h-full object-cover object-top" />
                         ) : (
                             <div className="text-slate-400 font-medium">Interactive Preview Component</div>
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent pointer-events-none" />
                    </motion.div>
                </section>

                {/* Problem Section */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24 lg:mb-32">
                     <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">{data.problem.title}</h2>
                     </div>
                     <div className="grid md:grid-cols-3 gap-8">
                         {data.problem.cards.map((card, idx) => (
                             <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                 className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-soft-glow hover:-translate-y-1 transition-all duration-300 group"
                             >
                                 <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-8 group-hover:scale-110 transition-transform duration-300">
                                     <card.icon className="w-7 h-7" />
                                 </div>
                                 <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{card.title}</h3>
                                 <p className="text-slate-600 leading-relaxed font-medium">{card.text}</p>
                             </motion.div>
                         ))}
                     </div>
                </section>

                {/* Solution Section (Alternating) */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24 lg:mb-32 space-y-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{data.solution.title}</h2>
                        <p className="text-xl text-slate-600">{data.solution.subtitle}</p>
                    </div>

                    {data.solution.blocks.map((block, idx) => (
                        <div key={idx} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${block.imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
                            <div className="flex-1 space-y-6">
                                <h3 className="text-3xl font-bold text-slate-900">{block.title}</h3>
                                <p className="text-lg text-slate-600 leading-relaxed">{block.description}</p>
                            </div>
                            <div className="flex-1 w-full relative">
                                {/* Use Mockup Component if available, else Image */}
                                {MOCKUP_COMPONENTS[block.image] ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6 }}
                                        className="rounded-2xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-200/50"
                                    >
                                        {React.createElement(MOCKUP_COMPONENTS[block.image])}
                                    </motion.div>
                                ) : (
                                    <img 
                                        src={block.image} 
                                        alt={block.title} 
                                        className="w-full rounded-2xl shadow-2xl shadow-brand-900/10 border border-slate-200/60"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Use Cases Section */}
                <section className="bg-slate-900 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                    <div className="relative max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">{data.useCases.title}</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {data.useCases.cases.map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-slate-800 p-8 rounded-2xl border border-slate-700/50 hover:border-brand-500/50 hover:bg-slate-800/80 transition-all group"
                                >
                                    <div className="p-3 bg-brand-500/10 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <item.icon className="w-8 h-8 text-brand-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-slate-300 leading-relaxed font-medium">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* FAQ */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-24">
                    <h2 className="text-3xl font-bold font-display text-center text-slate-900 mb-12">Preguntas Frecuentes</h2>
                     <div className="space-y-4">
                        {data.faq.map((item, idx) => (
                            <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                            >
                                <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                                    {item.q}
                                </h3>
                                <p className="text-slate-600 leading-relaxed pl-[1.125rem]">{item.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                 {/* Bottom CTA */}
                 <section className="px-4 text-center pb-24">
                    <div className="max-w-4xl mx-auto bg-brand-600 rounded-3xl p-12 text-white shadow-2xl shadow-brand-600/30 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">{data.cta.title}</h2>
                            <p className="text-brand-100 text-lg mb-8">{data.cta.subtitle}</p>
                            <Link 
                                to={data.cta.link}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-bold rounded-xl shadow-lg hover:bg-brand-50 transition-colors"
                            >
                                {data.cta.buttonText}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-brand-500 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-brand-400 rounded-full blur-3xl opacity-50"></div>
                    </div>
                 </section>

            </main>
            
            <Footer language={language} scrollToSection={scrollToSection} />
        </div>
    );
};

export default FeatureLandingPage;
