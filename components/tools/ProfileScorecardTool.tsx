import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, ChevronRight, Zap, Target, TrendingUp, Lock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';

import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';

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

            // Attempt AI analysis
            const prompt = `
                Audit this LinkedIn Profile Section:
                HEADLINE: "${headline}"
                ABOUT SUMMARY: "${about}"

                Task: Provide a "Viral Authority Score" (0-100) and 3 specific, brutal improvements.
                Return purely JSON: { "score": number, "diagnosis": "string", "tips": ["string", "string", "string"] }
                
                ${langInstruction}
            `;
            
            const { data, error } = await supabase.functions.invoke('generate-viral-post', {
                body: {
                    params: {
                        topic: "Profile Audit", // Dummy topic to pass schema
                        instructions: prompt,
                        mode: 'generate', // Uses the standard generation path
                        response_format: 'json_object' // Hint for JSON
                    }
                }
            });

            if (error) throw error;
            
            // Try to parse the AI result
            let parsedResult;
            try {
                const content = data?.data?.postContent || data?.postContent; 
                parsedResult = JSON.parse(content);
            } catch (e) {
                // If AI didn't return strict JSON, force a structure
                console.warn("AI didn't return JSON, using fallback parsing or simulation");
            }

            if (parsedResult?.score) {
                 setResult({
                    score: parsedResult.score,
                    diagnosis: parsedResult.diagnosis || (language === 'es' ? "Perfil con potencial pero falta posicionamiento." : "Profile shows potential but lacks clear positioning."),
                    tips: parsedResult.tips || (language === 'es' ? ["Enfócate en beneficios", "Añade prueba social", "Clarifica tu nicho"] : ["Focus on benefits not features", "Add social proof", "Clarify your niche"])
                 });
            } else {
                 throw new Error("Invalid AI format");
            }
            
            toast.success(language === 'es' ? "¡Auditoría Completa!" : "Audit Complete!");

        } catch (err) {
            console.warn("AI Failed, running local simulation", err);
            // Local Simulation Fallback (for guests/unauth)
            // Score based on length and keywords availability
            let simScore = 40;
            const tips = [];
            
            if (headline.length > 50) simScore += 10;
            if (headline.includes("|") || headline.includes("helps") || headline.includes("ayuda")) simScore += 10;
            if (about.length > 100) simScore += 10;
            
            // Diagnosis Logic
            let diagnosis = language === 'es' ? "Tu perfil es funcional pero invisible." : "Your profile is functional but invisible.";
            if (simScore > 60) diagnosis = language === 'es' ? "Tienes una base sólida, pero estás perdiendo oportunidades." : "You have a solid foundation, but you're leaving money on the table.";
            
            // Tips Logic
            tips.push(language === 'es' ? "Tu titular necesita una propuesta de valor más clara. ¿A quién ayudas?" : "Your headline needs a clearer value proposition. Who do you help?");
            if (about.length < 50) tips.push(language === 'es' ? "Tu sección 'Acerca de' es muy corta. Cuenta tu historia." : "Your 'About' section is too short. Tell your story.");
            tips.push(language === 'es' ? "Añade números/métricas concretas para probar tu autoridad." : "Add concrete numbers/metrics to prove your authority.");

            // Artificial Delay
            setTimeout(() => {
                 setResult({
                    score: simScore,
                    diagnosis,
                    tips
                 });
                 toast.success(language === 'es' ? "Auditoría Preliminar Completa" : "Preliminary Audit Complete");
            }, 1000);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const seoTitle = t.profileScorecard.seoTitle;
    const seoDesc = t.profileScorecard.seoDesc;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDesc} />
            </Helmet>

             {/* Nav */}
            <nav className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tighter">
                    Kolink<span className="text-brand-600">.</span>
                </Link>
                <div className="flex items-center gap-4">
                     <Link to="/login" className="px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-all">
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
                <span className="text-slate-600">{t.profileScorecard.title} {t.profileScorecard.titleHighlight}</span>
            </div>

            {/* Hero */}
            <header className="pt-12 pb-16 text-center px-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                    <Scan size={12} />
                    {t.profileScorecard.label}
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-6 tracking-tight">
                    {t.profileScorecard.title} <span className="text-amber-500">{t.profileScorecard.titleHighlight}</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    {t.profileScorecard.subtitle}
                </p>
            </header>

            <main className="max-w-4xl mx-auto px-6 pb-20 -mt-6">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    
                    {/* Input Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative z-10">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">{t.profileScorecard.headlineLabel}</label>
                                <textarea
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    placeholder={t.profileScorecard.headlinePlaceholder}
                                    className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-sm font-medium"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">{t.profileScorecard.aboutLabel}</label>
                                <textarea
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    placeholder={t.profileScorecard.aboutPlaceholder}
                                    className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-sm"
                                />
                            </div>

                            <button
                                onClick={handleAudit}
                                disabled={isAnalyzing}
                                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isAnalyzing ? <Scan className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5" />}
                                {isAnalyzing ? t.profileScorecard.analyzing : t.profileScorecard.button}
                            </button>
                        </div>
                    </div>

                    {/* Result Card */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden min-h-[400px] flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none" />
                        
                        <AnimatePresence mode="wait">
                            {!result ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center relative z-10"
                                >
                                    <Target className="w-16 h-16 mx-auto mb-6 text-slate-700" />
                                    <h3 className="text-xl font-bold mb-2">{t.profileScorecard.emptyTitle}</h3>
                                    <p className="text-slate-400 text-sm">{t.profileScorecard.emptyDesc}</p>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative z-10 w-full"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.profileScorecard.scoreLabel}</div>
                                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                            result.score > 70 ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                                        }`}>{result.score > 70 ? t.profileScorecard.good : t.profileScorecard.needsWork}</div>
                                    </div>
                                    
                                    <div className="text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                        {result.score}/100
                                    </div>

                                    <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/5 backdrop-blur-sm">
                                        <h4 className="font-bold mb-2 flex items-center gap-2 text-amber-400">
                                            <AlertTriangle size={16} /> {t.profileScorecard.diagnosisLabel}
                                        </h4>
                                        <p className="text-sm text-slate-200 leading-relaxed">
                                            {result.diagnosis}
                                        </p>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {result.tips.map((tip, i) => (
                                            <div key={i} className="flex gap-3 text-xs text-slate-300">
                                                <CheckCircle2 size={14} className="text-green-400 shrink-0 mt-0.5" />
                                                {tip}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Upsell */}
                                    <Link to="/login" className="block w-full py-4 text-center bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                                        {t.profileScorecard.cta} <ArrowRight size={16} className="inline ml-1" />
                                    </Link>
                                    <p className="text-[10px] text-center mt-3 text-slate-500">
                                        {t.profileScorecard.ctaSub}
                                    </p>
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
