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
    const { onSelectTemplate } = props; // Destructure
    const design = useCarouselStore(state => state.project.design);
    const updateDesign = useCarouselStore(state => state.updateDesign);

    const [activeTab, setActiveTab] = React.useState<'structures' | 'themes'>('structures');
    const [loadingThemeId, setLoadingThemeId] = React.useState<string | null>(null);

    const applyStructure = (structure: any) => {
        if (onSelectTemplate) {
            // we regenerate IDs to avoid conflicts if applied multiple times
            const newSlides = structure.slides.map((s: any) => ({ ...s, id: crypto.randomUUID() }));
            onSelectTemplate(newSlides);
        }
    };

    const updateTheme = (themeId: string) => {
        if (loadingThemeId) return;
        setLoadingThemeId(themeId);
        setTimeout(() => {
            const template = MASTER_TEMPLATES[themeId];
            if (template) {
                updateDesign({
                   themeId: template.themeId,
                   colorPalette: template.colorPalette,
                   fonts: template.fonts,
                   background: template.background,
                   layout: template.layout,
               });
            }
            setLoadingThemeId(null);
        }, 500);
    };

    return (
        <div className="space-y-6">
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('structures')}
                    className={cn(
                        "flex-1 text-xs font-bold py-1.5 rounded-md transition-all",
                        activeTab === 'structures' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Structures
                </button>
                <button 
                    onClick={() => setActiveTab('themes')}
                    className={cn(
                        "flex-1 text-xs font-bold py-1.5 rounded-md transition-all",
                        activeTab === 'themes' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Themes
                </button>
            </div>

            {activeTab === 'structures' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-800">Viral Structures</h3>
                        <p className="text-xs text-slate-500">Proven frameworks to frame your content.</p>
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
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-800">Visual Themes</h3>
                        <p className="text-xs text-slate-500">Curated designs optimized for engagement.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {Object.values(MASTER_TEMPLATES).map((template) => {
                            const isActive = design.themeId === template.themeId;
                            const isLoading = loadingThemeId === template.themeId;
                            
                            return (
                                <div 
                                    key={template.themeId}
                                    onClick={() => updateTheme(template.themeId)}
                                    className={cn(
                                        "group relative overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md",
                                        isActive ? "border-brand-500 bg-brand-50/10" : "border-slate-100 bg-white hover:border-slate-200"
                                    )}
                                >
                                    {isLoading && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                    
                                    <div className="flex items-stretch h-24">
                                        {/* Preview Strips */}
                                        <div className="w-24 flex-shrink-0 relative overflow-hidden bg-slate-100 border-r border-slate-100">
                                            <div 
                                                className="absolute inset-0"
                                                style={{ backgroundColor: template.colorPalette.background }}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: template.colorPalette.primary, opacity: 0.1 }} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 p-3 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-sm text-slate-700 capitalize">
                                                    {template.themeId.replace('_', ' ')}
                                                </span>
                                                {isActive && !isLoading && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-2">
                                                <div className="w-4 h-4 rounded-full border border-slate-100 shadow-sm" style={{ backgroundColor: template.colorPalette.primary }} />
                                                <div className="w-4 h-4 rounded-full border border-slate-100 shadow-sm" style={{ backgroundColor: template.colorPalette.secondary }} />
                                                <div className="w-4 h-4 rounded-full border border-slate-100 shadow-sm" style={{ backgroundColor: template.colorPalette.accent }} />
                                                <div className="w-4 h-4 rounded-full border border-slate-100 shadow-sm" style={{ backgroundColor: template.colorPalette.background }} />
                                            </div>
                                            <div className="mt-2 text-[10px] text-slate-400 font-medium">
                                                {template.fonts.heading} + {template.fonts.body}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplatesPanel;
