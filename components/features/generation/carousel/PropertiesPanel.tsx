import React from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Edit3, Palette, Type, Layout } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { PredictiveModal, EngagementPrediction } from './PredictiveModal';
import { Sparkles, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

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
    <div className="w-80 border-l border-slate-200 bg-white h-full flex flex-col z-20 shadow-sm transition-all">
      <Tabs defaultValue="edit" className="flex-1 flex flex-col">
          <div className="px-4 pt-4 border-b border-slate-100 bg-white sticky top-0 z-10">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                 <Edit3 className="w-3.5 h-3.5" /> {t.tabs.slide}
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2">
                 <Palette className="w-3.5 h-3.5" /> {t.tabs.design}
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
             <div className="p-5 space-y-6">
                
                {/* EDIT TAB */}
                <TabsContent value="edit" className="m-0 space-y-6 animate-in slide-in-from-right-4 duration-300">
                    
                    {/* AI PREDICT BUTTON */}
                    <div className="p-4 bg-gradient-to-br from-brand-50 to-indigo-50 rounded-xl border border-brand-100 flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-brand-600">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-brand-900">{t.ai.predict}</h4>
                                <p className="text-xs text-brand-700/80 leading-snug">
                                    Simulate audience reaction before you post.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handlePredictPerformance}
                            disabled={isPredicting}
                            className="w-full py-2 bg-white border border-brand-200 shadow-sm rounded-lg text-xs font-bold text-brand-700 hover:bg-brand-50 hover:border-brand-300 transition-all flex items-center justify-center gap-2"
                        >
                            {isPredicting ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />}
                            {t.ai.predict}
                        </button>
                    </div>

                    {activeSlide ? (
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{t.properties.content}</span>
                                <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-500 capitalize">{activeSlide.type}</span>
                            </div>

                            {/* Slide Variant Selector */}
                            <div className="space-y-3">
                                <Label className="text-xs text-slate-500">Slide Layout</Label>
                                <Select 
                                    value={activeSlide.content.variant || 'default'} 
                                    onValueChange={(val: any) => updateSlide(activeSlide.id, { variant: val })}
                                >
                                    <SelectTrigger className="w-full h-9 text-xs">
                                        <SelectValue placeholder="Select layout" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Default</SelectItem>
                                        <SelectItem value="tweet">Social Post / Tweet</SelectItem>
                                        <SelectItem value="quote">Quote / Testimonial</SelectItem>
                                        <SelectItem value="image-full">Full Image Overlay</SelectItem>
                                        <div className="border-t border-slate-100 my-1 mx-2"></div>
                                        <SelectItem value="big-number">Big Data / Statistic</SelectItem>
                                        <SelectItem value="checklist">Checklist / Steps</SelectItem>
                                        <SelectItem value="code">Code Snippet</SelectItem>
                                        <SelectItem value="comparison">Comparison (A vs B)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-3">
                                <Label className="text-xs text-slate-500">{t.properties.title}</Label>
                                <Textarea 
                                    value={activeSlide.content.title || ''}
                                    onChange={(e) => updateSlide(activeSlide.id, { title: e.target.value })}
                                    className="min-h-[80px] font-medium resize-none bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    placeholder={t.properties.title}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs text-slate-500">{t.properties.body}</Label>
                                <Textarea 
                                    value={activeSlide.content.body || ''}
                                    onChange={(e) => updateSlide(activeSlide.id, { body: e.target.value })}
                                    className="min-h-[120px] resize-y bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    placeholder={t.properties.body}
                                />
                            </div>

                            {/* Optional fields based on availability */}
                            {(activeSlide.type === 'intro' || activeSlide.type === 'image' || (activeSlide.type === 'content' && (activeSlide.content.variant === 'big-number' || activeSlide.content.variant === 'comparison'))) && (
                                <div className="space-y-3">
                                    <Label className="text-xs text-slate-500">{t.properties.subtitle}</Label>
                                    <Input 
                                        value={activeSlide.content.subtitle || ''}
                                        onChange={(e) => updateSlide(activeSlide.id, { subtitle: e.target.value })}
                                    />
                                </div>
                            )}

                             <div className="space-y-3">
                                <Label className="text-xs text-slate-500">{t.properties.cta}</Label>
                                <Input 
                                    value={activeSlide.content.cta_text || ''}
                                    onChange={(e) => updateSlide(activeSlide.id, { cta_text: e.target.value })}
                                    placeholder={t.properties.cta}
                                />
                             </div>

                             {/* VISUALS SECTION */}
                             <div className="pt-4 border-t border-slate-100 space-y-3">
                                <Label className="text-xs text-slate-500">Visuals</Label>
                                <div className="grid grid-cols-2 gap-2">
                                     {/* Illustration Button */}
                                     <ImageSelector 
                                        onSelect={(url) => updateSlide(activeSlide.id, { image_url: url })}
                                        trigger={
                                            <Button variant="outline" size="sm" className="w-full text-xs h-9 justify-start px-2">
                                                <ImageIcon className="w-3.5 h-3.5 mr-2 text-brand-500"/> Illustration
                                            </Button>
                                        }
                                     />

                                     {/* Background Button */}
                                     <ImageSelector 
                                        onSelect={(url) => updateSlide(activeSlide.id, { background_override: url })}
                                        trigger={
                                            <Button variant="outline" size="sm" className="w-full text-xs h-9 justify-start px-2">
                                               <Layout className="w-3.5 h-3.5 mr-2 text-brand-500"/> Background
                                            </Button>
                                        }
                                     />
                                </div>

                                {/* Remove Buttons */}
                                {(activeSlide.content.image_url || activeSlide.content.background_override) && (
                                    <div className="flex gap-2 pt-1">
                                        {activeSlide.content.image_url && (
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="h-6 text-[10px] text-red-500 px-2 ml-auto" 
                                              onClick={() => updateSlide(activeSlide.id, { image_url: undefined })}
                                            >
                                                Remove Image
                                            </Button>
                                        )}
                                        {activeSlide.content.background_override && (
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="h-6 text-[10px] text-red-500 px-2 ml-auto" 
                                              onClick={() => updateSlide(activeSlide.id, { background_override: undefined })}
                                            >
                                                Remove BG
                                            </Button>
                                        )}
                                    </div>
                                )}
                             </div>

                             <div className="pt-4 border-t border-slate-100">
                                <button 
                                  onClick={() => {
                                     const confirmed = window.confirm(t.properties.deleteConfirm);
                                     if (confirmed) {
                                         useCarouselStore.getState().removeSlide(activeSlide.id);
                                     }
                                  }}
                                  className="w-full py-2 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                   {t.properties.deleteSlide}
                                </button>
                             </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                            <p>{t.properties.slideEditor}</p>
                        </div>
                    )}
                </TabsContent>

                {/* DESIGN TAB */}
                <TabsContent value="design" className="m-0 space-y-8 animate-in slide-in-from-right-4 duration-300">
                    
                    {/* General Layout */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                           <Layout className="w-4 h-4 text-brand-500" />
                           <h3 className="text-sm font-semibold text-slate-800">{t.properties.globalDesign}</h3>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                           {['1:1', '4:5', '9:16'].map((ratio) => (
                               <button 
                                 key={ratio}
                                 onClick={() => updateDesign({ aspectRatio: ratio as any })}
                                 className={`px-2 py-3 rounded-lg border text-sm font-medium transition-all ${design.aspectRatio === ratio ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'}`}
                               >
                                 {ratio}
                               </button>
                           ))}
                        </div>
                     </div>

                     {/* Visibility Toggles */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Settings className="w-4 h-4 text-brand-500" />
                            <h3 className="text-sm font-semibold text-slate-800">Elements</h3>
                        </div>
                        <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                             <div className="flex items-center justify-between">
                                 <Label className="text-xs text-slate-600">Page Numbers</Label>
                                 <Switch 
                                    checked={design.layout.showSteppers}
                                    onCheckedChange={(c) => updateDesign({ layout: { ...design.layout, showSteppers: c } })}
                                 />
                             </div>
                             <div className="flex items-center justify-between">
                                 <Label className="text-xs text-slate-600">Profile Header</Label>
                                 <Switch 
                                    checked={design.layout.showCreatorProfile}
                                    onCheckedChange={(c) => updateDesign({ layout: { ...design.layout, showCreatorProfile: c } })}
                                 />
                             </div>
                             <div className="flex items-center justify-between">
                                 <Label className="text-xs text-slate-600">Swipe Indicator</Label>
                                 <Switch 
                                    checked={design.layout.showSwipeIndicator}
                                    onCheckedChange={(c) => updateDesign({ layout: { ...design.layout, showSwipeIndicator: c } })}
                                 />
                             </div>
                        </div>
                     </div>

                     {/* Colors */}
                    <div className="space-y-4">
                         <div className="flex items-center gap-2 mb-2">
                           <Palette className="w-4 h-4 text-brand-500" />
                           <h3 className="text-sm font-semibold text-slate-800">{t.properties.palette}</h3>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {['primary', 'secondary', 'accent', 'background', 'text'].map((key) => (
                                <div key={key} className="flex flex-col items-center gap-1 group relative">
                                    <div 
                                      className="w-10 h-10 rounded-full shadow-sm ring-1 ring-slate-200 cursor-pointer overflow-hidden border-2 border-white transition-transform hover:scale-110"
                                      style={{ backgroundColor: (design.colorPalette as any)[key] }}
                                    >
                                       <input 
                                         type="color" 
                                         className="opacity-0 w-full h-full cursor-pointer"
                                         value={(design.colorPalette as any)[key]}
                                         onChange={(e) => updateDesign({ 
                                            colorPalette: { ...design.colorPalette, [key]: e.target.value } 
                                         })}
                                       />
                                    </div>
                                    <span className="text-[10px] uppercase text-slate-400 font-medium">{key.substring(0,3)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                     {/* Typography */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                           <Type className="w-4 h-4 text-brand-500" />
                           <h3 className="text-sm font-semibold text-slate-800">{t.properties.font}</h3>
                        </div>
                        <div className="space-y-3">
                           <div className="space-y-1">
                               <Label className="text-xs text-slate-500">{t.properties.font}</Label>
                                <Select 
                                  value={design.fonts.heading} 
                                  onValueChange={(val) => updateDesign({ fonts: { ...design.fonts, heading: val } })}
                                >
                                  <SelectTrigger className="h-9">
                                     <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[300px]">
                                     <SelectItem value="Inter" style={{fontFamily: 'Inter'}}>Inter (Sans)</SelectItem>
                                     <SelectItem value="Roboto" style={{fontFamily: 'Roboto'}}>Roboto</SelectItem>
                                     <SelectItem value="Open Sans" style={{fontFamily: 'Open Sans'}}>Open Sans</SelectItem>
                                     <SelectItem value="Montserrat" style={{fontFamily: 'Montserrat'}}>Montserrat</SelectItem>
                                     <SelectItem value="Lato" style={{fontFamily: 'Lato'}}>Lato</SelectItem>
                                     <SelectItem value="Poppins" style={{fontFamily: 'Poppins'}}>Poppins</SelectItem>
                                     <SelectItem value="Plus Jakarta Sans" style={{fontFamily: 'Plus Jakarta Sans'}}>Plus Jakarta Sans</SelectItem>
                                     
                                     <div className="border-t border-slate-100 my-1 mx-2"></div>
                                     <SelectItem value="Playfair Display" style={{fontFamily: 'Playfair Display'}}>Playfair (Serif)</SelectItem>
                                     <SelectItem value="Merriweather" style={{fontFamily: 'Merriweather'}}>Merriweather</SelectItem>
                                     <SelectItem value="Lora" style={{fontFamily: 'Lora'}}>Lora</SelectItem>
                                     
                                     <div className="border-t border-slate-100 my-1 mx-2"></div>
                                     <SelectItem value="Oswald" style={{fontFamily: 'Oswald'}}>Oswald (Display)</SelectItem>
                                     <SelectItem value="Bebas Neue" style={{fontFamily: 'Bebas Neue'}}>Bebas Neue</SelectItem>
                                     <SelectItem value="Bangers" style={{fontFamily: 'Bangers'}}>Bangers</SelectItem>
                                  </SelectContent>
                                </Select>
                           </div>
                        </div>
                    </div>

                     {/* Brand Presets */}
                     <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                               <Sparkles className="w-4 h-4 text-brand-500" />
                               <h3 className="text-sm font-semibold text-slate-800">Brand Kits</h3>
                           </div>
                           <Button variant="outline" size="sm" onClick={handleSavePreset} className="h-7 text-xs">
                               + Save Current
                           </Button>
                        </div>
                        
                        {savedPresets.length === 0 ? (
                            <div className="text-xs text-slate-400 italic p-2 bg-slate-50 rounded text-center">
                                Save your colors & fonts to reuse them later.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {savedPresets.map((preset: any) => (
                                    <div key={preset.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100 hover:border-brand-200 transition-colors group">
                                        <button 
                                          className="text-xs font-medium text-slate-700 flex-1 text-left truncate"
                                          onClick={() => setTheme(preset.id)}
                                        >
                                           {preset.name}
                                        </button>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <div className="flex -space-x-1">
                                                 <div className="w-3 h-3 rounded-full" style={{ background: preset.colorPalette.primary }} />
                                                 <div className="w-3 h-3 rounded-full" style={{ background: preset.colorPalette.secondary }} />
                                             </div>
                                             <button onClick={(e) => { e.stopPropagation(); deletePreset(preset.id); }} className="text-slate-400 hover:text-red-500">
                                                 <span className="sr-only">Delete</span>
                                                 <X className="w-3 h-3" />
                                             </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                     </div>

                </TabsContent>
             </div>
          </ScrollArea>
      </Tabs>
      
      <PredictiveModal 
        isOpen={isPredictiveModalOpen}
        onClose={() => setIsPredictiveModalOpen(false)}
        isLoading={isPredicting}
        data={predictionData}
      />
    </div>
  );
};
