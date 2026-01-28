import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Briefcase, PartyPopper } from 'lucide-react';

interface ToneSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const ToneSlider: React.FC<ToneSliderProps> = ({ value, onChange, className }) => {
  const getLabel = (val: number) => {
    if (val < 20) return "Muy Serio";
    if (val < 40) return "Profesional";
    if (val < 60) return "Equilibrado";
    if (val < 80) return "Amigable";
    return "Viral / Divertido";
  };

  const getColor = (val: number) => {
    if (val < 20) return "text-slate-600";
    if (val < 40) return "text-blue-600";
    if (val < 60) return "text-indigo-600";
    if (val < 80) return "text-violet-600";
    return "text-pink-600";
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-between items-center">
        <Label className="text-xs font-bold uppercase text-slate-500">Tono de Voz</Label>
        <span className={cn("text-xs font-semibold transition-colors duration-300", getColor(value))}>
          {getLabel(value)}
        </span>
      </div>
      
      <div className="relative pt-1 pb-1">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6">
            <Briefcase className="w-4 h-4 text-slate-400" />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6">
            <PartyPopper className="w-4 h-4 text-pink-400" />
        </div>
        
        <Slider
          value={[value]}
          min={0}
          max={100}
          step={10}
          onValueChange={([val]) => onChange(val)}
          className="cursor-pointer"
        />
      </div>
      
      <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
        <span>Formal</span>
        <span>Creativo</span>
      </div>
    </div>
  );
};
