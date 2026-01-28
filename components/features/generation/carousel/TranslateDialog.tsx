
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Languages, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';
import { useCarouselStore } from '@/lib/store/useCarouselStore';

interface TranslateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
];

export const TranslateDialog: React.FC<TranslateDialogProps> = ({ isOpen, onClose }) => {
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const slides = useCarouselStore((state) => state.slides);
  const setSlides = useCarouselStore((state) => state.setSlides);

  const handleTranslate = async () => {
    try {
      setIsTranslating(true);
      
      const { data, error } = await supabase.functions.invoke('translate-carousel', {
        body: { 
            slides, 
            targetLanguage: LANGUAGES.find(l => l.code === targetLang)?.name || 'English' 
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      if (data.slides) {
          setSlides(data.slides);
          toast.success("Carousel translated successfully!");
          onClose();
      } else {
          throw new Error("No slides returned");
      }

    } catch (error) {
      console.error('Translation error:', error);
      toast.error("Failed to translate carousel. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-brand-500" />
            Translate Carousel
          </DialogTitle>
          <DialogDescription>
            AI will translate all your slides while preserving formatting and tone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Target Language</label>
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isTranslating}>
            Cancel
          </Button>
          <Button onClick={handleTranslate} disabled={isTranslating} className="bg-brand-600 hover:bg-brand-700">
            {isTranslating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Translate Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
