import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface LoadingProgressProps {
    steps: string[];
    duration?: number; // Total simulated duration in ms
    className?: string;
    onComplete?: () => void;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({
    steps,
    duration = 8000,
    className = "",
    onComplete,
}) => {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Progress simulation: fast to 90%, then very slow
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / duration, 1);

            // Use a power function for the curve (fast start, slow end)
            // progress = 1 - (1-t)^3 gets to ~90% at t=0.5
            const easedProgress = (1 - Math.pow(1 - t, 3)) * 100;

            setProgress(easedProgress);

            if (t >= 1) {
                clearInterval(interval);
                onComplete?.();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration, onComplete]);

    useEffect(() => {
        // Message rotation
        const stepDuration = duration / steps.length;
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % steps.length);
        }, stepDuration);

        return () => clearInterval(interval);
    }, [steps.length, duration]);

    return (
        <div
            className={`w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ${className}`}
        >
            <div className="flex flex-col items-center gap-3">
                <div className="relative">
                    <div className="absolute -inset-4 bg-brand-500/10 rounded-full blur-xl animate-pulse" />
                    <div className="relative flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm border border-brand-100">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-brand-500 border-t-transparent" />
                        <Sparkles className="absolute w-3 h-3 text-brand-500 animate-pulse" />
                    </div>
                </div>

                <div className="text-center space-y-1">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-widest min-h-[20px] transition-all duration-300">
                        {steps[currentStep]}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Procesando mediante kolink ai engine
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div
                        className="h-full bg-gradient-to-r from-brand-500 to-indigo-600 transition-all duration-500 ease-out relative"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Shimmer effect on the progress bar */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite] -skew-x-12" />
                    </div>
                </div>
                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-brand-600/70">
                        {Math.round(progress)}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Optimización Viral
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoadingProgress;
