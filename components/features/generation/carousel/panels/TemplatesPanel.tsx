import React from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { MASTER_TEMPLATES } from '@/lib/constants/CarouselTemplates';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface TemplatesPanelProps {
    onSelectTemplate?: (slides: any[]) => void; // Optional callback if needed
}

const TemplatesPanel: React.FC<TemplatesPanelProps> = () => {
    const design = useCarouselStore(state => state.project.design);
    const updateDesign = useCarouselStore(state => state.updateDesign);

    const [loadingThemeId, setLoadingThemeId] = React.useState<string | null>(null);

    const updateTheme = (themeId: string) => {
        if (loadingThemeId) return; // Prevent multiple clicks
        
        setLoadingThemeId(themeId);
        
        // Artificial delay for better UX (perception of "applying")
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
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800">Master Templates</h3>
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
    );
};

export default TemplatesPanel;
