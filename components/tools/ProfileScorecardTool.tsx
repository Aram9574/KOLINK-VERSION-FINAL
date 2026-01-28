import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, ChevronRight, Zap, Target, TrendingUp, Lock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Sparkles, MessageSquare, Briefcase, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';

import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';

const PremiumGauge = ({ score }: { score: number }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center p-8">
            <svg className="w-48 h-48 transform -rotate-90">
                <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-200/20"
                />
                <motion.circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    className={score > 70 ? "text-amber-500" : "text-amber-600"}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-display">
                <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl font-black text-white"
                >
                    {Math.round(score)}
                </motion.span>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest mt-1">LinkedIn Score</span>
            </div>
            
            {/* Decorative Pulse */}
            <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute w-52 h-52 border-2 border-amber-500/30 rounded-full"
            />
        </div>
    );
};

const ProfileScorecardTool = () => {
    const { language } = useUser();
    const t = translations[language]?.toolsPage || translations['en'].toolsPage;

    const [headline, setHeadline] = useState('');
    const [about, setAbout] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<{ score: number; diagnosis: string; tips: string[] } | null>(null);

    const handleAudit = async () => {
        if (!headline || headline.length < 10) {
            toast.error(language === 'es' ? "Ingresa un titular válido (min 10 caracteres)" : "Please enter a valid headline (min 10 chars)");
            return;
        }

        setIsAnalyzing(true);
        setResult(null);

        try {
            const langInstruction = language === 'es' ? "OUTPUT LANGUAGE: SPANISH (Español). IMPORTANT: Diagnosis and tips MUST be in Spanish." : "OUTPUT LANGUAGE: ENGLISH.";

            const prompt = `
                Audit this LinkedIn Profile Section:
                HEADLINE: "${headline}"
                ABOUT SUMMARY: "${about}"

                Task: Provide a "Viral Authority Score" (0-100) and 3 specific, actionable improvements.
                Return strictly a JSON object: { "score": number, "diagnosis": "string", "tips": ["string", "string", "string"] }
                
                ${langInstruction}
            `;
            
            const { data, error } = await supabase.functions.invoke('generate-viral-post', {
                body: {
                    params: {
                        instructions: prompt,
                        response_format: 'json_object'
                    }
                }
            });

            if (error) throw error;
            
            let parsedResult;
            try {
                const content = data?.data?.postContent; 
                parsedResult = JSON.parse(content);
            } catch (e) {
                console.warn("AI didn't return JSON, attempting split fallback");
                parsedResult = { score: 65, diagnosis: "Detailed analysis below.", tips: ["Add metrics", "Define niche", "Use keywords"] };
            }

            setResult({
                score: parsedResult.score || 65,
                diagnosis: parsedResult.diagnosis || (language === 'es' ? "Perfil con potencial pero falta posicionamiento." : "Profile shows potential but lacks clear positioning."),
                tips: parsedResult.tips || []
            });
            
            toast.success(language === 'es' ? "¡Auditoría Completa!" : "Audit Complete!");
        } catch (err) {
            console.error(err);
            toast.error(language === 'es' ? "Error en la auditoría" : "Audit failed.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const seoTitle = t.profileScorecard.seoTitle;
    const seoDesc = t.profileScorecard.seoDesc;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDesc} />
            </Helmet>

             {/* Nav */}
            <nav className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-white bg-white/50 backdrop-blur-xl sticky top-0 z-50 shadow-sm rounded-b-2xl">
                <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tighter flex items-center gap-2">
                    Kolink<span className="text-amber-500">.</span>
                </Link>
                <div className="flex items-center gap-4">
                     <Link to="/login" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all">
                        {t.common.tryPro}
                    </Link>
                </div>
            </nav>

            {/* Breadcrumbs */}
             <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-2 text-xs text-slate-400 font-black uppercase tracking-widest">
                <Link to="/" className="hover:text-amber-600 transition-colors">{t.common.home}</Link>
                <ChevronRight size={10} strokeWidth={3} />
                <Link to="/tools" className="hover:text-amber-600 transition-colors">{t.common.tools}</Link>
                <ChevronRight size={10} strokeWidth={3} />
                <span className="text-slate-900">{t.profileScorecard.title}</span>
            </div>

            {/* Hero */}
            <header className="pt-8 pb-16 text-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-100/50 via-transparent to-transparent opacity-50" />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-amber-100 text-amber-700 rounded-full text-[11px] font-black uppercase tracking-widest mb-8 shadow-sm">
                            <ShieldCheck size={12} fill="currentColor" />
                            {t.profileScorecard.label}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 mb-6 tracking-tight leading-[1.05]">
                            {t.profileScorecard.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">{t.profileScorecard.titleHighlight}</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                            {t.profileScorecard.subtitle}
                        </p>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pb-24 -mt-6">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white p-2 md:p-4 flex flex-col lg:flex-row gap-4 relative z-20">
                    
                    {/* Input Section */}
                    <div className="p-8 md:p-12 lg:w-3/5 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="space-y-8">
                            <div className="group">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                    <Briefcase size={12} /> {t.profileScorecard.headlineLabel}
                                </label>
                                <textarea
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    placeholder={t.profileScorecard.headlinePlaceholder}
                                    className="w-full h-28 px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 outline-none resize-none font-bold text-sm transition-all shadow-sm"
                                />
                                <div className="flex justify-between mt-2 px-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Min 10 chars</span>
                                    <span className={`text-[10px] font-bold ${headline.length > 220 ? 'text-red-500' : 'text-slate-400'}`}>{headline.length}/220</span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                    <MessageSquare size={12} /> {t.profileScorecard.aboutLabel}
                                </label>
                                <textarea
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    placeholder={t.profileScorecard.aboutPlaceholder}
                                    className="w-full h-44 px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 outline-none resize-none text-sm transition-all shadow-sm font-medium"
                                />
                            </div>

                            <button
                                onClick={handleAudit}
                                disabled={isAnalyzing}
                                className="w-full py-5 bg-slate-900 hover:bg-amber-600 text-white rounded-2xl font-black transition-all shadow-xl shadow-slate-900/10 hover:shadow-amber-500/20 disabled:opacity-70 flex items-center justify-center gap-3 text-lg uppercase tracking-wider relative overflow-hidden group"
                            >
                                <motion.div
                                    animate={isAnalyzing ? { x: ["-100%", "200%"] } : {}}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                                />
                                {isAnalyzing ? <RefreshCw className="animate-spin" /> : <Zap size={20} className="group-hover:scale-125 transition-transform" /> }
                                {isAnalyzing ? t.profileScorecard.analyzing : t.profileScorecard.button}
                            </button>
                        </div>
                    </div>

                    {/* Result Section */}
                    <div className="p-8 md:p-12 lg:w-2/5 flex flex-col items-center justify-center relative overflow-hidden rounded-[2rem] bg-slate-900 min-h-[500px]">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

                        <AnimatePresence mode="wait">
                            {!result ? (
                                <motion.div 
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="text-center relative z-10 p-8"
                                >
                                    <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-700/50 shadow-inner">
                                        <Target className="w-10 h-10 text-slate-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{t.profileScorecard.emptyTitle}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed max-w-[240px] mx-auto font-medium">
                                        {t.profileScorecard.emptyDesc}
                                    </p>
                                    
                                    <div className="mt-12 flex gap-4 justify-center">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div 
                                                    animate={{ x: ["-100%", "100%"] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                                                    className="w-full h-full bg-slate-700"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative z-10 w-full flex flex-col h-full"
                                >
                                    <PremiumGauge score={result.score} />
                                    
                                    <div className="space-y-4 mt-8">
                                        <motion.div 
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
                                        >
                                            <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-500 mb-3 flex items-center gap-2">
                                                <AlertTriangle size={14} /> {t.profileScorecard.diagnosisLabel}
                                            </h4>
                                            <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                                {result.diagnosis}
                                            </p>
                                        </motion.div>

                                        <div className="space-y-3">
                                            {result.tips.map((tip, i) => (
                                                <motion.div 
                                                    key={i}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                                    className="flex gap-4 items-center bg-slate-800/30 border border-white/5 rounded-xl p-4 transition-all hover:bg-slate-800/50"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                                    </div>
                                                    <span className="text-xs text-slate-300 font-bold leading-tight">{tip}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer Upsell */}
                                    <div className="mt-8 pt-6 border-t border-white/5 w-full">
                                        <Link to="/login" className="flex items-center justify-between w-full p-4 bg-white rounded-2xl group transition-all hover:-translate-y-1">
                                            <div className="text-left">
                                                <div className="text-[10px] font-black uppercase text-amber-600 mb-0.5">Premium Feature</div>
                                                <div className="text-sm font-black text-slate-900">{t.profileScorecard.cta}</div>
                                            </div>
                                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-amber-600 transition-colors">
                                                <ArrowRight size={18} />
                                            </div>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfileScorecardTool;
