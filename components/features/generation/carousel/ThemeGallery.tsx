import React from 'react';
import { CAROUSEL_THEMES, CarouselThemePreset } from './data/carousel-themes';
import { SlideRenderer } from './SlideRenderer';
import { cn } from '@/lib/utils';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { CarouselSlide, CarouselDesign } from '@/types/carousel';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

export const ThemeGallery = () => {
    const updateDesign = useCarouselStore(state => state.updateDesign);
    const setAspectRatio = useCarouselStore(state => state.setAspectRatio);
    const currentDesign = useCarouselStore(state => state.project.design);
    const savedPresets = useCarouselStore(state => state.savedPresets);
    const deletePreset = useCarouselStore(state => state.deletePreset);

    const DUMMY_SLIDE: CarouselSlide = {
        id: 'preview',
        type: 'content',
        layoutVariant: 'default',
        isVisible: true,
        content: {
            title: "Theme Preview",
            body: "This is how your content looks.",
            subtitle: "Visual Style"
        }
    };

    const DUMMY_AUTHOR = {
        name: "Kolink",
        handle: "@kolink"
    };

    const handleApplyTheme = (theme: CarouselThemePreset) => {
        // Merge the theme design into the current design, but preserve some existing settings if needed
        // For now, we overwrite layout, fonts, colors, and background.
        // We might want to keep the aspect ratio if the user explicitly set it, 
        // but themes often come with a preferred ratio. For now, we apply everything.
        
        updateDesign({
            ...theme.design,
            // Ensure deep merge for nested objects if updateDesign handles it, 
            // otherwise we pass the full object which is safer.
        });
        
        // Also update aspect ratio explicitly if needed, or rely on updateDesign
        if (theme.design.aspectRatio) {
            setAspectRatio(theme.design.aspectRatio);
        }

        toast.success(`Theme "${theme.name}" applied! 🎨`);
    };

    // Helper to check if current design matches a theme (roughly)
    const isCurrentTheme = (theme: CarouselThemePreset) => {
        // Simple check: do primary color and font match?
        // A robust check would verify all fields or use a tracked 'themeId' in store.
        return currentDesign.themeId === theme.id || 
               (currentDesign.colorPalette.primary === theme.design.colorPalette?.primary && 
                currentDesign.fonts.heading === theme.design.fonts?.heading);
    };

    return (
        <div className="space-y-4">
            {/* User Brand Kits (if any) */}
            {savedPresets.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Mis Kits de Marca</h4>
                    <div className="grid grid-cols-2 gap-3 p-1">
                        {savedPresets.map((kit) => (
                             <button
                                key={kit.id}
                                onClick={() => handleApplyTheme({ 
                                    id: kit.id, 
                                    name: kit.name, 
                                    design: { colorPalette: kit.colors, fonts: kit.fonts },
                                    previewColor: kit.colors.primary 
                                })}
                                className={cn(
                                    "group relative flex flex-col items-center gap-2 p-2 rounded-xl border text-left transition-all hover:bg-slate-50",
                                    currentDesign.themeId === kit.id 
                                        ? "border-brand-500 bg-brand-50/30 ring-1 ring-brand-500" 
                                        : "border-slate-200 hover:border-slate-300"
                                )}
                            >
                                <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow bg-white">
                                    <div className="absolute inset-0 origin-top-left w-[200%] h-[200%] scale-[0.5] pointer-events-none select-none">
                                        <SlideRenderer 
                                            slide={DUMMY_SLIDE}
                                            design={{ 
                                                ...currentDesign,
                                                colorPalette: kit.colors,
                                                fonts: kit.fonts
                                            }}
                                            author={DUMMY_AUTHOR}
                                            scale={1}
                                        /> 
                                    </div>
                                    <div className="absolute inset-0 z-10 bg-transparent" />
                                </div>
                                <div className="w-full">
                                    <span className="text-xs font-semibold text-slate-700 block truncate">{kit.name}</span>
                                    <div className="flex gap-1 mt-1 opacity-80">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: kit.colors.primary }} />
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: kit.colors.secondary }} />
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: kit.colors.accent }} />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Standard Themes */}
            <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Temas Prediseñados</h4>
                <div className="grid grid-cols-2 gap-3 p-1">
                {CAROUSEL_THEMES.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => handleApplyTheme(theme)}
                        className={cn(
                            "group relative flex flex-col items-center gap-2 p-2 rounded-xl border text-left transition-all hover:bg-slate-50",
                            isCurrentTheme(theme) 
                                ? "border-brand-500 bg-brand-50/30 ring-1 ring-brand-500" 
                                : "border-slate-200 hover:border-slate-300"
                        )}
                    >
                        {/* Visual Preview */}
                        <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
                            <div className="absolute inset-0 origin-top-left w-[200%] h-[200%] scale-[0.5] pointer-events-none select-none">
                                <SlideRenderer 
                                    slide={DUMMY_SLIDE}
                                    design={{ 
                                        ...currentDesign, // Fallback to current for missing props
                                        ...theme.design as CarouselDesign // Override with theme
                                    }}
                                    author={DUMMY_AUTHOR}
                                    scale={1} 
                                /> 
                            </div>
                            {/* Overlay to prevent interaction with slide elements */}
                            <div className="absolute inset-0 z-10 bg-transparent" />
                            
                            {/* Active Badge */}
                            {isCurrentTheme(theme) && (
                                <div className="absolute top-2 right-2 z-20 bg-brand-500 text-white rounded-full p-1 shadow-sm">
                                    <Check className="w-3 h-3" />
                                </div>
                            )}
                        </div>

                        {/* Meta */}
                        <div className="w-full">
                            <span className="text-xs font-semibold text-slate-700 block truncate">{theme.name}</span>
                            <div className="flex gap-1 mt-1 opacity-80">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.design.colorPalette?.primary }} />
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.design.colorPalette?.secondary }} />
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.design.colorPalette?.accent }} />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            </div>
        </div>
    );
};
