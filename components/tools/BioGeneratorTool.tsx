import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Copy, RefreshCw, ChevronRight, UserCheck, Briefcase, Target, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';
import { Helmet } from 'react-helmet-async';

import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';

const BioGeneratorTool = () => {
    const { language } = useUser();
    const t = translations[language]?.toolsPage || translations['en'].toolsPage;

    const [role, setRole] = useState('');
    const [niche, setNiche] = useState('');
    const [keywords, setKeywords] = useState('');
    const [style, setStyle] = useState('Professional'); // Professional, Creative, Minimalist
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedBios, setGeneratedBios] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!role.trim()) {
            toast.error(language === 'es' ? "¡Ingresa un rol!" : "Please enter a Role!");
            return;
        }

        setIsGenerating(true);
        setGeneratedBios(null);

        try {
            const langInstruction = language === 'es' ? "OUTPUT LANGUAGE: SPANISH (Español). Translate keywords/role if needed." : "OUTPUT LANGUAGE: ENGLISH.";

            const prompt = `Act as a LinkedIn Profile Expert. Generate 5 high-converting LinkedIn Bios (Headlines) for a "${role}" targeting "${niche || 'General Audience'}".
            
            Keywords to Include: ${keywords || 'None'}
            Style: ${style}
            
            Rules:
            1. Use the provided keywords naturally for SEO.
            2. Follow the formula: [Role] | [Value Proposition] | [Social Proof/CTA].
            3. Keep under 220 characters.
            4. Return ONLY the list of 5 bios, numbered 1-5. No intro/outro text.
            5. ${langInstruction}`;

            const { data, error } = await supabase.functions.invoke('generate-viral-post', {
                body: {
                    params: {
                        topic: "LinkedIn Bio",
                        tone: style,
                        target_audience: "recruiters and leads",
                        instructions: prompt
                    }
                }
            });

            if (error) throw error;
            setGeneratedBios(data?.data?.postContent || "Error: Could not generate bios.");
            toast.success(language === 'es' ? "¡Bios generadas!" : "Bios generated!");
        } catch (err) {
            console.error(err);
            toast.error(language === 'es' ? "Error al generar" : "Generation failed.");
        } finally {
            setIsGenerating(false);
        }
    };

    // SEO Data
    const seoTitle = t.bioGenerator.seoTitle;
    const seoDesc = t.bioGenerator.seoDesc;

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Kolink LinkedIn Bio Generator",
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
                <span className="text-slate-600">{t.bioGenerator.title}</span>
            </div>

            {/* Hero */}
            <header className="relative pt-12 pb-24 overflow-hidden bg-slate-50">
                 <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />
                 <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                        <UserCheck size={12} />
                        {t.bioGenerator.label}
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-slate-900 mb-6 tracking-tight leading-[1.05]">
                        {t.bioGenerator.title} <span className="text-blue-600">{t.bioGenerator.titleHighlight || "Generator"}</span>
                    </h1>
                     <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                        {t.bioGenerator.subtitle}
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
                                    <Briefcase size={12} /> {t.bioGenerator.roleLabel}
                                </label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g. Marketing Manager"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                    <Target size={12} /> {t.bioGenerator.nicheLabel}
                                </label>
                                <input
                                    type="text"
                                    value={niche}
                                    onChange={(e) => setNiche(e.target.value)}
                                    placeholder="e.g. SaaS Companies, Busy Moms"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                                />
                            </div>
                         </div>

                         <div className="mb-8">
                             <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                <Sparkles size={12} /> {t.bioGenerator.keywordsLabel}
                             </label>
                             <input
                                 type="text"
                                 value={keywords}
                                 onChange={(e) => setKeywords(e.target.value)}
                                 placeholder="e.g. Automation, AI, Growth"
                                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                             />
                         </div>

                         <div className="mb-8">
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                                {t.bioGenerator.styleLabel}
                            </label>
                            <div className="flex gap-4">
                                {['Professional', 'Creative', 'Minimalist'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStyle(s)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${style === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                                    >
                                        {t?.bioGenerator?.styles?.[s.toLowerCase()] || s}
                                    </button>
                                ))}
                            </div>
                         </div>
                        
                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-3 shadow-xl shadow-brand-500/20 active:scale-95"
                        >
                            {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />}
                            {isGenerating ? t.bioGenerator.generating : t.bioGenerator.button}
                        </button>

                        {generatedBios && (
                             <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6 mt-10"
                            >
                                <div className="border-t border-slate-100 pt-6">
                                     <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        {t.bioGenerator.resultTitle}
                                    </h3>
                                    <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 text-slate-800 whitespace-pre-wrap leading-relaxed font-medium relative group">
                                         {generatedBios}
                                            <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(generatedBios);
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
                                        <div className="font-semibold">{t.bioGenerator.ctaBox?.title}</div>
                                        <div className="text-xs text-brand-700/80">{t.bioGenerator.ctaBox?.subtitle}</div>
                                    </div>
                                    <Link to="/login" className="text-xs font-bold bg-white text-brand-600 px-4 py-2 rounded-lg shadow-sm hover:shadow border border-brand-100">
                                        {t.bioGenerator.ctaBtn} →
                                    </Link>
                                 </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

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

export default BioGeneratorTool;
