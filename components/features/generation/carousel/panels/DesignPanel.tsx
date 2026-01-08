import React from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { TemplateSelector } from '../../TemplateSelector';
import { DESIGN_PRESETS } from '../design-presets';
import { toast } from 'sonner';

export const DesignPanel = () => {
    const { updateDesign, project } = useCarouselStore();
    
    // We try to match the current store design to a preset ID if possible, 
    // otherwise fallback to a default or keep the last selected.
    // Since design state doesn't necessarily track "templateId" directly in a way compatible with the selector yet (except maybe themeId),
    // we use a local or derived state.
    
    const handleSelect = (templateId: string) => {
        const preset = DESIGN_PRESETS[templateId];
        if (preset) {
            updateDesign({
                colorPalette: preset.colorPalette,
                fonts: preset.fonts,
                background: preset.background,
                layout: preset.layout,
                themeId: templateId 
            });
            toast.success(`Theme "${templateId.replace(/-/g, ' ')}" applied!`);
        } else {
            // Fallback for templates not yet mapped perfectly
            toast.info("This theme variation is coming soon!");
        }
    };

    return (
        <div className="space-y-4">
            <div className="px-1">
                 <h3 className="text-sm font-bold text-slate-800 mb-1">Visual Themes</h3>
                 <p className="text-xs text-slate-500 mb-4">Choose a style for your carousel.</p>
            </div>
            
            <TemplateSelector 
                selectedTemplateId={project.design.themeId || 'minimalist-pro-accent'}
                onSelect={handleSelect}
                variant="embedded"
            />
        </div>
    );
};
