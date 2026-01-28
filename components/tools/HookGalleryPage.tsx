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
    BookOpen,
    ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { HOOK_LIBRARY, HookTemplate } from '../../data/hooks';

import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';

const HookGalleryPage = () => {
    const { language } = useUser();
    const t = translations[language]?.toolsPage?.hookGallery || translations['en'].toolsPage.hookGallery;
    const tCommon = translations[language]?.common || translations['en'].common;
    const tTools = translations[language]?.toolsPage?.common || translations['en'].toolsPage.common;

    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Dynamically get categories from translation map or raw data
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

    const seoTitle = t.seoTitle;
    const seoDesc = t.seoDesc;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDesc} />
            </Helmet>

            {/* Nav */}
            <nav className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tighter">
                    Kolink<span className="text-brand-600">.</span>
                </Link>
                <div className="flex items-center gap-4">
                     <Link to="/login" className="px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-all">
                        {tTools.tryPro}
                    </Link>
                </div>
            </nav>

            {/* Breadcrumbs */}
             <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Link to="/" className="hover:text-brand-600">{tTools.home}</Link>
                <ChevronRight size={12} />
                <Link to="/tools" className="hover:text-brand-600">{tTools.tools}</Link>
                <ChevronRight size={12} />
                <span className="text-slate-600">{t.title} {t.titleHighlight}</span>
            </div>

            {/* Hero */}
            <header className="pt-12 pb-16 text-center px-6 bg-white border-b border-slate-100">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 border border-pink-100 text-pink-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                    <Anchor size={12} />
                    {t.label}
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-6 tracking-tight">
                    {t.title} <span className="text-pink-600">{t.titleHighlight}</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                    {t.subtitle}
                </p>

                {/* Filters */}
                <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                selectedCategory === cat
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {cat === 'All' ? (language === 'es' ? 'Todos' : 'All') : (t.categories?.[cat] || cat)}
                        </button>
                    ))}
                </div>
            </header>

            {/* Gallery Grid */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredHooks.map((hook, i) => {
                             const templateText = (language === 'es' && hook.templateEs) ? hook.templateEs : hook.template;
                             const exampleText = (language === 'es' && hook.exampleEs) ? hook.exampleEs : hook.example;
                             const whyText = (language === 'es' && hook.whyItWorksEs) ? hook.whyItWorksEs : hook.whyItWorks;

                             return (
                            <motion.div
                                key={hook.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all group flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                        hook.category === 'Contrarian' ? 'bg-red-50 text-red-600' :
                                        hook.category === 'Data' ? 'bg-blue-50 text-blue-600' :
                                        hook.category === 'Story' ? 'bg-amber-50 text-amber-600' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {t.categories?.[hook.category] || hook.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                        <Zap size={12} fill="currentColor" />
                                        {hook.viralScore}/100
                                    </div>
                                </div>

                                <div className="mb-6 flex-grow">
                                    <h3 className="font-bold text-lg text-slate-800 mb-2 leading-relaxed">
                                        "{templateText}"
                                    </h3>
                                    <p className="text-sm text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        {t.card.example} "{exampleText}"
                                    </p>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex items-start gap-2 text-xs text-slate-500">
                                        <Sparkles size={14} className="text-purple-500 mt-0.5 shrink-0" />
                                        {whyText}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(templateText);
                                                toast.success(t.card.copied);
                                            }}
                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Copy size={14} />
                                            {t.card.copy}
                                        </button>
                                        <button 
                                            onClick={() => handleUseHook(hook)}
                                            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-pink-500/20"
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
                        <Filter className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>{t.empty.title}</p>
                    </div>
                )}
            </main>

            {/* CTA */}
            <section className="bg-slate-900 py-20 px-6 text-center text-white">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">{t.cta.title}</h2>
                    <p className="text-slate-400 mb-8">
                        {t.cta.desc}
                    </p>
                    <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-colors">
                        {t.cta.button} <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HookGalleryPage;
