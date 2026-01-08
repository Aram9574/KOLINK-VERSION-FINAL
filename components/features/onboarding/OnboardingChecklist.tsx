import React from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircle2, 
    Circle, 
    BrainCircuit, 
    PenSquare, 
    Sparkles, 
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { UserProfile, AppTab } from '../../../types';
import { cn } from '../../../lib/utils';

interface OnboardingChecklistProps {
    user: UserProfile;
    onSelectTool: (tab: AppTab) => void;
    onCarouselStudioClick: () => void;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ 
    user, 
    onSelectTool,
    onCarouselStudioClick 
}) => {
    // Determine completion statuses
    const hasBrandVoice = !!user.brandVoice;
    const hasPosts = user.xp > 0; // Rough proxy for having created content
    
    // In a real app, these would come from specific user metadata or DB flags
    const steps = [
        {
            id: 'brand-voice',
            title: { es: "Define tu Voz de Marca", en: "Define your Brand Voice" },
            desc: { es: "Entrena a la IA con tu estilo único.", en: "Train AI with your unique style." },
            icon: BrainCircuit,
            color: "text-purple-500",
            bg: "bg-purple-50",
            completed: hasBrandVoice,
            onClick: () => onSelectTool('chat')
        },
        {
            id: 'first-post',
            title: { es: "Crea tu Primer Post", en: "Create your First Post" },
            desc: { es: "Redacta contenido viral en segundos.", en: "Draft viral content in seconds." },
            icon: PenSquare,
            color: "text-blue-500",
            bg: "bg-blue-50",
            completed: hasPosts,
            onClick: () => onSelectTool('create')
        },
        {
            id: 'first-carousel',
            title: { es: "Diseña un Carrusel", en: "Design a Carousel" },
            desc: { es: "Visuales impactantes sin esfuerzo.", en: "Effortless high-impact visuals." },
            icon: Sparkles,
            color: "text-brand-500",
            bg: "bg-brand-50",
            completed: false, // Could track via user metadata if needed
            onClick: onCarouselStudioClick
        }
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const progress = (completedCount / steps.length) * 100;
    const lang = user.language || 'es';

    return (
        <div className="bg-slate-50/50 rounded-[2rem] border border-slate-200 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8 px-1">
                <div>
                    <h4 className="text-lg font-bold text-slate-900">
                        {lang === 'es' ? 'Tu Viaje en Kolink' : 'Your Kolink Journey'}
                    </h4>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        {lang === 'es' ? 'Completa estos pasos para despegar 🚀' : 'Complete these steps to lift off 🚀'}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-black text-brand-600 bg-brand-100 px-3 py-1 rounded-full">
                        {completedCount}/{steps.length}
                    </span>
                    <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-brand-500"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {steps.map((step, idx) => (
                    <motion.button
                        key={step.id}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={step.onClick}
                        className={cn(
                            "flex flex-col gap-4 p-5 rounded-2xl border transition-all text-left",
                            step.completed 
                                ? "bg-white border-brand-100 shadow-sm" 
                                : "bg-white/50 border-slate-100 hover:border-brand-200 hover:bg-white"
                        )}
                    >
                        <div className="flex justify-between items-start">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center border",
                                step.bg,
                                step.color,
                                "border-current/10"
                            )}>
                                <step.icon className="w-6 h-6" />
                            </div>
                            {step.completed ? (
                                <CheckCircle2 className="w-6 h-6 text-brand-500 fill-brand-50" />
                            ) : (
                                <Circle className="w-6 h-6 text-slate-200" />
                            )}
                        </div>
                        
                        <div>
                            <p className={cn(
                                "font-bold text-sm mb-1",
                                step.completed ? "text-slate-900" : "text-slate-600"
                            )}>
                                {step.title[lang]}
                            </p>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                {step.desc[lang]}
                            </p>
                        </div>

                        <div className="mt-auto pt-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className={step.completed ? "text-brand-500" : "text-slate-400"}>
                                {step.completed 
                                    ? (lang === 'es' ? 'Completado' : 'Completed')
                                    : (lang === 'es' ? 'Pendiente' : 'Pending')}
                            </span>
                            {!step.completed && <ArrowRight className="w-3 h-3 text-slate-300" />}
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
