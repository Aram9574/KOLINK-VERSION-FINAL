import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import { translations } from "../../../translations";
import { Loader2, CheckCircle2, Circle } from "lucide-react";

const AuditStatusTracker: React.FC = () => {
    const { language } = useUser();
    const t = translations[language].app.audit;
    
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const steps = [
        t.processing.step1,
        t.processing.step2,
        t.processing.step3,
        t.processing.step4,
    ];

    useEffect(() => {
        // Simulate progress for visual feedback
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < steps.length - 1) return prev + 1;
                return prev;
            });
        }, 3500);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                const target = (currentStep + 1) * 25;
                if (prev < target) {
                    // Non-linear progress curve
                    const increment = (target - prev) * 0.1 + 0.5;
                    return Math.min(prev + increment, 95); // Stay at 95 until real completion
                }
                return prev;
            });
        }, 100);

        return () => {
            clearInterval(stepInterval);
            clearInterval(progressInterval);
        };
    }, [currentStep, steps.length]);

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60/60 dark:border-slate-700 overflow-hidden">
                {/* Progress Bar Top */}
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    <div 
                        className="h-full bg-brand-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="p-8 lg:p-12 space-y-8">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl mb-4">
                            <Loader2 className="w-8 h-8 text-brand-600 dark:text-brand-400 animate-spin" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {language === "es" ? "Analizando Perfil..." : "Analyzing Profile..."}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {language === "es" 
                                ? "Nuestra IA está extrayendo y procesando tu información pública." 
                                : "Our AI is extracting and processing your public information."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {steps.map((step, idx) => {
                            const isCompleted = idx < currentStep;
                            const isActive = idx === currentStep;

                            return (
                                <div 
                                    key={idx} 
                                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 border-2 ${
                                        isActive 
                                        ? "bg-brand-50/50 dark:bg-brand-900/10 border-brand-200 dark:border-brand-900/30 scale-[1.02]" 
                                        : isCompleted 
                                            ? "bg-emerald-50/30 dark:bg-emerald-900/5 border-transparent opacity-80" 
                                            : "bg-transparent border-transparent opacity-40"
                                    }`}
                                >
                                    <div className="flex-shrink-0">
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        ) : isActive ? (
                                            <div className="relative">
                                                <div className="w-6 h-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                                            </div>
                                        ) : (
                                            <Circle className="w-6 h-6 text-slate-300" />
                                        )}
                                    </div>
                                    <span className={`font-semibold text-sm ${
                                        isActive 
                                        ? "text-brand-700 dark:text-brand-400" 
                                        : isCompleted 
                                            ? "text-emerald-700 dark:text-emerald-400" 
                                            : "text-slate-500 dark:text-slate-400"
                                    }`}>
                                        {step}
                                    </span>
                                    {isActive && (
                                        <div className="ml-auto">
                                            <span className="text-[10px] font-bold bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-2 py-1 rounded-full uppercase tracking-tighter animate-pulse">
                                                Active
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-4 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            Powered by Gemini 3 Flash
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditStatusTracker;
