import React, { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { translations } from "../../../translations";
import { LinkedInAuditResult } from "../../../types";
import { toast } from "sonner";
import { supabase } from "../../../services/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, Maximize2, Sparkles, TrendingUp, Users, BookOpen, UserCircle, Scan, CheckCircle2, ChevronRight, BarChart3, Target, Zap } from "lucide-react";

// --- Subcomponents ---

const MetricCard = ({ label, value, icon: Icon, colorClass }: { label: string, value: number, icon: any, colorClass: string }) => (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/50 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        <div className="relative z-10 flex flex-col items-center">
             <div className="mb-3 p-3 bg-white/50 rounded-full border border-slate-100 shadow-sm">
                 <Icon className="w-5 h-5 text-slate-700" />
             </div>
             
             <div className="relative w-24 h-24 mb-2 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
                    <circle cx="48" cy="48" r="36" stroke="#E2E8F0" strokeWidth="6" fill="transparent" />
                    <motion.circle 
                        initial={{ strokeDashoffset: 226 }}
                        animate={{ strokeDashoffset: 226 - (226 * value) / 100 }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        cx="48" cy="48" r="36" 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        fill="transparent" 
                        className="text-slate-900" 
                        strokeDasharray={226} 
                        strokeLinecap="round" 
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-bold text-2xl text-slate-900 tracking-tighter">{value}</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Puntuación</span>
                </div>
            </div>
            <span className="text-sm font-semibold text-slate-600 text-center">{label}</span>
        </div>
    </div>
);

const SuggestionCard = ({ title, score, feedback, suggested, onAction }: { title: string, score: number, feedback: string, suggested: string, onAction: () => void }) => (
    <motion.div 
        layout
        className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 hover:border-brand-200/50 transition-colors shadow-sm group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${score > 80 ? 'bg-emerald-100/50 text-emerald-600' : score > 60 ? 'bg-amber-100/50 text-amber-600' : 'bg-rose-100/50 text-rose-600'}`}>
                    {score > 80 ? <CheckCircle2 size={18} /> : score > 60 ? <BarChart3 size={18} /> : <Zap size={18} />}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${score > 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : score > 60 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                {score}/100
            </div>
        </div>
        
        <p className="text-slate-600 mb-6 text-sm leading-relaxed min-h-[60px]">{feedback}</p>
        
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 relative group-hover:bg-white transition-colors">
            <div className="absolute -left-[1px] top-6 bottom-6 w-[3px] bg-brand-400 rounded-r-full" />
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles size={12} className="text-brand-500" />
                Sugerencia IA
            </div>
            <div className="text-slate-800 font-medium italic text-sm leading-relaxed font-serif">
                "{suggested}"
            </div>
            <button 
                onClick={onAction}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Copiar sugerencia"
            >
                <Scan size={16} />
            </button>
        </div>
    </motion.div>
);

import PremiumLockOverlay from "../../ui/PremiumLockOverlay";

const LinkedInAuditView: React.FC = () => {
    const { user, language } = useUser();
    
    // Status: idle -> scanning (procesando) -> results (resultados)
    const [status, setStatus] = useState<"idle" | "scanning" | "results">("idle");
    const [auditData, setAuditData] = useState<LinkedInAuditResult | null>(null);
    const [dragActive, setDragActive] = useState(false);

    if (!user.isPremium) {
        return (
            <PremiumLockOverlay 
                title={language === 'es' ? 'Simulador Estratégico' : 'Strategic Simulator'}
                description={language === 'es' 
                    ? 'Auditoría algorítmica de tu perfil de LinkedIn. Sube tu PDF para un análisis profundo o una captura para evaluación visual.' 
                    : 'Algorithmic audit of your LinkedIn profile. Upload your PDF for a deep analysis or a capture for visual evaluation.'}
                icon={<Scan className="w-8 h-8" />}
            />
        );
    }

    // --- Actions ---

    const processFile = async (file: File) => {
        // Validations
        if (file.size > 5 * 1024 * 1024) {
            toast.error("El archivo es demasiado grande (Máx 5MB)");
            return;
        }

        const isPdf = file.type === 'application/pdf';
        setStatus("scanning");
        
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1];
                
                const payload = isPdf 
                    ? { pdfBase64: base64 } 
                    : { imageBase64: base64 };

                // Llamada a la Edge Function
                const { data, error } = await supabase.functions.invoke("analyze-profile", {
                    body: payload
                });

                if (error) {
                    console.error("Function Error:", error);
                    throw new Error("Error en el análisis del servidor.");
                }

                if (!data || data.error) {
                     throw new Error(data?.error || "Respuesta inválida del servidor.");
                }

                setAuditData(data);
                setStatus("results");
                toast.success("Análisis completado con éxito");
            };
            
            reader.onerror = () => {
                throw new Error("Error al leer el archivo local.");
            }

        } catch (e: any) {
            console.error(e);
            toast.error(e.message || "Falló el análisis. Inténtalo de nuevo.");
            setStatus("idle");
        }
    };

    // --- Render ---

    return (
        <div className="w-full space-y-6">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center lg:text-left"
                >
                    <h1 className="text-3xl font-display font-bold text-slate-900">
                        Simulador Estratégico
                    </h1>
                    <p className="text-slate-500 mt-1 max-w-2xl mx-auto lg:mx-0">
                        Auditoría algorítmica de tu perfil de LinkedIn. Sube tu PDF para un análisis profundo o una captura para evaluación visual.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    
                    {/* IDLE STATE: DROPZONE */}
                    {status === "idle" && (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center justify-center min-h-[400px]"
                        >
                            <label 
                                onDragEnter={() => setDragActive(true)}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragActive(false);
                                    if(e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
                                }}
                                className={`
                                    w-full max-w-3xl aspect-[2/1] rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer
                                    flex flex-col items-center justify-center gap-6 group relative overflow-hidden backdrop-blur-sm
                                    ${dragActive ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 bg-white/40 hover:border-brand-400 hover:bg-slate-50/50'}
                                `}
                            >
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*,application/pdf"
                                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                                />
                                
                                {/* Decorator Blur */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 p-5 rounded-2xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                                    <Upload strokeWidth={1.5} size={32} className="text-brand-600" />
                                </div>
                                
                                <div className="text-center relative z-10 px-4">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Arrastra tu PDF o Captura</h3>
                                    <p className="text-slate-400 text-sm">Soporta PDF (Análisis Semántico) y PNG/JPG (Psicología Visual)</p>
                                </div>
                                
                                <div className="flex gap-2 relative z-10 mt-4">
                                     <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-semibold">Max 5MB</span>
                                     <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-semibold">.pdf, .png, .jpg</span>
                                </div>
                            </label>
                        </motion.div>
                    )}

                    {/* SCANNING STATE */}
                    {status === "scanning" && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center min-h-[500px]"
                        >
                            <div className="w-24 h-24 relative mb-8">
                                <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                                <div className="absolute inset-0 border-4 border-t-brand-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Target className="text-brand-600 animate-pulse" size={32} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Analizando Perfil...</h3>
                            <p className="text-slate-500 text-sm animate-pulse">Extrayendo ADN Estilístico y visual...</p>
                        </motion.div>
                    )}

                    {/* RESULTS STATE */}
                    {status === "results" && auditData && (
                         <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                         >
                            {/* 1. Bento Grid High Level Metrics (MOVED TO TOP) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <MetricCard label="Impacto Global" value={auditData.authority_score ?? 0} icon={TrendingUp} colorClass="from-blue-500 to-cyan-500" />
                                <MetricCard label="Calidad Visual" value={auditData.visual_score ?? 0} icon={UserCircle} colorClass="from-violet-500 to-purple-500" />
                                <MetricCard label="Palabras Clave" value={auditData.technical_seo_keywords?.length * 10 || 70} icon={BookOpen} colorClass="from-amber-400 to-orange-500" />
                                <MetricCard label="Quick Wins" value={auditData.quick_wins?.length * 20 || 60} icon={Zap} colorClass="from-emerald-400 to-teal-500" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* 2. Profile Passport (NEW - VISUAL PROOF OF DATA) */}
                                <div className="lg:col-span-1 bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-slate-200/60 shadow-sm flex flex-col gap-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                                            <Scan size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Datos Detectados</h3>
                                            <p className="text-xs text-slate-500">Huella digital extraída</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Nombre</p>
                                            <p className="font-semibold text-slate-900 truncate">{auditData.processed_data?.name || "No detectado"}</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Titular Actual</p>
                                            <p className="text-sm text-slate-600 line-clamp-2">{auditData.processed_data?.headline || "No detectado"}</p>
                                        </div>

                                        {/* Experience Timeline Preview */}
                                        {auditData.processed_data?.experiences && auditData.processed_data.experiences.length > 0 && (
                                            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Trayectoria Reciente</p>
                                                <div className="space-y-3 relative">
                                                    {/* Timeline Line */}
                                                    <div className="absolute left-1.5 top-1 bottom-1 w-[1px] bg-slate-200" />
                                                    
                                                    {auditData.processed_data.experiences.slice(0, 3).map((exp, i) => (
                                                        <div key={i} className="relative pl-5 text-sm">
                                                            <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-slate-100 border-2 border-slate-300 z-10" />
                                                            <p className="font-semibold text-slate-800 leading-tight">{exp.position}</p>
                                                            <p className="text-xs text-slate-500">{exp.company}</p>
                                                            <p className="text-[10px] text-slate-400 mt-0.5">{exp.duration}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Skills Cloud */}
                                        {auditData.processed_data?.skills && auditData.processed_data.skills.length > 0 && (
                                            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Habilidades Clave (Top 5)</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {auditData.processed_data.skills.slice(0, 5).map((skill, i) => (
                                                        <span key={i} className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 text-[10px] border border-slate-100 font-medium">{skill}</span>
                                                    ))}
                                                    {auditData.processed_data.skills.length > 5 && (
                                                        <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-400 text-[10px] border border-slate-100 italic">+{auditData.processed_data.skills.length - 5} más</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 3. Main Diagnosis (Diagnosis spans 2 cols) */}
                                <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-xl flex flex-col justify-center">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/20 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                                <Sparkles className="text-brand-400" /> 
                                                Diagnóstico Brutal
                                            </h2>
                                            
                                            {/* Source Badge */}
                                            {auditData.source_type && (
                                                <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-2
                                                    ${auditData.source_type === 'hybrid' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                                                    auditData.source_type === 'visual' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 
                                                    'bg-slate-700/50 border-slate-600 text-slate-400'}`}>
                                                    {auditData.source_type === 'hybrid' ? <CheckCircle2 size={12} /> : <Scan size={12} />}
                                                    {auditData.source_type === 'hybrid' ? "Híbrido (Vivo)" : 
                                                    auditData.source_type === 'visual' ? "Visual" : "Estándar"}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-slate-300 leading-relaxed text-lg font-light">
                                            {auditData.brutal_diagnosis}
                                        </p>
                                        
                                        <div className="mt-6 flex flex-wrap gap-2">
                                            {auditData.quick_wins?.map((win, i) => (
                                                <div key={i} className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-sm text-slate-100">
                                                    <Zap size={10} className="text-amber-400" />
                                                    {win}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actionable Suggestions (3 Cols Grid) */}
                            <h3 className="text-xl font-bold text-slate-900 px-1">Roadmap Estratégico</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <SuggestionCard 
                                    title="Optimización de Titular" 
                                    score={Math.round(auditData.authority_score * 0.9)}
                                    feedback="Tu titular necesita integrar tu promesa de valor y keywords clave para el algoritmo."
                                    suggested={auditData.strategic_roadmap.headline}
                                    onAction={() => {
                                        navigator.clipboard.writeText(auditData.strategic_roadmap.headline);
                                        toast.success("Copiado al portapapeles");
                                    }} 
                                />
                                <SuggestionCard 
                                    title="Narrativa del 'Acerca de'" 
                                    score={Math.round(auditData.authority_score * 0.85)}
                                    feedback="Las primeras 3 líneas del About son críticas. Hemos optimizado el gancho inicial."
                                    suggested={auditData.strategic_roadmap.about}
                                    onAction={() => {
                                        navigator.clipboard.writeText(auditData.strategic_roadmap.about);
                                        toast.success("Copiado al portapapeles");
                                    }}
                                />
                                <SuggestionCard 
                                    title="Autoridad en Experiencia" 
                                    score={Math.round(auditData.authority_score * 0.95)}
                                    feedback="Ejemplo de redirección de logros enfocada en resultados cuantificables."
                                    suggested={auditData.strategic_roadmap.experience}
                                    onAction={() => {
                                        navigator.clipboard.writeText(auditData.strategic_roadmap.experience);
                                        toast.success("Copiado al portapapeles");
                                    }}
                                />
                            </div>
                            
                            {/* Reset Button */}
                            <div className="flex justify-center pt-8 pb-12">
                                <button 
                                    onClick={() => setStatus("idle")}
                                    className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold text-sm hover:border-brand-300 hover:text-brand-600 transition-all shadow-sm"
                                >
                                    <Scan size={16} className="text-slate-400 group-hover:text-brand-500" />
                                    <span>Escanear otro perfil</span>
                                </button>
                            </div>

                         </motion.div>
                    )}
                </AnimatePresence>
        </div>
    );
};

export default LinkedInAuditView;
