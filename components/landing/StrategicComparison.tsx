import React from "react";
import { AlertCircle, CheckCircle2, XCircle, Sparkles, Trophy } from "lucide-react";
import { translations } from "../../translations.ts";
import { AppLanguage } from "../../types.ts";
import { motion } from "framer-motion";

interface StrategicComparisonProps {
    language: AppLanguage;
}

const StrategicComparison: React.FC<StrategicComparisonProps> = ({ language }) => {
    const t = translations[language].strategicComparison;

    const renderValue = (val: string) => {
        const extraText = val.replace(/✅|❌|⚠️|\(|\)/g, "").trim();
        const hasExtra = extraText.length > 0;

        if (val.includes("✅")) {
            return (
                <div className="flex flex-col items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-500/10" />
                    </div>
                    {hasExtra && (
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                            {extraText}
                        </span>
                    )}
                </div>
            );
        }
        if (val.includes("❌")) return (
            <div className="flex flex-col items-center">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-slate-300" />
                </div>
                {hasExtra && <span className="text-[10px] font-medium text-slate-400 mt-1">{extraText}</span>}
            </div>
        );
        if (val.includes("⚠️")) {
            return (
                 <div className="flex flex-col items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    {hasExtra && (
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                            {extraText}
                        </span>
                    )}
                </div>
            );
        }
        return <span className="text-sm font-bold text-slate-700">{val}</span>;
    };

    const competitors = [
        { key: "kolink", name: t.kolink, isKolink: true },
        { key: "taplio", name: t.taplio, isKolink: false },
        { key: "supergrow", name: t.supergrow, isKolink: false },
        { key: "authoredUp", name: t.authoredUp, isKolink: false },
    ];

    return (
        <section id="features" className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
             {/* Background Atmosphere */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-brand-600 text-[11px] font-black mb-8 tracking-widest uppercase shadow-sm"
                    >
                        <Trophy className="w-3.5 h-3.5 fill-brand-100" />
                        {language === 'es' ? 'Líder del Mercado' : 'Market Leader'}
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-6 tracking-tight leading-[1.05]"
                    >
                        {t.title}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        {t.subtitle}
                    </motion.p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative rounded-[2.5rem] p-[3px] bg-gradient-to-br from-white/80 via-white/50 to-white/80 shadow-2xl shadow-slate-200/50"
                >
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-[2.5rem]" />
                    
                    <div className="relative bg-white/40 rounded-[2.3rem] overflow-hidden border border-white/50">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr>
                                        <th className="p-8 text-xs font-black text-slate-400 uppercase tracking-widest w-1/4">
                                            {t.features}
                                        </th>
                                        {competitors.map((comp) => (
                                            <th
                                                key={comp.key}
                                                className={`pt-12 pb-8 px-6 text-center w-1/5 relative transition-colors duration-300 ${
                                                    comp.isKolink ? "bg-brand-50/30" : ""
                                                }`}
                                            >
                                                {comp.isKolink && (
                                                    <>
                                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-indigo-500" />
                                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-brand-500/20 flex items-center gap-1.5 whitespace-nowrap tracking-wider uppercase">
                                                            <Sparkles className="w-3 h-3 text-brand-200" />
                                                            {t.bestChoice}
                                                        </div>
                                                    </>
                                                )}
                                                <span
                                                    className={`text-xl font-display font-bold block ${
                                                        comp.isKolink
                                                            ? "text-brand-900 text-2xl scale-110 origin-center"
                                                            : "text-slate-400"
                                                    }`}
                                                >
                                                    {comp.name}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/50">
                                    {t.rows.map((row, idx) => (
                                        <tr
                                            key={idx}
                                            className="group hover:bg-white/50 transition-all duration-300"
                                        >
                                            <td className="p-8 text-sm font-bold text-slate-600 group-hover:text-brand-900 transition-colors">
                                                {row.name}
                                            </td>
                                            
                                            {/* Columns */}
                                            {Object.entries(row.values).map(([key, value], i) => {
                                                 const isKolink = key === 'kolink';
                                                 return (
                                                    <td 
                                                        key={key} 
                                                        className={`p-6 text-center relative ${isKolink ? 'bg-brand-50/30' : ''}`}
                                                    >
                                                        {isKolink && (
                                                            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-brand-200/50 to-transparent" />
                                                        )}
                                                        {isKolink && (
                                                            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-brand-200/50 to-transparent" />
                                                        )}
                                                        
                                                        <div className="flex justify-center transition-transform duration-300 group-hover:scale-110">
                                                            {renderValue(value)}
                                                        </div>
                                                    </td>
                                                 );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                {/* Mobile Hint */}
                <div className="mt-8 flex items-center justify-center gap-3 md:hidden">
                    <div className="h-px w-12 bg-slate-200" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                        {language === "es"
                            ? "Desliza para comparar"
                            : "Swipe to compare"}
                    </p>
                    <div className="h-px w-12 bg-slate-200" />
                </div>
            </div>
        </section>
    );
};

export default StrategicComparison;
