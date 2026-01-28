
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2, Scissors, TrendingUp, Smile, Loader2, MoreHorizontal } from 'lucide-react';
import { useClickOutside } from '@/components/ui/use-click-outside';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';

interface MagicInputWrapperProps {
  value: string;
  onAiUpdate: (newValue: string) => void;
  children: React.ReactNode;
  className?: string; // To allow positioning override
}

import { useCarouselStore } from '@/lib/store/useCarouselStore';

// ... imports

export const MagicInputWrapper: React.FC<MagicInputWrapperProps> = ({ value, onAiUpdate, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useUser();
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Get tone from store
  const project = useCarouselStore(state => state.project);
  const toneValue = project.settings?.tone ?? 50;

  useClickOutside(wrapperRef, () => setIsOpen(false));

  const t = (translations[language || 'en'].carouselStudio as any)?.magicTools || {
    improve: "Mejorar",
    shorten: "Acortar",
    expand: "Expandir",
    punchify: "Gancho Viral",
    emojify: "Emojify"
  };

  const handleMagicAction = async (action: string) => {
    if (!value || value.length < 3) {
      toast.error("Text is too short for AI magic! ✨");
      return;
    }

    setIsLoading(true);
    setIsOpen(false); 
    const toastId = toast.loading("Invoking AI Magic...");

    const getToneDescription = (val: number) => {
      if (val < 20) return "Very Professional, Serious, Corporate";
      if (val < 40) return "Professional, Clear, Informative";
      if (val < 60) return "Balanced, Engaging, Approachable";
      if (val < 80) return "Casual, Friendly, Conversational";
      return "Witty, Viral, Humorous, Bold";
    };

    try {
      // Use the 'micro_edit' mode we just added to the backend
      const { data, error } = await supabase.functions.invoke('generate-viral-post', {
        body: { 
          params: { 
            topic: value, 
            mode: 'micro_edit',
            action: action,
            tone: getToneDescription(toneValue), // Dynamic Tone
            audience: 'General'
          } 
        }
      });

      if (error) throw error;

      const result = data.data?.postContent || data.postContent;
      
      if (result) {
        onAiUpdate(result);
        toast.success("Magic Applied! ✨", { id: toastId });
      } else {
        throw new Error("No result from AI");
      }

    } catch (err: any) {
      console.error("Magic Tool Error:", err);
      toast.error("Magic failed. Try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("relative group", className)} ref={wrapperRef}>
      {children}
      
      <div className={cn(
        "absolute right-2 top-2 z-20 transition-all duration-200",
        isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
          <div className="relative">
            <Button 
              size="icon" 
              variant="secondary" 
              className={cn(
                "h-6 w-6 rounded-full shadow-sm bg-white/90 hover:bg-white text-indigo-500 hover:text-indigo-600 border border-indigo-100",
                isLoading && "animate-pulse cursor-wait"
              )}
              disabled={isLoading}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            </Button>

            {isOpen && (
                <div className="absolute right-0 top-8 z-50 w-48 rounded-md border bg-white p-1 shadow-md outline-none animate-in fade-in-0 zoom-in-95 border-slate-200">
                    <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">AI Magic Tools</span>
                    
                    <Button variant="ghost" size="sm" className="justify-start h-8 text-xs font-medium" onClick={() => handleMagicAction('Improve Writing')}>
                        <Wand2 className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                        {t.improve || 'Mejorar'}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="justify-start h-8 text-xs font-medium" onClick={() => handleMagicAction('Shorten')}>
                        <Scissors className="w-3.5 h-3.5 mr-2 text-rose-500" />
                        {t.shorten || 'Acortar'}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="justify-start h-8 text-xs font-medium" onClick={() => handleMagicAction('Expand / Add Detail')}>
                        <MoreHorizontal className="w-3.5 h-3.5 mr-2 text-blue-500" />
                        {t.expand || 'Expandir'}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="justify-start h-8 text-xs font-medium bg-amber-50/50 hover:bg-amber-50 text-amber-900" onClick={() => handleMagicAction('Make it a Viral Hook')}>
                        <TrendingUp className="w-3.5 h-3.5 mr-2 text-amber-500" />
                        {t.punchify || 'Gancho Viral'}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="justify-start h-8 text-xs font-medium" onClick={() => handleMagicAction('Add Emojis')}>
                        <Smile className="w-3.5 h-3.5 mr-2 text-emerald-500" />
                        {t.emojify || 'Emojify'}
                    </Button>
                    </div>
                </div>
            )}
          </div>
      </div>
    </div>
  );
};
