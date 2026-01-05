import React, { useRef, useEffect } from "react";
import { translations } from "../../../../translations";
import { AppLanguage } from "../../../../types";

interface HeroPromptProps {
  value: string;
  onChange: (value: string) => void;
  language: AppLanguage;
  isGenerating: boolean;
}

export const HeroPrompt: React.FC<HeroPromptProps> = ({ value, onChange, language, isGenerating }) => {
  const t = translations[language].app.generator;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <div className="w-full relative group">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isGenerating}
        placeholder={t.topicPlaceholder}
        className="w-full bg-transparent border-0 focus:ring-0 text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 placeholder:text-slate-300 resize-none overflow-hidden leading-tight transition-all duration-300 min-h-[200px]"
        style={{ caretColor: "#4f46e5" }} // Brand color caret
        autoFocus
      />
      {/* Subtle character counter that only appears on focus/hover */}
      <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <span className={`text-xs font-medium ${value.length > 4500 ? "text-amber-500" : "text-slate-300"}`}>
             {value.length}/5000
         </span>
      </div>
    </div>
  );
};
