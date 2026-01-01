import React, { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { translations } from "../../../translations";
import { LinkedInAudit } from "../../../types";
import { 
    CheckCircle2, 
    AlertCircle, 
    Copy, 
    Check, 
    RefreshCcw, 
    ExternalLink,
    TrendingUp,
    Target,
    Briefcase,
    Zap,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { toast } from "sonner";

interface AuditResultsProps {
    audit: LinkedInAudit;
    onNewAudit: () => void;
    onRegenerate: (section: "headline" | "about") => Promise<void>;
}

const AuditResults: React.FC<AuditResultsProps> = ({ audit, onNewAudit, onRegenerate }) => {
    const { language } = useUser();
    const t = translations[language].app.audit;
    const results = audit?.results;

    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);

    const handleRegenerate = async (section: "headline" | "about") => {
        setRegeneratingSection(section);
        await onRegenerate(section);
        setRegeneratingSection(null);
    };

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
                <p className="text-slate-500">Error: No se pudieron cargar los resultados.</p>
                <button onClick={onNewAudit} className="text-brand-500 font-bold underline">Volver a intentar</button>
            </div>
        );
    }

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success(t.results.copied);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getScoreColor = (score: number) => {
        if (score >= 71) return "text-emerald-500";
        if (score >= 41) return "text-amber-500";
        return "text-red-500";
    };

    const getScoreBg = (score: number) => {
        if (score >= 71) return "bg-emerald-500";
        if (score >= 41) return "bg-amber-500";
        return "bg-red-500";
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Top Stats Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Hero */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-[32px] border border-slate-100 dark:border-slate-700/50 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-slate-100 dark:text-slate-700"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={364}
                                strokeDashoffset={364 - (364 * results.score) / 100}
                                strokeLinecap="round"
                                className={`${getScoreColor(results.score)} transition-all duration-1000 ease-out`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-4xl font-black ${getScoreColor(results.score)}`}>
                                {results.score}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                / 100
                            </span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.results.scoreTitle}</h3>
                        <div className={`h-1 w-12 mx-auto rounded-full ${getScoreBg(results.score)} opacity-50`} />
                    </div>
                </div>

                {/* AI Summary Hero */}
                <div className="lg:col-span-2 bg-gradient-to-br from-brand-500 to-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-brand-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg">{t.results.summaryTitle}</h3>
                        </div>
                        <p className="text-xl lg:text-2xl font-medium leading-relaxed opacity-95">
                            "{results.summary}"
                        </p>
                        <div className="pt-4 flex gap-4">
                            <button 
                                onClick={onNewAudit}
                                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold backdrop-blur-sm transition-all flex items-center gap-2"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                {language === "es" ? "Analizar Otro Perfil" : "Analyze Another Profile"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Breakdown */}
            <div className="grid grid-cols-1 gap-6">
                {/* Headline Section */}
                <SectionCard 
                    icon={<Target className="w-6 h-6 text-brand-500" />}
                    title={t.results.headline}
                    analysis={results.headline?.analysis || ""}
                    currentLabel={t.results.current}
                    currentText={results.headline?.current || ""}
                    suggestedLabel={t.results.suggested}
                    suggestedText={results.headline?.suggested || ""}
                    onCopy={(text) => copyToClipboard(text, "headline")}
                    isCopied={copiedId === "headline"}
                    badge={results.score > 80 ? "Optimized" : "Needs Work"}
                    onRegenerate={() => handleRegenerate("headline")}
                    isRegenerating={regeneratingSection === "headline"}
                    language={language}
                />

                {/* About Section */}
                <SectionCard 
                    icon={<Briefcase className="w-6 h-6 text-violet-500" />}
                    title={t.results.about}
                    analysis={results.about?.analysis || ""}
                    currentLabel={language === "es" ? "Palabras Clave Faltantes" : "Missing Keywords"}
                    currentText={results.about?.missingKeywords?.join(", ") || ""}
                    suggestedLabel={t.results.suggested}
                    suggestedText={results.about?.suggested || ""}
                    onCopy={(text) => copyToClipboard(text, "about")}
                    isCopied={copiedId === "about"}
                    isTextarea
                    onRegenerate={() => handleRegenerate("about")}
                    isRegenerating={regeneratingSection === "about"}
                    language={language}
                />

                {/* Experience Section */}
                <div className="bg-white dark:bg-slate-800/40 backdrop-blur-md rounded-[32px] border border-slate-100 dark:border-slate-700/50 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                                <Briefcase className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.results.experience}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {language === "es" ? "Análisis de cargos y logros" : "Job titles and achievements analysis"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 space-y-8">
                        {results.experience.map((exp, idx) => (
                            <div key={idx} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{exp.position}</h4>
                                        <p className="text-xs text-slate-500 font-medium">{exp.company}</p>
                                    </div>
                                    <div className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                                            Update Needed
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                        "{exp.analysis}"
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                        {language === "es" ? "Sugerencias de Mejora" : "Improvement Suggestions"}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {exp.suggestions.map((sug, sidx) => (
                                            <div key={sidx} className="flex items-start gap-2 p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-900/20">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-slate-700 dark:text-slate-300">{sug}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {idx < results.experience.length - 1 && <div className="h-px bg-slate-100 dark:bg-slate-700/50 w-full" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills Section */}
                <SectionCard 
                    icon={<Zap className="w-6 h-6 text-amber-500" />}
                    title={t.results.skills}
                    analysis={results.skills?.analysis || ""}
                    currentLabel={language === "es" ? "Aptitudes Faltantes" : "Missing Skills"}
                    currentText={results.skills?.missing?.join(", ") || ""}
                    suggestedLabel={language === "es" ? "Aptitudes Actuales" : "Current Skills"}
                    suggestedText={results.skills?.current?.join(", ") || ""}
                    badge="Gap Analysis"
                    language={language}
                />

                {/* Bottom Audit Action */}
                <div className="flex justify-center pt-8">
                    <button 
                        onClick={onNewAudit}
                        className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[20px] font-bold text-lg shadow-xl shadow-slate-200 dark:shadow-none hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        {language === "es" ? "Analizar Otro Perfil" : "Analyze Another Profile"}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface SectionCardProps {
    icon: React.ReactNode;
    title: string;
    analysis: string;
    currentLabel: string;
    currentText: string;
    suggestedLabel: string;
    suggestedText: string;
    onCopy?: (text: string) => void;
    isCopied?: boolean;
    isTextarea?: boolean;
    badge?: string;
    onRegenerate?: () => void;
    isRegenerating?: boolean;
    language: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ 
    icon, 
    title, 
    analysis, 
    currentLabel, 
    currentText, 
    suggestedLabel, 
    suggestedText,
    onCopy,
    isCopied,
    isTextarea,
    badge,
    onRegenerate,
    isRegenerating,
    language
}) => {
    return (
        <div className="bg-white dark:bg-slate-800/40 backdrop-blur-md rounded-[32px] border border-slate-100 dark:border-slate-700/50 overflow-hidden group hover:border-brand-200 dark:hover:border-brand-900/30 transition-all duration-300">
            <div className="p-8 border-b border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
                            {analysis}
                        </p>
                    </div>
                </div>
                {badge && (
                    <div className="hidden sm:block px-3 py-1 bg-brand-50 dark:bg-brand-900/20 rounded-full border border-brand-100 dark:border-brand-900/30">
                        <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                            {badge}
                        </span>
                    </div>
                )}
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{currentLabel}</span>
                    </div>
                    <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {currentText}
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">{suggestedLabel}</span>
                        </div>
                        {onCopy && (
                            <button 
                                onClick={() => onCopy(suggestedText)}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                    isCopied 
                                    ? "bg-emerald-500 text-white" 
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-600 hover:text-white"
                                }`}
                            >
                                {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {isCopied ? "COPIED" : "COPY"}
                            </button>
                        )}
                        {onRegenerate && (
                            <button 
                                onClick={onRegenerate}
                                disabled={isRegenerating}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                    isRegenerating 
                                    ? "bg-brand-100 text-brand-500 cursor-wait" 
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-600 hover:text-white"
                                }`}
                            >
                                <RefreshCcw className={`w-3 h-3 ${isRegenerating ? "animate-spin" : ""}`} />
                                {isRegenerating 
                                    ? (language === "es" ? "GENERANDO..." : "GENERATING...") 
                                    : (language === "es" ? "NUEVA VARIANTE" : "NEW VARIANT")}
                            </button>
                        )}
                    </div>
                    <div className={`p-5 bg-brand-50/30 dark:bg-brand-900/10 rounded-2xl border border-brand-100/50 dark:border-brand-900/20 text-slate-900 dark:text-white font-medium text-sm leading-relaxed ${isTextarea ? "min-h-[150px]" : ""}`}>
                        {suggestedText}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditResults;
