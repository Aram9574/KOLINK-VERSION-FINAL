import React, { useState } from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Sparkles, LayoutTemplate, Type, FileText, Loader2, Linkedin, Copy, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { CarouselSlide } from '@/types/carousel';
import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';

export const EditorSidebar = () => {
  const { user, language } = useUser();
  const t = translations[language || 'en'].carouselStudio;
  const { isSidebarOpen, isGenerating } = useCarouselStore(state => state.editor);
  const setIsGenerating = useCarouselStore(state => state.setIsGenerating);
  const updateProject = useCarouselStore(state => state.updateDesign); // Simplified for this snippet, real impl would replace slides
  
  // Direct store access for slides replacement
  const setSlides = (slides: CarouselSlide[]) => {
      useCarouselStore.setState((state) => ({ 
          project: { ...state.project, slides } 
      }));
  };

  const [topic, setTopic] = useState('');
  const [activeTab, setActiveTab] = useState('topic');
  const [textInput, setTextInput] = useState('');

  const [urlInput, setUrlInput] = useState('');

  // Caption Generator State
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateCaption = async () => {
    setIsGeneratingCaption(true);
    setCopied(false);
    try {
        const project = useCarouselStore.getState().project;
        const { data, error } = await supabase.functions.invoke('generate-linkedin-caption', {
            body: { 
                slides: project.slides,
                title: project.title
            }
        });

        if (error) throw error;

        if (data?.caption) {
            setGeneratedCaption(data.caption);
            setShowCaptionModal(true);
            toast.success("Caption generated!");
        }
    } catch (err) {
        console.error("Caption gen failed:", err);
        toast.error("Failed to generate caption.");
    } finally {
        setIsGeneratingCaption(false);
    }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(generatedCaption);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
      let source = '';
      let sourceType = 'topic';

      if (activeTab === 'topic') {
          source = topic;
          sourceType = 'topic';
      } else if (activeTab === 'text') {
          source = textInput;
          sourceType = 'text';
      } else if (activeTab === 'url') {
          source = urlInput;
          sourceType = (urlInput.includes('youtube.com') || urlInput.includes('youtu.be')) ? 'youtube' : 'url';
      }

      if (!source.trim()) {
          toast.error("Please provide content to generate from.");
          return;
      }
      
      setIsGenerating(true);
      try {
           const { data, error } = await supabase.functions.invoke('generate-carousel', {
               body: { source, sourceType, tone: 'Professional', language: language || 'en' }
           });

           if (error) throw error;
           
            if (data?.slides) {
               setSlides(data.slides);
               // If there are design suggestions, we could update theme here too using data.carousel_config
               toast.success(t.aiGenerator.generating); 
           }

      } catch (err) {
          console.error("Generation failed:", err);
          toast.error("Generation failed. Please try again or check console.");
      } finally {
          setIsGenerating(false);
      }
  };

  if (!isSidebarOpen) return null;

  return (
    <div className="w-80 border-r border-slate-200 bg-white h-full flex flex-col z-20 shadow-sm transition-all duration-300">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-500" />
          {t.tabs.ai}
        </h2>
        
        {/* Caption Generator Button */}
        <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs px-2 text-slate-500 hover:text-brand-600 gap-1"
            onClick={handleGenerateCaption}
            disabled={isGeneratingCaption}
        >
            {isGeneratingCaption ? <Loader2 className="w-3 h-3 animate-spin"/> : <Linkedin className="w-3 h-3" />}
            Caption
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="w-full grid grid-cols-4 mb-2">
            <TabsTrigger value="topic" className="text-xs px-1">Topic</TabsTrigger>
            <TabsTrigger value="text" className="text-xs px-1">Text</TabsTrigger>
            <TabsTrigger value="url" className="text-xs px-1">Link</TabsTrigger>
            <TabsTrigger value="templates" className="text-xs px-1">Tmpl</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            
            {/* TOPIC INPUT */}
            <TabsContent value="topic" className="space-y-4 m-0">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 mb-4 font-medium">
                    {t.aiGenerator.topic.label}
                  </p>
                  <Textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t.aiGenerator.topic.placeholder}
                    className="mb-4 bg-white min-h-[100px]"
                  />
                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic.trim()}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20"
                  >
                     {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.aiGenerator.generating}
                        </>
                     ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" /> Generate
                        </>
                     )}
                  </Button>
               </div>
            </TabsContent>

            {/* TEXT INPUT */}
            <TabsContent value="text" className="space-y-4 m-0">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 mb-4 font-medium">
                    Paste your article or notes
                  </p>
                  <Textarea 
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste text here..."
                    className="mb-4 bg-white min-h-[150px]"
                  />
                   <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !textInput.trim()}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20"
                  >
                     {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                     Generate
                  </Button>
               </div>
            </TabsContent>

            {/* URL INPUT */}
            <TabsContent value="url" className="space-y-4 m-0">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 mb-4 font-medium">
                    Repurpose URL or YouTube
                  </p>
                  <Textarea 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="mb-4 bg-white min-h-[80px]"
                  />
                  <p className="text-xs text-slate-400 mb-4">
                      Supports: YouTube Videos, Blog Posts, News Articles.
                  </p>
                   <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !urlInput.trim()}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20"
                  >
                     {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                     Repurpose
                  </Button>
               </div>
            </TabsContent>
            <TabsContent value="templates" className="space-y-4 m-0">
               <div className="grid grid-cols-2 gap-3">
                   {/* PREDEFINED TEMPLATES/THEMES */}
                   {[
                       { id: 'modern', name: t.templates.modern, bg: '#EFF6FF', primary: '#2563EB', text: '#1E293B', font: 'Inter' },
                       { id: 'dark', name: t.templates.minimal, bg: '#0F172A', primary: '#38BDF8', text: '#F8FAFC', font: 'Inter' },
                       { id: 'bold', name: t.templates.bold, bg: '#FEFCE8', primary: '#EAB308', text: '#422006', font: 'Oswald' },
                       { id: 'gradient', name: t.templates.gradient, bg: 'linear-gradient(135deg, #4f46e5 0%, #aa24b4 100%)', primary: '#FFFFFF', text: '#FFFFFF', font: 'Montserrat' },
                   ].map(theme => (
                       <button
                         key={theme.id}
                         onClick={() => {
                             useCarouselStore.getState().updateDesign({
                                 themeId: theme.id,
                                 colorPalette: {
                                     primary: theme.primary,
                                     secondary: theme.primary, // simple fallback
                                     accent: theme.primary,
                                     background: theme.bg,
                                     text: theme.text
                                 },
                                 fonts: { heading: theme.font, body: 'Inter' },
                                 background: { type: theme.bg.includes('gradient') ? 'gradient' : 'solid', value: theme.bg }
                             });
                             toast.success(`Theme applied: ${theme.name}`);
                         }}
                         className="group relative aspect-[4/5] rounded-xl border border-slate-200 overflow-hidden hover:ring-2 ring-brand-500 transition-all text-left"
                       >
                           <div className="absolute inset-0 p-3 flex flex-col justify-end" style={{ background: theme.bg }}>
                               <span className="font-bold text-lg leading-none mb-1" style={{ color: theme.primary, fontFamily: theme.font }}>Abc</span>
                               <span className="text-[10px] font-medium opacity-80" style={{ color: theme.text }}>{theme.name}</span>
                           </div>
                       </button>
                   ))}
               </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>

      {/* Caption Result Modal */}
      <Dialog open={showCaptionModal} onOpenChange={setShowCaptionModal}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Linkedin className="w-5 h-5 text-[#0077b5]" />
                    LinkedIn Post Caption
                </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 max-h-[400px] overflow-y-auto text-sm whitespace-pre-wrap leading-relaxed text-slate-700 font-medium">
                    {generatedCaption}
                </div>
                <Button onClick={copyToClipboard} className="w-full gap-2 font-bold mb-2">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
