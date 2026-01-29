
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
    Users, DollarSign, TrendingUp, Sparkles, CheckCircle, ArrowRight, 
    Wallet, Globe, Zap, Briefcase, Mail, Download, 
    Video, Layout
} from 'lucide-react';

import Navbar from '../Navbar';
import Footer from '../Footer';
import Section from '../../ui/Section';
import CommissionCalculator from './CommissionCalculator';
import AffiliateTermsModal from './AffiliateTermsModal';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';
import { Card } from '../../ui/card';

const AffiliatePage: React.FC = () => {
    const { language, setLanguage, user } = useUser();
    const t = translations[language].affiliatePage;
    const [isTermsOpen, setIsTermsOpen] = useState(false);

    const scrollToSection = (e: any, id: string) => {
        const el = document.getElementById(id);
        if(el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AffiliateProgram",
        "name": "Kolink Partner Program",
        "description": "Earn 30% recurring commission on all referrals.",
        "provider": {
            "@type": "Organization",
            "name": "Kolink"
        },
        "commission": {
            "@type": "MonetaryAmount",
            "currency": "EUR",
            "value": "30%"
        }
    };

    return (
        <div className="font-sans selection:bg-indigo-100 selection:text-indigo-900 bg-white">
            <Helmet>
                <title>{language === 'es' ? 'Programa de Afiliados | Kolink Partner' : 'Affiliate Program | Kolink Partner'}</title>
                 <meta name="description" content={language === 'es' ? "Gana un 30% recurrente promocionando Kolink." : "Earn 30% recurring commissions promoting Kolink."} />
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            </Helmet>

            <Navbar 
                language={language} 
                setLanguage={setLanguage} 
                user={user} 
                activeSection="" 
                scrollToSection={scrollToSection} 
            />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-24">
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-8"
                    >
                        <Sparkles className="w-3 h-3" />
                        {t.hero.badge}
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tight mb-8"
                    >
                        {t.hero.titleLine1}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{t.hero.titleLine2}</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed mb-10"
                    >
                        {t.hero.subtitle}
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a 
                            href="https://kolink.tolt.io" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-xl hover:bg-indigo-700 transition-all text-lg flex items-center justify-center gap-2 transform hover:-translate-y-1"
                        >
                            {t.hero.ctaPrimary}
                            <ArrowRight className="w-5 h-5" />
                        </a>
                        <button onClick={(e) => scrollToSection(e, 'calculator')} className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-lg">
                            {t.hero.ctaSecondary}
                        </button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mt-20 p-8 rounded-3xl bg-slate-50 border border-slate-100"
                    >
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 mb-1">{t.stats.activePartners}</div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Activos Globalmente</div>
                        </div>
                        <div className="text-center border-l border-slate-200">
                             <div className="text-3xl font-bold text-emerald-600 mb-1">€12,500+</div>
                             <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.stats.payouts}</div>
                        </div>
                         <div className="text-center border-l border-slate-200 hidden md:block">
                             <div className="text-3xl font-bold text-indigo-600 mb-1">~3.5%</div>
                             <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.stats.conversionRate}</div>
                        </div>
                        <div className="text-center border-l border-slate-200 hidden md:block">
                             <div className="text-3xl font-bold text-indigo-600 mb-1">~€450/mo</div>
                             <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.stats.avgEarnings}</div>
                        </div>
                    </motion.div>
                </section>

                {/* Opportunity Section (Why Now?) */}
                <Section className="py-24 bg-white">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-16">
                             <h2 className="text-3xl font-bold font-display text-slate-900 mb-4">{t.opportunity.title}</h2>
                             <p className="text-slate-600 text-lg max-w-2xl mx-auto">{t.opportunity.subtitle}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             <OpportunityCard 
                                icon={<TrendingUp className="w-6 h-6 text-white"/>} 
                                title={t.opportunity.card1Title} 
                                desc={t.opportunity.card1Desc} 
                                color="bg-orange-500"
                             />
                             <OpportunityCard 
                                icon={<Zap className="w-6 h-6 text-white"/>} 
                                title={t.opportunity.card2Title} 
                                desc={t.opportunity.card2Desc} 
                                color="bg-indigo-600"
                             />
                             <OpportunityCard 
                                icon={<DollarSign className="w-6 h-6 text-white"/>} 
                                title={t.opportunity.card3Title} 
                                desc={t.opportunity.card3Desc} 
                                color="bg-emerald-500"
                             />
                        </div>
                    </div>
                </Section>

                {/* Target Audience (Who is this for?) */}
                <Section className="py-24 bg-slate-50">
                     <div className="container mx-auto px-4 max-w-6xl">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-bold font-display text-slate-900 mb-6">{t.targetAudience.title}</h2>
                                <p className="text-lg text-slate-600 mb-8">{t.targetAudience.subtitle}</p>
                                <div className="space-y-6">
                                    <AudienceItem icon={<Video className="w-5 h-5"/>} title={t.targetAudience.a1Title} desc={t.targetAudience.a1Desc} />
                                    <AudienceItem icon={<Briefcase className="w-5 h-5"/>} title={t.targetAudience.a2Title} desc={t.targetAudience.a2Desc} />
                                    <AudienceItem icon={<Users className="w-5 h-5"/>} title={t.targetAudience.a3Title} desc={t.targetAudience.a3Desc} />
                                </div>
                            </div>
                            <div className="relative">
                                {/* Enhanced Visual with Generated Asset */}
                                <div className="relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
                                     <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
                                     <img 
                                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
                                        alt="Kolink Partner Dashboard"
                                        className="rounded-2xl shadow-2xl border border-slate-200/50 w-full"
                                     />
                                </div>
                            </div>
                         </div>
                     </div>
                </Section>

                {/* Calculator */}
                <div id="calculator">
                    <CommissionCalculator />
                </div>

                 {/* Assets Section */}
                 <Section className="py-24 bg-indigo-900 text-white overflow-hidden">
                    <div className="container mx-auto px-4 max-w-6xl relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-display mb-4">{t.assets.title}</h2>
                            <p className="text-indigo-200 text-lg">{t.assets.subtitle}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <AssetCard label={t.assets.asset1} icon={<Layout className="w-6 h-6"/>} />
                            <AssetCard label={t.assets.asset2} icon={<Mail className="w-6 h-6"/>} />
                            <AssetCard label={t.assets.asset3} icon={<Download className="w-6 h-6"/>} />
                            <AssetCard label={t.assets.asset4} icon={<Video className="w-6 h-6"/>} />
                        </div>
                    </div>
                </Section>

                {/* How it Works */}
                <Section className="py-24 bg-white">
                    <div className="container mx-auto px-4 max-w-6xl">
                         <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-display text-slate-900 mb-4">{t.howItWorks.title}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <FeatureCard 
                                icon={<Users className="w-8 h-8 text-indigo-500" />}
                                title={t.howItWorks.step1Title}
                                desc={t.howItWorks.step1Desc}
                                step="01"
                            />
                            <FeatureCard 
                                icon={<Globe className="w-8 h-8 text-violet-500" />}
                                title={t.howItWorks.step2Title}
                                desc={t.howItWorks.step2Desc}
                                step="02"
                            />
                            <FeatureCard 
                                icon={<Wallet className="w-8 h-8 text-emerald-500" />}
                                title={t.howItWorks.step3Title}
                                desc={t.howItWorks.step3Desc}
                                step="03"
                            />
                        </div>
                    </div>
                </Section>
                
                 {/* Benefits Grid */}
                 <Section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-4 max-w-6xl">
                         <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-display text-slate-900 mb-4">{t.benefits.title}</h2>
                            <p className="text-slate-600">{t.benefits.subtitle}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                             <BenefitCard title={t.benefits.b1Title} desc={t.benefits.b1Desc} />
                             <BenefitCard title={t.benefits.b2Title} desc={t.benefits.b2Desc} />
                             <BenefitCard title={t.benefits.b3Title} desc={t.benefits.b3Desc} />
                             <BenefitCard title={t.benefits.b4Title} desc={t.benefits.b4Desc} />
                        </div>
                    </div>
                </Section>

                {/* FAQ */}
                <Section id="faq" className="py-24 bg-white">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-display text-slate-900 mb-4">{t.faq.title}</h2>
                        </div>
                        <div className="space-y-4">
                            <FAQItem q={t.faq.q1} a={t.faq.a1} />
                            <FAQItem q={t.faq.q2} a={t.faq.a2} />
                            <FAQItem q={t.faq.q3} a={t.faq.a3} />
                            {t.faq.q4 && <FAQItem q={t.faq.q4} a={t.faq.a4} />}
                        </div>
                    </div>
                </Section>
                
                {/* CTA */}
                <section className="py-24 px-4 bg-slate-900 text-center text-white">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <h2 className="text-4xl font-bold font-display">{t.cta.title}</h2>
                        <p className="text-xl text-indigo-200">{t.cta.subtitle}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a 
                                href="https://kolink.tolt.io" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-500 hover:shadow-xl transition-all text-lg transform hover:-translate-y-1"
                            >
                                {t.cta.button}
                                <ArrowRight className="w-5 h-5" />
                            </a>
                             <button 
                                onClick={() => setIsTermsOpen(true)}
                                className="text-sm text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-4 cursor-pointer"
                            >
                                {t.cta.secondary}
                            </button>
                        </div>
                    </div>
                </section>

                <Footer language={language} scrollToSection={scrollToSection} />

                {/* Terms Modal */}
                <AffiliateTermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
            </main>
        </div>
    );
};

