import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Copy, RefreshCw, ChevronRight, CheckCircle, Type, Briefcase, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';
import { Helmet } from 'react-helmet-async';

import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';

const HeadlineGeneratorTool = () => {
    const { language } = useUser();
    const t = translations[language]?.toolsPage || translations['en'].toolsPage; // Fallback
    
    const [topic, setTopic] = useState('');
    const [role, setRole] = useState('');
    const [industry, setIndustry] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedHeadlines, setGeneratedHeadlines] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.error(language === 'es' ? "¡Ingresa un tema!" : "Please enter a topic!");
            return;
        }

        setIsGenerating(true);
        setGeneratedHeadlines(null);

        try {
            const langInstruction = language === 'es' ? "OUTPUT LANGUAGE: SPANISH (Español). Translate role/industry if needed." : "OUTPUT LANGUAGE: ENGLISH.";
            
            const prompt = `Act as a Viral LinkedIn Ghostwriter. Generate 10 high-converting LinkedIn Headlines (Hooks) for a "${role || 'Professional'}" in the "${industry || 'General'}" industry writing about "${topic}".
            
            Rules:
            1. Use viral frameworks (Contrarian, Listicle, Story).
            2. Keep them under 2 lines.
            3. Use specific numbers where applicable.
            4. Return ONLY the list of 10 headlines, numbered 1-10. No intro/outro text.
            5. ${langInstruction}`;

            const { data, error } = await supabase.functions.invoke('generate-viral-post', {
                body: {
                    params: {
                        topic: topic,
                        tone: "Viral & Punchy",
                        target_audience: "LinkedIn Users",
                        instructions: prompt
                    }
                }
            });

            if (error) throw error;
            setGeneratedHeadlines(data?.data?.postContent || "Error: Could not generate headlines.");
            toast.success(language === 'es' ? "¡Headlines generados!" : "Headlines generated!");
        } catch (err) {
            console.error(err);
            toast.error(language === 'es' ? "Error al generar" : "Generation failed.");
        } finally {
            setIsGenerating(false);
        }
    };

    // SEO Data
    const seoTitle = t.headlineGenerator.seoTitle;
    const seoDesc = t.headlineGenerator.seoDesc;

    // Schema
     const schemaData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Kolink LinkedIn Headline Generator",
        "applicationCategory": "BusinessApplication",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": seoDesc
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
             <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDesc} />
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Helmet>

             {/* Header / Nav */}
            <nav className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tighter">
                    Kolink<span className="text-brand-600">.</span>
                </Link>
                <div className="flex items-center gap-4 md:gap-6">
                    <Link to="/tools" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">
                        {t.common.moreTools}
                    </Link>
                    <Link to="/login" className="px-5 py-2 bg-brand-600 text-white rounded-full text-sm font-semibold hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20">
                        {t.common.tryPro}
                    </Link>
                </div>
            </nav>

             {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Link to="/" className="hover:text-brand-600">{t.common.home}</Link>
                <ChevronRight size={12} />
                <Link to="/tools" className="hover:text-brand-600">{t.common.tools}</Link>
                <ChevronRight size={12} />
                <span className="text-slate-600">{t.headlineGenerator.title}</span>
            </div>

            {/* Hero */}
            <header className="relative pt-12 pb-24 overflow-hidden bg-slate-50">
                 <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />
                 <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-100 text-brand-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Zap size={12} />
                        {t.headlineGenerator.label}
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-slate-900 mb-6 tracking-tight leading-[1.05]">
                        {t.headlineGenerator.title} <span className="text-brand-600">{t.headlineGenerator.titleHighlight}</span>
                    </h1>
                     <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                        {t.headlineGenerator.subtitle}
                    </p>
                 </div>
            </header>

            {/* Tool Input Section */}
            <section className="max-w-4xl mx-auto px-6 -mt-16 relative z-20 pb-20">
                <div className="bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                    <Briefcase size={12} /> {t.headlineGenerator.roleLabel}
                                </label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder={t.headlineGenerator.rolePlaceholder}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                    <Type size={12} /> {t.headlineGenerator.industryLabel}
                                </label>
                                <input
                                    type="text"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    placeholder={t.headlineGenerator.industryPlaceholder}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                                />
                            </div>
                         </div>
                        
                         <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                            {t.headlineGenerator.topicLabel}
                        </label>
                        <div className="flex flex-col md:flex-row gap-3 mb-8">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder={t.headlineGenerator.topicPlaceholder}
                                className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none text-lg font-medium shadow-inner"
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-3 shadow-xl shadow-brand-500/20 active:scale-95 whitespace-nowrap"
                            >
                                {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />}
                                {isGenerating ? t.headlineGenerator.generating : t.headlineGenerator.button}
                            </button>
                        </div>

                        {generatedHeadlines && (
                             <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="border-t border-slate-100 pt-6">
                                     <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-brand-500 rounded-full" />
                                        {t.headlineGenerator.resultTitle}
                                    </h3>
                                    <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 text-slate-800 whitespace-pre-wrap leading-relaxed font-medium relative group">
                                         {generatedHeadlines}
                                            <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(generatedHeadlines);
                                                toast.success(t.common.copyToast);
                                            }}
                                            className="absolute top-4 right-4 p-2 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-100 border border-slate-200"
                                            title="Copy All"
                                        >
                                            <Copy size={16} className="text-slate-500" />
                                        </button>
                                    </div>
                                </div>
                                 <div className="p-4 bg-brand-50/50 border border-brand-100 rounded-xl flex items-center justify-between">
                                    <div className="text-sm font-medium text-brand-900">
                                        {t.common.conversion}
                                    </div>
                                    <Link to="/login" className="text-xs font-bold bg-white text-brand-600 px-4 py-2 rounded-lg shadow-sm hover:shadow border border-brand-100">
                                        {t.common.tryPro} →
                                    </Link>
                                 </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

             {/* SEO Content */}
             <article className="max-w-3xl mx-auto px-6 pb-24 space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{t.headlineGenerator.whyTitle}</h2>
                    <p className="text-slate-600 leading-relaxed">
                        {t.headlineGenerator.whyDesc}
                    </p>
                </section>
                
                 <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {t.headlineGenerator.frameworks?.map((item: any, i: number) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                    ))}
                </section>
             </article>

              {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-12 text-center">
                <div className="max-w-7xl mx-auto px-6">
                     <p className="text-slate-400 text-xs uppercase tracking-widest">
                        {t.common.footer}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HeadlineGeneratorTool;
