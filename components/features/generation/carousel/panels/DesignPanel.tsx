import React, { useState, useEffect } from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { MASTER_TEMPLATES } from '@/lib/constants/CarouselTemplates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wand2, Image as ImageIcon, Loader2, Palette, CheckCircle2, Briefcase, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { translations } from '@/translations';
import { AppLanguage } from '@/types';

export const DesignPanel = () => {
    const { project, updateDesign, savedPresets, savePreset, loadPresets, deletePreset, isLoadingPresetes } = useCarouselStore();
    const { design } = project;
    const { user, language } = useUser();

    // Translation Helper
    const t = (path: string, params?: Record<string, string>) => {
        const keys = path.split('.');
        let current: any = translations[(language as AppLanguage) || 'en'];
        
        for (const k of keys) {
            if (current?.[k] === undefined) return path;
            current = current[k];
        }
        
        let result = typeof current === 'string' ? current : path;
        
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                result = result.replace(`{{${key}}}`, value);
            });
        }
        return result;
    };

    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingThemeId, setLoadingThemeId] = useState<string | null>(null);
    
    // Brand Kit State
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [newKitName, setNewKitName] = useState('');

    useEffect(() => {
        if (user?.id) {
            loadPresets(user.id);
        }
    }, [user?.id]);

    const updateTheme = (themeId: string) => {
        if (loadingThemeId) return;
        setLoadingThemeId(themeId);
        
        // Check if it's a saved preset (Brand Kit)
        const savedKit = savedPresets.find(k => k.id === themeId);
        
        if (savedKit) {
             updateDesign({
                   themeId: savedKit.id,
                   colorPalette: savedKit.colors,
                   fonts: savedKit.fonts,
                   // Background not strictly part of brand kit usually, but could be optional
             });
             toast.success(t('carouselStudio.brandKit.applied', { name: savedKit.name }));
             setLoadingThemeId(null);
             return;
        }

        // Built-in templates
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
               toast.success(`Tema "${themeId.replace('_', ' ')}" aplicado`);
            }
            setLoadingThemeId(null);
        }, 500);
    };
    
    const handleSaveKit = async () => {
        if (!newKitName || !user) return;
        try {
            await savePreset(newKitName, user.id);
            toast.success(t('carouselStudio.brandKit.savedSuccess'));
            setIsSaveDialogOpen(false);
            setNewKitName('');
        } catch (error) {
            toast.error(t('carouselStudio.brandKit.saveError'));
        }
    };

    const handleDeleteKit = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm(t('carouselStudio.brandKit.deleteConfirm'))) return;
        await deletePreset(id);
        toast.success(t('carouselStudio.brandKit.deletedSuccess'));
    };
    
    const handleGenerateBackground = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        toast.loading("Diseñando tu fondo con IA...");

        try {
            const { data, error } = await supabase.functions.invoke('generate-image', {
                body: { 
                    prompt: `Professional LinkedIn background texture, abstract, aesthetic: ${prompt}`,
                    size: '1024x1024'
                }
            });

            if (error) throw error;
            
            if (data?.image_url) {
                updateDesign({
                    background: {
                        type: 'image',
                        value: data.image_url,
                        patternType: 'none'
                    }
                });
                toast.success("¡Fondo generado y aplicado!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error generando el fondo");
            // Fallback simulado
            const mockUrl = `https://source.unsplash.com/random/1080x1350/?${encodeURIComponent(prompt)},background`;
            updateDesign({
                background: {
                    type: 'image',
                    value: mockUrl,
                    patternType: 'none'
                }
            });
            toast.success("Imagen de stock aplicada (Simulación)");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Sección de Brand Kits */}
            <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-brand-500" />
                            {t('carouselStudio.brandKit.title')}
                        </h3>
                        <p className="text-xs text-slate-500">{t('carouselStudio.brandKit.description')}</p>
                    </div>
                    
                    <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 border-brand-200 text-brand-700 bg-brand-50 hover:bg-brand-100">
                                <Plus className="w-3 h-3" />
                                {t('carouselStudio.brandKit.saveCurrent')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('carouselStudio.brandKit.saveDialogTitle')}</DialogTitle>
                                <DialogDescription>
                                    {t('carouselStudio.brandKit.saveDialogDesc')}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-2">
                                <Label>{t('carouselStudio.brandKit.kitNameLabel')}</Label>
                                <Input 
                                    value={newKitName} 
                                    onChange={(e) => setNewKitName(e.target.value)} 
                                    placeholder={t('carouselStudio.brandKit.kitNamePlaceholder')}
                                    className="mt-2"
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSaveKit} disabled={!newKitName}>{t('carouselStudio.brandKit.saveButton')}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoadingPresetes ? (
                    <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
                ) : savedPresets.length === 0 ? (
                    <div className="text-center p-6 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                        <p className="text-xs text-slate-400">{t('carouselStudio.brandKit.emptyState')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {savedPresets.map((kit) => {
                             const isActive = design.themeId === kit.id;
                             return (
                                <div 
                                    key={kit.id}
                                    onClick={() => updateTheme(kit.id)}
                                    className={cn(
                                        "group relative p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-sm bg-white",
                                        isActive ? "border-brand-500 ring-1 ring-brand-500/20" : "border-slate-100 hover:border-brand-200"
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                         <span className="font-semibold text-xs text-slate-700 truncate pr-2">{kit.name}</span>
                                         {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />}
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                        {[kit.colors.primary, kit.colors.secondary, kit.colors.accent].map((c, i) => (
                                            <div key={i} className="w-4 h-4 rounded-full border border-slate-100" style={{backgroundColor: c}} />
                                        ))}
                                    </div>
                                    <button 
                                        onClick={(e) => handleDeleteKit(e, kit.id)}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-md transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3 text-red-500" />
                                    </button>
                                </div>
                             )
                        })}
                    </div>
                )}
            </div>

            <div className="w-full h-px bg-slate-100" />

            {/* Sección de Temas Visuales */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-brand-500" />
                        Galería de Temas
                    </h3>
                    <p className="text-xs text-slate-500">Estilos curados por expertos para viralidad.</p>
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
                                
                                <div className="flex items-stretch h-20">
                                    {/* Preview Strips */}
                                    <div className="w-20 flex-shrink-0 relative overflow-hidden bg-slate-100 border-r border-slate-100">
                                        <div 
                                            className="absolute inset-0"
                                            style={{ backgroundColor: template.colorPalette.background }}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: template.colorPalette.primary, opacity: 0.2 }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-3 flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-sm text-slate-700 capitalize">
                                                {template.themeId.replace(/_/g, ' ')}
                                            </span>
                                            {isActive && !isLoading && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            {[template.colorPalette.primary, template.colorPalette.secondary, template.colorPalette.accent, template.colorPalette.background].map((color, i) => (
                                                <div key={i} className="w-3.5 h-3.5 rounded-full border border-slate-100 shadow-sm" style={{ backgroundColor: color }} />
                                            ))}
                                        </div>
                                        <div className="mt-1.5 text-[10px] text-slate-400 font-medium">
                                            {template.fonts.heading}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="w-full h-px bg-slate-100" />

            {/* Sección de IA Background */}
            <div className="space-y-3">
                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-brand-500" />
                        Generador de Fondos IA
                    </h3>
                    <p className="text-xs text-slate-500">¿Buscas algo único? Describe tu textura ideal.</p>
                </div>

                <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="space-y-1">
                        <Label className="text-xs font-semibold text-slate-600">Prompt Mágico</Label>
                        <Input 
                            placeholder="Ej. Gradiente geométrico azul minimalista..." 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="text-xs h-9 bg-white"
                        />
                    </div>
                    <Button 
                        className="w-full h-8 text-xs bg-slate-900 text-white hover:bg-slate-800" 
                        onClick={handleGenerateBackground}
                        disabled={isGenerating || !prompt}
                    >
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <ImageIcon className="w-3 h-3 mr-2" />}
                        Generar Textura
                    </Button>
                </div>
            </div>
        </div>
    );
};
