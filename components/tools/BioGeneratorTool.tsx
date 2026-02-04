import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Copy, RefreshCw, ChevronRight, UserCheck, Briefcase, Target, User, CheckCircle2, MapPin, Building2, ExternalLink, AlertCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';
import { publicToolsService } from '@/services/publicToolsService';

const BioGeneratorTool = () => {
    const { language } = useUser();
    const t = translations[language]?.toolsPage || translations['en'].toolsPage;

    const [role, setRole] = useState('');
    const [niche, setNiche] = useState('');
    const [keywords, setKeywords] = useState('');
    const [style, setStyle] = useState('Professional'); // Professional, Creative, Minimalist
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedBios, setGeneratedBios] = useState<string[]>([]);
    const [selectedBio, setSelectedBio] = useState<string | null>(null);
    const [usageInfo, setUsageInfo] = useState<{ currentCount: number; limit: number; resetAt: string } | null>(null);
    const [showLimitModal, setShowLimitModal] = useState(false);

    const handleGenerate = async () => {
        if (!role.trim()) {
            toast.error(language === 'es' ? "¡Ingresa un rol!" : "Please enter a Role!");
            return;
        }

        setIsGenerating(true);
        setGeneratedBios([]);
        setSelectedBio(null);

        try {
            const result = await publicToolsService.generateBio({
                currentBio: role || undefined, // Using role as primary input for bio generation
                role: role || undefined,
                expertise: niche || keywords || undefined
            });

            setGeneratedBios(result.bios);
            if (result.bios.length > 0) setSelectedBio(result.bios[0]);
            setUsageInfo(result.usageInfo);

            toast.success(language === 'es' ? "¡Bios generadas!" : "Bios generated!");
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
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
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
                    Kolink<span className="text-blue-600">.</span>
                </Link>
                <div className="flex items-center gap-4">
                     <Link to="/login" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                        {t.common.tryPro}
                    </Link>
                </div>
            </nav>

             {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                 <Link to="/" className="hover:text-blue-600 transition-colors">{t.common.home}</Link>
                 <ChevronRight size={10} strokeWidth={3} />
                 <Link to="/tools" className="hover:text-blue-600 transition-colors">{t.common.tools}</Link>
                 <ChevronRight size={10} strokeWidth={3} />
                 <span className="text-slate-900">{t.bioGenerator.title}</span>
            </div>

            {/* Hero */}
            <header className="pt-8 pb-16 text-center px-6 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent opacity-50" />
                 <div className="relative z-10 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-blue-100 text-blue-700 rounded-full text-[11px] font-black uppercase tracking-widest mb-8 shadow-sm">
                            <UserCheck size={12} fill="currentColor" />
                            {t.bioGenerator.label}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 mb-6 tracking-tight leading-[1.05]">
                            {t.bioGenerator.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t.bioGenerator.titleHighlight}</span>
                        </h1>
                         <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
                            {t.bioGenerator.subtitle}
                        </p>
                    </motion.div>
                 </div>
            </header>

            {/* Tool Area */}
            <section className="max-w-7xl mx-auto px-6 pb-24 -mt-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    
                    {/* Inputs */}
                    <div className="w-full lg:w-1/3 space-y-4">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-white">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-sm">
                                <Sparkles size={16} className="text-blue-500"/>
                                Generator Config
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                        <Briefcase size={12} /> {t.bioGenerator.roleLabel}
                                    </label>
                                    <input
                                        type="text"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        placeholder="e.g. Product Designer"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-bold text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                        <Target size={12} /> {t.bioGenerator.nicheLabel}
                                    </label>
                                    <input
                                        type="text"
                                        value={niche}
                                        onChange={(e) => setNiche(e.target.value)}
                                        placeholder="e.g. SaaS Startups"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-bold text-sm transition-all"
                                    />
                                </div>
                                <div>
                                     <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                        <Sparkles size={12} /> {t.bioGenerator.keywordsLabel}
                                    </label>
                                    <input
                                        type="text"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        placeholder="e.g. UX, Figma, Growth"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-bold text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">
                                        {t.bioGenerator.styleLabel}
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Professional', 'Creative', 'Minimalist'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setStyle(s)}
                                                className={`px-2 py-3 rounded-xl text-[10px] font-bold border transition-all uppercase tracking-wider ${style === s ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button 
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 disabled:opacity-70 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    {isGenerating ? <RefreshCw className="animate-spin w-5 h-5" /> : <Sparkles size={20} />}
                                    {isGenerating ? t.bioGenerator.generating : t.bioGenerator.button}
                                </button>
                                
                                {usageInfo && (
                                    <div className="flex items-center justify-center gap-2 mt-4 bg-slate-50 py-2 px-4 rounded-xl border border-slate-100">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Límite:
                                        </span>
                                        <div className="flex gap-1">
                                            {[...Array(usageInfo.limit)].map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`w-1.5 h-1.5 rounded-full ${i < usageInfo.currentCount ? 'bg-blue-500 shadow-[0_0_5px_rgba(37,99,235,0.3)]' : 'bg-slate-200'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 ml-1">
                                            {usageInfo.limit - usageInfo.currentCount} libres
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        {/* Live Preview Card */}
                         <AnimatePresence mode='wait'>
                             <motion.div 
                                layout
                                className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden relative"
                            >
                                {/* Banner */}
                                <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-300 relative overflow-hidden">
                                     <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                                </div>
                                <div className="px-8 pb-8 relative z-10">
                                    {/* Avatar */}
                                    <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 -mt-16 mb-4 shadow-sm overflow-hidden flex items-center justify-center text-4xl">
                                        Using specific image...
                                        <img 
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role || 'User'}`} 
                                            alt="Avatar" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    
                                    {/* Name & Badge */}
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                                {role || 'Your Name'} <CheckCircle2 size={18} className="text-blue-500 fill-blue-50" />
                                            </h2>
                                            <p className="text-sm text-slate-500 font-medium">Talks about #marketing, #growth, and #startups</p>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="flex gap-2 text-sm text-slate-500 font-bold items-center">
                                                <Building2 size={14} /> 
                                                <span>Acme Inc.</span>
                                                <span className="text-slate-300">•</span>
                                                <ExternalLink size={14} />
                                                <span>Website</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* The Dynamic Bio (Highlight) */}
                                    <motion.div 
                                        key={selectedBio}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-lg md:text-xl text-slate-900 leading-snug font-medium mb-4 min-h-[3.5rem]"
                                    >
                                        {selectedBio || (language === 'es' ? "Tu titular optimizado aparecerá aquí..." : "Your optimized headline will appear here...")}
                                    </motion.div>

                                    <div className="flex items-center gap-2 text-sm text-slate-400 font-bold">
                                        <MapPin size={14} /> New York, USA 
                                        <span className="text-blue-600 ml-2 cursor-pointer hover:underline">Contact Info</span>
                                    </div>
                                    
                                    <div className="mt-6 flex gap-3">
                                        <button className="px-6 py-1.5 bg-blue-600 text-white rounded-full font-bold text-sm shadow-lg shadow-blue-500/30">Connect</button>
                                        <button className="px-6 py-1.5 bg-white border border-slate-300 text-slate-600 rounded-full font-bold text-sm hover:bg-slate-50">Message</button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Selection List */}
                        {generatedBios.length > 0 && (
                            <div className="grid gap-3">
                                {generatedBios.map((bio, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => setSelectedBio(bio)}
                                        className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                                            selectedBio === bio 
                                            ? 'bg-blue-50/50 border-blue-500 shadow-sm' 
                                            : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex gap-4 items-center">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                selectedBio === bio ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <p className={`text-sm font-medium ${selectedBio === bio ? 'text-blue-900' : 'text-slate-600'}`}>
                                                {bio}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigator.clipboard.writeText(bio);
                                                toast.success(t.common.copyToast);
                                            }}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

             {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-12 text-center">
                <div className="max-w-7xl mx-auto px-6">
                     <p className="text-slate-400 text-xs uppercase tracking-widest hover:text-blue-600 transition-colors cursor-pointer">
                        {t.common.footer}
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
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-500/10">
                                <Zap size={32} fill="currentColor" />
                            </div>
                            
                            <h2 className="text-3xl font-black text-slate-900 text-center mb-4 tracking-tight leading-tight">
                                {language === 'es' ? '¡Límite Alcanzado!' : 'Limit Reached!'}
                            </h2>
                            
                            <p className="text-slate-600 text-center mb-8 font-medium leading-relaxed">
                                {language === 'es' 
                                    ? 'Has agotado tus 3 generaciones de Bio gratuitas por hoy. ¡Únete a Kolink Pro para acceso ilimitado!' 
                                    : 'You have used your 3 free Bio generations for today. Join Kolink Pro for unlimited access!'}
                            </p>
                            
                            <div className="space-y-3">
                                <Link 
                                    to="/login" 
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                                >
                                    {language === 'es' ? 'Empezar Gratis' : 'Get Started Free'}
                                    <ArrowRight size={20} />
                                </Link>
                                <button 
                                    onClick={() => setShowLimitModal(false)}
                                    className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl font-bold transition-all flex items-center justify-center text-sm"
                                >
                                    {language === 'es' ? 'Cerrar' : 'Close'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BioGeneratorTool;
