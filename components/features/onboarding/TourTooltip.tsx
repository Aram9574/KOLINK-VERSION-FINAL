import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button.tsx';
import { cn } from '../../../lib/utils';

interface TourTooltipProps {
    title: string;
    content: string;
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onPrev: () => void;
    onSkip: () => void;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    targetRect?: DOMRect | null;
}

export const TourTooltip: React.FC<TourTooltipProps> = ({
    title,
    content,
    currentStep,
    totalSteps,
    onNext,
    onPrev,
    onSkip,
    position = 'bottom',
    targetRect
}) => {
    // Calculate tooltip position based on targetRect
    const getStyles = () => {
        if (!targetRect || position === 'center') {
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                position: 'fixed' as const,
                zIndex: 1000,
            };
        }

        const offset = 20;
        let top = 0;
        let left = 0;

        switch (position) {
            case 'top':
                top = targetRect.top - offset;
                left = targetRect.left + targetRect.width / 2;
                break;
            case 'bottom':
                top = targetRect.bottom + offset;
                left = targetRect.left + targetRect.width / 2;
                break;
            case 'left':
                top = targetRect.top + targetRect.height / 2;
                left = targetRect.left - offset;
                break;
            case 'right':
                top = targetRect.top + targetRect.height / 2;
                left = targetRect.right + offset;
                break;
        }

        return {
            top,
            left,
            position: 'fixed' as const,
            zIndex: 1000,
            transform: position === 'top' ? 'translate(-50%, -100%)' : 
                       position === 'bottom' ? 'translate(-50%, 0)' :
                       position === 'left' ? 'translate(-100%, -50%)' :
                       'translate(0, -50%)'
        };
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={getStyles()}
            className={cn(
                "w-full max-w-[320px] bg-white/90 backdrop-blur-xl border border-slate-200/60 p-6 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden",
                "before:absolute before:inset-0 before:bg-gradient-to-tr before:from-brand-500/5 before:via-transparent before:to-transparent before:pointer-events-none"
            )}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                        <Sparkles size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Paso {currentStep + 1} de {totalSteps}
                    </span>
                </div>
                <button 
                    onClick={onSkip}
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {content}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-slate-100 rounded-full mt-6 mb-6 overflow-hidden relative z-10">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    className="h-full bg-brand-500"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between relative z-10">
                <button 
                    onClick={onPrev}
                    disabled={currentStep === 0}
                    className={cn(
                        "text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-slate-600 transition-colors disabled:opacity-0",
                    )}
                >
                    <ChevronLeft size={14} />
                    Anterior
                </button>
                
                <Button 
                    onClick={onNext}
                    className="rounded-full bg-slate-900 hover:bg-brand-600 text-white px-6 h-10 group"
                >
                    {currentStep === totalSteps - 1 ? '¡Empezar!' : 'Siguiente'}
                    {currentStep !== totalSteps - 1 && <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />}
                </Button>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full" />
        </motion.div>
    );
};
