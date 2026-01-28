import React from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { MASTER_TEMPLATES } from '@/lib/constants/CarouselTemplates';
import { VIRAL_STRUCTURES } from '@/lib/data/ViralStructures';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface TemplatesPanelProps {
    onSelectTemplate?: (slides: any[]) => void; // Optional callback if needed
}

const TemplatesPanel: React.FC<TemplatesPanelProps> = (props) => {
    const { onSelectTemplate } = props;

    // Ya no necesitamos lógica de pestañas ni estado de temas aquí
    const applyStructure = (structure: any) => {
        if (onSelectTemplate) {
            // regenerar IDs para evitar conflictos
            const newSlides = structure.slides.map((s: any) => ({ ...s, id: crypto.randomUUID() }));
            onSelectTemplate(newSlides);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-800">Estructuras Virales</h3>
                    <p className="text-xs text-slate-500">Plantillas probadas para enmarcar tu contenido.</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                        {VIRAL_STRUCTURES.map((structure) => (
                            <div 
                            key={structure.id}
                            onClick={() => applyStructure(structure)}
                            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all cursor-pointer p-4"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-500 shrink-0">
                                        {/* Simple icon mapping */}
                                        {structure.id === 'the_bridge' && <div className="font-bold text-lg">🌉</div>}
                                        {structure.id === 'negative_list' && <div className="font-bold text-lg">❌</div>}
                                        {structure.id === 'hero_journey' && <div className="font-bold text-lg">🦸</div>}
                                        {structure.id === 'step_by_step' && <div className="font-bold text-lg">👣</div>}
                                        {structure.id === 'myth_buster' && <div className="font-bold text-lg">⚡</div>}
                                        {structure.id === 'contrarian' && <div className="font-bold text-lg">⚠️</div>}
                                        {structure.id === 'case_study' && <div className="font-bold text-lg">📊</div>}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800 mb-1 group-hover:text-brand-600 transition-colors">{structure.name}</h4>
                                        <p className="text-[11px] text-slate-500 leading-tight">{structure.description}</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex gap-1">
                                    {structure.slides.slice(0, 5).map((_, i) => (
                                        <div key={i} className="h-1.5 flex-1 rounded-full bg-slate-100 group-hover:bg-brand-100 transition-colors" />
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default TemplatesPanel;
