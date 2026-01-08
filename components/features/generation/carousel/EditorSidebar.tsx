import React, { useState } from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Sparkles, Loader2, Linkedin, LayoutTemplate } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { CarouselSlide } from '@/types/carousel';
import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';

// Sub-panels
import { InputSourcePanel } from './InputSourcePanel';
import TemplatesPanel from '../../inferencia/panels/TemplatesPanel';

export const EditorSidebar = () => {
  const { language } = useUser();
  const t = translations[language || 'en'].carouselStudio;
  const { isSidebarOpen } = useCarouselStore(state => state.editor);

  // Direct store access for slides replacement
  const setSlides = (slides: CarouselSlide[]) => {
      useCarouselStore.setState((state) => ({ 
          project: { ...state.project, slides } 
      }));
  };

  const [mainTab, setMainTab] = useState('generate');

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
        if (!project.slides || project.slides.length === 0) {
            toast.error("Please add some slides first.");
            return;
        }

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

  if (!isSidebarOpen) return null;

  return (
    <div className="w-96 border-r border-slate-200 bg-white h-full flex flex-col z-20 shadow-xl shadow-slate-200/50 transition-all duration-300">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-brand-500 fill-brand-50" />
          AI Studio
        </h2>
        
        <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs px-3 text-slate-500 hover:text-brand-600 hover:bg-brand-50 gap-1.5 transition-colors"
            onClick={handleGenerateCaption}
            disabled={isGeneratingCaption}
        >
            {isGeneratingCaption ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />}
            Caption
        </Button>
      </div>
      
      <Tabs value={mainTab} onValueChange={setMainTab} className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="px-5 pt-4">
          <TabsList className="w-full grid grid-cols-2 mb-2 p-1 bg-slate-100/80">
            <TabsTrigger value="generate" className="text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Generate
            </TabsTrigger>
            <TabsTrigger value="templates" className="text-xs font-semibold">
                <LayoutTemplate className="w-3.5 h-3.5 mr-2" />
                Templates
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-5 h-full">
            <TabsContent value="generate" className="mt-0 h-full">
                <InputSourcePanel />
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
                <TemplatesPanel onSelectTemplate={(slides) => {
                    setSlides(slides);
                    toast.success("Template applied successfully!");
                }} />
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
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 max-h-[400px] overflow-y-auto text-sm whitespace-pre-wrap leading-relaxed text-slate-700 font-medium font-mono text-[13px]">
                    {generatedCaption}
                </div>
                <Button onClick={copyToClipboard} className="w-full gap-2 font-bold mb-2">
                     <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
