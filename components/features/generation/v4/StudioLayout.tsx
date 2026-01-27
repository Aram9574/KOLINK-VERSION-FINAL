import React from "react";
import { AppLanguage, GenerationParams } from "../../../../types";
import { HeroPrompt } from "./HeroPrompt";
import { FloatingControls } from "./FloatingControls";
import { HookLibrary } from "./HookLibrary";

interface StudioLayoutProps {
  params: GenerationParams;
  onUpdateParams: (params: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  credits: number;
  language: AppLanguage;
  children?: React.ReactNode; // Content Preview
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({
  params,
  onUpdateParams,
  onGenerate,
  isGenerating,
  credits,
  language,
  children
}) => {
  // Determine if we are in "Focus Mode" (empty state) or "Studio Mode" (with content/preview)
  const hasContent = !!children; 

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-100px)] flex flex-col items-center animate-in fade-in duration-700">
        
       {/* BACKGROUND AMBIANCE */}
       <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-500/5 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
       </div>

       <div className={`w-full h-full transition-all duration-700 ease-spring ${hasContent ? "flex flex-col lg:flex-row gap-8 items-start w-full px-8 lg:px-12" : "w-full max-w-[1400px] flex flex-col justify-center flex-1 px-8 lg:px-16"}`}>
           
           {/* LEFT: EDITOR CANVAS */}
           <div className={`transition-all duration-700 ${hasContent ? "w-full lg:w-1/2 xl:w-7/12" : "w-full"}`}>
               <div className="relative">
                   
                   {/* HEADER (Only visible in Focus Mode for branding, subtle in Studio Mode) */}
                   <div className={`transition-all duration-700 ${hasContent ? "opacity-50 scale-90 origin-top-left mb-8" : "mb-12 text-left"}`}>
                       <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
                           {language === 'es' ? 'Crea. Inspira. Viraliza.' : 'Create. Inspire. Go Viral.'}
                       </h1>
                       <p className="text-lg text-slate-400 mt-2 font-medium">
                            {language === 'es' ? 'Tu estudio de escritura minimalista.' : 'Your minimalist writing studio.'}
                       </p>
                   </div>

                   {/* EDITOR */}
                   <HeroPrompt 
                        value={params.topic}
                        onChange={(val) => onUpdateParams({ topic: val })}
                        language={language}
                        isGenerating={isGenerating}
                   />

                   {!hasContent && (
                       <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                           <HookLibrary onSelect={(hook) => onUpdateParams({ topic: params.topic ? params.topic + "\n\n" + hook : hook })} />
                       </div>
                   )}

                   {/* FLOATING CONTROLS (Always sticky at bottom of editor or viewport) */}
                   <FloatingControls 
                        params={params}
                        onUpdateParams={onUpdateParams}
                        onGenerate={onGenerate}
                        isGenerating={isGenerating}
                        language={language}
                   />
               </div>
           </div>

           {/* RIGHT: LIVE PREVIEW (Only appears when hasContent) */}
           {hasContent && (
               <div className="hidden lg:block w-1/2 xl:w-5/12 animate-in slide-in-from-right-10 fade-in duration-700 delay-100">
                   <div className="sticky top-8 flex justify-center">
                       {/* IPHONE BEZEL CONTAINER */}
                       <div className="relative w-full max-w-[420px] h-[calc(100vh-100px)] bg-slate-900 rounded-[3.5rem] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10">
                           
                           {/* NOTCH / DYNAMIC ISLAND */}
                           <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-7 bg-black rounded-full z-50 flex items-center justify-center gap-2 pointer-events-none">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-800/50" />
                                <div className="w-16 h-4 rounded-full bg-slate-900/0" />
                           </div>

                           {/* SCREEN CONTENT */}
                           <div className="w-full h-full bg-slate-50 rounded-[2.75rem] overflow-hidden relative">
                               {/* Status Bar Fake Implementation */}
                               <div className="h-11 w-full bg-slate-50/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 pt-2">
                                    <span className="text-[10px] font-bold text-slate-900 ml-2">9:41</span>
                                    <div className="flex gap-1.5 items-center mr-2">
                                        <div className="w-4 h-2.5 bg-slate-900 rounded-[2px]" />
                                        <div className="w-0.5 h-1 bg-slate-900/30" />
                                    </div>
                               </div>
                               
                               <div className="h-[calc(100%-44px)] overflow-y-auto no-scrollbar pb-8">
                                   {children}
                               </div>

                               {/* Home Indicator */}
                               <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/20 rounded-full pointers-events-none z-50" />
                           </div>

                           {/* Side Buttons (Cosmetic) */}
                           <div className="absolute top-24 left-[-4px] w-1 h-8 bg-slate-700 rounded-l-md" /> {/* Mute */}
                           <div className="absolute top-36 left-[-4px] w-1 h-14 bg-slate-700 rounded-l-md" /> {/* Vol Up */}
                           <div className="absolute top-52 left-[-4px] w-1 h-14 bg-slate-700 rounded-l-md" /> {/* Vol Down */}
                           <div className="absolute top-40 right-[-4px] w-1 h-20 bg-slate-700 rounded-r-md" /> {/* Power */}

                       </div>
                   </div>
               </div>
           )}

       </div>
    </div>
  );
};
