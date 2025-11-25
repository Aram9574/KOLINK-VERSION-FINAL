import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    Zap,
    TrendingUp,
    Award,
    Users,
    CheckCircle2,
    ArrowRight,
    Globe,
    ChevronDown,
    ChevronUp,
    Linkedin,
    Star,
    Shield,
    Clock,
    Play,
    Fingerprint,
    LayoutGrid,
    Lightbulb,
    Bot,
    Settings as SettingsIcon,
    Wand2,
    ThumbsUp,
    MessageCircle,
    Repeat,
    Send,
    PenTool,
    Cpu,
    Rocket,
    BarChart3,
    BrainCircuit,
    Target,
    Check,
    X as XIcon,
    MoreHorizontal,
    PenLine,
    LineChart,
    FileText,
    AlertCircle,
    Plus,
    MousePointer2,
    Quote,
    Edit3,
    History
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PLANS } from '../constants';
import { translations } from '../translations';
import { AppLanguage } from '../types';
import { Link } from 'react-router-dom';

interface LandingPageProps {
    language: AppLanguage;
    setLanguage: (lang: AppLanguage) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ language, setLanguage }) => {
    const [activeSection, setActiveSection] = useState<string>('hero');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const t = translations[language];
    const isEs = language === 'es';

    const faqs = [
        { q: t.faq.q1, a: t.faq.a1 },
        { q: t.faq.q2, a: t.faq.a2 },
        { q: t.faq.q3, a: t.faq.a3 },
        { q: t.faq.q4, a: t.faq.a4 }
    ];

    // Mock Content Localization
    const mockContent = isEs ? {
        level: "NIVEL 1",
        creator: "Creador",
        studio: "Estudio",
        ideas: "Ideas",
        autopilot: "AutoPilot",
        history: "Historial",
        settings: "Ajustes",
        credits: "20 créditos",
        topicLabel: "Tema o Idea",
        topicValue: "Cómo la consistencia vence a la intensidad en LinkedIn...",
        audienceLabel: "Audiencia",
        audienceValue: "Fundadores SaaS, Creadores",
        toneLabel: "Tono",
        toneValue: "Controvertido",
        structureLabel: "Estructura",
        creativityLabel: "Creatividad",
        creativityValue: "Alta",
        generate: "Generar",
        postHeader: "Founder @ Kolink",
        postContent: "Deja de mirar una página en blanco. 🛑\n\nLa mayoría pierde 10 horas/semana pensando qué escribir.\n\nMientras tanto, el top 1% usa frameworks.\n\nAquí está el secreto: No necesitas más creatividad. Necesitas mejor arquitectura.\n\nEl Framework PAS para viralidad:\n❌ Problema: El bloqueo mata el impulso.\n🔥 Agitación: La inconsistencia mata el alcance.\n✅ Solución: Usa estructuras probadas.",
        postTags: "#GrowthHacking #LinkedInTips #AI",
        voiceCardTitle: "ADN de Marca",
        voiceCardVal: "Clonación: 99%",
        viralCardTitle: "Alcance Viral",
        viralCardVal: "Potencial: Alto",
        // NEW
        badPost: "Me complace anunciar que hoy he reflexionado sobre la importancia de la consistencia. La consistencia es clave porque nos permite desarrollar hábitos duraderos. Además, es fundamental mantenerse motivado incluso cuando los resultados no son inmediatos para poder alcanzar el éxito a largo plazo en nuestras carreras profesionales...",
        goodPostHook: "La consistencia vence a la intensidad.",
        goodPostBody: "La mayoría falla porque corre un sprint.\nEl 1% gana porque camina cada día.\n\nAquí mi sistema de 3 pasos: 👇"
    } : {
        level: "LEVEL 1",
        creator: "Creator",
        studio: "Studio",
        ideas: "Ideas",
        autopilot: "AutoPilot",
        history: "History",
        settings: "Settings",
        credits: "20 credits",
        topicLabel: "Topic or Idea",
        topicValue: "How consistency beats intensity on LinkedIn...",
        audienceLabel: "Audience",
        audienceValue: "SaaS Founders, Creators",
        toneLabel: "Tone",
        toneValue: "Controversial",
        structureLabel: "Structure",
        creativityLabel: "Creativity",
        creativityValue: "High",
        generate: "Generate",
        postHeader: "Founder @ Kolink",
        postContent: "Stop staring at a blank page. 🛑\n\nMost people waste 10 hours/week thinking what to write.\n\nMeanwhile, the top 1% use frameworks.\n\nHere is the secret: You don't need more creativity. You need better architecture.\n\nThe PAS Framework for virality:\n❌ Problem: Writer's block kills momentum.\n🔥 Agitate: Inconsistency kills reach.\n✅ Solution: Use proven structures.",
        postTags: "#GrowthHacking #LinkedInTips #AI",
        voiceCardTitle: "Brand DNA",
        voiceCardVal: "Voice Match: 99%",
        viralCardTitle: "Viral Reach",
        viralCardVal: "Potential: High",
        // NEW
        badPost: "I am thrilled to announce that today I have been reflecting on the importance of consistency. Consistency is key because it allows us to build lasting habits. Furthermore, it is fundamental to stay motivated even when results are not immediate in order to achieve long-term success in our professional careers...",
        goodPostHook: "Consistency > Intensity.",
        goodPostBody: "Most people fail because they sprint.\nThe top 1% win because they walk everyday.\n\nHere is my 3-step system: 👇"
    };

    // Handle smooth scrolling with offset for fixed header
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80; // Adjust based on navbar height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            // Manually set active section immediately for better UX
            setActiveSection(sectionId);
        }
    };

    // Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            // Removed 'testimonials' from tracking
            const sections = ['howitworks', 'features', 'pricing', 'faq'];
            const scrollPosition = window.scrollY + 100; // Trigger point offset

            // Default to empty if at very top
            if (window.scrollY < 50) {
                setActiveSection('');
                return;
            }

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const offsetTop = element.offsetTop - 120;
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(sectionId);
                        return;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getNavLinkClass = (id: string) => {
        const isActive = activeSection === id;
        return `px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${isActive
            ? 'text-brand-700 bg-white shadow-sm ring-1 ring-slate-200'
            : 'text-slate-600 hover:text-brand-700 hover:bg-white/50'
            }`;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-200 selection:text-brand-900">
            <Helmet>
                <title>Kolink - Viral LinkedIn Post Generator</title>
                <meta name="description" content="Create viral LinkedIn posts in seconds with AI. Kolink helps you write engaging content, grow your audience, and build your personal brand." />
                <meta property="og:title" content="Kolink - Viral LinkedIn Post Generator" />
                <meta property="og:description" content="Create viral LinkedIn posts in seconds with AI." />
                <meta property="og:type" content="website" />
            </Helmet>

            {/* Custom Styles for Marquee and Gradients */}
            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
        }
        .mask-linear {
            mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
        }
        html {
            scroll-behavior: smooth;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite 2s;
        }
      `}</style>

            {/* Background Elements */}
            <div className="fixed inset-0 bg-grid-pattern pointer-events-none -z-20"></div>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-400/20 blur-[120px] rounded-full pointer-events-none -z-10 opacity-60 mix-blend-multiply animate-pulse duration-1000"></div>
            <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-indigo-400/10 blur-[100px] rounded-full pointer-events-none -z-10 opacity-60"></div>

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-display font-bold text-2xl text-slate-900 tracking-tight cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-110">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl rotate-6 opacity-50 blur-[2px]"></div>
                            <div className="relative w-full h-full bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                                K
                            </div>
                        </div>
                        <span className="hidden sm:inline">Kolink</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100/50 border border-slate-200/50 backdrop-blur-md">
                        <a
                            href="#howitworks"
                            onClick={(e) => scrollToSection(e, 'howitworks')}
                            className={getNavLinkClass('howitworks')}
                        >
                            {t.nav.howItWorks}
                        </a>
                        <a
                            href="#features"
                            onClick={(e) => scrollToSection(e, 'features')}
                            className={getNavLinkClass('features')}
                        >
                            {t.nav.features}
                        </a>
                        {/* Testimonials Link Removed */}
                        <a
                            href="#pricing"
                            onClick={(e) => scrollToSection(e, 'pricing')}
                            className={getNavLinkClass('pricing')}
                        >
                            {t.nav.pricing}
                        </a>
                        <a
                            href="#faq"
                            onClick={(e) => scrollToSection(e, 'faq')}
                            className={getNavLinkClass('faq')}
                        >
                            {t.nav.faq}
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Language Toggle */}
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                            className="w-10 h-10 rounded-full bg-slate-100 text-lg flex items-center justify-center hover:bg-slate-200 transition-colors border border-slate-200"
                            title="Change Language"
                        >
                            {language === 'en' ? '🇺🇸' : '🇪🇸'}
                        </button>

                        <Link to="/login" className="hidden sm:block text-slate-600 font-bold hover:text-brand-600 transition-colors px-4 text-sm">
                            {t.nav.login}
                        </Link>
                        <Link to="/login" className="group bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 text-sm">
                            {t.nav.getStarted}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-40 px-6 relative">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-default">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        {t.hero.badge}
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-slate-900 mb-8 tracking-tight leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        {t.hero.titleLine1} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 animate-gradient-x">{t.hero.titleLine2}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 font-medium">
                        {t.hero.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/40 hover:shadow-brand-500/60 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 text-lg group">
                            {t.hero.ctaPrimary}
                            <Sparkles className="w-5 h-5 group-hover:animate-spin-slow" />
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 text-lg shadow-sm hover:shadow-md">
                            <Play className="w-5 h-5 fill-slate-700" />
                            {t.hero.ctaSecondary}
                        </button>
                    </div>
                </div>

                {/* Advanced Hero Visual - Realistic App Preview */}
                <div className="mt-20 md:mt-32 relative max-w-6xl mx-auto perspective-1000 group z-10 px-4 sm:px-6">

                    {/* Floating Feature Card - Left (Voice) */}
                    <div className="absolute -left-12 top-1/4 z-20 hidden xl:block animate-float-slow">
                        <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-4 max-w-[240px]">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <Fingerprint className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {mockContent.voiceCardTitle}
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                    {mockContent.voiceCardVal}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Floating Feature Card - Right (Viral) */}
                    <div className="absolute -right-12 bottom-1/3 z-20 hidden xl:block animate-float-delayed">
                        <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-4 max-w-[240px]">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {mockContent.viralCardTitle}
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                    {mockContent.viralCardVal}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Glow effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-[2.5rem] opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700"></div>

                    <div className="relative bg-slate-900/5 rounded-3xl p-2 ring-1 ring-slate-900/10 shadow-2xl transform rotate-x-6 group-hover:rotate-x-2 transition-transform duration-1000 ease-out backdrop-blur-sm">
                        {/* App Window Frame */}
                        <div className="bg-slate-50 rounded-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9] relative flex border border-slate-200 shadow-inner">

                            {/* APP SIDEBAR MOCK */}
                            <div className="hidden md:flex w-64 border-r border-slate-200 bg-white flex-col flex-shrink-0">
                                {/* Logo */}
                                <div className="p-6 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/30">K</div>
                                    <span className="font-display font-bold text-xl text-slate-900 tracking-tight">Kolink</span>
                                </div>

                                {/* Gamification Widget Mock - CHANGED FROM BLACK TO BRAND GRADIENT */}
                                <div className="px-4 mb-2">
                                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-3 text-white relative overflow-hidden border border-indigo-500/50 shadow-md">
                                        <div className="flex items-center justify-between mb-2 relative z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm">
                                                    <Star className="w-3 h-3 text-white fill-white" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold uppercase text-indigo-200">{mockContent.level}</p>
                                                    <p className="text-xs font-bold text-white">{mockContent.creator}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-indigo-900/40 rounded-full overflow-hidden">
                                            <div className="h-full bg-white w-1/3"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu */}
                                <div className="px-4 space-y-1 mt-2">
                                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-brand-50 text-brand-700 text-sm font-semibold border border-brand-100 shadow-sm">
                                        <LayoutGrid className="w-4 h-4" /> {mockContent.studio}
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 text-sm font-semibold hover:bg-slate-50">
                                        <Lightbulb className="w-4 h-4" /> {mockContent.ideas}
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 text-sm font-semibold hover:bg-slate-50">
                                        <Bot className="w-4 h-4" /> {mockContent.autopilot}
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 text-sm font-semibold hover:bg-slate-50">
                                        <History className="w-4 h-4" /> {mockContent.history}
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 text-sm font-semibold hover:bg-slate-50">
                                        <SettingsIcon className="w-4 h-4" /> {mockContent.settings}
                                    </div>
                                </div>

                                {/* User Footer */}
                                <div className="mt-auto p-4 border-t border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <img src="https://picsum.photos/seed/alex/150/150" className="w-9 h-9 rounded-full border border-slate-200" alt="User" />
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">Alex Rivera</div>
                                            <div className="text-xs text-brand-600 font-bold">{mockContent.credits}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* APP MAIN CONTENT MOCK */}
                            <div className="flex-1 bg-slate-50 p-6 md:p-8 overflow-hidden flex flex-col md:flex-row gap-6 lg:gap-8">

                                {/* Generator Column */}
                                <div className="flex-1 max-w-lg space-y-5 flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-display font-bold text-slate-900">{mockContent.studio}</h2>
                                        <div className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> {mockContent.credits}
                                        </div>
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-5 shadow-sm space-y-4 flex-1 overflow-y-auto no-scrollbar">
                                        {/* Topic */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 ml-1">{mockContent.topicLabel}</label>
                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 h-20 shadow-inner text-opacity-80 font-medium">
                                                {mockContent.topicValue}
                                            </div>
                                        </div>
                                        {/* Audience */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 ml-1">{mockContent.audienceLabel}</label>
                                            <input disabled className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium" value={mockContent.audienceValue} />
                                        </div>
                                        {/* Grid Config */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-700">{mockContent.toneLabel}</label>
                                                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 flex justify-between items-center shadow-sm">
                                                    {mockContent.toneValue} <ChevronDown className="w-3 h-3 text-slate-400" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-700">{mockContent.structureLabel}</label>
                                                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 flex justify-between items-center shadow-sm">
                                                    PAS <ChevronDown className="w-3 h-3 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Creativity */}
                                        <div className="space-y-1 pt-1">
                                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                                <span>{mockContent.creativityLabel}</span>
                                                <span className="text-brand-600">{mockContent.creativityValue}</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-200 rounded-full w-full overflow-hidden">
                                                <div className="w-3/4 h-full bg-brand-500"></div>
                                            </div>
                                        </div>

                                        <div className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 text-sm mt-auto">
                                            <Wand2 className="w-4 h-4" /> {mockContent.generate}
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Column (Hidden on smaller screens within mock) */}
                                <div className="hidden lg:block flex-1 max-w-md pt-0 md:pt-8 overflow-y-auto no-scrollbar">
                                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-0 overflow-hidden transform scale-100 origin-top-left w-full">
                                        {/* LinkedIn Header */}
                                        <div className="p-4 pb-2 flex items-start justify-between">
                                            <div className="flex gap-3">
                                                <img src="https://picsum.photos/seed/alex/150/150" className="w-10 h-10 rounded-full border border-slate-100" alt="User" />
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 hover:text-blue-600 hover:underline cursor-pointer">Alex Rivera</div>
                                                    <div className="text-xs text-slate-500">{mockContent.postHeader} • 1h • 🌐</div>
                                                </div>
                                            </div>
                                            <button className="text-brand-600 font-bold text-sm hover:bg-blue-50 px-3 py-1 rounded-full">+ Follow</button>
                                        </div>

                                        {/* Post Content */}
                                        <div className="px-4 py-2 text-sm text-slate-900 space-y-3 leading-relaxed font-normal whitespace-pre-wrap">
                                            {mockContent.postContent.split('\n\n').map((para, i) => (
                                                <p key={i}>{para}</p>
                                            ))}
                                            <p className="text-brand-600 hover:underline cursor-pointer">{mockContent.postTags}</p>
                                        </div>

                                        {/* Engagement */}
                                        <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
                                            <div className="flex items-center gap-1">
                                                <div className="flex -space-x-1">
                                                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">👍</div>
                                                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white">❤️</div>
                                                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white">👏</div>
                                                </div>
                                                <span className="hover:text-blue-600 hover:underline">1,243</span>
                                            </div>
                                            <div className="hover:text-blue-600 hover:underline">89 comments</div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="px-2 py-1 flex justify-between">
                                            <button className="flex-1 py-3 hover:bg-slate-100 rounded-lg text-slate-500 font-semibold text-xs flex items-center justify-center gap-2 group">
                                                <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" /> Like
                                            </button>
                                            <button className="flex-1 py-3 hover:bg-slate-100 rounded-lg text-slate-500 font-semibold text-xs flex items-center justify-center gap-2 group">
                                                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> Comment
                                            </button>
                                            <button className="flex-1 py-3 hover:bg-slate-100 rounded-lg text-slate-500 font-semibold text-xs flex items-center justify-center gap-2 group">
                                                <Repeat className="w-4 h-4 group-hover:scale-110 transition-transform" /> Repost
                                            </button>
                                            <button className="flex-1 py-3 hover:bg-slate-100 rounded-lg text-slate-500 font-semibold text-xs flex items-center justify-center gap-2 group">
                                                <Send className="w-4 h-4 group-hover:scale-110 transition-transform" /> Send
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section (NEW) */}
            <section id="howitworks" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">{t.howItWorks.title}</h2>
                        <p className="text-slate-500 text-xl">{t.howItWorks.subtitle}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connection Line */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-slate-100 -z-10">
                            <div className="w-1/2 h-full bg-gradient-to-r from-brand-100 to-indigo-50"></div>
                        </div>

                        {/* Step 1 */}
                        <div className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-8 mx-auto group-hover:scale-110 transition-transform border-8 border-white shadow-sm">
                                <PenTool className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">{t.howItWorks.step1Title}</h3>
                            <p className="text-slate-500 text-center leading-relaxed">
                                {t.howItWorks.step1Desc}
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-8 mx-auto group-hover:scale-110 transition-transform border-8 border-white shadow-sm">
                                <Cpu className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">{t.howItWorks.step2Title}</h3>
                            <p className="text-slate-500 text-center leading-relaxed">
                                {t.howItWorks.step2Desc}
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-8 mx-auto group-hover:scale-110 transition-transform border-8 border-white shadow-sm">
                                <Rocket className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">{t.howItWorks.step3Title}</h3>
                            <p className="text-slate-500 text-center leading-relaxed">
                                {t.howItWorks.step3Desc}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid (Bento Style Redesign) */}
            <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">{t.features.title}</h2>
                        <p className="text-slate-500 text-xl">{t.features.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-12 gap-6 md:gap-8">

                        {/* Feature 1: Viral Frameworks (Engine) - REPLACED BLACK BG WITH GRADIENT */}
                        <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl shadow-brand-900/20">
                            {/* Background Effects */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-brand-500/30 border border-white/10 backdrop-blur-md">
                                    <Zap className="w-8 h-8 fill-current" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{t.features.f1Title}</h3>
                                <p className="text-blue-50 text-lg leading-relaxed max-w-xl mb-12 opacity-90">
                                    {t.features.f1Desc}
                                </p>

                                {/* Dynamic Frameworks Visualization */}
                                <div className="mt-auto flex gap-4 overflow-x-auto no-scrollbar pb-2 mask-linear">
                                    {[
                                        { name: 'Problem-Agitate-Solution', desc: 'Conversion' },
                                        { name: 'Before-After-Bridge', desc: 'Storytelling' },
                                        { name: 'The Contrarian Take', desc: 'Engagement' },
                                        { name: 'The Listicle', desc: 'Reach' }
                                    ].map((fw, i) => (
                                        <div key={i} className="min-w-[200px] bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-default">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-brand-300' : 'bg-slate-300'}`}></div>
                                                <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{fw.desc}</span>
                                            </div>
                                            <p className="text-white font-bold text-sm">{fw.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Feature 2: Virality Score (Stats) */}
                        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group shadow-xl hover:shadow-2xl transition-shadow duration-500">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-50 rounded-full blur-3xl"></div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                                    <BarChart3 className="w-7 h-7 fill-current" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">{t.features.f3Title}</h3>
                                <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                                    {t.features.f3Desc}
                                </p>

                                {/* Viral Score Gauge Mockup */}
                                <div className="mt-auto bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase">{t.features.viralScore}</span>
                                        <span className="text-lg font-bold text-green-600">94/100</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-green-400 to-green-600 w-[94%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <div className="flex-1 bg-white rounded-lg p-2 text-center shadow-sm">
                                            <span className="block text-[10px] text-slate-400 font-bold uppercase">{t.features.hooks}</span>
                                            <span className="block text-green-600 font-bold text-sm">A+</span>
                                        </div>
                                        <div className="flex-1 bg-white rounded-lg p-2 text-center shadow-sm">
                                            <span className="block text-[10px] text-slate-400 font-bold uppercase">{t.features.format}</span>
                                            <span className="block text-green-600 font-bold text-sm">A</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3: Brand Voice Cloning (DNA) */}
                        <div className="col-span-12 lg:col-span-5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group shadow-2xl shadow-indigo-900/20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md border border-white/20">
                                        <Fingerprint className="w-7 h-7" />
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-2">
                                        <BrainCircuit className="w-3 h-3" /> AI Model
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-4">{t.features.f2Title}</h3>
                                <p className="text-indigo-100 leading-relaxed mb-8">
                                    {t.features.f2Desc}
                                </p>

                                {/* Visual Mock: Input -> AI -> Output */}
                                <div className="space-y-3">
                                    <div className="flex gap-3 items-center opacity-60">
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">YOU</div>
                                        <div className="h-2 flex-1 bg-white/10 rounded-full"></div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold shadow-lg shadow-white/20">AI</div>
                                        <div className="h-2 flex-1 bg-gradient-to-r from-white/50 to-white rounded-full"></div>
                                        <div className="px-3 py-1 bg-white text-indigo-700 text-xs font-bold rounded-lg shadow-sm">100% Match</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 4: Speed & Workflow */}
                        <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group hover:shadow-xl transition-shadow duration-500 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                                    <Target className="w-7 h-7 fill-current" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{t.features.speedTitle}</h3>
                                <p className="text-slate-500 leading-relaxed mb-6">
                                    {t.features.speedDesc}
                                </p>
                                <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
                                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> {t.features.noWritersBlock}</span>
                                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> {t.features.mobileOptimized}</span>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 bg-slate-50 rounded-2xl border border-slate-100 p-4 shadow-inner">
                                {/* Timeline Mock */}
                                <div className="space-y-4">
                                    <div className="flex gap-3 items-start opacity-50">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-500">1</div>
                                        <div className="h-2 w-3/4 bg-slate-200 rounded mt-2"></div>
                                    </div>
                                    <div className="flex gap-3 items-start opacity-50">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-500">2</div>
                                        <div className="h-2 w-1/2 bg-slate-200 rounded mt-2"></div>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <div className="w-6 h-6 rounded-full bg-amber-500 flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                        <div className="flex-1 p-3 bg-white rounded-xl shadow-sm border border-slate-200">
                                            <div className="h-2 w-full bg-slate-900 rounded-full mb-2 opacity-10"></div>
                                            <div className="h-2 w-2/3 bg-slate-900 rounded-full opacity-10"></div>
                                            <div className="mt-2 flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-amber-600 uppercase">{t.features.readyToPost}</span>
                                                <Send className="w-3 h-3 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Redesigned Comparison Section */}
            <section className="py-32 bg-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">{t.comparison.title}</h2>
                        <p className="text-slate-500 text-xl">{t.comparison.subtitle}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch relative">

                        {/* Floating VS Badge */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-xl border-4 border-slate-50 font-black text-slate-900 text-lg">
                            VS
                        </div>

                        {/* Generic AI Card */}
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 lg:p-10 flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                            <div className="mb-8 relative z-10">
                                <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 mb-6 shadow-sm">
                                    <Bot className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-700 mb-2">{t.comparison.genericHeader}</h3>
                                <p className="text-slate-500">{t.comparison.genericSub}</p>
                            </div>

                            {/* Visual Abstract: Bad Post */}
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-8 relative">
                                {/* User Header */}
                                <div className="flex items-center gap-3 mb-3 opacity-50">
                                    <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                                    <div className="h-2 w-20 bg-slate-200 rounded"></div>
                                </div>
                                {/* Wall of Text */}
                                <p className="text-xs text-slate-500 leading-relaxed text-justify line-clamp-6">
                                    {mockContent.badPost}
                                </p>
                                {/* Badge Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-[1px]">
                                    <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100 text-xs font-bold flex items-center gap-1.5 shadow-sm transform -rotate-6">
                                        <XIcon className="w-3.5 h-3.5" />
                                        {t.comparison.genericVisualLabel}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto space-y-4">
                                <div className="flex items-start gap-3 text-slate-500">
                                    <XIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="block font-bold text-slate-700 text-sm">{t.features.roboticTone}</span>
                                        <span className="text-xs">{t.comparison.toneBad}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 text-slate-500">
                                    <XIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="block font-bold text-slate-700 text-sm">{t.features.zeroStructure}</span>
                                        <span className="text-xs">{t.comparison.hookBad}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 text-slate-500">
                                    <XIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="block font-bold text-slate-700 text-sm">{t.features.hardToPrompt}</span>
                                        <span className="text-xs">{t.comparison.promptBad}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kolink Card - UPDATED: White background with gradient glow instead of dark theme */}
                        <div className="bg-white border border-brand-100 rounded-3xl p-8 lg:p-10 flex flex-col relative overflow-hidden shadow-2xl shadow-brand-900/10 group ring-4 ring-brand-50">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-100/50 to-indigo-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                            <div className="mb-8 relative z-10">
                                {/* Updated Bubble Color - Lighter Style */}
                                <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
                                    <Sparkles className="w-7 h-7 fill-current" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.comparison.kolinkHeader}</h3>
                                <p className="text-slate-500">{t.comparison.kolinkSub}</p>
                            </div>

                            {/* Visual Abstract: Structured Post (Sneak Peek) */}
                            <div className="bg-white rounded-xl border border-indigo-50 p-5 mb-8 shadow-xl shadow-indigo-100/50 relative overflow-hidden group-hover:-translate-y-1 transition-transform duration-500">
                                {/* Decoration */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-brand-50 to-transparent rounded-bl-full pointer-events-none"></div>

                                {/* User Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <img src="https://picsum.photos/seed/alex/100/100" alt="User" className="w-8 h-8 rounded-full border border-indigo-100" />
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-bold text-slate-900">Alex Rivera</span>
                                                <div className="w-3 h-3 bg-brand-500 rounded-full flex items-center justify-center">
                                                    <Check className="w-2 h-2 text-white stroke-[3]" />
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-slate-400">1h • 🌐</div>
                                        </div>
                                    </div>
                                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                </div>

                                {/* Structured Content */}
                                <div className="space-y-3">
                                    <p className="text-sm font-bold text-slate-900 leading-snug">
                                        {mockContent.goodPostHook}
                                    </p>
                                    <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                                        {mockContent.goodPostBody}
                                    </div>

                                    {/* Visual List */}
                                    <div className="space-y-1.5 mt-2 pl-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                                            <span className="text-green-500">✅</span> Systematize output
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                                            <span className="text-green-500">✅</span> Leverage psychology
                                        </div>
                                    </div>
                                </div>

                                {/* Engagement Fake Stats */}
                                <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between text-[10px] text-slate-400 font-medium">
                                    <div className="flex items-center gap-1">
                                        <div className="flex -space-x-1">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                                            <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                                        </div>
                                        <span>1,420 likes</span>
                                    </div>
                                    <span>84 comments</span>
                                </div>

                                {/* Floating Success Badge */}
                                <div className="absolute bottom-16 right-4 bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100 text-[10px] font-bold flex items-center gap-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 translate-y-2 group-hover:translate-y-0 transform">
                                    <TrendingUp className="w-3 h-3" /> Viral
                                </div>
                            </div>

                            <div className="mt-auto space-y-4 relative z-10">
                                <div className="flex items-start gap-3">
                                    <div className="p-0.5 bg-brand-100 rounded-full text-brand-600 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-slate-900 text-sm">Human & Viral</span>
                                        <span className="text-xs text-slate-500">{t.comparison.toneGood}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-0.5 bg-brand-100 rounded-full text-brand-600 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-slate-900 text-sm">Psychological Hooks</span>
                                        <span className="text-xs text-slate-500">{t.comparison.hookGood}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-0.5 bg-brand-100 rounded-full text-brand-600 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-slate-900 text-sm">Zero Learning Curve</span>
                                        <span className="text-xs text-slate-500">{t.comparison.promptGood}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section Removed */}

            {/* NEW: Cost of Inaction / ROI Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">{t.roi.title}</h2>
                        <p className="text-slate-500 text-lg">{t.roi.subtitle}</p>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-2 border border-slate-200 shadow-xl">
                        <div className="bg-white rounded-[1.2rem] overflow-hidden">
                            {/* Expensive Items List */}
                            <div className="divide-y divide-slate-100">
                                <div className="p-5 md:p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                                            <PenLine className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{t.roi.item1Title}</h4>
                                            <p className="text-xs text-slate-500">{t.roi.item1Desc}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-slate-900">{t.roi.item1Price}</span>
                                </div>

                                <div className="p-5 md:p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{t.roi.item2Title}</h4>
                                            <p className="text-xs text-slate-500">{t.roi.item2Desc}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-slate-900">{t.roi.item2Price}</span>
                                </div>

                                <div className="p-5 md:p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-100 rounded-xl text-green-600">
                                            <LineChart className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{t.roi.item3Title}</h4>
                                            <p className="text-xs text-slate-500">{t.roi.item3Desc}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-slate-900">{t.roi.item3Price}</span>
                                </div>

                                <div className="p-5 md:p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{t.roi.item4Title}</h4>
                                            <p className="text-xs text-slate-500">{t.roi.item4Desc}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-slate-900">{t.roi.item4Price}</span>
                                </div>
                            </div>

                            {/* Total Row */}
                            <div className="bg-red-50 p-6 flex items-center justify-between border-t border-red-100">
                                <div className="flex items-center gap-3 text-red-700 font-bold">
                                    <XIcon className="w-5 h-5" />
                                    {t.roi.totalLabel}
                                </div>
                                <span className="text-xl font-bold text-red-600 line-through decoration-red-400 decoration-2">{t.roi.totalPrice}</span>
                            </div>
                        </div>

                        {/* Kolink Offer */}
                        <div className="mt-2 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10 text-center">
                                <p className="text-brand-100 font-medium mb-3">{t.roi.kolinkLabel}</p>
                                <div className="flex items-center justify-center gap-4 mb-6">
                                    <h3 className="text-2xl md:text-3xl font-display font-bold">{t.roi.kolinkPlan}</h3>
                                    <span className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">{t.roi.kolinkPrice}</span>
                                </div>
                                <Link to="/login" className="inline-block px-8 py-3 bg-white text-brand-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm">
                                    {t.pricing.getStarted}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 bg-white border-t border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">{t.pricing.title}</h2>
                        <p className="text-slate-500 text-xl">{t.pricing.subtitle}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative rounded-3xl p-8 border flex flex-col h-full transition-all duration-300
                        ${plan.highlight
                                        ? 'bg-brand-700 text-white border-brand-600 shadow-2xl scale-110 z-10 py-12 ring-4 ring-brand-500/20'
                                        : 'bg-white text-slate-900 border-slate-200 hover:border-brand-300 hover:shadow-xl'
                                    }`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-indigo-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg shadow-brand-500/30 uppercase tracking-wider flex items-center gap-1.5">
                                        <Star className="w-4 h-4 fill-current" /> {t.pricing.mostPopular}
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                                    <p className={`text-sm ${plan.highlight ? 'text-brand-100' : 'text-slate-500'}`}>{plan.description}</p>
                                </div>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-5xl font-display font-bold tracking-tight">€{plan.price}</span>
                                    <span className={`text-lg font-medium ${plan.highlight ? 'text-brand-200' : 'text-slate-400'}`}>/mo</span>
                                </div>
                                <div className="space-y-5 mb-10 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className={`mt-1 p-0.5 rounded-full flex-shrink-0 ${plan.highlight ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600'}`}>
                                                <Check className="w-3 h-3 stroke-[4]" />
                                            </div>
                                            <span className={`text-base ${plan.highlight ? 'text-white' : 'text-slate-600'}`}>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    to="/login"
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 block text-center
                            ${plan.highlight
                                            ? 'bg-white text-brand-700 hover:bg-brand-50 shadow-lg hover:-translate-y-1'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-900 hover:-translate-y-1'
                                        }`}
                                >
                                    {plan.price === 0 ? t.pricing.startFree : t.pricing.getStarted}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-32 bg-slate-50 border-t border-slate-200">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-display font-bold text-slate-900 mb-12 text-center">{t.faq.title}</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-brand-300 hover:shadow-md">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-bold text-lg text-slate-900">{faq.q}</span>
                                    {openFaq === index
                                        ? <ChevronUp className="w-5 h-5 text-brand-600" />
                                        : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="p-6 pt-0 text-slate-500 leading-relaxed text-lg">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden px-6">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900 to-indigo-950"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.3),transparent_60%)]"></div>
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.3),transparent_60%)]"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 tracking-tight">
                        {t.cta.title}
                    </h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                        {t.cta.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/login" className="px-10 py-5 bg-white text-slate-900 font-bold rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300 text-lg flex items-center justify-center gap-2">
                            {t.cta.button}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <p className="mt-8 text-sm text-slate-500 flex items-center justify-center gap-2 opacity-80">
                        <Shield className="w-4 h-4" />
                        {t.cta.disclaimer}
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 py-16 border-t border-slate-200 text-sm text-slate-500">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900">
                            <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm shadow-md">K</div>
                            Kolink
                        </div>
                        <p className="max-w-xs text-center md:text-left">
                            Architecting viral moments for the world's most ambitious creators.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12 font-medium">
                        <a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-brand-600 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-brand-600 transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-brand-600 transition-colors">Contact</a>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200 text-center md:text-left">
                    <p>© 2024 Kolink Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;