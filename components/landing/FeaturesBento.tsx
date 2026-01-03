import { useState, useEffect } from "react";
import Section from "@/components/ui/Section.tsx";
import { cn } from "@/lib/utils.ts";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, BarChart, Layers, Sparkles, Calendar, TrendingUp } from "lucide-react";
import { AppLanguage } from "@/types.ts";
import { es } from "@/translations/es.ts";
import { en } from "@/translations/en.ts";

// --- Visual Components ---

const LiveEditorVisual = () => {
    const text = "La consistencia vence a la intensidad.";
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;
            if (i > text.length) {
                // Pause then restart
                setTimeout(() => { i = 0; setDisplayedText(""); }, 2000);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5 shadow-sm relative overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-50 dark:border-slate-800 pb-3">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                <span className="ml-2 text-[10px] text-slate-400 font-mono">viral-hook_v3.txt</span>
            </div>
            <div className="font-mono text-slate-800 dark:text-slate-200 text-lg leading-relaxed">
                {displayedText}
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2.5 h-5 bg-blue-500 ml-1 align-middle"
                />
            </div>
        </div>
    );
};

const VoiceVisual = () => {
    return (
        <div className="flex items-center justify-center gap-1.5 h-full">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.div
                    key={i}
                    className="w-2.5 bg-indigo-500 rounded-full"
                    animate={{ height: ["20%", "80%", "30%", "60%", "20%"] }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.15,
                    }}
                />
            ))}
        </div>
    );
};

const AuditVisual = () => {
    return (
        <div className="relative flex items-center justify-center h-full">
             <div className="w-28 h-28 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <motion.circle
                        cx="50" cy="50" r="46"
                        fill="none"
                        stroke="#10b981" // emerald-500
                        strokeWidth="8"
                        strokeDasharray="289" // 2 * pi * 46
                        strokeDashoffset="289"
                        animate={{ strokeDashoffset: 40 }} // ~85%
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">85</span>
                    <span className="text-[10px] text-emerald-600 font-medium bg-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wide">Good</span>
                </div>
             </div>
        </div>
    );
};

const LiveCarouselVisual = () => {
    const slides = [
        { bg: "bg-blue-600", title: "Stop Selling.", sub: "Start Helping." },
        { bg: "bg-slate-900", title: "The 80/20 Rule", sub: "For LinkedIn Growth" },
        { bg: "bg-purple-600", title: "3 Mistakes", sub: "Killing Your Reach" },
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center relative px-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ x: 50, opacity: 0, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: -50, opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={cn(
                        "w-full max-w-[200px] aspect-video rounded-xl shadow-xl flex flex-col justify-center items-center text-center p-4 ring-1 ring-white/10",
                        slides[index].bg
                    )}
                >
                    <div className="w-6 h-6 rounded-full bg-white/20 mb-2" />
                    <h4 className="text-white font-bold text-base leading-tight tracking-tight">{slides[index].title}</h4>
                    <p className="text-white/80 text-[10px] mt-1 font-medium">{slides[index].sub}</p>
                </motion.div>
            </AnimatePresence>
            {/* Navigation dots */}
            <div className="absolute -bottom-2 flex gap-1.5">
                {slides.map((_, i) => (
                    <motion.div 
                        key={i} 
                        animate={{ scale: i === index ? 1.2 : 1, opacity: i === index ? 1 : 0.4 }}
                        className={cn("w-1.5 h-1.5 rounded-full transition-colors", i === index ? "bg-slate-800 dark:bg-white" : "bg-slate-400 dark:bg-slate-600")} 
                    />
                ))}
            </div>
        </div>
    );
};

const SchedulingVisual = () => {
    return (
        <div className="w-full h-full p-3 flex flex-col gap-2">
             <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium px-1">
                 <span>Mo</span><span>Tu</span><span>We</span><span>Th</span>
             </div>
             <div className="flex-1 grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className={cn(
                        "rounded-md relative overflow-hidden aspect-square",
                        i === 2 || i === 6 ? "bg-blue-100 dark:bg-blue-900/40 ring-1 ring-blue-200 dark:ring-blue-800 shadow-sm" : "bg-slate-50 dark:bg-slate-800/50"
                    )}>
                        { (i === 2 || i === 6) && (
                             <motion.div 
                                className="absolute inset-0 bg-blue-500/20"
                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                             />
                        )}
                        { (i === 2 || i === 6) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-sm" />
                            </div>
                        )}
                    </div>
                ))}
             </div>
             <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-medium bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-full w-fit mx-auto mt-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> 
                <span>Best Time</span>
             </div>
        </div>
    );
}

