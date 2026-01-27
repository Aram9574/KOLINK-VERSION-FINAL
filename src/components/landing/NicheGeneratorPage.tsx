import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getNiche } from '../../../data/niches';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle, Copy, RefreshCw, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../services/supabaseClient';

const NicheGeneratorPage = () => {
    const { nicheSlug } = useParams<{ nicheSlug: string }>();
    const niche = getNiche(nicheSlug || '');
    
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPost, setGeneratedPost] = useState<string | null>(null);

    // SEO Dynamic Update
    React.useEffect(() => {
        if (niche) {
            document.title = niche.metaTitle;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', niche.metaDescription);
            }
        }
    }, [niche]);

    if (!niche) {
        return <Navigate to="/" replace />;
    }

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.error("¡Por favor ingresa un tema!");
            return;
        }

        setIsGenerating(true);
        setGeneratedPost(null);

        try {
            const { data, error } = await supabase.functions.invoke('generate-viral-post', {
                body: {
                    params: {
                        topic: topic,
                        tone: "Professional yet engaging",
                        target_audience: niche.title,
                        instructions: `Actúa como ${niche.roleContext}. Escribe un post de LinkedIn en ESPAÑOL sobre ${topic}. Enfócate en resolver este problema: ${niche.painPoint}. Usa ganchos virales.`
                    }
                }
            });

            if (error) throw error;
            setGeneratedPost(data?.data?.postContent || "Error: No se pudo generar el post.");
            toast.success("¡Post generado!");
        } catch (err) {
            console.error(err);
            toast.error("Falló la generación. Intenta de nuevo.");
            setGeneratedPost(`(Borrador para ${niche.title} sobre "${topic}")\n\nEmpieza con un gancho sobre ${niche.painPoint}...\n[La generación por IA requiere conexión al backend]`);
        } finally {
            setIsGenerating(false);
        }
    };

    // Schema.org for SEO Authority
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": niche.guideTitle,
        "description": niche.metaDescription,
        "author": {
            "@type": "Organization",
            "name": "Kolink AI"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://kolink.ai/tools/${niche.slug}`
        }
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
                                    <p className="text-[11px] text-slate-400 mt-4 flex items-center gap-2">
                                        <CheckCircle size={12} className="text-brand-500" />
                                        Contexto IA: {niche.roleContext}
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
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-brand-500 rounded-full" />
                                        Tu Estrategia de Contenido
                                    </h3>
                                    <button 
                                        onClick={() => { setGeneratedPost(null); setTopic(''); }}
                                        className="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wider"
                                    >
                                        Nuevo Borrador
                                    </button>
                                </div>

                                <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 text-slate-800 whitespace-pre-wrap leading-relaxed font-medium text-lg relative group">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Sparkles className="text-brand-200" size={32} />
                                    </div>
                                    {generatedPost}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(generatedPost);
                                            toast.success("¡Copiado! Listo para LinkedIn");
                                        }}
                                        className="flex-1 py-4 bg-white border-2 border-slate-100 hover:border-brand-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Copy size={18} />
                                        Copiar
                                    </button>
                                    <Link 
                                        to="/login"
                                        className="flex-[2] py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-500/25"
                                    >
                                        Programar en Kolink Pro
                                        <ArrowRight size={18} />
                                    </Link>
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

                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-400 to-brand-600 rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                            <div className="relative aspect-square md:aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                                <img 
                                    src="/Users/aramzakzuk/.gemini/antigravity/brain/429d8a46-8681-4885-af5f-0f6ad05cded2/kolink_authority_dashboard_mockup_1769463594345.png" 
                                    alt="Kolink Analytics Dashboard"
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-8">
                                    <p className="text-white text-sm font-bold flex items-center gap-2">
                                        <Sparkles size={16} className="text-brand-400" />
                                        Tu Centro de Comando LinkedIn
                                    </p>
                                </div>
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
        </div>
    );
};

export default NicheGeneratorPage;
