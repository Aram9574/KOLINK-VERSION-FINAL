import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Hammer, TrendingUp, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Trend, ContentAngle, GeneratedPostContent } from '../../../types';
import { toast } from 'sonner';

interface AngleGeneratorProps {
    trend: Trend;
    onGenerate: (angle: ContentAngle) => Promise<void>;
    onClose: () => void;
}

const ANGLES: ContentAngle[] = [
    {
        type: 'visionary',
        title: 'El Visionario (Contrario)',
        hook: 'Por qué todos están equivocados con esto...',
        description: 'Desafía el status quo. Predice consecuencias a 5 años. Sé audaz.',
    },
    {
        type: 'implementer',
        title: 'El Implementador (Pragmático)',
        hook: 'Aquí te explico cómo usar esto mañana...',
        description: 'Pasos prácticos. Sin relleno. Valor inmediato para el lector.',
    },
    {
        type: 'analyst',
        title: 'El Analista (Estratégico)',
        hook: 'El impacto en el ROI de este cambio es...',
        description: 'Traduce tendencias a números de negocio. Enfoque en eficiencia y ganancias.',
    },
];

const AngleGenerator: React.FC<AngleGeneratorProps> = ({ trend, onGenerate, onClose }) => {
    const [selectedAngle, setSelectedAngle] = useState<ContentAngle | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSelect = async (angle: ContentAngle) => {
        setSelectedAngle(angle);
        setIsGenerating(true);
        try {
            await onGenerate(angle);
            // Parent handles loading/success UI mostly, but we can close or show success here
        } catch (error) {
            console.error(error);
            toast.error("Error al generar el borrador");
        } finally {
            setIsGenerating(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'visionary': return <Lightbulb size={24} className="text-amber-500" />;
            case 'implementer': return <Hammer size={24} className="text-emerald-500" />;
            case 'analyst': return <TrendingUp size={24} className="text-blue-500" />;
            default: return <Sparkles />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'visionary': return 'hover:border-amber-500 hover:bg-amber-50/50';
            case 'implementer': return 'hover:border-emerald-500 hover:bg-emerald-50/50';
            case 'analyst': return 'hover:border-blue-500 hover:bg-blue-50/50';
            default: return 'hover:border-slate-300';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-2xl w-full mx-auto relative">
            <div className="bg-slate-50 p-6 border-b border-slate-100">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tendencia Detectada</span>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {trend.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                    {trend.summary}
                </p>
            </div>

            <div className="p-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-500" />
                    Elige tu Ángulo de Ataque
                </h4>

                <div className="space-y-4">
                    {ANGLES.map((angle) => (
                        <motion.button
                            key={angle.type}
                            onClick={() => handleSelect(angle)}
                            disabled={isGenerating}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full text-left p-4 rounded-xl border-2 border-slate-100 transition-all group ${getColor(angle.type)} relative overflow-hidden`}
                        >
                            <div className="flex items-start gap-4 z-10 relative">
                                <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                                    {getIcon(angle.type)}
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-slate-800 text-lg group-hover:text-slate-900">
                                        {angle.title}
                                    </h5>
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                                        Objetivo: {angle.hook}
                                    </p>
                                    <p className="text-sm text-slate-600 group-hover:text-slate-700">
                                        {angle.description}
                                    </p>
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                     {isGenerating && selectedAngle?.type === angle.type ? (
                                        <Loader2 className="animate-spin text-slate-400" />
                                     ) : (
                                        <ArrowRight className="text-slate-400" />
                                     )}
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
            
            {isGenerating && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="text-center">
                         <Loader2 size={40} className="animate-spin text-indigo-600 mx-auto mb-4" />
                         <p className="font-medium text-slate-900">Redactando con lente {selectedAngle?.type}...</p>
                         <p className="text-sm text-slate-500">Inyectando ADN de experticia...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AngleGenerator;
