import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, FileText, Upload } from 'lucide-react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { translations } from '@/translations';

// Input types
type InputType = 'topic' | 'url' | 'youtube' | 'pdf';

export const InputSourcePanel = () => {
  const { language } = useUser();
  const t = translations[language || 'en'].carouselStudio.inputs;
  const toasts = translations[language || 'en'].carouselStudio.toasts;
  const isGenerating = useCarouselStore(state => state.editor.isGenerating);
  const setIsGenerating = useCarouselStore(state => state.setIsGenerating);
  
  // Local state for inputs
  const [activeTab, setActiveTab] = useState<InputType>('topic');
  const [topic, setTopic] = useState('');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.type !== 'application/pdf') {
          toast.error(toasts?.pdfNeeded || "Please upload a PDF file.");
          return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error(t.pdf.maxSize);
          return;
      }

      const reader = new FileReader();
      reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          setPdfBase64(base64);
          setPdfName(file.name);
          toast.success(`${toasts?.loaded || "Loaded"}: ${file.name}`);
      };
      reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
      let source = '';
      let sourceType = 'topic';

      // Determine source based on active tab
      if (activeTab === 'topic') {
          source = topic;
          sourceType = 'topic';
      } else if (activeTab === 'url') {
          source = urlInput;
          sourceType = 'url';
      } else if (activeTab === 'youtube') {
          source = urlInput;
          sourceType = 'youtube';
      } else if (activeTab === 'pdf') {
          if (!pdfBase64) {
              toast.error(toasts?.pdfNeeded || "Please upload a PDF first.");
              return;
          }
          source = pdfBase64;
          sourceType = 'pdf';
      }

      if (!source.trim()) {
          toast.error(toasts?.contentNeeded || "Please provide content to generate from.");
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
               toast.success(toasts?.genSuccess || "Carousel generated successfully!"); 
           }

      } catch (err) {
          console.error("Generation failed:", err);
          toast.error(toasts?.genFailed || "Generation failed. Please try again.");
      } finally {
          setIsGenerating(false);
      }
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as InputType)} className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-4">
          <TabsTrigger value="topic">{t.tabs.topic}</TabsTrigger>
          <TabsTrigger value="url">{t.tabs.url}</TabsTrigger>
          <TabsTrigger value="youtube">{t.tabs.youtube}</TabsTrigger>
          <TabsTrigger value="pdf">{t.tabs.pdf}</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
            {/* TOPIC INPUT */}
            <TabsContent value="topic" className="mt-0">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 mb-3 font-medium">
                    {t.topic.question}
                  </p>
                  <Textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t.topic.placeholder}
                    className="mb-4 bg-white min-h-[100px] resize-none focus:ring-brand-500"
                  />
                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic.trim()}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20"
                  >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.buttons.generating}
                        </>
                     ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" /> {t.buttons.generate}
                        </>
                     )}
                  </Button>
               </div>
            </TabsContent>

            {/* URL INPUT */}
            <TabsContent value="url" className="mt-0">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 mb-3 font-medium">
                    {t.url.label}
                  </p>
                  <Textarea 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://medium.com/@username/article-id..."
                    className="mb-4 bg-white min-h-[100px] resize-none focus:ring-brand-500"
                  />
                  <div className="text-xs text-slate-400 mb-4 bg-white p-2 rounded border border-slate-100 italic">
                      {t.url.hint}
                  </div>
                   <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !urlInput.trim()}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20"
                  >
                     {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                     {isGenerating ? t.buttons.converting : t.buttons.convert}
                  </Button>
               </div>
            </TabsContent>

            {/* YOUTUBE INPUT */}
            <TabsContent value="youtube" className="mt-0">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 mb-3 font-medium">
                    {t.youtube.label}
                  </p>
                  <Textarea 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="mb-4 bg-white min-h-[100px] resize-none focus:ring-brand-500"
                  />
                  <div className="text-xs text-slate-400 mb-4 bg-white p-2 rounded border border-slate-100 italic">
                      {t.youtube.hint}
                  </div>
                   <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !urlInput.trim()}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20"
                  >
                     {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                     {isGenerating ? t.buttons.analyzing : t.buttons.video}
                  </Button>
               </div>
            </TabsContent>

            {/* PDF INPUT */}
            <TabsContent value="pdf" className="mt-0">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 mb-3 font-medium">
                    {t.pdf.label}
                  </p>
                  
                  <div className="relative mb-4">
                      <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={handleFileUpload}
                        className="hidden" 
                        id="pdf-upload"
                      />
                      <label 
                        htmlFor="pdf-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg bg-white hover:bg-slate-50 hover:border-brand-400 cursor-pointer transition-all group"
                      >
                         {pdfName ? (
                            <div className="flex flex-col items-center">
                                <FileText className="w-8 h-8 text-brand-500 mb-2" />
                                <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{pdfName}</span>
                                <span className="text-[10px] text-slate-400 mt-1">{t.pdf.change}</span>
                            </div>
                         ) : (
                            <div className="flex flex-col items-center">
                                <Upload className="w-8 h-8 text-slate-400 group-hover:text-brand-500 mb-2 transition-colors" />
                                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{t.pdf.select}</span>
                                <span className="text-[10px] text-slate-400 mt-1">{t.pdf.maxSize}</span>
                            </div>
                         )}
                      </label>
                  </div>

                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !pdfBase64}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20"
                  >
                     {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                     {isGenerating ? t.buttons.extracting : t.buttons.extract}

                  </Button>
               </div>
            </TabsContent>
        </div>
      </Tabs>
      
      {/* Footer / Hint */}
      <div className="mt-auto pt-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center">
              {t.footer}
          </p>
      </div>
    </div>
  );
};
