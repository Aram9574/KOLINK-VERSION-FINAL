import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, HelpCircle, ChevronDown, ChevronUp, 
    ShieldCheck, Zap, CreditCard, MessageCircle 
} from 'lucide-react';

import Navbar from '../Navbar';
import Footer from '../Footer';
import Section from '../../ui/Section';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';
import { Card } from '../../ui/card';

const FAQPage: React.FC = () => {
    const { language, setLanguage, user } = useUser();
    const t = translations[language].faqPage;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    // Filter logic
    const allQuestions = [
        ...t.questions.general.map((q: any) => ({ ...q, category: 'general', categoryLabel: t.categories.general, icon: <HelpCircle className="w-5 h-5"/> })),
        ...t.questions.features.map((q: any) => ({ ...q, category: 'features', categoryLabel: t.categories.features, icon: <Zap className="w-5 h-5"/> })),
        ...t.questions.pricing.map((q: any) => ({ ...q, category: 'pricing', categoryLabel: t.categories.pricing, icon: <CreditCard className="w-5 h-5"/> })),
        ...t.questions.safety.map((q: any) => ({ ...q, category: 'safety', categoryLabel: t.categories.safety, icon: <ShieldCheck className="w-5 h-5"/> }))
    ];

    const filteredQuestions = allQuestions.filter(item => {
        const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.a.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [
        { id: 'all', label: language === 'es' ? 'Todas' : 'All', icon: <HelpCircle className="w-4 h-4"/> },
        { id: 'general', label: t.categories.general, icon: <MessageCircle className="w-4 h-4"/> },
        { id: 'features', label: t.categories.features, icon: <Zap className="w-4 h-4"/> },
        { id: 'pricing', label: t.categories.pricing, icon: <CreditCard className="w-4 h-4"/> },
        { id: 'safety', label: t.categories.safety, icon: <ShieldCheck className="w-4 h-4"/> },
    ];

    const toggleAccordion = (index: string) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="font-sans selection:bg-indigo-100 selection:text-indigo-900 bg-slate-50 min-h-screen">
             <Helmet>
                <title>{language === 'es' ? 'Preguntas Frecuentes (FAQ) | Kolink' : 'Common FAQ | Kolink'}</title>
                 <meta name="description" content={language === 'es' ? "Resuelve tus dudas sobre Kolink. Precios, seguridad, funcionalidades y más." : "Get answers about Kolink. Pricing, security, features, and more."} />
                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [
                                ${filteredQuestions.map(q => `{
                                    "@type": "Question",
                                    "name": "${q.q}",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "${q.a}"
                                    }
                                }`).join(',')}
                            ]
                        }
                    `}
                </script>
            </Helmet>

            <Navbar 
                language={language} 
                setLanguage={setLanguage} 
                user={user} 
                activeSection="" 
                scrollToSection={() => {}} 
            />

            <main className="pt-24 pb-20">
                {/* Hero Search Area */}
                <Section className="bg-white border-b border-slate-200 py-16">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                         <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6"
                        >
                            {t.hero.badge}
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6"
                        >
                            {t.hero.title}
                        </motion.h1>
                        <motion.p 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.2 }}
                             className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto"
                        >
                            {t.hero.subtitle}
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="relative max-w-xl mx-auto"
                        >
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            <input 
                                type="text"
                                placeholder={t.hero.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-slate-50 focus:bg-white transition-all text-lg"
                            />
                        </motion.div>
                    </div>
                </Section>

                {/* Categories & List */}
                <div className="container mx-auto px-4 max-w-4xl mt-12">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 justify-center mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all
                                    ${activeCategory === cat.id 
                                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200 ring-offset-2' 
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'}
                                `}
                            >
                                {cat.icon}
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Accordion List */}
                    <div className="space-y-4">
                        {filteredQuestions.length > 0 ? (
                            filteredQuestions.map((item, idx) => {
                                const isOpen = openIndex === `item-${idx}`;
                                return (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Card 
                                            className={`
                                                overflow-hidden border transition-all duration-300
                                                ${isOpen ? 'border-indigo-200 ring-2 ring-indigo-50 shadow-md' : 'border-slate-200 hover:border-indigo-200'}
                                            `}
                                        >
                                            <button 
                                                onClick={() => toggleAccordion(`item-${idx}`)}
                                                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-slate-50/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-lg ${isOpen ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'} transition-colors`}>
                                                        {item.icon}
                                                    </div>
                                                    <span className={`font-bold text-lg ${isOpen ? 'text-indigo-900' : 'text-slate-900'}`}>
                                                        {item.q}
                                                    </span>
                                                </div>
                                                {isOpen 
                                                    ? <ChevronUp className="w-5 h-5 text-indigo-500" /> 
                                                    : <ChevronDown className="w-5 h-5 text-slate-400" />
                                                }
                                            </button>
                                            
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50">
                                                            <div className="mt-4 prose-sm max-w-none">
                                                                {item.a}
                                                            </div>
                                                            {/* Mini CTA inside answer if it's about pricing */}
                                                            {item.category === 'pricing' && (
                                                                <div className="mt-4 pt-4 border-t border-dashed border-indigo-100">
                                                                    <a href="/company/pricing" className="text-indigo-600 font-bold hover:underline text-sm flex items-center gap-1">
                                                                        Ver precios detallados 
                                                                        <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Card>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-500">No se encontraron resultados para "{searchQuery}"</p>
                                <button onClick={() => setSearchQuery('')} className="text-indigo-600 font-bold mt-2 hover:underline">
                                    Limpiar búsqueda
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Final Support CTA */}
                <Section className="mt-24 bg-white border-t border-slate-100 py-20">
                    <div className="container mx-auto px-4 text-center max-w-2xl">
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl mx-auto flex items-center justify-center mb-6 text-indigo-600">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold font-display text-slate-900 mb-4">{t.cta.title}</h2>
                        <p className="text-slate-600 mb-8">{t.cta.subtitle}</p>
                        <a 
                            href="mailto:support@kolink.com" // Or a contact page
                            className="inline-flex px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                        >
                            {t.cta.button}
                        </a>
                    </div>
                </Section>
                
                <Footer language={language} scrollToSection={() => {}} />
            </main>
        </div>
    );
};

export default FAQPage;