// --- Sub-Components ---
// Keep generic components here to avoid cluttering main file if used only here.
// In a real refactor, move to separate files.

const OpportunityCard = ({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) => (
    <Card className="p-8 border-slate-200 bg-white shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
        <div className={"w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg " + color}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </Card>
);

const AudienceItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-slate-900 text-lg">{title}</h4>
            <p className="text-slate-600 text-sm">{desc}</p>
        </div>
    </div>
);

const AssetCard = ({ label, icon }: { label: string, icon: any }) => (
    <div className="p-6 bg-indigo-800/50 border border-indigo-700 rounded-2xl flex flex-col items-center text-center gap-4 hover:bg-indigo-700 transition-colors">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            {icon}
        </div>
        <span className="font-bold text-indigo-100 text-sm">{label}</span>
    </div>
);

const BenefitCard = ({ title, desc }: { title: string, desc: string }) => (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-200 transition-colors">
        <CheckCircle className="w-6 h-6 text-emerald-500 mb-4" />
        <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm">{desc}</p>
    </div>
);

const FeatureCard = ({ icon, title, desc, step }: { icon: React.ReactNode, title: string, desc: string, step: string }) => (
    <div className="relative p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 group">
        <div className="absolute top-8 right-8 text-6xl font-display font-bold text-slate-100 -z-0 group-hover:text-indigo-50 transition-colors">
            {step}
        </div>
        <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
                {desc}
            </p>
        </div>
    </div>
);

const FAQItem = ({ q, a }: { q: string, a: string }) => (
    <div className="border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 transition-colors bg-white">
        <h3 className="font-bold text-slate-900 mb-2">{q}</h3>
        <p className="text-slate-600">{a}</p>
    </div>
);

export default AffiliatePage;