const AnalyticsVisual = () => {
    return (
        <div className="w-full h-full flex items-end justify-between px-6 pb-6 pt-10 gap-2 relative">
             <div className="absolute top-4 right-4 text-xs font-bold text-green-500 flex items-center gap-1">
                <TrendingUp size={12} /> +124%
             </div>
             {[30, 45, 35, 60, 50, 80, 70, 95].map((h, i) => (
                 <motion.div 
                    key={i}
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-sm opacity-80"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1, type: "spring" }}
                 />
             ))}
        </div>
    );
}


export const FeaturesBento = ({ language }: { language: AppLanguage }) => {
    const t = language === 'es' ? es : en;

    return (
        <Section className="py-20 relative" withGrid>
             <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
                    {t.features.title}
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                    {t.features.subtitle}
                </p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
                {/* Large Box: Post Generator (Col 1-8) */}
                <motion.div 
                    whileHover={{ y: -5, borderColor: "#2563EB" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="md:col-span-8 h-[360px] card-premium group/card p-8 flex flex-col md:flex-row gap-8 hover:shadow-soft-glow"
                >
                    <div className="flex-1 flex flex-col justify-center text-left">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-800">
                            <Sparkles size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white tracking-tight">{t.bento.postGenerator.title}</h3>
                         <p className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-4">{t.bento.postGenerator.desc}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t.bento.postGenerator.subDesc}</p>
                    </div>
                    <div className="flex-1 h-full relative min-h-[200px] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner bg-slate-50/50">
                        <LiveEditorVisual />
                    </div>
                </motion.div>

                {/* Vertical Stack (Col 9-12) containing Voice & Smart Scheduling */}
                <div className="md:col-span-4 flex flex-col gap-6 h-[360px]">
                     {/* Voice Cloning */}
                     <motion.div
                        whileHover={{ y: -5, borderColor: "#2563EB" }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex-1 card-premium group/card p-6 flex flex-col justify-between hover:shadow-soft-glow"
                    >
                        <div className="flex justify-between items-start">
                             <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.bento.voiceCloning.title}</h3>
                                <p className="text-xs text-slate-500 mt-1">{t.bento.voiceCloning.desc}</p>
                             </div>
                             <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-100 dark:ring-indigo-800">
                                <Mic size={16} />
                            </div>
                        </div>
                        <div className="h-12 w-full mt-4">
                            <VoiceVisual />
                        </div>
                    </motion.div>

                    {/* Smart Scheduling (New) */}
                    <motion.div
                        whileHover={{ y: -5, borderColor: "#2563EB" }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 card-premium group/card p-5 flex flex-row gap-4 overflow-hidden hover:shadow-soft-glow"
                    >
                         <div className="flex-1">
                             <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-600 dark:text-sky-400 ring-1 ring-sky-100 dark:ring-sky-800 mb-2">
                                <Calendar size={16} />
                            </div>
                             <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{t.bento.scheduling.title}</h3>
                             <p className="text-[10px] text-slate-500 mt-1 leading-tight">{t.bento.scheduling.desc}</p>
                         </div>
                         <div className="w-24 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                             <SchedulingVisual />
                         </div>
                    </motion.div>
                </div>

                {/* Row 2 */}

                 {/* Analytics (New) (Col 1-4) - Swapped position for variety */}
                 <motion.div
                     whileHover={{ y: -5, borderColor: "#2563EB" }}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.3 }}
                     className="md:col-span-4 h-[320px] card-premium p-8 flex flex-col justify-between"
                >
                    <div className="mb-auto">
                         <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-100 dark:ring-emerald-800">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.bento.analytics.title}</h3>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t.bento.analytics.subDesc}</p>
                    </div>
                    <div className="h-32 w-full">
                        <AnalyticsVisual />
                    </div>
                </motion.div>

                {/* Audit (Col 5-8) */}
                 <motion.div
                     whileHover={{ y: -5, borderColor: "#2563EB" }}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.4 }}
                     className="md:col-span-4 h-[320px] card-premium p-8 flex flex-col justify-between"
                >
                    <div className="mb-auto">
                         <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-6 text-slate-600 dark:text-slate-400 ring-1 ring-slate-100 dark:ring-slate-700">
                            <BarChart size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.bento.audit.title}</h3>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t.bento.audit.desc}</p>
                    </div>
                    <div className="py-2 flex justify-center my-4">
                        <AuditVisual />
                    </div>
                </motion.div>

                {/* Medium Box: Carousel (Col 9-12) */}
                <motion.div
                     whileHover={{ y: -5, borderColor: "#2563EB" }}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.5 }}
                     className="md:col-span-4 h-[320px] card-premium group/card p-6 flex flex-col justify-between hover:shadow-soft-glow"
                >
                     <div className="flex-1 w-full h-full relative overflow-visible flex items-center justify-center mb-4">
                        <LiveCarouselVisual />
                    </div>
                    <div className="text-left mt-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 ring-1 ring-purple-100 dark:ring-purple-800">
                                <Layers size={16} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{t.bento.carousel.title}</h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{t.bento.carousel.subDesc}</p>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
};

