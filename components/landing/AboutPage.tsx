
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Heart, ShieldCheck, Zap, TrendingUp, Users, Globe, check } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TestimonialsSection from "../ui/testimonial-v2";
import LogoTicker from "../ui/LogoTicker";
import GlobalImpactSection from "./GlobalImpactSection";
import PressSection from "./PressSection";
import { useUser } from "../../context/UserContext";
import { translations } from "../../translations";
import SmartCursor from "../ui/SmartCursor";

const AboutPage: React.FC = () => {
    const { user, language, setLanguage } = useUser();
    const t = translations[language];
    const about = t.about;

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const stagger = {
        visible: { transition: { staggerChildren: 0.2 } }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-brand-200 selection:text-brand-900 overflow-x-hidden">
            <Helmet>
                <title>{language === 'es' ? 'Sobre Nosotros | Kolink' : 'About Us | Kolink'}</title>
                <meta name="description" content={about.hero.description} />
            </Helmet>

            <SmartCursor />
            <Navbar language={language} setLanguage={setLanguage} user={user} activeSection="about" scrollToSection={() => {}} />

            <main className="pt-32">
                {/* Hero / Manifesto - Editorial Style */}
                <section className="relative px-6 mb-20 md:mb-32">
                     <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-brand-200/20 rounded-full blur-[100px]" />
                        <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-[80px]" />
                    </div>

                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={stagger}
                        >
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm text-xs font-bold tracking-widest text-slate-600 uppercase">
                                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                                {about.hero.badge}
                            </motion.div>
                            
                            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-display font-medium tracking-tight text-slate-900 mb-8 leading-[0.95]">
                                {about.hero.title.replace('.', '')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 italic font-serif pr-2">{about.hero.subtitle}</span>
                            </motion.h1>

                            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                                {about.hero.description}
                            </motion.p>
                        </motion.div>
                    </div>
                </section>

                {/* Social Proof Ticker */}
                <LogoTicker label={about.ticker} />

                {/* Press Section */}
                <PressSection />

                {/* Stats Section */}
                <section className="bg-white py-20 border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                            {[
                                { ...about.stats.s1, icon: <Zap className="w-6 h-6" /> },
                                { ...about.stats.s2, icon: <Users className="w-6 h-6" /> },
                                { ...about.stats.s3, icon: <Heart className="w-6 h-6" /> },
                                { ...about.stats.s4, icon: <Globe className="w-6 h-6" /> },
                            ].map((stat: any, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative group"
                                >
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-brand-50/50 rounded-full blur-xl group-hover:bg-brand-100/50 transition-colors" />
                                    <div className="relative text-5xl md:text-6xl font-display font-bold text-slate-900 mb-2">{stat.value}</div>
                                    <div className="relative flex items-center justify-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                        {stat.icon && React.cloneElement(stat.icon, { className: "w-4 h-4 text-brand-500" })}
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission & Story (Timeline) */}
                <section className="py-32 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl font-display font-bold mb-6">{about.history?.title || "Our Journey"}</h2>
                            <p className="text-xl text-slate-500 max-w-2xl mx-auto">{about.mission.text}</p>
                        </div>

                        <div className="relative border-l-2 border-slate-200 ml-4 md:ml-0 md:pl-0 space-y-16">
                            {about.history?.steps?.map((step: any, idx: number) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: idx * 0.2 }}
                                    className="relative pl-12 md:pl-0 md:grid md:grid-cols-5 md:gap-12 items-center group"
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[9px] top-1 md:left-auto md:right-0 md:col-start-2 md:col-span-1 md:relative h-4 w-4 rounded-full bg-white border-4 border-slate-300 group-hover:border-brand-500 transition-colors z-10" />
                                    
                                    <div className="md:col-span-2 md:text-right md:pr-12">
                                        <span className="text-6xl font-display font-bold text-slate-200 group-hover:text-brand-100 transition-colors pointer-events-none select-none">
                                            {step.year}
                                        </span>
                                    </div>
                                    <div className="md:col-start-3 md:col-span-3">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                        <p className="text-slate-500 leading-relaxed text-lg">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Technology Section (Interactive Cards) */}
                <section className="px-6 py-20 bg-slate-900 text-white relative overflow-hidden">
                     {/* Background Grid */}
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest mb-8">
                                    <Zap className="w-3 h-3" />
                                    <span>{about.tech.subtitle}</span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-display font-bold mb-8 leading-tight">
                                    {about.tech.title}
                                </h2>
                                <p className="text-slate-300 text-xl leading-relaxed mb-12 max-w-xl">
                                    {about.tech.description}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4">
                                     {about.values && [
                                        { l: "99.9%", t: "Uptime" },
                                        { l: "<2s", t: "Generation" },
                                        { l: "100%", t: "Secure" },
                                        { l: "24/7", t: "Support" }
                                     ].map((m, i) => (
                                         <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                                             <div className="text-2xl font-bold text-white">{m.l}</div>
                                             <div className="text-xs text-slate-400 uppercase tracking-widest">{m.t}</div>
                                         </div>
                                     ))}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                                {about.tech.cards.map((card: any, idx: number) => (
                                    <motion.div 
                                        key={idx} 
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        className="bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 p-8 rounded-2xl hover:border-brand-500/30 transition-all shadow-xl"
                                    >
                                        <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 text-sm font-bold">{idx + 1}</span>
                                            {card.title}
                                        </h4>
                                        <p className="text-slate-400 pl-11">{card.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Global Impact Section */}
                <GlobalImpactSection />

                {/* Team Section */}
                <section className="px-6 py-32 bg-slate-50">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">{about.teamSection.title}</h2>
                            <p className="text-slate-500 text-xl max-w-2xl mx-auto">{about.teamSection.subtitle}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {about.teamSection.members.map((member: any, idx: number) => (
                                <motion.div 
                                    key={idx} 
                                    whileHover={{ y: -10 }}
                                    className="group bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                    
                                    <div className="relative w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                        <img 
                                            src={`https://images.unsplash.com/photo-${[
                                                '1560250097-9b93dbd96cd0',
                                                '1573496359142-b8d87734a5a2',
                                                '1472099645785-5658abf4ff4e'
                                            ][idx]}?auto=format&fit=crop&q=80&w=400&h=400`} 
                                            alt={member.name} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{member.name}</h3>
                                    <p className="text-brand-600 font-medium text-sm mb-4 uppercase tracking-wider">{member.role}</p>
                                    <p className="text-slate-500 font-light italic">"{member.bio}"</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Social Proof Embeds */}
                <section className="pb-20">
                    <TestimonialsSection />
                </section>

                {/* Values Grid (Re-styled) */}
                <section className="px-6 mb-32">
                    <div className="max-w-7xl mx-auto bg-brand-900 rounded-[3rem] p-12 md:p-24 text-center relatives overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-brand-100 mb-16 uppercase tracking-widest opacity-70">{about.values.title}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {[
                                    { title: about.values.v1Title, desc: about.values.v1Desc },
                                    { title: about.values.v2Title, desc: about.values.v2Desc },
                                    { title: about.values.v3Title, desc: about.values.v3Desc }
                                ].map((item, idx) => (
                                    <div key={idx} className="text-white">
                                        <div className="text-lg font-bold mb-4 flex items-center justify-center gap-3">
                                            <span className="w-2 h-2 rounded-full bg-brand-400" />
                                            {item.title}
                                        </div>
                                        <p className="text-brand-200 leading-relaxed font-light">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>


                {/* Founder's Letter */}
                <section className="px-6 py-32 bg-slate-900 text-white relative isolate overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
                    <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-slate-900 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
                    
                    <div className="mx-auto max-w-7xl lg:max-w-none grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative h-full min-h-[400px] lg:min-h-full rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                             <img 
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop" 
                                alt="Founder" 
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-8 left-8">
                                <p className="text-white font-serif italic text-2xl">"{about.founderLetter.p4}"</p>
                            </div>
                        </div>

                        <div className="lg:pr-12">
                            <div className="inline-flex items-center space-x-2 text-brand-400 font-bold tracking-widest uppercase text-xs mb-8">
                                <span className="w-8 h-[1px] bg-brand-400"></span>
                                <span>{about.founderLetter.salutation}</span>
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-10 leading-tight">
                                {about.founderLetter.title}
                            </h2>

                            <div className="space-y-6 text-lg text-slate-300 font-serif leading-relaxed">
                                <p>{about.founderLetter.p1}</p>
                                <p>{about.founderLetter.p2}</p>
                                <p className="text-white font-medium">{about.founderLetter.p3}</p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-4">
                                <div>
                                    <div className="font-display font-bold text-white text-xl">{about.founderLetter.signature}</div>
                                    <div className="text-brand-400 text-sm">{about.founderLetter.role}</div>
                                </div>
                                <div className="ml-auto">
                                   {/* Signature graphic placeholder */}
                                   <div className="font-serif italic text-4xl text-white/50 opacity-50 rotate-[-5deg] pr-8">Alex R.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="px-6 py-32 bg-white">
                     <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-900 mb-8 tracking-tighter">
                            Ready to make your mark?
                        </h2>
                        <Link to="/" className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-slate-800 transition-all hover:scale-105 shadow-xl hover:shadow-2xl">
                            {about.cta} <ArrowRight className="w-6 h-6" />
                        </Link>
                     </div>
                </section>
            </main>

            <Footer language={language} scrollToSection={() => {}} />
        </div>
    );
};

export default AboutPage;
