import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { SeoService } from '../../services/seoService';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle, Zap, Target, Users, Play } from 'lucide-react';
import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';
import { useUser } from '../../context/UserContext';
import { useState } from 'react';
import VideoDemoSection from '../landing/VideoDemoSection';

interface ProgrammaticLandingProps {
    actionSlug?: string;
    roleSlug?: string;
}

const ProgrammaticLanding: React.FC<ProgrammaticLandingProps> = (props) => {
    const { user, language, setLanguage } = useUser();
    const params = useParams<{ actionSlug: string; roleSlug: string }>();
    const actionSlug = props.actionSlug || params.actionSlug;
    const roleSlug = props.roleSlug || params.roleSlug;
    
    // For Navbar scroll prop
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        // Simple fallback for landing pages that don't have all sections
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    if (!actionSlug || !roleSlug) {
        return <Navigate to="/" replace />;
    }

    const metadata = SeoService.getPageMetadata(actionSlug, roleSlug);

    if (!metadata) {
        return <Navigate to="/404" replace />;
    }

    const { title, description, canonical, roleName, actionName, painPoints } = metadata;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonical} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta name="twitter:card" content="summary_large_image" />
                 {/* Schema Markup for SoftwareApp */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": `KOLINK for ${roleName}`,
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "description": description
                    })}
                </script>
            </Helmet>

            <Navbar 
                language={language}
                setLanguage={setLanguage}
                user={user}
                activeSection="tools"
                scrollToSection={scrollToSection}
            />

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-white z-0">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-8 border border-blue-100 shadow-sm animate-fade-in-up">
                            <Zap className="w-4 h-4" />
                            <span>Solución de IA para {roleName}</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
                            La mejor forma de <span className="text-blue-600">{actionName}</span> para <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{roleName}</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            KOLINK entiende los desafíos únicos de los {roleName}. 
                            {description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/auth?mode=signup">
                                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-blue-500/30 w-full sm:w-auto flex items-center justify-center gap-2">
                                    Empezar Gratis
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <Link to="/#demo" className="text-slate-600 font-semibold flex items-center gap-2 hover:text-blue-600 transition-colors px-6 py-4">
                                <Play className="w-5 h-5 fill-current" />
                                Ver Demo del Producto
                            </Link>
                        </div>
                        <p className="mt-6 text-sm text-slate-400">
                            No requiere tarjeta de crédito • Plan gratuito disponible
                        </p>
                    </div>
                </div>
            </header>

            {/* Pain Points Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            ¿Por qué es difícil para {roleName}?
                        </h2>
                        <p className="text-lg text-slate-600">
                            Entendemos los obstáculos específicos de tu industria.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {painPoints.map((point, index) => (
                            <div key={index} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                                    <Target className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 capitalize">
                                    {point}
                                </h3>
                                <p className="text-slate-600">
                                    Supera la barrera de "{point}" con nuestra tecnología automatizada.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Video Demo Section */}
             <section id="demo" className="py-16 bg-slate-50">
                <VideoDemoSection language={language} />
            </section>

             {/* Solution / How it Works */}
             <section className="py-24 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                             <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                                Diseñado específicamente para {roleName}
                            </h2>
                            <p className="text-slate-300 text-lg mb-8">
                                No uses herramientas genéricas. KOLINK adapta el tono, el estilo y el contenido a las expectativas de tu sector.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                                    <div>
                                        <strong className="block text-white">Vocabulario del Sector</strong>
                                        <span className="text-slate-400">La IA conoce la jerga de {roleName}.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                                    <div>
                                        <strong className="block text-white">Ahorro de Tiempo Real</strong>
                                        <span className="text-slate-400">Automatiza {actionName} y enfócate en tu negocio.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                                    <div>
                                        <strong className="block text-white">Resultados Profesionales</strong>
                                        <span className="text-slate-400">Calidad de agencia, al instante.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
                             <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                                        AI
                                    </div>
                                    <div>
                                        <div className="h-4 w-32 bg-slate-700 rounded mb-2"></div>
                                        <div className="h-3 w-20 bg-slate-700 rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-slate-700 rounded"></div>
                                    <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
                                    <div className="h-4 w-4/6 bg-slate-700 rounded"></div>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <div className="h-8 w-24 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center text-sm font-medium">Viral</div>
                                    <div className="h-8 w-24 bg-slate-700 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 bg-blue-600">
                <div className="max-w-4xl mx-auto px-4 text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                        ¿Listo para dominar tu nicho?
                    </h2>
                    <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                        Únete a otros {roleName} que ya están usando Inteligencia Artificial para destacar en LinkedIn sin esfuerzo.
                    </p>
                    <Link to="/auth?mode=signup">
                        <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-2xl hover:scale-105 transform duration-200">
                            Obtener Acceso Anticipado
                        </button>
                    </Link>
                </div>
            </section>

             <Footer 
                language={language}
                scrollToSection={scrollToSection}
            />
        </div>
    );
};

export default ProgrammaticLanding;
