import React, { useState, useRef } from "react";
import { useUser } from "../../../context/UserContext";
import { translations } from "../../../translations";
import { Linkedin, Search, FileUp, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface AuditEmptyStateProps {
    onStart: (file: File) => void;
    hasLatestAudit?: boolean;
    onViewLatest?: () => void;
}

const AuditEmptyState: React.FC<AuditEmptyStateProps> = ({ onStart, hasLatestAudit, onViewLatest }) => {
    const { language } = useUser();
    const t = translations[language].app.audit;
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (file) {
            onStart(file);
        }
    };

    const onButtonClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center justify-center py-6 px-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 lg:p-8 space-y-6">
                    {/* Visual Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-16 h-16 bg-brand-500/10 dark:bg-brand-500/20 rounded-[24px] flex items-center justify-center transform rotate-6 transition-transform hover:rotate-0 duration-500">
                                <FileText className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div className="absolute -top-1.5 -right-1.5 w-8 h-8 bg-white dark:bg-slate-700 rounded-xl shadow-lg flex items-center justify-center transform -rotate-12 border border-slate-50 dark:border-slate-600">
                                <Linkedin className="w-4 h-4 text-brand-500" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                            {t.title}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                            {language === "es" 
                                ? "Para una auditoría perfecta e híbrida, sube el PDF de tu perfil generado por LinkedIn." 
                                : "For a perfect hybrid audit, upload your LinkedIn-generated profile PDF."}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div 
                            className={`relative group cursor-pointer transition-all duration-300 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center py-8 px-6 ${
                                dragActive 
                                ? "border-brand-500 bg-brand-50/50 dark:bg-brand-900/10 scale-[1.02]" 
                                : file 
                                    ? "border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-900/5" 
                                    : "border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500/50"
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={onButtonClick}
                        >
                            <input 
                                ref={inputRef}
                                type="file" 
                                className="hidden" 
                                accept=".pdf"
                                onChange={handleChange}
                            />
                            
                            {file ? (
                                <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <p className="text-slate-900 dark:text-white font-bold">{file.name}</p>
                                    <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <FileUp className="w-8 h-8 text-slate-400 group-hover:text-brand-500 transition-colors" />
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">
                                        {t.inputPlaceholder}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        PDF only • Max 10MB
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
                            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                <strong>{language === "es" ? "Tip pro:" : "Pro tip:"}</strong> {t.pdfHint}
                            </p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!file}
                            className={`w-full flex items-center justify-center gap-3 py-5 px-8 rounded-[24px] font-bold text-lg text-white transition-all duration-300 transform active:scale-[0.98] ${
                                file 
                                ? "bg-slate-900 dark:bg-brand-500 hover:scale-[1.02] shadow-xl shadow-slate-200 dark:shadow-none" 
                                : "bg-slate-200 dark:bg-slate-700 cursor-not-allowed text-slate-400"
                            }`}
                        >
                            {t.buttonAction}
                            <Search className="w-5 h-5" />
                        </button>

                        {hasLatestAudit && onViewLatest && (
                            <div className="flex justify-center pt-2">
                                <button 
                                    onClick={(e) => { e.preventDefault(); onViewLatest(); }}
                                    className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 underline underline-offset-4 transition-colors"
                                >
                                    {language === "es" ? "Ver mi último reporte generado" : "View my latest generated report"}
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                        {language === "es" 
                            ? "Tus datos están protegidos. El análisis es privado y cumple con GDPR." 
                            : "Your data is protected. The analysis is private and GDPR compliant."}
                    </p>
                </div>
            </div>

            {/* Steps help */}
            <div className="mt-8 flex flex-col md:flex-row gap-6 items-center text-center">
                <div className="flex-1 space-y-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">1</span>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {language === "es" ? "Ve a tu perfil de LinkedIn" : "Go to your LinkedIn profile"}
                    </p>
                </div>
                <div className="flex-1 space-y-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">2</span>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {language === "es" ? "Clic en 'Más' > 'Guardar en PDF'" : "Click 'More' > 'Save to PDF'"}
                    </p>
                </div>
                <div className="flex-1 space-y-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">3</span>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {language === "es" ? "Súbelo aquí arriba" : "Upload it here above"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuditEmptyState;
