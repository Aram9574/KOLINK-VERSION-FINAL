import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getNiche } from '../../data/niches';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle, Copy, RefreshCw, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../services/supabaseClient';
import { usePublicRateLimit } from '../../hooks/usePublicRateLimit';
import { publicToolsService } from '../../services/publicToolsService';
import { AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { translations } from '../../translations';

const NicheGeneratorPage = () => {
    const { nicheSlug } = useParams<{ nicheSlug: string }>();
    const niche = getNiche(nicheSlug || '');
    
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPost, setGeneratedPost] = useState<string | null>(null);
    const [usageInfoState, setUsageInfoState] = useState<{ currentCount: number; limit: number; resetAt: string } | null>(null);
    const [showLimitModal, setShowLimitModal] = useState(false);

    const { usageInfo, checkLimit } = usePublicRateLimit('niche_content');
    const { language } = useUser();
    const t = translations[language];

    // Sync usageInfo from hook to local state for immediate updates after generation
    React.useEffect(() => {
        if (usageInfo) {
            setUsageInfoState({
                currentCount: usageInfo.currentCount,
                limit: usageInfo.limit,
                resetAt: usageInfo.resetAt.toISOString()
            });
        }
    }, [usageInfo]);

    // SEO Dynamic Update
    React.useEffect(() => {
        if (niche) {
            document.title = niche.metaTitle;
        }
    }, [niche]);

    if (!niche) {
        return <Navigate to="/" replace />;
    }

    // Dynamic Meta Tags using Helmet (Wait, Helmet is not imported in this file, need to assume local management or use Helmet)
    // Actually, looking at previous files, Helmet is available.
    // However, NicheGeneratorPage uses vanilla JS document manipulation in useEffect.
    // I should switch to Helmet for consistency if possible, or stick to vanilla if Helmet is not easily usable here.
    // Let's use vanilla JS replacement in useEffect as currently implemented, but EXTEND it to OpenGraph types.
    
    React.useEffect(() => {
         if (!niche) return;

         // Helper to set meta
         const setMeta = (name: string, content: string) => {
             let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
             if (!element) {
                 element = document.createElement('meta');
                 element.setAttribute('name', name); // Or property, strictly calling it name for simplicity, but OG uses property
                 document.head.appendChild(element);
             }
             element.setAttribute('content', content);
         };
         
         // Helper for Property (OG)
         const setProperty = (property: string, content: string) => {
             let element = document.querySelector(`meta[property="${property}"]`);
             if (!element) {
                 element = document.createElement('meta');
                 element.setAttribute('property', property);
                 document.head.appendChild(element);
             }
             element.setAttribute('content', content);
         }

         setMeta('description', niche.metaDescription);
         setProperty('og:title', niche.metaTitle);
         setProperty('og:description', niche.metaDescription);
         setProperty('og:image', 'https://kolink.ai/og-image-default.jpg'); // Todo: dynamic image based on niche?
         setProperty('og:url', window.location.href);
         setProperty('og:type', 'website');
         
         setMeta('twitter:card', 'summary_large_image');
         setMeta('twitter:title', niche.metaTitle);
         setMeta('twitter:description', niche.metaDescription);

    }, [niche]);

    if (!niche) {
        return <Navigate to="/" replace />;
    }

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.error(language === 'es' ? "¡Por favor ingresa un tema!" : "Please enter a topic!");
            return;
        }

        setIsGenerating(true);
        setGeneratedPost(null);

        try {
            const result = await publicToolsService.generateNicheContent({
                topic: topic,
                nicheTitle: niche.title,
                roleContext: niche.roleContext,
                painPoint: niche.painPoint
            });

            setGeneratedPost(result.postContent);
            setUsageInfoState(result.usageInfo);
            toast.success(language === 'es' ? "¡Post generado!" : "Post generated!");
        } catch (err: any) {
            console.error(err);
            if (err.message === 'RATE_LIMIT_EXCEEDED') {
                setShowLimitModal(true);
                toast.error(language === 'es' ? "Límite alcanzado. Regístrate para más usos." : "Limit reached. Sign up for more uses.");
            } else {
                toast.error(language === 'es' ? "Error al generar" : "Generation failed.");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    // Schema.org for SEO Authority (SoftwareApplication + FAQ)
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": `Kolink ${niche.title} Generator`,
                "operatingSystem": "Web",
                "applicationCategory": "BusinessApplication",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "ratingCount": "120"
                },
                "description": niche.metaDescription
            },
            {
                "@type": "FAQPage",
                "mainEntity": niche.proTips.map(tip => ({
                    "@type": "Question",
                    "name": tip.title,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": tip.content
                    }
                }))
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://kolink.ai"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Tools",
                        "item": "https://kolink.ai/tools"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": niche.title,
                        "item": `https://kolink.ai/tools/${niche.slug}`
                    }
                ]
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>

            {/* Header / Nav */}
            <nav className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tighter">
                    Kolink<span className="text-brand-600">.</span>
                </Link>
                <div className="flex items-center gap-4 md:gap-6">
                    <Link to="/login" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">
                        Panel
                    </Link>
                    <Link to="/login" className="px-5 py-2 bg-brand-600 text-white rounded-full text-sm font-semibold hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20">
                        Pruébalo Gratis
                    </Link>
                </div>
            </nav>

            {/* Breadcrumbs for SEO hierarchy */}
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Link to="/" className="hover:text-brand-600">Inicio</Link>
                <ChevronRight size={12} />
                <Link to="/" className="hover:text-brand-600">Herramientas</Link>
                <ChevronRight size={12} />
                <span className="text-slate-600">{niche.title}</span>
            </div>

            {/* Hero Section */}
            <header className="relative pt-12 pb-24 overflow-hidden bg-slate-50">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />
                
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-100 text-brand-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
                    >
                        <Sparkles size={12} />
                        LinkedIn Authority Engine
                    </motion.div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-slate-900 mb-6 tracking-tight leading-[1.05]">
                        {niche.heroTitle} <span className="text-brand-600">Free IA</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                        {niche.painPoint} Genera autoridad en LinkedIn con nuestra IA programada para {niche.title}.
                    </p>
                </div>
            </header>

            {/* Tool Section */}
            <section id="tool" className="max-w-4xl mx-auto px-6 -mt-16 relative z-20 pb-20">
                <div className="bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        {!generatedPost ? (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                                        ¿Qué quieres compartir hoy con tu red?
                                    </label>
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder={`ej., "${niche.exampleTopic}"`}
                                            className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-lg font-medium"
                                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                        />
                                        <button 
                                            onClick={handleGenerate}
                                            disabled={isGenerating}
                                            className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-3 shadow-xl shadow-brand-500/20 active:scale-95"
                                        >
                                            {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />}
                                            {isGenerating ? "Creando..." : "Generar Post"}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <CheckCircle size={12} className="text-brand-500" />
                                            Contexto IA: {niche.roleContext}
                                        </span>
                                        {usageInfoState && (
                                            <span className="flex items-center gap-1">
                                                {[...Array(usageInfoState.limit)].map((_, i) => (
                                                    <div 
                                                        key={i} 
                                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${i < usageInfoState.currentCount ? 'bg-brand-500' : 'bg-slate-200'}`} 
                                                    />
                                                ))}
                                                <span className="ml-2 bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">
                                                    {usageInfoState.limit - usageInfoState.currentCount} {language === 'es' ? 'Libres' : 'Free'}
                                                </span>
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-4">
                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                                        Tu Estrategia de Contenido
                                    </h3>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => { setGeneratedPost(null); setTopic(''); }}
                                        className="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full transition-colors"
                                    >
                                        Nuevo Borrador
                                    </motion.button>
                                </div>

                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200/60 shadow-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-medium text-lg relative group overflow-hidden"
                                >
                                    <div className="absolute top-4 right-4 text-brand-100 opacity-20 group-hover:opacity-50 transition-opacity">
                                        <Sparkles size={32} />
                                    </div>

                                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-50">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                            <img src="/logo.png" alt="Kolink" className="w-6 h-6 grayscale opacity-50" />
                                        </div>
                                        <div>
                                            <div className="w-24 h-3 bg-slate-100 rounded-full mb-1" />
                                            <div className="w-16 h-2 bg-slate-50 rounded-full" />
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        {generatedPost}
                                    </div>
                                </motion.div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <motion.button 
                                        whileHover={{ y: -1, backgroundColor: "#f8fafc" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            navigator.clipboard.writeText(generatedPost);
                                            toast.success("¡Copiado! Listo para LinkedIn");
                                        }}
                                        className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
                                    >
                                        <Copy size={18} />
                                        Copiar
                                    </motion.button>
                                    <motion.div className="flex-[2]" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                                        <Link 
                                            to="/login"
                                            className="w-full h-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-500/20"
                                        >
                                            Programar en Kolink Pro
                                            <ArrowRight size={18} />
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Authority Content Section - THE SEO ENGINE */}
            <article className="max-w-4xl mx-auto px-6 py-12 md:py-24 border-t border-slate-100">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 space-y-12">
                        <section>
                            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 mb-6 tracking-tight">
                                {niche.guideTitle}
                            </h2>
                            <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed font-medium">
                                <p>{niche.guideContent}</p>
                            </div>
                        </section>

                        <section className="bg-brand-50/30 p-8 rounded-3xl border border-brand-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <CheckCircle className="text-brand-600" size={20} />
                                Beneficios de Dominar LinkedIn como {niche.title}
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {niche.keyBenefits.map((benefit, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-700 leading-snug">
                                        <div className="flex-shrink-0 w-5 h-5 bg-white rounded-full border border-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-600">
                                            {i + 1}
                                        </div>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <aside className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="font-black text-xs uppercase tracking-widest text-brand-600 mb-4">Pro Tips de Experto</h4>
                            <div className="space-y-6">
                                {niche.proTips.map((tip, i) => (
                                    <div key={i} className="space-y-2">
                                        <p className="font-bold text-sm text-slate-900">{tip.title}</p>
                                        <p className="text-xs text-slate-500 leading-relaxed">{tip.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900 text-white">
                            <h4 className="font-bold text-sm mb-4">¿Por qué usar Kolink?</h4>
                            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                                A diferencia de ChatGPT genérico, Kolink conoce los algoritmos actuales de LinkedIn y tu voz profesional exacta.
                            </p>
                            <Link to="/login" className="text-xs font-bold text-brand-400 flex items-center gap-1 hover:text-brand-300 transition-colors">
                                Crear cuenta gratuita <ArrowRight size={14} />
                            </Link>
                        </div>
                    </aside>
                </div>
            </article>

            {/* Interlinking Section for SEO Hierarchy */}
            <section className="bg-slate-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">Soluciones para Otros Sectores Profesionales</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {niche.relatedNiches.map(relSlug => {
                            const relNiche = getNiche(relSlug);
                            if (!relNiche) return null;
                            return (
                                <Link 
                                    key={relSlug}
                                    to={`/tools/${relSlug}`}
                                    className="p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
                                        IA para {relNiche.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Optimiza tu presencia profesional y atrae leads cualificados en el sector de {relNiche.title.toLowerCase()}.
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Footer with SEO Links */}
            <footer className="bg-white border-t border-slate-100 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex justify-center gap-8 mb-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Link to="/" className="hover:text-brand-600">Inicio</Link>
                        <Link to="/login" className="hover:text-brand-600">Sobre Kolink</Link>
                        <Link to="/login" className="hover:text-brand-600">Privacidad</Link>
                    </div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest">
                        Kolink Authority Lab &copy; 2026. Todos los derechos reservados.
                    </p>
                </div>
            </footer>

            {/* Limit Reached Modal */}
            <AnimatePresence>
                {showLimitModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLimitModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-white p-8 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-brand-500/10">
                                <Zap size={32} fill="currentColor" />
                            </div>
                            
                            <h2 className="text-3xl font-black text-slate-900 text-center mb-4 tracking-tight leading-tight">
                                {language === 'es' ? '¡Has alcanzado el límite!' : 'Limit Reached!'}
                            </h2>
                            
                            <p className="text-slate-600 text-center mb-8 font-medium leading-relaxed">
                                {language === 'es' 
                                    ? 'Has usado tus 3 generaciones gratuitas por hoy. Únete a miles de profesionales y obtén acceso ilimitado.' 
                                    : 'You have used your 3 free generations for today. Join thousands of professionals and get unlimited access.'}
                            </p>
                            
                            <div className="space-y-3">
                                <Link 
                                    to="/login" 
                                    className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-600/20 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                                >
                                    {language === 'es' ? 'Crear Cuenta Gratis' : 'Create Free Account'}
                                    <ArrowRight size={20} />
                                </Link>
                                <button 
                                    onClick={() => setShowLimitModal(false)}
                                    className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl font-bold transition-all flex items-center justify-center text-sm"
                                >
                                    {language === 'es' ? 'Quizás más tarde' : 'Maybe later'}
                                </button>
                            </div>
                            
                             <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2">
                                <div className="flex -space-x-1">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-sm" >
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="User" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    +5,000 Usuarios Pro
                                </span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NicheGeneratorPage;
