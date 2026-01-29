import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, ChevronRight, Zap, Target, TrendingUp, Lock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Sparkles, MessageSquare, Briefcase, RefreshCw, CalendarDays, Clock, Info, Share2, CheckCircle } from 'lucide-react';

// Industry Data with Heatmap Scores (0-100)
type HeatmapData = Record<string, number[]>;

import { useUser } from '../../context/UserContext';
import { translations } from '../../translations';

const INDUSTRY_KEYS = ["tech", "marketing", "realEstate", "finance", "healthcare", "education", "general"];

const INDUSTRY_PATTERNS: Record<string, HeatmapData> = {
    "tech": {
        "Mon": [60, 85, 70, 65, 50], "Tue": [80, 95, 85, 75, 60], "Wed": [85, 90, 80, 70, 55], "Thu": [80, 95, 85, 80, 65], "Fri": [70, 65, 50, 40, 30], "Sat": [20, 30, 25, 20, 10], "Sun": [10, 20, 30, 40, 50]
    },
    "marketing": {
        "Mon": [70, 90, 80, 70, 60], "Tue": [85, 95, 90, 80, 65], "Wed": [85, 95, 90, 80, 65], "Thu": [85, 95, 90, 80, 65], "Fri": [75, 70, 60, 50, 40], "Sat": [30, 40, 30, 20, 10], "Sun": [20, 40, 50, 60, 70]
    },
    "general": {
        "Mon": [70, 80, 60, 50, 40], "Tue": [80, 90, 70, 60, 50], "Wed": [80, 90, 70, 60, 50], "Thu": [80, 90, 70, 60, 50], "Fri": [70, 60, 50, 40, 30], "Sat": [30, 40, 30, 20, 10], "Sun": [20, 30, 40, 50, 60]
    }
};

