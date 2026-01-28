import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Clock, Calendar, CheckCircle, ChevronRight, TrendingUp, ArrowRight, Zap } from 'lucide-react';

// Industry Data with Heatmap Scores (0-100)
// Simplified: 7 days (Mon-Sun), 4 time slots (Morning, Lunch, Afternoon, Evening)
// Or finer grain: 7 days x 12 slots (2 hour blocks)
// Let's do 7 days x 5 time slots: 8am-10am, 10am-12pm, 12pm-2pm, 2pm-5pm, 5pm-8pm
type HeatmapData = Record<string, number[]>; // key: Day (0-6), value: array of scores for slots

import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';

// Industry Keys for Mapping
const INDUSTRY_KEYS = [
    "tech",
    "marketing",
    "realEstate",
    "finance",
    "healthcare",
    "education",
    "general"
];

// Patterns keyed by simple IDs
const INDUSTRY_PATTERNS: Record<string, HeatmapData> = {
    "tech": {
        "Mon": [60, 85, 70, 65, 50],
        "Tue": [80, 95, 85, 75, 60],
        "Wed": [85, 90, 80, 70, 55],
        "Thu": [80, 95, 85, 80, 65],
        "Fri": [70, 65, 50, 40, 30],
        "Sat": [20, 30, 25, 20, 10],
        "Sun": [10, 20, 30, 40, 50]
    },
    // ... we can map others to similar patterns or duplicate for now
    "marketing": {
        "Mon": [70, 90, 80, 70, 60], "Tue": [85, 95, 90, 80, 65], "Wed": [85, 95, 90, 80, 65], "Thu": [85, 95, 90, 80, 65], "Fri": [75, 70, 60, 50, 40], "Sat": [30, 40, 30, 20, 10], "Sun": [20, 40, 50, 60, 70]
    },
    "general": {
        "Mon": [70, 80, 60, 50, 40],
        "Tue": [80, 90, 70, 60, 50],
        "Wed": [80, 90, 70, 60, 50],
        "Thu": [80, 90, 70, 60, 50],
        "Fri": [70, 60, 50, 40, 30],
        "Sat": [30, 40, 30, 20, 10],
        "Sun": [20, 30, 40, 50, 60]
    }
};

