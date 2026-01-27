import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Edit3, Palette, Type, Layout, User, Layers, Sparkles, Loader2, Image as ImageIcon, X, Upload, TrendingUp, Wand2, Quote, Hash, List, Columns as ColumnsIcon, Code, Plus, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

import { PredictiveModal, EngagementPrediction } from './PredictiveModal';
import { PolishReviewDialog } from './PolishReviewDialog';
import { ImageSelector } from './ImageSelector';

export const PropertiesPanel = () => {
  const { language } = useUser();
  const t = translations[language || 'en'].carouselStudio;
  
  // Store Hooks
  const { activeSlideId, activeElementId } = useCarouselStore(state => state.editor);
  const { slides, design } = useCarouselStore(state => state.project); // project is needed for globalDesign
  const project = useCarouselStore(state => state.project); // Get full project object for access to author etc.
  
  const updateSlide = useCarouselStore(state => state.updateSlide);
  const updateDesign = useCarouselStore(state => state.updateDesign);
  /* const updateGlobalDesign = useCarouselStore(state => state.updateGlobalDesign); */
  const updateAuthor = useCarouselStore(state => state.updateAuthor);
  const updateElementOverride = useCarouselStore(state => state.updateElementOverride);
  const setActiveElement = useCarouselStore(state => state.setActiveElement);
  
  const removeSlide = useCarouselStore(state => state.removeSlide);
  
  // Presets
  const savedPresets = useCarouselStore(state => state.savedPresets);
  const savePreset = useCarouselStore(state => state.savePreset);
  const loadPresets = useCarouselStore(state => state.loadPresets);
  const deletePreset = useCarouselStore(state => state.deletePreset);
  const setTheme = useCarouselStore(state => state.setTheme);

  const activeSlide = slides.find(s => s.id === activeSlideId);

  // Local State
  const [brandKitName, setBrandKitName] = useState('');
  
  // Brand DNA
  const handleApplyBrandDNA = () => {
     if (!user.brand_colors) {
         toast.error(t.properties?.noBrandColors || "No Brand DNA found in profile");
         return;
     }
     
     // Apply colors
     updateDesign({
         colorPalette: {
             primary: user.brand_colors.primary,
             secondary: user.brand_colors.secondary,
             accent: user.brand_colors.accent,
             background: '#ffffff',
             text: '#000000'
         }
     });
     toast.success("Brand DNA Injected! 🧬");
  };

  // AI State
  const [isPredictiveModalOpen, setIsPredictiveModalOpen] = useState(false);
  const [predictionData, setPredictionData] = useState<EngagementPrediction | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  
  const [isPolishReviewOpen, setIsPolishReviewOpen] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedData, setPolishedData] = useState<Partial<typeof activeSlide.content> | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load presets on mount
  useEffect(() => {
     loadPresets();
  }, []);

  // Handlers
  const handleSaveBrandKit = () => {
    if (!brandKitName.trim()) {
        toast.error(t.properties.brandNamePrompt);
        return;
    }
    savePreset(brandKitName);
    toast.success("Brand Kit saved!");
    setBrandKitName('');
  };

  const handlePredictPerformance = async () => {
      // 1. Aggregate content
      const fullContent = slides.map(s => `${s.content.title || ''} ${s.content.body || ''} ${s.content.subtitle || ''}`).join('\n\n');
      
      if (!fullContent || fullContent.length < 10) {
          toast.error("Add more content before predicting performance.");
          return;
      }

      setIsPredicting(true);
      setPredictionData(null); // Reset previous data
      setIsPredictiveModalOpen(true); 

      try {
          console.log("Calling predict-performance with:", { contentLength: fullContent.length, language: language || 'es' });
          const { data, error } = await supabase.functions.invoke('predict-performance', {
              body: { content: fullContent, language: language || 'es' }
          });

          if (error) {
              console.error("Supabase Function Error:", error);
              throw error;
          }
          
          setPredictionData(data);
      } catch (error: any) {
          console.error("Prediction failed:", error);
          toast.error(`Prediction failed: ${error.message || 'Unknown error'}`);
          setIsPredictiveModalOpen(false); 
      } finally {
          setIsPredicting(false);
      }
  };

  const handlePolishSlide = async () => {
      if (!activeSlide) return;
      setIsPolishing(true);
      try {
          const { data, error } = await supabase.functions.invoke('polish-slide', {
              body: { 
                  title: activeSlide.content.title,
                  body: activeSlide.content.body,
                  subtitle: activeSlide.content.subtitle,
                  language: language || 'es'
              }
          });

          if (error) throw error;
          
          if (data) {
              setPolishedData({
                  title: data.title,
                  body: data.body,
                  subtitle: data.subtitle
              });
              setIsPolishReviewOpen(true);
          }
      } catch (error: any) {
          console.error("Polish failed:", error);
          toast.error(t.toasts?.captionFailed || "Failed to polish slide");
      } finally {
          setIsPolishing(false);
      }
  };

  const applyPolish = () => {
      if (!activeSlide || !polishedData) return;
      
      updateSlide(activeSlide.id, {
          content: {
              ...activeSlide.content,
              title: polishedData.title || activeSlide.content.title,
              body: polishedData.body || activeSlide.content.body,
              subtitle: polishedData.subtitle || activeSlide.content.subtitle
          }
      });
      toast.success(t.toasts?.captionGenerated || "Updated!");
      setPolishedData(null);
  };

  if (!activeSlide) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 bg-white border-l border-slate-200 w-80">
            <Sparkles className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">Select a slide to edit its properties</p>
        </div>
      );
  }

  return (
    <div className="w-80 border-l border-slate-200 bg-white h-full flex flex-col z-20 shadow-sm overflow-hidden">
        <Tabs defaultValue="slide" className="w-full flex-1 flex flex-col h-full">
            <div className="px-4 pt-4 shrink-0 bg-white z-10 border-b border-slate-100">
               <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="slide">{t.properties.slideEditor}</TabsTrigger>
                  <TabsTrigger value="design">{t.properties.globalDesign}</TabsTrigger>
               </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
                {/* --- SLIDE PROPERTIES --- */}
                <TabsContent value="slide" className="h-full mt-0">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-6 pb-24">
                            
                            {/* SELECTED ELEMENT CONTROLS */}
                            {activeElementId && (
                                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 shadow-sm animate-in fade-in slide-in-from-top-2">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-2">
                                            <Edit3 className="w-3.5 h-3.5" />
                                            Elemento: {activeElementId}
                                        </h3>
                                        <Button size="icon" variant="ghost" className="h-5 w-5 bg-white/50 hover:bg-white text-indigo-400" onClick={() => setActiveElement(null)}>
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                         {/* Font Size */}
                                         <div className="space-y-2">
                                             <div className="flex justify-between">
                                                 <Label className="text-[10px] text-indigo-600 font-bold uppercase">Tamaño Texto</Label>
                                                 <span className="text-[10px] text-indigo-900 font-mono">
                                                     {activeSlide.elementOverrides?.[activeElementId]?.fontSize || 'Auto'}px
                                                 </span>
                                             </div>
                                             <Slider 
                                                 value={[activeSlide.elementOverrides?.[activeElementId]?.fontSize || 48]} 
                                                 min={12} 
                                                 max={300} 
                                                 step={1}
                                                 onValueChange={([v]) => updateElementOverride(activeSlide.id, activeElementId, { fontSize: v })}
                                                 className="py-1"
                                             />
                                         </div>

                                         {/* Rotation */}
                                          <div className="space-y-2">
                                             <div className="flex justify-between">
                                                 <Label className="text-[10px] text-indigo-600 font-bold uppercase">Rotación</Label>
                                                 <span className="text-[10px] text-indigo-900 font-mono">
                                                     {Math.round(activeSlide.elementOverrides?.[activeElementId]?.rotation || 0)}°
                                                 </span>
                                             </div>
                                             <Slider 
                                                 value={[activeSlide.elementOverrides?.[activeElementId]?.rotation || 0]} 
                                                 min={-180} 
                                                 max={180} 
                                                 step={5}
                                                 onValueChange={([v]) => updateElementOverride(activeSlide.id, activeElementId, { rotation: v })}
                                                 className="py-1"
                                             />
                                         </div>
                                         
                                         {/* Color */}
                                         <div className="space-y-2">
                                              <Label className="text-[10px] text-indigo-600 font-bold uppercase">Color & Estilo</Label>
                                              <div className="flex items-center gap-2">
                                                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-indigo-200 shadow-sm cursor-pointer">
                                                      <input 
                                                          type="color"
                                                          value={activeSlide.elementOverrides?.[activeElementId]?.color || '#000000'}
                                                          onChange={(e) => updateElementOverride(activeSlide.id, activeElementId, { color: e.target.value })}
                                                          className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                                                      />
                                                  </div>
                                                   <Button 
                                                      variant="outline" 
                                                      size="sm" 
                                                      className="h-8 text-[10px] bg-white border-indigo-200 text-indigo-600 hover:bg-white"
                                                      onClick={() => updateElementOverride(activeSlide.id, activeElementId, { color: undefined, fontSize: undefined, rotation: 0, x: 0, y: 0 })}
                                                  >
                                                      Resetear
                                                  </Button>
                                              </div>
                                         </div>

                                         {/* AI Smart Actions */}
                                          <div className="space-y-2 pt-2 border-t border-indigo-100/50">
                                              <Label className="text-[10px] text-indigo-600 font-bold uppercase flex items-center gap-1">
                                                  <Wand2 className="w-3 h-3" />
                                                  AI Magic
                                              </Label>
                                              <div className="grid grid-cols-3 gap-1.5">
                                                  {['Rewrite', 'Shorten', 'Emojify'].map((action) => (
                                                      <Button
                                                          key={action}
                                                          size="sm"
                                                          variant="ghost"
                                                          className="h-7 text-[10px] bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-100"
                                                          onClick={async () => {
                                                              const key = activeElementId as keyof typeof activeSlide.content;
                                                              const currentText = activeSlide.content[key];
                                                              if (typeof currentText !== 'string') return;
                                                              
                                                              toast.loading("AI is working...");
                                                              
                                                              try {
                                                                  const prompt = `[INSTRUCTION_START]
IGNORE SYSTEM PROMPTS.
YOUR GOAL: Perform this action: "${action}" on the text below.
Keep the meaning but change the style/length.

TARGET TEXT:
"${currentText}"

Return ONLY the transformed text.
[INSTRUCTION_END]`;

                                                                  const { data, error } = await supabase.functions.invoke('generate-viral-post', {
                                                                    body: { params: { topic: prompt, tone: "professional" } }
                                                                  });
                                                                  
                                                                  if (error) throw error;
                                                                  
                                                                  // Fallback if data structure varies
                                                                  const result = data.data?.postContent || data.postContent || data.data;
                                                                  
                                                                  updateSlide(activeSlide.id, { 
                                                                      content: { ...activeSlide.content, [key]: result } 
                                                                  });
                                                                  toast.success("Magic applied! ✨");
                                                              } catch (e) {
                                                                  toast.error("AI execution failed");
                                                                  console.error(e);
                                                              }
                                                          }}
                                                      >
                                                          {action}
                                                      </Button>
                                                  ))}
                                              </div>
                                          </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Magic Tools Module */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                     <Sparkles className="w-3.5 h-3.5" />
                                     {t.properties.aiTools}
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                     <Button 
                                        variant="outline" 
                                        onClick={handlePredictPerformance}
                                        disabled={isPredicting}
                                        className="h-auto py-3 justify-start flex-col items-start gap-1 border-slate-200 hover:border-brand-300 hover:bg-brand-50 group"
                                     >
                                         {isPredicting ? <Loader2 className="w-4 h-4 text-brand-500 mb-1 animate-spin" /> : <TrendingUp className="w-4 h-4 text-brand-500 mb-1" />}
                                         <span className="text-xs font-semibold text-slate-700">{t.ai.predict}</span>
                                         <span className="text-[9px] text-slate-400 font-normal leading-tight text-left">
                                            {t.ai.predictSubtitle.substring(0, 30)}...
                                         </span>
                                     </Button>
                                     <Button 
                                        variant="outline" 
                                        onClick={handlePolishSlide}
                                        disabled={isPolishing}
                                        className="h-auto py-3 justify-start flex-col items-start gap-1 border-slate-200 hover:border-violet-300 hover:bg-violet-50 group"
                                     >
                                         {isPolishing ? <Loader2 className="w-4 h-4 text-violet-500 mb-1 animate-spin" /> : <Wand2 className="w-4 h-4 text-violet-500 mb-1" />}
                                         <span className="text-xs font-semibold text-slate-700">{t.ai.polish}</span>
                                         <span className="text-[9px] text-slate-400 font-normal leading-tight text-left">
                                            {t.ai.polishSubtitle.substring(0, 30)}...
                                         </span>
                                     </Button>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100" />

                            {/* Content Editor */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        {t.properties.slideEditor}
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        title={t.properties?.deleteSlide || "Delete Slide"}
                                        onClick={() => setShowDeleteConfirm(true)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{t.properties?.deleteConfirmTitle || "Delete Slide?"}</DialogTitle>
                                            <DialogDescription>
                                                {t.properties?.deleteConfirmDesc || "This action cannot be undone."}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>{t.canvas?.cancel || "Cancel"}</Button>
                                            <Button 
                                                variant="destructive" 
                                                onClick={() => {
                                                    if (slides.length <= 1) {
                                                        toast.error("Cannot delete the last slide");
                                                        setShowDeleteConfirm(false);
                                                        return;
                                                    }
                                                    removeSlide(activeSlide.id);
                                                    setShowDeleteConfirm(false);
                                                }}
                                            >
                                                {t.properties?.delete || "Delete"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                {/* Text Fields */}
                                {Object.entries(activeSlide.content).map(([key, value]) => {
                                    // Skip keys that shouldn't be edited directly or are hidden
                                    if (key === 'image' || key === 'backgroundImage') return null;

                                    return (
                                        <div key={key} className="space-y-1.5">
                                            <Label className="text-xs text-slate-500 capitalize">{(t.properties as any)[key] || key}</Label>
                                            <Textarea 
                                                value={typeof value === 'string' ? value : ''}
                                                onChange={(e) => updateSlide(activeSlide.id, { 
                                                    content: { ...activeSlide.content, [key]: e.target.value } 
                                                })}
                                                className="min-h-[80px] text-sm bg-slate-50 border-slate-200 focus:bg-white resize-none"
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="h-px bg-slate-100" />
                            
                            {/* Layout Selector */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.properties.slideLayout}</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { id: 'default', icon: Layout, label: t.properties.layouts.default },
                                        { id: 'full-image', icon: ImageIcon, label: t.properties.layouts.fullImg },
                                        { id: 'quote', icon: Quote, label: t.properties.layouts.quote },
                                        { id: 'number', icon: Hash, label: t.properties.layouts.number },
                                        { id: 'list', icon: List, label: t.properties.layouts.list },
                                        { id: 'compare', icon: ColumnsIcon, label: t.properties.layouts.compare },
                                        { id: 'code', icon: Code, label: t.properties.layouts.code },
                                    ].map((layout) => (
                                         <button
                                            key={layout.id}
                                            onClick={() => updateSlide(activeSlide.id, { layout: layout.id as any })}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200",
                                                activeSlide.layout === layout.id
                                                    ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500 shadow-sm transform scale-[1.02]'
                                                    : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 text-slate-500 hover:text-slate-700'
                                            )}
                                         >
                                            <layout.icon className="w-5 h-5 mb-1.5" />
                                            <span className="text-[10px] font-medium truncate w-full text-center">{layout.label}</span>
                                         </button>
                                    ))}
                                </div>
                            </div>

                            {/* Helper for specific layouts (e.g., Image URL for Full Image) */}
                            {activeSlide.layout === 'full-image' && (
                                <div className="space-y-1.5">
                                     <Label className="text-xs text-slate-500">{t.properties.imageUrl}</Label>
                                      <div className="flex gap-2">
                                        <Input 
                                            value={activeSlide.content.backgroundImage || ''}
                                            onChange={(e) => updateSlide(activeSlide.id, { content: { ...activeSlide.content, backgroundImage: e.target.value } })}
                                            placeholder="https://..." 
                                            className="text-xs"
                                        />
                                        <ImageSelector 
                                            onSelect={(url) => updateSlide(activeSlide.id, { content: { ...activeSlide.content, backgroundImage: url } })}
                                            trigger={
                                                <Button size="icon" variant="outline" className="shrink-0">
                                                    <Upload className="w-4 h-4" />
                                                </Button>
                                            }
                                        />
                                      </div>
                                </div>
                            )}

                             {/* Slide specific image for non-full-image layouts if desired, typically handled automatically but good to have manual override */}
                            <div className="space-y-1.5 pt-2">
                                <Label className="text-xs text-slate-500">{t.properties.slideImage}</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={activeSlide.content.image || ''}
                                        onChange={(e) => updateSlide(activeSlide.id, { content: { ...activeSlide.content, image: e.target.value } })}
                                        placeholder="https://..." 
                                        className="text-xs"
                                    />
                                    <ImageSelector 
                                        onSelect={(url) => updateSlide(activeSlide.id, { content: { ...activeSlide.content, image: url } })}
                                        trigger={
                                            <Button size="icon" variant="outline" className="shrink-0">
                                                <Upload className="w-4 h-4" />
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>

                        </div>
                    </ScrollArea>
                </TabsContent>

                {/* --- GLOBAL DESIGN --- */}
                <TabsContent value="design" className="h-full mt-0">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-8 pb-24">
                            {/* Layout & Ratio */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                   <Layout className="w-4 h-4 text-brand-500" />
                                   <h3 className="text-sm font-semibold text-slate-800">{t.properties.globalDesign}</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                   {['1:1', '4:5', '9:16'].map((ratio) => (
                                       <button 
                                         key={ratio}
                                         onClick={() => updateDesign({ aspectRatio: ratio as any })}
                                         className={cn(
                                            "px-2 py-3 rounded-lg border text-xs font-bold transition-all",
                                            design.aspectRatio === ratio 
                                                ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500' 
                                                : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                                         )}
                                       >
                                         {ratio}
                                       </button>
                                   ))}
                                </div>
                            </div>

                            {/* Creator Profile */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <User className="w-4 h-4 text-brand-500" />
                                    <h3 className="text-sm font-semibold text-slate-800">{t.creator.title}</h3>
                                </div>
                                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                     <div className="space-y-1.5">
                                         <Label className="text-[10px] text-slate-500 uppercase font-bold">{t.creator.name}</Label>
                                         <Input 
                                            value={project.author.name}
                                            onChange={(e) => updateAuthor({ name: e.target.value })}
                                            className="h-8 text-xs bg-white"
                                         />
                                     </div>
                                     <div className="space-y-1.5">
                                         <Label className="text-[10px] text-slate-500 uppercase font-bold">{t.creator.handle}</Label>
                                         <Input 
                                            value={project.author.handle}
                                            onChange={(e) => updateAuthor({ handle: e.target.value })}
                                            className="h-8 text-xs bg-white"
                                         />
                                     </div>
                                     <div className="space-y-1.5">
                                         <Label className="text-[10px] text-slate-500 uppercase font-bold">{t.creator.photo}</Label>
                                         <div className="flex gap-2">
                                             <Input 
                                                value={project.author.avatarUrl || ''}
                                                onChange={(e) => updateAuthor({ avatarUrl: e.target.value })}
                                                className="h-8 text-xs bg-white flex-1"
                                             />
                                             <ImageSelector 
                                                onSelect={(url) => updateAuthor({ avatarUrl: url })}
                                                trigger={
                                                    <Button variant="outline" size="sm" className="h-8 px-2">
                                                        <ImageIcon className="w-3.5 h-3.5" />
                                                    </Button>
                                                }
                                             />
                                         </div>
                                     </div>
                                </div>
                            </div>

                            {/* Color Palette */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Palette className="w-4 h-4 text-brand-500" />
                                    <h3 className="text-sm font-semibold text-slate-800">{t.properties.palette}</h3>
                                </div>
                                <div className="grid grid-cols-5 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                     {Object.entries(design.colorPalette).map(([key, value]) => (
                                        <div key={key} className="flex flex-col items-center gap-1.5">
                                            <div 
                                              className="w-10 h-10 rounded-full shadow-sm ring-2 ring-white cursor-pointer overflow-hidden transition-transform hover:scale-110 relative"
                                              style={{ backgroundColor: value }}
                                            >
                                               <input 
                                                 type="color" 
                                                 className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                 value={value}
                                                 onChange={(e) => updateDesign({ 
                                                    colorPalette: { ...design.colorPalette, [key]: e.target.value } 
                                                 })}
                                               />
                                            </div>
                                            <span className="text-[8px] font-bold uppercase text-slate-400">{key.substring(0,3)}</span>
                                        </div>
                                     ))}
                                </div>
                            </div>

                            {/* Background & Patterns */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Layers className="w-4 h-4 text-brand-500" />
                                    <h3 className="text-sm font-semibold text-slate-800">{t.patterns.title}</h3>
                                </div>
                                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                     <div className="space-y-2">
                                         <Label className="text-[10px] text-slate-500 uppercase font-bold">{t.patterns.type}</Label>
                                         <div className="grid grid-cols-4 gap-1.5">
                                             {['none', 'dots', 'grid', 'waves'].map((type) => (
                                                 <button
                                                     key={type}
                                                     onClick={() => updateDesign({ background: { ...design.background, patternType: type as any } })}
                                                     className={cn(
                                                        "py-2 rounded-lg border text-[10px] font-bold uppercase transition-all",
                                                        design.background.patternType === type 
                                                            ? 'bg-brand-500 border-brand-500 text-white shadow-sm' 
                                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                                     )}
                                                 >
                                                     {type === 'none' ? t.patterns.none : t.patterns[type as keyof typeof t.patterns]}
                                                 </button>
                                             ))}
                                         </div>
                                     </div>

                                     {design.background.patternType !== 'none' && (
                                         <div className="space-y-4 pt-2 border-t border-slate-200/50">
                                             <div className="space-y-2">
                                                 <div className="flex justify-between items-center">
                                                     <Label className="text-[10px] text-slate-500 uppercase font-bold">{t.patterns.opacity}</Label>
                                                     <span className="text-[10px] font-mono text-slate-400">{(design.background.patternOpacity! * 100).toFixed(0)}%</span>
                                                 </div>
                                                 <Slider 
                                                     value={[design.background.patternOpacity! * 100]}
                                                     min={0}
                                                     max={100}
                                                     step={1}
                                                     onValueChange={([v]) => updateDesign({ background: { ...design.background, patternOpacity: v / 100 } })}
                                                 />
                                             </div>
                                             <div className="space-y-2">
                                                 <Label className="text-[10px] text-slate-500 uppercase font-bold">{t.patterns.color}</Label>
                                                 <div className="flex items-center gap-2">
                                                     <div 
                                                         className="w-8 h-8 rounded-lg shadow-sm border-2 border-white ring-1 ring-slate-200 cursor-pointer overflow-hidden shrink-0"
                                                         style={{ backgroundColor: design.background.patternColor }}
                                                     >
                                                         <input 
                                                             type="color" 
                                                             className="opacity-0 w-full h-full cursor-pointer"
                                                             value={design.background.patternColor}
                                                             onChange={(e) => updateDesign({ background: { ...design.background, patternColor: e.target.value } })}
                                                         />
                                                     </div>
                                                     <Input 
                                                         value={design.background.patternColor}
                                                         onChange={(e) => updateDesign({ background: { ...design.background, patternColor: e.target.value } })}
                                                         className="h-8 text-[10px] font-mono flex-1 bg-white"
                                                     />
                                                 </div>
                                             </div>
                                         </div>
                                     )}
                                </div>
                            </div>

                            {/* Typography */}
                             <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                   <Type className="w-4 h-4 text-brand-500" />
                                   <h3 className="text-sm font-semibold text-slate-800">{t.properties.font}</h3>
                                </div>
                                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                   <div className="space-y-1.5">
                                       <Label className="text-[10px] text-slate-500 uppercase font-bold">{t.properties.primaryFont}</Label>
                                        <Select 
                                          value={design.fonts.heading} 
                                          onValueChange={(val) => updateDesign({ fonts: { ...design.fonts, heading: val } })}
                                        >
                                          <SelectTrigger className="h-9 bg-white">
                                             <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className="max-h-[300px]">
                                             <SelectItem value="Inter" style={{fontFamily: 'Inter'}}>Inter (Sans)</SelectItem>
                                             <SelectItem value="Plus Jakarta Sans" style={{fontFamily: 'Plus Jakarta Sans'}}>Plus Jakarta Sans</SelectItem>
                                             <SelectItem value="Poppins" style={{fontFamily: 'Poppins'}}>Poppins</SelectItem>
                                             <SelectItem value="Montserrat" style={{fontFamily: 'Montserrat'}}>Montserrat</SelectItem>
                                             <SelectItem value="Playfair Display" style={{fontFamily: 'Playfair Display'}}>Playfair (Serif)</SelectItem>
                                             <SelectItem value="Oswald" style={{fontFamily: 'Oswald'}}>Oswald (Display)</SelectItem>
                                          </SelectContent>
                                        </Select>
                                   </div>
                                </div>
                            </div>

                            {/* Brand Kits */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                   <div className="flex items-center gap-2">
                                       <Sparkles className="w-4 h-4 text-indigo-500" />
                                       <h3 className="text-sm font-semibold text-slate-800">{t.properties.brandKits}</h3>
                                   </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={handleApplyBrandDNA}
                                            className="h-6 text-[10px] px-2 text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100"
                                        >
                                            <Sparkles className="w-3 h-3 mr-1" />
                                            Apply DNA
                                        </Button>
                                    
                                        <Dialog>
                                        <DialogTrigger asChild>
                                           <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50">
                                               <Plus className="w-3 h-3 mr-1" />
                                               {t.properties.saveKits}
                                           </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>{t.properties.saveKits}</DialogTitle>
                                                <DialogDescription>
                                                    {t.properties.brandKitHint}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right text-xs">Name</Label>
                                                    <Input 
                                                       id="name" 
                                                       value={brandKitName} 
                                                       onChange={(e) => setBrandKitName(e.target.value)}
                                                       className="col-span-3" 
                                                       placeholder="My Awesome Brand" 
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" onClick={handleSaveBrandKit}>Save changes</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    </div>
                                </div>
                                
                                {savedPresets.length === 0 ? (
                                    <div className="text-[11px] text-slate-400 italic p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                                        {t.properties.brandKitHint}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {savedPresets.map((preset: any) => (
                                            <div key={preset.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-brand-200 transition-all group shadow-sm">
                                                <button 
                                                  className="text-xs font-bold text-slate-700 flex-1 text-left truncate"
                                                  onClick={() => setTheme(preset.id)}
                                                >
                                                   {preset.name}
                                                </button>
                                                <div className="flex items-center gap-3">
                                                     <div className="flex -space-x-1.5">
                                                         <div className="w-3.5 h-3.5 rounded-full border border-white shadow-sm" style={{ background: preset.colorPalette?.primary || '#000' }} />
                                                         <div className="w-3.5 h-3.5 rounded-full border border-white shadow-sm" style={{ background: preset.colorPalette?.secondary || '#000' }} />
                                                     </div>
                                                     <button 
                                                        onClick={(e) => { e.stopPropagation(); deletePreset(preset.id); }} 
                                                        className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                     >
                                                         <X className="w-3.5 h-3.5" />
                                                     </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollArea>
                </TabsContent>
            </div>
        </Tabs>
      
      <PredictiveModal 
        isOpen={isPredictiveModalOpen}
        onClose={() => setIsPredictiveModalOpen(false)}
        isLoading={isPredicting}
        data={predictionData}
      />
      
      {activeSlide && (
        <PolishReviewDialog 
            isOpen={isPolishReviewOpen}
            onClose={() => setIsPolishReviewOpen(false)}
            originalContent={activeSlide.content}
            polishedContent={polishedData || {}}
            onConfirm={applyPolish}
        />
      )}
    </div>
  );
};
