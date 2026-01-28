import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Copy, RefreshCw, ChevronRight, CheckCircle, Type, Briefcase, Zap, Rocket, Star, Quote } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';
import { Helmet } from 'react-helmet-async';

import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';

const HeadlineGeneratorTool = () => {
    const { language } = useUser();
    const t = translations[language]?.toolsPage || translations['en'].toolsPage; 
    
    const [topic, setTopic] = useState('');
    const [role, setRole] = useState('');
    const [industry, setIndustry] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedHeadlines, setGeneratedHeadlines] = useState<string[]>([]); // Changed to array

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.error(language === 'es' ? "¡Ingresa un tema!" : "Please enter a topic!");
            return;
        }

        setIsGenerating(true);
        setGeneratedHeadlines([]);

        try {
            const langInstruction = language === 'es' ? "OUTPUT LANGUAGE: SPANISH (Español). Translate role/industry if needed." : "OUTPUT LANGUAGE: ENGLISH.";
            
            const prompt = `Act as a Viral LinkedIn Ghostwriter. Generate 10 high-converting LinkedIn Headlines (Hooks) for a "${role || 'Professional'}" in the "${industry || 'General'}" industry writing about "${topic}".
            
            Rules:
            1. Use viral frameworks (Contrarian, Listicle, Story).
            2. Keep them under 2 lines.
            3. Use specific numbers where applicable.
            4. Return strictly a JSON array of strings. Example: ["Headline 1", "Headline 2"].
            5. ${langInstruction}`;

            const { data, error } = await supabase.functions.invoke('generate-viral-post', {
                body: {
                    params: {
                        instructions: prompt,
                        response_format: 'json_object' 
                    }
                }
            });

            if (error) throw error;

            console.log("Raw Response:", data?.data?.postContent);

            // Parsing Logic (Simulated for safety if API returns unstructured text, but aim for JSON)
            let headlines = [];
            try {
                const parsed = JSON.parse(data?.data?.postContent);
                if (Array.isArray(parsed)) headlines = parsed;
                else if (parsed.headlines) headlines = parsed.headlines;
                else headlines = data?.data?.postContent.split('\n').filter(l => l.length > 10).map(l => l.replace(/^\d+\.\s*/, ''));
            } catch (e) {
                // Fallback split
                headlines = data?.data?.postContent.split('\n').filter(l => l.length > 10).map(l => l.replace(/^\d+\.\s*/, ''));
            }

            setGeneratedHeadlines(headlines.slice(0, 10)); // Take top 10
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
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Kolink LinkedIn Headline Generator",
        "applicationCategory": "BusinessApplication",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": seoDesc
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
             <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDesc} />
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Helmet>

             {/* Header */}
            <nav className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-white/50 bg-white/50 backdrop-blur-xl sticky top-0 z-50 rounded-b-2xl shadow-sm">
                <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tighter flex items-center gap-2">
                    Kolink<span className="text-brand-600">.</span>
                </Link>
                <div className="flex items-center gap-4 md:gap-6">
                    <Link to="/tools" className="hidden md:block text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-brand-600 transition-colors">
                        {t.common.moreTools}
                    </Link>
                    <Link to="/login" className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20">
                        {t.common.tryPro}
                    </Link>
                </div>
            </nav>

             {/* Breadcrumbs */}
             <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <Link to="/" className="hover:text-brand-600 transition-colors">{t.common.home}</Link>
                <ChevronRight size={10} strokeWidth={3} />
                <Link to="/tools" className="hover:text-brand-600 transition-colors">{t.common.tools}</Link>
                <ChevronRight size={10} strokeWidth={3} />
                <span className="text-slate-900">{t.headlineGenerator.title}</span>
            </div>

            {/* Hero */}
            <header className="relative pt-8 pb-24 overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/50 via-transparent to-transparent opacity-60" />
                 <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-brand-100 text-brand-700 rounded-full text-[11px] font-black uppercase tracking-widest mb-8 shadow-sm">
                            <Zap size={12} fill="currentColor" />
                            {t.headlineGenerator.label}
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-slate-900 mb-6 tracking-tight leading-[0.95]">
                            Headline <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">{t.headlineGenerator.titleHighlight}</span>
                        </h1>
                         <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                            {t.headlineGenerator.subtitle}
                        </p>
                    </motion.div>
                 </div>
            </header>

            {/* Tool Input Section */}
            <section className="max-w-5xl mx-auto px-6 -mt-16 relative z-20 pb-20">
                <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white p-2 md:p-3">
                    <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-8 md:p-12 overflow-hidden relative">
                        
                         {/* Form */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                    <Briefcase size={12} /> {t.headlineGenerator.roleLabel}
                                </label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder={t.headlineGenerator.rolePlaceholder}
                                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none font-bold text-lg transition-all placeholder:text-slate-300"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                    <Type size={12} /> {t.headlineGenerator.industryLabel}
                                </label>
                                <input
                                    type="text"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    placeholder={t.headlineGenerator.industryPlaceholder}
                                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none font-bold text-lg transition-all placeholder:text-slate-300"
                                />
                            </div>
                         </div>
                        
                         <div className="relative z-10">
                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                <Rocket size={12} />
                                {t.headlineGenerator.topicLabel}
                            </label>
                            <div className="flex flex-col md:flex-row gap-4 mb-12">
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder={t.headlineGenerator.topicPlaceholder}
                                    className="flex-1 px-6 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none text-xl font-bold shadow-sm placeholder:text-slate-300 transition-all"
                                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                />
                                <button 
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="px-10 py-5 bg-slate-900 hover:bg-brand-600 text-white rounded-2xl font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-95 whitespace-nowrap group relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2 text-lg">
                                        {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} className="group-hover:text-yellow-300 transition-colors" />}
                                        {isGenerating ? t.headlineGenerator.generating : t.headlineGenerator.button}
                                    </span>
                                     {isGenerating && (
                                        <motion.div 
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                         {/* Results Area */}
                         <AnimatePresence mode='wait'>
                            {generatedHeadlines.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative z-10"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-3 text-lg">
                                            <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center">
                                                <Star fill="currentColor" size={16} />
                                            </div>
                                            {t.headlineGenerator.resultTitle}
                                        </h3>
                                        <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                                            {generatedHeadlines.length} Options
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-4">
                                        {generatedHeadlines.map((headline, index) => (
                                            <motion.div 
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group bg-white hover:bg-brand-50/50 p-6 rounded-2xl border border-slate-200 hover:border-brand-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(headline);
                                                    toast.success(t.common.copyToast);
                                                }}
                                            >
                                                <div className="flex gap-4">
                                                    <span className="text-xs font-bold text-slate-300 mt-1">#{index + 1}</span>
                                                    <p className="text-lg text-slate-700 font-medium leading-relaxed pr-8">
                                                        {headline}
                                                    </p>
                                                </div>
                                                <div className="absolute top-1/2 -translate-y-1/2 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded-lg border border-slate-100 shadow-sm text-slate-400 group-hover:text-brand-600">
                                                    <Copy size={18} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex -space-x-2">
                                            {[1,2,3,4].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-slate-50 relative overflow-hidden" >
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+topic}`} alt="User" />
                                                </div>
                                            ))}
                                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-50">
                                                +2k
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium">
                                            Join 2,000+ creators using Kolink daily
                                        </p>
                                        <Link to="/login" className="text-sm font-bold bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                                            {t.common.tryPro} →
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                         </AnimatePresence>

                         {/* Background Decor */}
                         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                    </div>
                </div>
            </section>

             {/* SEO Content (Bottom) */}
             <article className="max-w-3xl mx-auto px-6 pb-24 space-y-16">
                 {/* ... (Existing SEO content structure, kept minimal for this edit as requested focus is UI) ... */}
                 <section className="text-center">
                    <Quote className="w-12 h-12 text-brand-200 mx-auto mb-6" />
                     <h2 className="text-3xl font-bold text-slate-900 mb-6">{t.headlineGenerator.whyTitle}</h2>
                     <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                         {t.headlineGenerator.whyDesc}
                     </p>
                 </section>
                
                  <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {t.headlineGenerator.frameworks?.map((item: any, i: number) => (
                         <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 font-bold mb-4">
                                {i + 1}
                             </div>
                             <h3 className="font-bold text-slate-900 mb-3 text-lg">{item.title}</h3>
                             <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                         </div>
                     ))}
                 </section>
             </article>

              {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-12 text-center">
                <div className="max-w-7xl mx-auto px-6">
                     <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-brand-600 transition-colors cursor-pointer">
                        {t.common.footer}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HeadlineGeneratorTool;
