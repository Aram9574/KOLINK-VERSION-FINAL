import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Anchor, 
    ChevronRight, 
    Copy, 
    Wand2, 
    Filter, 
    Sparkles, 
    Zap,
    ArrowRight,
    Search
} from 'lucide-react';
import { toast } from 'sonner';
import { HOOK_LIBRARY, HookTemplate } from '../../data/hooks';

import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';
import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';

const HookGalleryPage = () => {
    const { language, setLanguage, user } = useUser();
    const t = translations[language]?.toolsPage?.hookGallery || translations['en'].toolsPage.hookGallery;
    const tTools = translations[language]?.toolsPage?.common || translations['en'].toolsPage.common;

    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const CATEGORIES = ['All', ...Array.from(new Set(HOOK_LIBRARY.map(h => h.category)))];

    const filteredHooks = HOOK_LIBRARY.filter(hook => {
        const matchesCategory = selectedCategory === 'All' || hook.category === selectedCategory;
        const templateText = (language === 'es' && hook.templateEs) ? hook.templateEs : hook.template;
        const exampleText = (language === 'es' && hook.exampleEs) ? hook.exampleEs : hook.example;

        const matchesSearch = templateText.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              exampleText.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleUseHook = (hook: HookTemplate) => {
        const templateToUse = (language === 'es' && hook.templateEs) ? hook.templateEs : hook.template;
        navigate(`/carousel-studio?hook=${encodeURIComponent(templateToUse)}`);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-brand-100 selection:text-brand-900">
            <Helmet>
                <title>{t.seoTitle}</title>
                <meta name="description" content={t.seoDesc} />
            </Helmet>

            <Navbar 
                language={language} 
                setLanguage={setLanguage} 
                user={user} 
                activeSection="" 
                scrollToSection={() => {}} 
            />

            <main className="pt-24">
                {/* Hero Section with Mesh Gradient */}
                <header className="relative pt-20 pb-24 text-center px-6 overflow-hidden">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/20 blur-[120px] rounded-full" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-200/20 blur-[120px] rounded-full" />
                    </div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-md border border-brand-100 text-brand-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 shadow-sm"
                        >
                            <Sparkles size={12} className="text-brand-500" />
                            {t.label}
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-display font-black text-slate-900 mb-8 tracking-tight leading-[1.1]"
                        >
                            {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-pink-600">{t.titleHighlight}</span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed"
                        >
                            {t.subtitle}
                        </motion.p>

                        {/* Search & Categories */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-8"
                        >
                             <div className="max-w-xl mx-auto relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                                <input 
                                    type="text"
                                    placeholder={language === 'es' ? "Busca por palabra clave..." : "Search by keyword..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-lg font-medium"
                                />
                            </div>

                            <div className="flex flex-wrap justify-center gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                            selectedCategory === cat
                                            ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                        }`}
                                    >
                                        {cat === 'All' ? (language === 'es' ? 'Todos' : 'All') : (t.categories?.[cat] || cat)}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* Gallery Grid */}
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredHooks.map((hook) => {
                                 const templateText = (language === 'es' && hook.templateEs) ? hook.templateEs : hook.template;
                                 const exampleText = (language === 'es' && hook.exampleEs) ? hook.exampleEs : hook.example;
                                 const whyText = (language === 'es' && hook.whyItWorksEs) ? hook.whyItWorksEs : hook.whyItWorks;

                                 return (
                                <motion.div
                                    key={hook.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-sm hover:shadow-soft-glow transition-all group flex flex-col h-full relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            hook.category === 'Contrarian' ? 'bg-red-50 text-red-600' :
                                            hook.category === 'Data' ? 'bg-blue-50 text-blue-600' :
                                            hook.category === 'Story' ? 'bg-amber-50 text-amber-600' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {t.categories?.[hook.category] || hook.category}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-brand-600 text-sm font-black">
                                            <Zap size={14} className="fill-brand-600" />
                                            {hook.viralScore}%
                                        </div>
                                    </div>

                                    <div className="flex-grow mb-8">
                                        <h3 className="font-display font-bold text-xl text-slate-900 mb-4 leading-snug">
                                            "{templateText}"
                                        </h3>
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-brand-50/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <p className="relative text-sm text-slate-500 italic bg-slate-50/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 leading-relaxed">
                                                <span className="font-bold text-slate-400 not-italic mr-1">{t.card.example}</span> "{exampleText}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-6 border-t border-slate-100">
                                        <p className="flex items-start gap-2.5 text-xs font-medium text-slate-500 leading-relaxed">
                                            <Sparkles size={16} className="text-brand-500 shrink-0" />
                                            {whyText}
                                        </p>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(templateText);
                                                    toast.success(t.card.copied);
                                                }}
                                                className="px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
                                            >
                                                <Copy size={14} />
                                                {t.card.copy}
                                            </button>
                                            <button 
                                                onClick={() => handleUseHook(hook)}
                                                className="px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-600/20 active:scale-95 hover:-translate-y-0.5"
                                            >
                                                <Wand2 size={14} />
                                                {t.card.useInStudio}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                             )})}
                        </AnimatePresence>
                    </div>

                    {filteredHooks.length === 0 && (
                        <div className="text-center py-20 text-slate-400">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Filter className="w-16 h-16 mx-auto mb-6 opacity-10" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{t.empty.title}</h3>
                                <p className="text-slate-500 font-medium">{t.empty.desc}</p>
                            </motion.div>
                        </div>
                    )}
                </section>

                {/* CTA Section */}
                <section className="px-6 py-32 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl"
                    >
                         {/* Abstract background for CTA */}
                         <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-600/20 rounded-full blur-[100px]" />
                         <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-pink-600/20 rounded-full blur-[100px]" />
                         
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-display font-black mb-8 leading-tight">
                                {t.cta.title}
                            </h2>
                            <p className="text-lg text-slate-400 mb-12 font-medium leading-relaxed">
                                {t.cta.desc}
                            </p>
                            <Link 
                                to="/login" 
                                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-100 hover:-translate-y-1 transition-all shadow-xl shadow-white/5 active:scale-95"
                            >
                                {t.cta.button} 
                                <ArrowRight size={22} className="text-brand-600" />
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer language={language} scrollToSection={() => {}} />
        </div>
    );
};

export default HookGalleryPage;
