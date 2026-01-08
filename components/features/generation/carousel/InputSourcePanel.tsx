import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Input types
type InputType = 'topic' | 'text' | 'url';

export const InputSourcePanel = () => {
  const { language } = useUser();
  const { setIsGenerating, isGenerating } = useCarouselStore(state => state.editor);
  
  // Local state for inputs
  const [activeTab, setActiveTab] = useState<InputType>('topic');
  const [topic, setTopic] = useState('');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const handleGenerate = async () => {
      let source = '';
      let sourceType = 'topic';

      // Determine source based on active tab
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
               // Update global store
               useCarouselStore.setState((state) => ({ 
                  project: { ...state.project, slides: data.slides } 
               }));
               toast.success("Carousel generated successfully!"); 
           }

      } catch (err) {
          console.error("Generation failed:", err);
          toast.error("Generation failed. Please try again.");
      } finally {
          setIsGenerating(false);
      }
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as InputType)} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="topic">Topic</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="url">Link</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
            {/* TOPIC INPUT */}
            <TabsContent value="topic" className="mt-0">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 mb-3 font-medium">
                    What is your carousel about?
                  </p>
                  <Textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="E.g., 5 Tips for Remote Work Productivity..."
                    className="mb-4 bg-white min-h-[100px] resize-none focus:ring-brand-500"
                  />
                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic.trim()}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20"
                  >
                     {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                        </>
                     ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                        </>
                     )}
                  </Button>
               </div>
            </TabsContent>

            {/* TEXT INPUT */}
            <TabsContent value="text" className="mt-0">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 mb-3 font-medium">
                    Paste article or notes
                  </p>
                  <Textarea 
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste your content here..."
                    className="mb-4 bg-white min-h-[150px] resize-none focus:ring-brand-500"
                  />
                   <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !textInput.trim()}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20"
                  >
                     {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                     Key Points → Carousel
                  </Button>
               </div>
            </TabsContent>

            {/* URL INPUT */}
            <TabsContent value="url" className="mt-0">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 mb-3 font-medium">
                    Repurpose URL or YouTube
                  </p>
                  <Textarea 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="mb-4 bg-white min-h-[80px] resize-none focus:ring-brand-500"
                  />
                  <div className="text-xs text-slate-400 mb-4 bg-white p-2 rounded border border-slate-100 italic">
                      Supports: YouTube Videos, Blog Posts, News Articles.
                  </div>
                   <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !urlInput.trim()}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20"
                  >
                     {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                     Repurpose Content
                  </Button>
               </div>
            </TabsContent>
        </div>
      </Tabs>
      
      {/* Footer / Hint */}
      <div className="mt-auto pt-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center">
              AI generated content may require editing. Review before publishing.
          </p>
      </div>
    </div>
  );
};
