import React, { useRef, useState } from "react";
import {
    AlertCircle,
    ArrowRight,
    BookOpen,
    Briefcase,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Download,
    ExternalLink,
    Layout,
    Loader2,
    Share2,
    Sparkles,
    Target,
    TrendingUp,
    Users,
} from "lucide-react";
import { useUser } from "../../../context/UserContext";
import { AuditResult } from "../../../types";
import confetti from "canvas-confetti";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { toast } from "sonner";

interface AuditResultsProps {
    data: AuditResult;
}

// Reuseable Components for Cleaner Code
const ScoreBadge = ({ score }: { score: number }) => {
    let color =
        "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/50";
    if (score >= 80) {
        color =
            "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50";
    } else if (score >= 50) {
        color =
            "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50";
    }

    return (
        <span
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${color}`}
        >
            {score}/100 Score
        </span>
    );
};

const SectionCard = (
    { title, icon: Icon, children, className = "", headerAction }: any,
) => (
    <div
        className={`group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${className}`}
    >
        {title && (
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform border border-slate-100 dark:border-slate-700">
                        {Icon && (
                            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        )}
                    </div>
                    <span className="text-xl tracking-tight">{title}</span>
                </h3>
                {headerAction}
            </div>
        )}
        <div className="p-8">
            {children}
        </div>
    </div>
);

const AdviceAccordion = ({ title, children, defaultOpen = false }: any) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden mb-4 last:mb-0 bg-slate-50 dark:bg-slate-900">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
                <span className="font-black text-slate-800 dark:text-slate-200 text-sm tracking-tight">
                    {title}
                </span>
                <div
                    className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
            </button>
            {isOpen && (
                <div className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200 bg-white dark:bg-slate-950">
                    {children}
                </div>
            )}
        </div>
    );
};

// [Smart Actions Helper]
const getTaskAction = (task: any) => {
    if (task.text.includes("URL")) {
        return (
            <a
                href="https://www.linkedin.com/in/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-[10px] font-black uppercase tracking-[0.1em] text-blue-600 hover:text-blue-700 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl transition-all hover:scale-105 active:scale-95 border border-blue-100 dark:border-blue-800/50 shadow-sm"
            >
                LinkedIn →
            </a>
        );
    }
    if (task.id.startsWith("f1") || task.id.startsWith("n1")) {
        return (
            <button className="ml-auto text-[10px] font-black uppercase tracking-[0.1em] text-purple-600 hover:text-purple-700 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl transition-all hover:scale-105 active:scale-95 border border-purple-100 dark:border-purple-800/50 shadow-sm">
                Copiar
            </button>
        );
    }
    return null;
};

const AuditResults: React.FC<AuditResultsProps> = ({ data }) => {
    const { language } = useUser();
    const { perfil_resumen, pilares, quick_wins } = data;
    const [activeTab, setActiveTab] = useState<
        "overview" | "pilar1" | "pilar2" | "pilar3" | "checklist"
    >("overview");

    // Initialize from LocalStorage or empty
    const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
        try {
            if (typeof window !== "undefined") {
                const saved = localStorage.getItem(
                    `audit_checklist_${perfil_resumen.nombre}`,
                );
                return saved ? JSON.parse(saved) : [];
            }
            return [];
        } catch (e) {
            return [];
        }
    });

    // Effect: Save to LocalStorage
    React.useEffect(() => {
        localStorage.setItem(
            `audit_checklist_${perfil_resumen.nombre}`,
            JSON.stringify(completedTasks),
        );
    }, [completedTasks, perfil_resumen.nombre]);

    // Generate all tasks first to count them
    const allTasks = [
        // Fundamento
        {
            id: "f1",
            category: "Fundamento",
            text: "Actualizar Titular (Headline)",
            subtext: "Implementa la fórmula: Rol | Especialidad | Valor",
            impact: "High",
        },
        {
            id: "f2",
            category: "Fundamento",
            text: "Revisar Foto y Banner",
            subtext: pilares.pilar_1_fundamento.foto_banner_check,
            impact: "Medium",
        },
        {
            id: "f3",
            category: "Fundamento",
            text: "Personalizar URL de LinkedIn",
            subtext:
                "Asegura que tu URL sea limpia (linkedin.com/in/tu-nombre)",
            impact: "Medium",
        },
        // Narrativa
        {
            id: "n1",
            category: "Narrativa",
            text: 'Reescribir el "Gancho" del Extracto',
            subtext:
                "Las primeras 3 líneas deben vender tu valor inmediatamente.",
            impact: "High",
        },
        ...pilares.pilar_2_narrativa.experiencia_mejoras.map((
            exp: any,
            i: number,
        ) => ({
            id: `n2-${i}`,
            category: "Narrativa",
            text: `Optimizar experiencia en ${exp.empresa}`,
            subtext: "Añadir métricas y logros cuantificables.",
            impact: "High",
        })),
        // Visibilidad
        {
            id: "v1",
            category: "Visibilidad",
            text: "Definir pilares de contenido",
            subtext:
                "Elige 3 temas en los que quieras posicionarte como experto.",
            impact: "Medium",
        },
        {
            id: "v2",
            category: "Visibilidad",
            text: "Comentar en 5 perfiles top al día",
            subtext: "Estrategia de networking para visibilidad rápida.",
            impact: "Medium",
        },
        // Quick Wins
        ...quick_wins.map((win, i) => ({
            id: `qw-${i}`,
            category: "Quick Wins",
            text: win,
            subtext: "Victoria rápida detectada por la IA.",
            impact: "High",
        })),
    ];

    const tabs = [
        { id: "overview", label: "Resumen", icon: Target },
        { id: "pilar1", label: "1. Fundamento", icon: Layout },
        { id: "pilar2", label: "2. Narrativa", icon: BookOpen },
        { id: "pilar3", label: "3. Visibilidad", icon: Users },
        { id: "checklist", label: "Plan de Acción", icon: CheckCircle2 },
    ];

    const toggleTask = (id: string) => {
        setCompletedTasks((prev) => {
            const isCompleting = !prev.includes(id);
            const newDocs = isCompleting
                ? [...prev, id]
                : prev.filter((t) => t !== id);

            if (isCompleting && newDocs.length === allTasks.length) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#10b981", "#34d399", "#f59e0b"],
                });
            }
            return newDocs;
        });
    };

    const componentRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        if (!componentRef.current) return;
        setIsDownloading(true);

        const element = componentRef.current;

        // Opciones para el PDF
        // @ts-ignore
        const opt = {
            margin: [5, 5] as [number, number],
            filename: `Auditoria_Kolink_${
                perfil_resumen.nombre.replace(/\s+/g, "_")
            }.pdf`,
            image: { type: "jpeg" as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait" as const,
            },
        };

        try {
            await html2pdf().set(opt).from(element).save();
            toast.success("PDF descargado correctamente");
        } catch (error) {
            console.error("PDF Error:", error);
            toast.error("Hubo un error al generar el PDF");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div
            ref={componentRef}
            className="max-w-7xl mx-auto font-sans text-slate-900 dark:text-white animate-in fade-in duration-1000 p-2 sm:p-0"
        >
            {/* --- PREMIUM HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 px-2">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                                LinkedIn Audit
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                    KOLINK EXPERT ANALYSIS
                                </span>
                                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                    Verificado
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-xl">
                        Análisis estratégico de alto impacto para{" "}
                        <span className="text-slate-900 dark:text-white font-black underline decoration-blue-500/30 decoration-4 underline-offset-4">
                            {perfil_resumen.nombre}
                        </span>
                    </p>
                </div>
                <div
                    className="flex items-center gap-4"
                    data-html2canvas-ignore
                >
                    <button className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95">
                        <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        Compartir
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] text-sm font-black transition-all hover:shadow-xl disabled:opacity-70 disabled:cursor-wait active:scale-95 overflow-hidden"
                    >
                        {isDownloading
                            ? (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                            )
                            : (
                                <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                            )}
                        {isDownloading ? "Generando..." : "Exportar PDF"}
                    </button>
                </div>
            </div>

            {/* --- STUDIO NAVIGATION TABS (PILL STYLE) --- */}
            <div
                className="mb-12 sticky top-6 z-40 px-2"
                data-html2canvas-ignore
            >
                <div className="inline-flex p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl shadow-slate-900/5 overflow-hidden">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar scroll-smooth">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`group relative flex items-center gap-2.5 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-2xl ${
                                    activeTab === tab.id
                                        ? "text-white"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                {activeTab === tab.id && (
                                    <div className="absolute inset-0 bg-slate-900 dark:bg-blue-600 rounded-2xl shadow-lg animate-in fade-in zoom-in duration-300" />
                                )}
                                <tab.icon
                                    className={`w-4 h-4 relative z-10 ${
                                        activeTab === tab.id
                                            ? "text-white"
                                            : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 group-hover:scale-110 transition-all"
                                    }`}
                                />
                                <span className="relative z-10">
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- STUDIO LAYOUT AREA --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Main Column */}
                <div className="lg:col-span-8 space-y-10 min-h-[600px]">
                    {/* TAB: OVERVIEW */}
                    {activeTab === "overview" && (
                        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
                            {/* Score Visualization Card */}
                            <SectionCard className="relative overflow-hidden group/score border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl group-hover/score:scale-110 transition-transform duration-700" />

                                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                                    <div className="relative shrink-0 perspective-1000">
                                        <div className="relative w-48 h-48 transform-gpu transition-transform duration-700 group-hover/score:rotate-y-12">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle
                                                    cx="96"
                                                    cy="96"
                                                    r="84"
                                                    stroke="currentColor"
                                                    strokeWidth="16"
                                                    fill="transparent"
                                                    className="text-slate-100 dark:text-slate-800"
                                                />
                                                <defs>
                                                    <linearGradient
                                                        id="scoreGradient"
                                                        x1="0%"
                                                        y1="0%"
                                                        x2="100%"
                                                        y2="100%"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#2563eb"
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#4f46e5"
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <circle
                                                    cx="96"
                                                    cy="96"
                                                    r="84"
                                                    stroke="url(#scoreGradient)"
                                                    strokeWidth="16"
                                                    fill="transparent"
                                                    strokeDasharray={527.7}
                                                    strokeDashoffset={527.7 -
                                                        (527.7 *
                                                                perfil_resumen
                                                                    .score_actual) /
                                                            100}
                                                    strokeLinecap="round"
                                                    className="filter transition-all duration-1000 ease-out"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-full m-8 shadow-inner border border-slate-100 dark:border-slate-800">
                                                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                                                    {perfil_resumen
                                                        .score_actual}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">
                                                    TOTAL
                                                </span>
                                            </div>
                                        </div>
                                        {perfil_resumen.score_actual >= 80 && (
                                            <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-xl animate-pulse -z-10" />
                                        )}
                                    </div>

                                    <div className="flex-1 text-center md:text-left space-y-6">
                                        <div className="space-y-3">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider">
                                                Diagnóstico de Impacto
                                            </div>
                                            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                                                {perfil_resumen.score_actual <
                                                        50
                                                    ? "Alerta de Visibilidad"
                                                    : "Impacto de Marca"}
                                            </h2>
                                            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
                                                {perfil_resumen.score_actual <
                                                        50
                                                    ? "Se detectan fugas críticas de atención que están costando oportunidades valiosas."
                                                    : "Tienes una base sólida, pero faltan ajustes estratégicos para convertir visitas en clientes reales."}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                {
                                                    label: "Foundations",
                                                    val: pilares
                                                        .pilar_1_fundamento
                                                        .score,
                                                },
                                                {
                                                    label: "Narrative",
                                                    val: pilares
                                                        .pilar_2_narrativa
                                                        .score,
                                                },
                                                {
                                                    label: "Growth",
                                                    val: pilares
                                                        .pilar_3_visibilidad
                                                        .score,
                                                },
                                            ].map((p, i) => (
                                                <div
                                                    key={i}
                                                    className="p-4 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
                                                >
                                                    <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                                                        {p.label}
                                                    </div>
                                                    <div
                                                        className={`text-xl font-black ${
                                                            p.val >= 80
                                                                ? "text-emerald-500"
                                                                : p.val >= 50
                                                                ? "text-amber-500"
                                                                : "text-rose-500"
                                                        }`}
                                                    >
                                                        {p.val}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SectionCard
                                    title="Victorias Rápidas"
                                    icon={Sparkles}
                                    className="dark:bg-slate-900/40"
                                >
                                    <div className="space-y-3">
                                        {quick_wins.map((win, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30"
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-emerald-500/20">
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-slate-700 dark:text-slate-200 text-sm font-bold leading-relaxed">
                                                    {win}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>
                                <div className="bg-slate-900 dark:bg-blue-600 rounded-[2.5rem] p-8 text-white relative shadow-2xl">
                                    <div className="relative z-10 space-y-6">
                                        <h3 className="text-2xl font-black">
                                            Tu Roadmap
                                        </h3>
                                        <div className="space-y-4 text-sm font-bold opacity-80">
                                            <p>1. Optimiza Fundamentos (SEO)</p>
                                            <p>
                                                2. Reescribe Narrativa
                                                (Conversión)
                                            </p>
                                            <p>
                                                3. Activa Visibilidad
                                                (Networking)
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setActiveTab("pilar1")}
                                            className="w-full py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black rounded-2xl text-sm transition-all hover:scale-[1.02]"
                                        >
                                            Comenzar Optimización
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: PILAR 1 - FUNDAMENTO */}
                    {activeTab === "pilar1" && (
                        <div className="space-y-10 animate-in slide-in-from-right-8 duration-700">
                            <SectionCard
                                title="Headline Optimization"
                                icon={Target}
                                className="dark:bg-slate-900/40"
                            >
                                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-3xl p-6 mb-8 italic text-amber-900 dark:text-amber-200">
                                    "{pilares.pilar_1_fundamento
                                        .analisis_titular}"
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">
                                            Opción A
                                        </span>
                                        <p className="text-lg font-bold text-slate-800 dark:text-slate-300">
                                            {pilares.pilar_1_fundamento
                                                .propuesta_titular_a}
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-3xl border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10">
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 block">
                                            Opción Recomendada
                                        </span>
                                        <p className="text-xl font-black text-slate-900 dark:text-white">
                                            {pilares.pilar_1_fundamento
                                                .propuesta_titular_b}
                                        </p>
                                    </div>
                                </div>
                            </SectionCard>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SectionCard
                                    title="Visual Identity"
                                    icon={Layout}
                                    className="dark:bg-slate-900/40"
                                >
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                        {pilares.pilar_1_fundamento
                                            .foto_banner_check}
                                    </p>
                                </SectionCard>
                                <SectionCard
                                    title="Digital ID"
                                    icon={ExternalLink}
                                    className="dark:bg-slate-900/40"
                                >
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-400">
                                        {pilares.pilar_1_fundamento.url_check}
                                    </p>
                                </SectionCard>
                            </div>
                        </div>
                    )}

                    {/* TAB: PILAR 2 - NARRATIVA */}
                    {activeTab === "pilar2" && (
                        <div className="space-y-10 animate-in slide-in-from-right-8 duration-700">
                            <SectionCard
                                title="El Gancho (The Hook)"
                                icon={BookOpen}
                                className="dark:bg-slate-900/40"
                            >
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20 mb-8">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">
                                        NUEVO EXTRACTO
                                    </h4>
                                    <p className="text-2xl font-black leading-tight">
                                        {pilares.pilar_2_narrativa
                                            .redaccion_gancho_sugerida}
                                    </p>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 text-sm italic text-slate-500">
                                    Análisis:{" "}
                                    {pilares.pilar_2_narrativa.gancho_analisis}
                                </div>
                            </SectionCard>
                            <SectionCard
                                title="Experiencia & Logros"
                                icon={Briefcase}
                                className="dark:bg-slate-900/40"
                            >
                                <div className="grid grid-cols-1 gap-4">
                                    {pilares.pilar_2_narrativa
                                        .experiencia_mejoras.map((
                                            exp: any,
                                            i: number,
                                        ) => (
                                            <div
                                                key={i}
                                                className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50"
                                            >
                                                <h4 className="font-black text-slate-900 dark:text-white mb-2">
                                                    {exp.empresa}
                                                </h4>
                                                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                    {exp.propuesta_metrica}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </SectionCard>
                        </div>
                    )}

                    {/* TAB: PILAR 3 - VISIBILIDAD */}
                    {activeTab === "pilar3" && (
                        <div className="space-y-10 animate-in slide-in-from-right-8 duration-700">
                            <SectionCard
                                title="Estrategia Growth"
                                icon={TrendingUp}
                                className="dark:bg-slate-900/40"
                            >
                                <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden mb-10">
                                    <h3 className="text-3xl font-black mb-6 leading-tight">
                                        Plan de Acción IA
                                    </h3>
                                    <p className="text-slate-400 text-lg leading-relaxed">
                                        {pilares.pilar_3_visibilidad
                                            .estrategia_contenido}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                                        <h4 className="text-lg font-black mb-4">
                                            Social Selling
                                        </h4>
                                        <p className="text-sm text-slate-500 font-bold">
                                            {pilares.pilar_3_visibilidad
                                                .estrategia_networking}
                                        </p>
                                    </div>
                                    <div className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                                        <h4 className="text-lg font-black mb-4">
                                            Posicionamiento
                                        </h4>
                                        <p className="text-sm text-slate-500 font-bold">
                                            Usa el generador de Kolink para
                                            crear contenido basado en tus
                                            pilares de autoridad.
                                        </p>
                                    </div>
                                </div>
                            </SectionCard>
                        </div>
                    )}

                    {/* TAB: CHECKLIST FULL VIEW */}
                    {activeTab === "checklist" && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <SectionCard
                                title="Checklist Maestro"
                                icon={CheckCircle2}
                            >
                                <div className="space-y-8">
                                    {[
                                        "Fundamento",
                                        "Narrativa",
                                        "Visibilidad",
                                        "Quick Wins",
                                    ].map((cat) => {
                                        const tasks = allTasks.filter((t) =>
                                            t.category === cat
                                        );
                                        if (tasks.length === 0) return null;
                                        return (
                                            <div
                                                key={cat}
                                                className="space-y-4"
                                            >
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                                                    {cat}
                                                </h4>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {tasks.map((task) => {
                                                        const isDone =
                                                            completedTasks
                                                                .includes(
                                                                    task.id,
                                                                );
                                                        return (
                                                            <button
                                                                key={task.id}
                                                                onClick={() =>
                                                                    toggleTask(
                                                                        task.id,
                                                                    )}
                                                                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                                                                    isDone
                                                                        ? "bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800"
                                                                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg"
                                                                }`}
                                                            >
                                                                <div
                                                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                                        isDone
                                                                            ? "bg-emerald-500 border-emerald-500"
                                                                            : "border-slate-300"
                                                                    }`}
                                                                >
                                                                    {isDone && (
                                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                                    )}
                                                                </div>
                                                                <span
                                                                    className={`font-bold text-sm ${
                                                                        isDone
                                                                            ? "text-slate-400 line-through"
                                                                            : "text-slate-900 dark:text-white"
                                                                    }`}
                                                                >
                                                                    {task.text}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </SectionCard>
                        </div>
                    )}
                </div>

                {/* SIDEBAR COLUMN (Persistent on Desktop) */}
                <div
                    className="lg:col-span-4 space-y-8 sticky top-32 group/sidebar"
                    data-html2canvas-ignore
                >
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-900/5 transition-all hover:shadow-2xl">
                        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
                            PROGRESO DEL PLAN
                        </h4>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">
                                    {Math.round(
                                        (completedTasks.length /
                                            allTasks.length) * 100,
                                    )}%
                                </span>
                                <span className="text-[10px] font-black text-emerald-500 uppercase">
                                    Completado
                                </span>
                            </div>
                            <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${
                                            (completedTasks.length /
                                                allTasks.length) * 100
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-900/5">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                            TAREAS PENDIENTES
                            <span className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2 py-0.5 rounded-full text-[8px]">
                                {allTasks.length - completedTasks.length}
                            </span>
                        </h4>
                        <div className="space-y-3">
                            {allTasks.filter((t) =>
                                !completedTasks.includes(t.id)
                            ).slice(0, 5).map((task) => (
                                <div
                                    key={task.id}
                                    onClick={() => toggleTask(task.id)}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer hover:scale-[1.02] transition-all group/task"
                                >
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover/task:border-blue-500 transition-colors" />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                                        {task.text}
                                    </span>
                                </div>
                            ))}
                            {allTasks.filter((t) =>
                                        !completedTasks.includes(t.id)
                                    ).length > 5 && (
                                <button
                                    onClick={() =>
                                        setActiveTab("checklist" as any)}
                                    className="w-full pt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                >
                                    Ver todas
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group/ia shadow-2xl">
                        <div className="absolute inset-0 bg-blue-600/10 group-hover/ia:opacity-20 transition-opacity" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                                    Kolink AI Insight
                                </span>
                            </div>
                            <p className="text-sm font-bold leading-relaxed mb-6 italic opacity-90">
                                Un perfil con score superior al 80% genera 4.5x
                                más leads cualificados.
                            </p>
                            <div className="flex items-center justify-between text-[10px] font-black opacity-30 uppercase">
                                <span>K-CORE ENGINE</span>
                                <span>v2.5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditResults;