// Keys for constants
const TIME_SLOTS_KEYS = ["8am - 10am", "10am - 12pm", "12pm - 2pm", "2pm - 5pm", "5pm - 8pm"];
const KEYS_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const BestTimeCalculatorTool = () => {
    const { language } = useUser();
    const t = translations[language]?.toolsPage || translations['en'].toolsPage;

    // Use translation if available, otherwise fallback to keys
    const DAYS = KEYS_DAYS.map(key => t.bestTime?.days?.[key] || key);
    const TIME_SLOTS = TIME_SLOTS_KEYS.map(key => t.bestTime?.timeSlots?.[key] || key);

    const [industryKey, setIndustryKey] = useState<string>("tech");
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<HeatmapData | null>(null);

    const handleCalculate = () => {
        setIsCalculating(true);
        // Simulate calculation delay
        setTimeout(() => {
            const pattern = INDUSTRY_PATTERNS[industryKey] || INDUSTRY_PATTERNS["general"];
            // Add some randomness so it feels 'live'
            const randomizedPattern: HeatmapData = {};
            Object.keys(pattern).forEach(day => {
                randomizedPattern[day] = pattern[day].map(score => Math.min(100, Math.max(0, score + (Math.random() * 10 - 5))));
            });
            setResult(randomizedPattern);
            setIsCalculating(false);
        }, 800);
    };

    const getHeatmapColor = (score: number) => {
        if (score >= 90) return "bg-green-500";
        if (score >= 70) return "bg-green-400";
        if (score >= 50) return "bg-green-300";
        if (score >= 30) return "bg-green-200";
        return "bg-slate-100";
    };

    const seoTitle = t.bestTime.seoTitle;
    const seoDesc = t.bestTime.seoDesc;

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDesc} />
            </Helmet>

            {/* Nav */}
            <nav className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
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
                <span className="text-slate-600">{t.bestTime.title} {t.bestTime.titleHighlight}</span>
            </div>

            {/* Hero */}
            <header className="pt-12 pb-16 text-center px-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                    <Clock size={12} />
                    {t.bestTime.label}
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-6 tracking-tight">
                    {t.bestTime.title} <span className="text-blue-600">{t.bestTime.titleHighlight}</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    {t.bestTime.subtitle}
                </p>
            </header>

            {/* Main Tool UI */}
            <main className="max-w-5xl mx-auto px-6 pb-20 -mt-8">
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                    
                    {/* Controls */}
                    <div className="p-8 md:w-1/3 border-r border-slate-100 bg-slate-50/50">
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-3">{t.bestTime.industryLabel}</label>
                        <div className="space-y-2 mb-8">
                            {INDUSTRY_KEYS.map(key => (
                                <button
                                    key={key}
                                    onClick={() => setIndustryKey(key)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                        industryKey === key 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    {t.bestTime.industries[key]}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={handleCalculate}
                            disabled={isCalculating}
                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isCalculating ? <Clock className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5" />}
                            {isCalculating ? t.bestTime.analyzing : t.bestTime.button}
                        </button>
                    </div>

                    {/* Heatmap Visualization */}
                    <div className="p-8 md:w-2/3 bg-white relative">
                        {!result ? (
                             <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <Calendar className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-sm font-medium max-w-xs text-center">{t.bestTime.emptyState}</p>
                             </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <TrendingUp className="text-blue-500" size={20} />
                                        {t.bestTime.heatmapTitle}
                                    </h3>
                                    <div className="flex gap-2 text-[10px] font-bold uppercase text-slate-400 items-center">
                                        <span>{t.bestTime.low}</span>
                                        <div className="flex gap-0.5">
                                            <div className="w-3 h-3 bg-slate-100 rounded-sm" />
                                            <div className="w-3 h-3 bg-green-200 rounded-sm" />
                                            <div className="w-3 h-3 bg-green-300 rounded-sm" />
                                            <div className="w-3 h-3 bg-green-400 rounded-sm" />
                                            <div className="w-3 h-3 bg-green-500 rounded-sm" />
                                        </div>
                                        <span>{t.bestTime.high}</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-x-auto pb-4">
                                    <div className="min-w-[500px]">
                                        {/* Header Row */}
                                        <div className="grid grid-cols-6 mb-2 gap-2">
                                            <div className="col-span-1 text-right pr-4"></div>
                                            {TIME_SLOTS.map(slot => (
                                                <div key={slot} className="text-[10px] font-bold text-slate-400 text-center">{slot}</div>
                                            ))}
                                        </div>

                                        {/* Rows */}
                                        {DAYS.map(day => (
                                            <div key={day} className="grid grid-cols-6 mb-2 gap-2 items-center">
                                                 <div className="col-span-1 text-right pr-4 text-xs font-bold text-slate-500">{day}</div>
                                                 {result[day]?.map((score, i) => (
                                                     <motion.div 
                                                        key={i}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className={`h-10 rounded-lg flex items-center justify-center ${getHeatmapColor(score)} group relative cursor-help transition-all hover:scale-105`}
                                                     >
                                                        <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-slate-900 transition-opacity">
                                                            {Math.round(score)}%
                                                        </span>
                                                     </motion.div>
                                                 ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                                    <div className="text-xs text-blue-900 font-medium">
                                        <span className="font-bold block mb-1">{t.bestTime.schedCtaTitle}</span>
                                        {t.bestTime.schedCtaDesc}
                                    </div>
                                    <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 transition-colors shadow-sm">
                                        {t.bestTime.schedCtaBtn}
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* SEO Content below */}
                 <div className="mt-20 max-w-3xl mx-auto space-y-12">
                    <section>
                         <h2 className="text-2xl font-bold text-slate-900 mb-4">{t.bestTime.whyTitle}</h2>
                         <p className="text-slate-600 leading-relaxed font-medium">
                             {t.bestTime.whyDesc}
                         </p>
                    </section>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                             <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500"/>
                                {t.bestTime.bestDaysTitle}
                             </h3>
                             <p className="text-sm text-slate-500">
                                 {t.bestTime.bestDaysDesc}
                             </p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                             <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500"/>
                                {t.bestTime.worstTimesTitle}
                             </h3>
                             <p className="text-sm text-slate-500">
                                 {t.bestTime.worstTimesDesc}
                             </p>
                        </div>
                    </div>
                 </div>
            </main>
        </div>
    );
};

export default BestTimeCalculatorTool;