const TIME_SLOTS_KEYS = ["8am - 10am", "10am - 12pm", "12pm - 2pm", "2pm - 5pm", "5pm - 8pm"];
const KEYS_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const BestTimeCalculatorTool = () => {
    const { language } = useUser();
    const t = translations[language]?.toolsPage || translations['en'].toolsPage;

    const DAYS = KEYS_DAYS.map(key => t.bestTime?.days?.[key] || key);
    const TIME_SLOTS = TIME_SLOTS_KEYS.map(key => t.bestTime?.timeSlots?.[key] || key);

    const [industryKey, setIndustryKey] = useState<string>("tech");
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<HeatmapData | null>(null);

    const handleCalculate = () => {
        setIsCalculating(true);
        setTimeout(() => {
            const pattern = INDUSTRY_PATTERNS[industryKey] || INDUSTRY_PATTERNS["general"];
            const randomizedPattern: HeatmapData = {};
            Object.keys(pattern).forEach(day => {
                randomizedPattern[day] = pattern[day].map(score => Math.min(100, Math.max(0, score + (Math.random() * 8 - 4))));
            });
            setResult(randomizedPattern);
            setIsCalculating(false);
        }, 1200);
    };

    const getHeatmapColor = (score: number) => {
        if (score >= 90) return "bg-indigo-600 shadow-lg shadow-indigo-600/20 border-white/20";
        if (score >= 75) return "bg-indigo-500 border-white/10";
        if (score >= 60) return "bg-indigo-400 border-white/5";
        if (score >= 40) return "bg-indigo-300 border-white/5";
        if (score >= 20) return "bg-indigo-200 border-white/5";
        return "bg-slate-100 border-transparent";
    };

    const seoTitle = t.bestTime.seoTitle;
    const seoDesc = t.bestTime.seoDesc;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDesc} />
            </Helmet>

            {/* Nav */}
            <nav className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-white bg-white/50 backdrop-blur-xl sticky top-0 z-50 shadow-sm rounded-b-2xl">
                <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tighter flex items-center gap-2">
                    Kolink<span className="text-indigo-600">.</span>
                </Link>
                <div className="flex items-center gap-4">
                     <Link to="/login" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
                        {t.common.tryPro}
                    </Link>
                </div>
            </nav>

            {/* Breadcrumbs */}
             <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-2 text-xs text-slate-400 font-black uppercase tracking-widest">
                <Link to="/" className="hover:text-indigo-600 transition-colors">{t.common.home}</Link>
                <ChevronRight size={10} strokeWidth={3} />
                <Link to="/tools" className="hover:text-indigo-600 transition-colors">{t.common.tools}</Link>
                <ChevronRight size={10} strokeWidth={3} />
                <span className="text-slate-900">{t.bestTime.title}</span>
            </div>

            {/* Hero */}
            <header className="pt-8 pb-16 text-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-transparent opacity-50" />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-indigo-100 text-indigo-700 rounded-full text-[11px] font-black uppercase tracking-widest mb-8 shadow-sm">
                            <ShieldCheck size={12} fill="currentColor" />
                            {t.bestTime.label}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 mb-6 tracking-tight leading-[1.05]">
                            {t.bestTime.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{t.bestTime.titleHighlight}</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                            {t.bestTime.subtitle}
                        </p>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pb-24 -mt-6">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white p-2 md:p-4 flex flex-col lg:flex-row gap-4 relative z-20 overflow-hidden">
                    
                    {/* Controls Sidebar */}
                    <div className="p-8 md:p-10 lg:w-1/3 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
                         
                         <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                             <Target size={14} /> {t.bestTime.industryLabel}
                         </h3>

                         <div className="space-y-2 mb-10">
                            {INDUSTRY_KEYS.map(key => (
                                <button
                                    key={key}
                                    onClick={() => setIndustryKey(key)}
                                    className={`w-full text-left px-5 py-4 rounded-2xl text-[13px] font-black uppercase tracking-wider transition-all border-2 flex items-center justify-between group ${
                                        industryKey === key 
                                        ? 'bg-white border-indigo-600 text-indigo-900 shadow-lg shadow-indigo-600/10' 
                                        : 'bg-transparent border-transparent text-slate-500 hover:bg-white hover:border-slate-200'
                                    }`}
                                >
                                    {t.bestTime.industries[key]}
                                    <div className={`w-2 h-2 rounded-full transition-all ${industryKey === key ? 'bg-indigo-600 scale-125' : 'bg-slate-200 group-hover:bg-slate-300'}`} />
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={handleCalculate}
                            disabled={isCalculating}
                            className="w-full py-5 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black transition-all shadow-xl shadow-slate-900/10 hover:shadow-indigo-500/20 disabled:opacity-70 flex items-center justify-center gap-3 text-lg uppercase tracking-wider group overflow-hidden relative"
                        >
                            <motion.div
                                animate={isCalculating ? { x: ["-100%", "200%"] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                            />
                            {isCalculating ? <Clock className="animate-spin" /> : <Zap size={20} className="group-hover:scale-125 transition-transform" />}
                            {isCalculating ? t.bestTime.analyzing : t.bestTime.button}
                        </button>
                    </div>

                    {/* Heatmap Section */}
                    <div className="p-8 md:p-12 lg:w-2/3 flex flex-col items-center justify-center relative overflow-hidden rounded-[2rem] bg-white min-h-[550px]">
                        <AnimatePresence mode="wait">
                            {!result ? (
                                <motion.div 
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="text-center relative z-10 p-8"
                                >
                                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-slate-100 shadow-sm relative">
                                        <CalendarDays className="w-10 h-10 text-slate-300" />
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-sm">
                                            <Info size={14} />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{t.bestTime.emptyState}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto font-medium">
                                        {t.bestTime.emptyStateDesc}
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="heatmap"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full relative z-10"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-2">
                                                <TrendingUp className="text-indigo-600" size={24} />
                                                {t.bestTime.heatmapTitle}
                                            </h3>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.bestTime.globalIndex}</p>
                                        </div>
                                        <div className="flex gap-3 text-[10px] font-black uppercase text-slate-500 items-center bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                            <span>{t.bestTime.low}</span>
                                            <div className="flex gap-1">
                                                {[20, 40, 60, 80, 100].map(s => (
                                                    <div key={s} className={`w-3 h-3 rounded-sm ${getHeatmapColor(s)}`} />
                                                ))}
                                            </div>
                                            <span>{t.bestTime.high}</span>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto pb-4 custom-scrollbar">
                                        <div className="min-w-[600px]">
                                            <div className="grid grid-cols-6 mb-4 gap-2">
                                                <div className="col-span-1"></div>
                                                {TIME_SLOTS.map(slot => (
                                                    <div key={slot} className="text-[10px] font-black text-slate-400 text-center uppercase tracking-widest">{slot}</div>
                                                ))}
                                            </div>

                                            {KEYS_DAYS.map((dayKey, dayIndex) => (
                                                <div key={dayKey} className="grid grid-cols-6 mb-2 gap-2 items-center">
                                                     <div className="col-span-1 text-right pr-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">{DAYS[dayIndex]}</div>
                                                     {result[dayKey]?.map((score, i) => (
                                                         <motion.div 
                                                            key={i}
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ delay: (dayIndex * 0.05) + (i * 0.05) }}
                                                            className={`h-14 rounded-2xl flex items-center justify-center border-2 ${getHeatmapColor(score)} group relative cursor-help transition-all hover:scale-105 active:scale-95`}
                                                         >
                                                            <div className="opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all bg-slate-900 text-white absolute inset-0 rounded-2xl z-20">
                                                                <span className="text-[10px] font-black uppercase mb-0.5">Rating</span>
                                                                <span className="text-lg font-black">{Math.round(score)}%</span>
                                                            </div>
                                                            {score >= 85 && (
                                                                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse shadow-sm" />
                                                            )}
                                                         </motion.div>
                                                     ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Cta */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="mt-10 bg-indigo-600 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-600/30 relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                                        <div className="relative z-10 flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles size={18} className="text-indigo-200" />
                                                <h4 className="text-xl font-black">{t.bestTime.schedCtaTitle}</h4>
                                            </div>
                                            <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-md">
                                                {t.bestTime.schedCtaDesc}
                                            </p>
                                        </div>
                                        <Link to="/login" className="relative z-10 px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black text-sm hover:translate-x-1 transition-all shadow-xl flex items-center gap-3">
                                            {t.bestTime.schedCtaBtn}
                                            <ArrowRight size={18} />
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Content Section */}
                 <div className="mt-24 grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    <div className="lg:col-span-2 space-y-8">
                         <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t.bestTime.whyTitle}</h2>
                         <p className="text-xl text-slate-500 leading-relaxed font-medium">
                             {t.bestTime.whyDesc}
                         </p>
                         <div className="grid md:grid-cols-2 gap-6 pt-4">
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                 <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center text-green-600 border border-green-100">
                                        <CheckCircle size={18} />
                                    </div>
                                    {t.bestTime.bestDaysTitle}
                                 </h3>
                                 <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                     {t.bestTime.bestDaysDesc}
                                 </p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                 <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center text-red-600 border border-red-100">
                                        <Clock size={18} />
                                    </div>
                                    {t.bestTime.worstTimesTitle}
                                 </h3>
                                 <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                     {t.bestTime.worstTimesDesc}
                                 </p>
                            </div>
                         </div>
                    </div>
                    
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
                        <h3 className="text-2xl font-black mb-6 relative z-10">{t.bestTime.viralTipTitle}</h3>
                        <div className="space-y-6 relative z-10">
                            {t.bestTime.tips.map((tip: string, i: number) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-indigo-400 shrink-0 border border-white/5">{i+1}</div>
                                    <p className="text-sm text-slate-300 font-medium">{tip}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12">
                             <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 transition-colors flex items-center justify-center gap-2">
                                 <Share2 size={14} />
                                 {language === 'es' ? 'Compartir Resultados' : 'Share Results'}
                             </button>
                        </div>
                    </div>
                 </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-16 text-center">
                <div className="max-width-7xl mx-auto px-6">
                     <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Powered by Kolink Matrix Engine
                    </p>
                    <div className="w-12 h-1 bg-slate-100 mx-auto rounded-full" />
                </div>
            </footer>
        </div>
    );
};

export default BestTimeCalculatorTool;
