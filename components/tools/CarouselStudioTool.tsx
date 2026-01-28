import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, Sparkles, Wand2, Download, Share2, LogIn, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CarouselStudio from '@/components/features/generation/CarouselStudio';

const CarouselStudioTool = () => {
    const { language, user } = useUser();
    const t = translations[language]?.toolsPage?.carouselStudio || translations['en']?.toolsPage?.carouselStudio || {
        title: "AI Carousel Generator",
        desc: "Create premium LinkedIn carousels in seconds.",
        badge: "Free Tool",
        heroTitle: "Stop designing from scratch. Let AI do the heavy lifting.",
        heroSubtitle: "Generate high-quality PDF carousels for LinkedIn using proven viral structures. No design skills required."
    };
    const navigate = useNavigate();
    const [started, setStarted] = useState(false);

    const isGuest = !user?.id || user.id.startsWith('mock-');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Helmet>
                <title>{t.title} | Kolink AI</title>
                <meta name="description" content={t.desc} />
            </Helmet>

            {!started ? (
                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="relative pt-20 pb-32 overflow-hidden">
                        {/* Background Decorations */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-200/20 blur-[100px] rounded-full" />
                            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/20 blur-[100px] rounded-full" />
                        </div>

                        <div className="max-w-7xl mx-auto px-6 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-bold mb-8"
                            >
                                <Sparkles className="w-4 h-4" />
                                {language === 'es' ? 'Herramienta Gratuita' : 'Free AI Tool'}
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl font-display font-black text-slate-900 mb-6 tracking-tight leading-[1.1]"
                            >
                                {language === 'es' ? 'Crea carruseles virales' : 'Create viral carousels'} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">
                                    {language === 'es' ? 'en segundos' : 'in seconds'}
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium"
                            >
                                {language === 'es' 
                                    ? 'Transforma tus ideas en presentaciones premium optimizadas para el algoritmo de LinkedIn. Sin Canva, sin estrés.'
                                    : 'Transform your ideas into premium presentations optimized for the LinkedIn algorithm. No Canva, no stress.'}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                            >
                                <Button 
                                    size="lg" 
                                    onClick={() => setStarted(true)}
                                    className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-7 text-lg font-bold rounded-2xl shadow-xl shadow-brand-500/20 gap-3 group"
                                >
                                    <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    {language === 'es' ? 'Abrir Generador Gratis' : 'Open Free Generator'}
                                </Button>
                                {!isGuest && (
                                    <Button 
                                        variant="outline"
                                        size="lg"
                                        onClick={() => navigate('/dashboard')}
                                        className="border-slate-200 text-slate-600 px-8 py-7 text-lg font-bold rounded-2xl gap-3"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                        {language === 'es' ? 'Ir al Dashboard' : 'Go to Dashboard'}
                                    </Button>
                                )}
                            </motion.div>

                            {/* Trust badges */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-16 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all"
                            >
                                <div className="flex items-center gap-2 font-bold text-slate-400">
                                    <CheckCircle2 className="w-5 h-5" /> No se requiere tarjeta
                                </div>
                                <div className="flex items-center gap-2 font-bold text-slate-400">
                                    <CheckCircle2 className="w-5 h-5" /> Exportación PDF HD
                                </div>
                                <div className="flex items-center gap-2 font-bold text-slate-400">
                                    <CheckCircle2 className="w-5 h-5" /> Optimizado para LinkedIn
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="py-24 bg-white border-y border-slate-100">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <Card className="p-8 border-none shadow-none bg-slate-50 rounded-3xl group hover:bg-brand-50/50 transition-colors">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-brand-600 group-hover:scale-110 transition-transform">
                                        <Layout className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-slate-900">Diseño Premium</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {language === 'es' ? 'Olvídate de las plantillas genéricas. Nuestros layouts están diseñados por expertos en marca personal.' : 'Forget generic templates. Our layouts are designed by personal branding experts.'}
                                    </p>
                                </Card>
                                <Card className="p-8 border-none shadow-none bg-slate-50 rounded-3xl group hover:bg-indigo-50/50 transition-colors">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                                        <Zap className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-slate-900">IA Inteligente</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {language === 'es' ? 'Introduce tu tema y la IA redactará el guion optimizado para generar retención y clics.' : 'Input your topic and the AI will write the script optimized to generate retention and clicks.'}
                                    </p>
                                </Card>
                                <Card className="p-8 border-none shadow-none bg-slate-50 rounded-3xl group hover:bg-purple-50/50 transition-colors">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                                        <Download className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-slate-900">Exportación PDF</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {language === 'es' ? 'Descarga tus presentaciones listas para subir a LinkedIn como documentos PDF de alta resolución.' : 'Download your presentations ready to upload to LinkedIn as high-resolution PDF documents.'}
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </section>
                </main>
            ) : (
                <div className="flex-1 flex flex-col pt-4">
                    <div className="px-6 flex items-center justify-between mb-4">
                         <Button 
                            variant="ghost" 
                            onClick={() => setStarted(false)}
                            className="text-slate-500 hover:text-slate-900 gap-2"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            {language === 'es' ? 'Regresar' : 'Go Back'}
                        </Button>
                        <div className="text-sm font-bold text-slate-400">
                             {language === 'es' ? 'ESTUDIO GRATUITO' : 'FREE STUDIO'}
                        </div>
                    </div>
                    <div className="flex-1">
                        {/* 
                            Pass a unique context or limited features here if needed.
                            For now, using the CarouselStudio component directly.
                        */}
                        <CarouselStudio />
                    </div>
                </div>
            )}

            {/* Simple Footer */}
            {!started && (
                <footer className="py-12 px-6 border-t border-slate-100 bg-white">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">KOLINK 2026</p>
                        <div className="flex gap-8">
                            <Link to="/tools" className="text-slate-500 hover:text-brand-600 font-bold text-sm transition-colors">Más Herramientas</Link>
                            <Link to="/#pricing" className="text-slate-500 hover:text-brand-600 font-bold text-sm transition-colors">Planes Pro</Link>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default CarouselStudioTool;
