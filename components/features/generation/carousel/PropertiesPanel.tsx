import React from 'react';
import { cn } from '@/lib/utils';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Edit3, Palette, Type, Layout, User, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { PredictiveModal, EngagementPrediction } from './PredictiveModal';
import { PolishReviewDialog } from './PolishReviewDialog';
import { Sparkles, Loader2, Image as ImageIcon, X, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '../../../ui/slider';

import { ImageSelector } from './ImageSelector';

export const PropertiesPanel = () => {
  const { language } = useUser();
  const t = translations[language || 'en'].carouselStudio;
  const { activeSlideId } = useCarouselStore(state => state.editor);
  const { slides, design } = useCarouselStore(state => state.project);
  const updateSlide = useCarouselStore(state => state.updateSlide);
  const updateDesign = useCarouselStore(state => state.updateDesign); 

  const activeSlide = slides.find(s => s.id === activeSlideId);
  
  // Presets
  const savedPresets = useCarouselStore(state => state.savedPresets);
  const savePreset = useCarouselStore(state => state.savePreset);
  const loadPresets = useCarouselStore(state => state.loadPresets);
  const deletePreset = useCarouselStore(state => state.deletePreset);
  const setTheme = useCarouselStore(state => state.setTheme);

  React.useEffect(() => {
     loadPresets();
  }, []);

  const handleSavePreset = () => {
      // Simple prompt for now, can be a dialog later
      const name = window.prompt(t.properties?.brandNamePrompt || "Name your Brand Kit:"); // Ensure translation key exists or fallback
      if (name) {
          savePreset(name);
          toast.success("Brand Kit saved!");
      }
  };

  const [isPredictiveModalOpen, setIsPredictiveModalOpen] = React.useState(false);
  const [predictionData, setPredictionData] = React.useState<EngagementPrediction | null>(null);
  const [isPredicting, setIsPredicting] = React.useState(false);
  const [isPolishing, setIsPolishing] = React.useState(false);
  
  // Polish Review State
  const [isPolishReviewOpen, setIsPolishReviewOpen] = React.useState(false);
  const [polishedData, setPolishedData] = React.useState<Partial<typeof activeSlide.content> | null>(null);

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
          toast.error("Failed to polish slide");
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
      toast.success("Slide polished successfully!");
      setPolishedData(null);
  };

  const handlePredictPerformance = async () => {
      // 1. Aggregate content
      const fullContent = slides.map(s => `${s.content.title} ${s.content.body} ${s.content.subtitle || ''}`).join('\n\n');
      
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
          
          console.log("Prediction Success:", data);
          setPredictionData(data);
      } catch (error: any) {
          console.error("Prediction failed:", error);
          toast.error(`Prediction failed: ${error.message || 'Unknown error'}`);
          setIsPredictiveModalOpen(false); 
      } finally {
          setIsPredicting(false);
      }
  };

  return (
    <div className="w-80 border-l border-slate-200 bg-white h-full flex flex-col z-20 shadow-sm transition-all overflow-hidden">
      <Tabs defaultValue="edit" className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="px-4 pt-4 border-b border-slate-100 bg-white shrink-0">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                 <Edit3 className="w-3.5 h-3.5" /> {t.tabs.slide}
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2">
                 <Palette className="w-3.5 h-3.5" /> {t.tabs.design}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
                {/* EDIT TAB */}
                <TabsContent value="edit" className="m-0 h-full animate-in slide-in-from-left-4 duration-300 outline-none">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-8 pb-24">
                            {/* AI TOOLS SECTION */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-4 h-4 text-brand-500" />
                                    <h3 className="text-sm font-semibold text-slate-800">AI Magic Tools</h3>
                                </div>
                                
                                <div className="grid gap-3">
                                    {/* AI PREDICT */}
                                    <div className="p-3 bg-gradient-to-br from-brand-50/50 to-indigo-50/50 rounded-xl border border-brand-100/50 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-white rounded-lg shadow-sm text-brand-600">
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                </div>
                                                <h4 className="font-bold text-xs text-brand-900">{t.ai.predict}</h4>
                                            </div>
                                            <button
                                                onClick={handlePredictPerformance}
                                                disabled={isPredicting}
                                                className="px-3 py-1 bg-white border border-brand-200 shadow-sm rounded-lg text-[10px] font-bold text-brand-700 hover:bg-brand-50 disabled:opacity-50 transition-all flex items-center gap-1.5"
                                            >
                                                {isPredicting ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />}
                                                {t.ai.predict}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-brand-700/70 leading-snug">
                                            {t.ai.predictSubtitle}
                                        </p>
                                    </div>

                                    {/* AI POLISH */}
                                    <div className="p-3 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 rounded-xl border border-indigo-100/50 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-white rounded-lg shadow-sm text-indigo-600">
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </div>
                                                <h4 className="font-bold text-xs text-indigo-900">{t.ai.polish}</h4>
                                            </div>
                                            <button
                                                onClick={handlePolishSlide}
                                                disabled={isPolishing}
                                                className="px-3 py-1 bg-white border border-indigo-200 shadow-sm rounded-lg text-[10px] font-bold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 transition-all flex items-center gap-1.5"
                                            >
                                                {isPolishing ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />}
                                                {t.ai.optimizeBtn}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-indigo-700/70 leading-snug">
                                            {t.ai.polishSubtitle}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CONTENT EDIT SECTION */}
                            {activeSlide && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.properties.slideEditor}</h3>
                                        <button 
                                            onClick={() => {
                                                if (globalThis.confirm(t.properties.deleteConfirm)) {
                                                    useCarouselStore.getState().removeSlide(activeSlide.id);
                                                }
                                            }}
                                            className="text-red-500 hover:text-red-600 transition-colors p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-500 uppercase">{t.properties.title}</Label>
                                            <Textarea 
                                                value={activeSlide.content.title}
                                                onChange={(e) => updateSlide(activeSlide.id, { content: { ...activeSlide.content, title: e.target.value } })}
                                                className="min-h-[80px] text-sm resize-none"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-500 uppercase">{t.properties.body}</Label>
                                            <Textarea 
                                                value={activeSlide.content.body}
                                                onChange={(e) => updateSlide(activeSlide.id, { content: { ...activeSlide.content, body: e.target.value } })}
                                                className="min-h-[120px] text-sm resize-none"
                                            />
                                        </div>

                                        {activeSlide.type === 'intro' && (
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase">{t.properties.subtitle}</Label>
                                                <Input 
                                                    value={activeSlide.content.subtitle}
                                                    onChange={(e) => updateSlide(activeSlide.id, { content: { ...activeSlide.content, subtitle: e.target.value } })}
                                                    className="h-9 text-sm"
                                                />
                                            </div>
                                        )}

                                        {activeSlide.type === 'outro' && (
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase">CTA</Label>
                                                <Input 
                                                    value={activeSlide.content.cta_text}
                                                    onChange={(e) => updateSlide(activeSlide.id, { content: { ...activeSlide.content, cta_text: e.target.value } })}
                                                    className="h-9 text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* SLIDE LAYOUT */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Layout className="w-4 h-4 text-brand-500" />
                                            <h3 className="text-sm font-semibold text-slate-800">Slide Layout</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs text-slate-500">Slide Layout</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { id: 'default', label: 'Default', icon: <Layout className="w-4 h-4" /> },
                                                { id: 'image-full', label: 'Full Img', icon: <ImageIcon className="w-4 h-4" /> },
                                                { id: 'quote', label: 'Quote', icon: <div className="text-[10px] font-serif font-bold">""</div> },
                                                { id: 'big-number', label: 'Number', icon: <span className="text-[10px] font-bold">#1</span> },
                                                { id: 'checklist', label: 'List', icon: <CheckCircle className="w-4 h-4" /> },
                                                { id: 'comparison', label: 'Compare', icon: <div className="flex text-[8px] gap-0.5"><div className="w-2 h-3 bg-slate-300"/><div className="w-2 h-3 bg-brand-500"/></div> },
                                                { id: 'code', label: 'Code', icon: <div className="font-mono text-[8px]">&lt;/&gt;</div> },
                                            ].map((layout) => (
                                                <button
                                                    key={layout.id}
                                                    onClick={() => updateSlide(activeSlide.id, { layoutVariant: layout.id as any })}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-2 rounded-lg border transition-all h-20 gap-2",
                                                        activeSlide.layoutVariant === layout.id 
                                                            ? "bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500 shadow-sm"
                                                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                                                    )}
                                                >
                                                    <div className={cn("p-1.5 rounded-md", activeSlide.layoutVariant === layout.id ? "bg-white shadow-sm" : "bg-slate-100")}>
                                                        {layout.icon}
                                                    </div>
                                                    <span className="text-[10px] font-medium">{layout.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                        </div>
                                    </div>

                                    {/* IMAGE UPLOAD */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <ImageIcon className="w-4 h-4 text-brand-500" />
                                            <h3 className="text-sm font-semibold text-slate-800">Slide Image</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs text-slate-500">Image URL</Label>
                                            <div className="flex gap-2">
                                                <Input 
                                                    value={activeSlide.content.image_url || ''}
                                                    onChange={(e) => updateSlide(activeSlide.id, { content: { ...activeSlide.content, image_url: e.target.value } })}
                                                    className="h-9 text-sm flex-1"
                                                />
                                                <ImageSelector 
                                                    onSelect={(url) => updateSlide(activeSlide.id, { content: { ...activeSlide.content, image_url: url } })}
                                                    trigger={
                                                        <Button variant="outline" size="sm" className="h-9 px-2">
                                                            <Upload className="w-3.5 h-3.5" />
                                                        </Button>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!activeSlide && (
                                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Settings className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p className="text-sm text-slate-400">Select a slide to edit its properties</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </TabsContent>

                {/* DESIGN TAB */}
                <TabsContent value="design" className="m-0 h-full animate-in slide-in-from-right-4 duration-300 outline-none">
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
                                         className={`px-2 py-3 rounded-lg border text-xs font-bold transition-all ${design.aspectRatio === ratio ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'}`}
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
                                            value={useCarouselStore.getState().project.author.name}
                                            onChange={(e) => useCarouselStore.getState().updateAuthor({ name: e.target.value })}
                                            className="h-8 text-xs bg-white"
                                         />
                                     </div>
                                     <div className="space-y-1.5">
                                         <Label className="text-[10px] text-slate-500 uppercase font-bold">{t.creator.handle}</Label>
                                         <Input 
                                            value={useCarouselStore.getState().project.author.handle}
                                            onChange={(e) => useCarouselStore.getState().updateAuthor({ handle: e.target.value })}
                                            className="h-8 text-xs bg-white"
                                         />
                                     </div>
                                     <div className="space-y-1.5">
                                         <Label className="text-[10px] text-slate-500 uppercase font-bold">{t.creator.photo}</Label>
                                         <div className="flex gap-2">
                                             <Input 
                                                value={useCarouselStore.getState().project.author.avatarUrl || ''}
                                                onChange={(e) => useCarouselStore.getState().updateAuthor({ avatarUrl: e.target.value })}
                                                className="h-8 text-xs bg-white flex-1"
                                             />
                                             <ImageSelector 
                                                onSelect={(url) => useCarouselStore.getState().updateAuthor({ avatarUrl: url })}
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
                                                 className="absolute inset-0 opacity-0 cursor-pointer w-full h-fullScale"
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
                                                     className={`py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${design.background.patternType === type ? 'bg-brand-500 border-brand-500 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
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
                                       <Label className="text-[10px] text-slate-500 uppercase font-bold">Primary Font</Label>
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
                                       <h3 className="text-sm font-semibold text-slate-800">Brand Kits</h3>
                                   </div>
                                   <Button variant="outline" size="sm" onClick={handleSavePreset} className="h-7 text-[10px] font-bold uppercase px-2">
                                       + Save Kits
                                   </Button>
                                </div>
                                
                                {savedPresets.length === 0 ? (
                                    <div className="text-[11px] text-slate-400 italic p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                                        Save your brand colors to reuse them.
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
