import React, { useState } from "react";
import PDFUploader from "./PDFUploader";
import AuditResults from "./AuditResults";
import { AuditService } from "../../../services/AuditService";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";

const ProfileAuditor: React.FC = () => {
    const [results, setResults] = useState<any>(() => {
        if (typeof window !== "undefined") {
            try {
                const saved = localStorage.getItem("kolink_audit_results");
                return saved ? JSON.parse(saved) : null;
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    const [step, setStep] = useState<"upload" | "analyzing" | "results">(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("kolink_audit_results");
            return saved ? "results" : "upload";
        }
        return "upload";
    });

    const { language } = useUser();

    const handleFileSelect = async (file: File) => {
        setStep("analyzing");
        try {
            const data = await AuditService.analyzeProfilePDF(file);
            setResults(data);
            localStorage.setItem("kolink_audit_results", JSON.stringify(data));
            setStep("results");
            toast.success(
                language === "es" ? "Análisis completado" : "Analysis complete",
            );
        } catch (error) {
            console.error(error);
            setStep("upload");
            toast.error(
                language === "es"
                    ? "Error al analizar el perfil. Intenta de nuevo."
                    : "Error analyzing profile. Try again.",
            );
        }
    };

    return (
        <div className="relative min-h-[90vh] pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="mt-8">
                    {step === "upload" && (
                        <div className="space-y-12">
                            {/* Visual Stepper Instructions */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    {
                                        step: "01",
                                        title: language === "es"
                                            ? "Perfil"
                                            : "Profile",
                                        desc: language === "es"
                                            ? "Ve a tu perfil de LinkedIn"
                                            : "Go to your LinkedIn profile",
                                        icon: "👤",
                                        link: "https://www.linkedin.com/in/",
                                    },
                                    {
                                        step: "02",
                                        title: language === "es"
                                            ? "Recursos"
                                            : "Resources",
                                        desc: language === "es"
                                            ? "Haz clic en 'Recursos'"
                                            : "Click on 'Resources'",
                                        icon: "📂",
                                    },
                                    {
                                        step: "03",
                                        title: language === "es"
                                            ? "Guardar"
                                            : "Save",
                                        desc: language === "es"
                                            ? "Selecciona 'Guardar en PDF'"
                                            : "Select 'Save to PDF'",
                                        icon: "📄",
                                    },
                                    {
                                        step: "04",
                                        title: language === "es"
                                            ? "Subir"
                                            : "Upload",
                                        desc: language === "es"
                                            ? "Sube el archivo aquí abajo"
                                            : "Upload the file below",
                                        icon: "🚀",
                                    },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="group relative bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="absolute top-4 right-6 text-3xl font-black opacity-5 dark:opacity-10 select-none">
                                            {item.step}
                                        </div>
                                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center text-xl mb-4 shadow-inner group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <h3 className="font-black text-slate-900 dark:text-white mb-1">
                                            {item.link
                                                ? (
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:text-blue-600 transition-colors flex items-center gap-1"
                                                    >
                                                        {item.title} ↗
                                                    </a>
                                                )
                                                : item.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-brand-500/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200">
                                </div>
                                <div className="relative">
                                    <PDFUploader
                                        onFileSelect={handleFileSelect}
                                        isAnalyzing={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "analyzing" && (
                        <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-pulse">
                            <div className="relative">
                                <div className="absolute -inset-8 bg-blue-500/20 rounded-full blur-[40px] animate-pulse" />
                                <PDFUploader
                                    onFileSelect={() => {}}
                                    isAnalyzing={true}
                                />
                            </div>
                        </div>
                    )}

                    {step === "results" && results && (
                        <div className="space-y-8">
                            <div
                                className="flex justify-between items-center group/back cursor-pointer"
                                onClick={() => {
                                    setStep("upload");
                                    setResults(null);
                                    localStorage.removeItem(
                                        "kolink_audit_results",
                                    );
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover/back:-translate-x-1 transition-transform">
                                        <svg
                                            className="w-5 h-5 text-slate-600 dark:text-slate-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                        {language === "es"
                                            ? "Analizar otro perfil"
                                            : "Analyze another profile"}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-2 sm:p-4">
                                <AuditResults data={results} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileAuditor;
