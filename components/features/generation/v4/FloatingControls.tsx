import React, { useState } from "react";
import { 
    Mic, 
    Sparkles, 
    Zap, 
    Settings2, 
    ChevronUp, 
    AlignLeft, 
    Smile, 
    Target,
    Hash
} from "lucide-react";
import { AppLanguage, GenerationParams } from "../../../../types";
import { TONES, FRAMEWORKS, LENGTH_OPTIONS, EMOJI_OPTIONS } from "../../../../constants";
import { translations } from "../../../../translations";
import { CustomSelect } from "../../../ui/CustomSelect"; 

interface FloatingControlsProps {
  params: GenerationParams;
  onUpdateParams: (params: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  language: AppLanguage;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  params,
  onUpdateParams,
  onGenerate,
  isGenerating,
  language
}) => {
  const [activeMenu, setActiveMenu] = useState<"tone" | "format" | "settings" | null>(null);

  const toggleMenu = (menu: "tone" | "format" | "settings") => {
    if (activeMenu === menu) setActiveMenu(null);
    else setActiveMenu(menu);
  };

  const tConstants = translations[language].app.constants;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 isolate font-sans">
        
       {/* MENU POPUPS (Rendered above the buttons) */}
       {/* Kept existing logic for popups, but improved their container styling */}
       {activeMenu === "tone" && (
           <div className="mb-3 bg-[#0f172a] border border-slate-700/50 shadow-2xl rounded-xl p-2 w-64 animate-in slide-in-from-bottom-5 fade-in duration-200">
               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-2">
                   {language === 'es' ? 'Tono de Voz' : 'Tone of Voice'}
               </div>
               <div className="max-h-60 overflow-y-auto no-scrollbar space-y-1">
                   {TONES.map(tone => (
                       <button
                           key={tone.value}
                           onClick={() => { onUpdateParams({ tone: tone.value }); setActiveMenu(null); }}
                           className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${params.tone === tone.value ? "bg-white/10 text-white" : "hover:bg-white/5 text-slate-400"}`}
                       >
                           {tConstants.tones[tone.value]?.label || tone.label}
                       </button>
                   ))}
               </div>
           </div>
       )}

       {activeMenu === "format" && (
           <div className="mb-3 bg-[#0f172a] border border-slate-700/50 shadow-2xl rounded-xl p-2 w-72 animate-in slide-in-from-bottom-5 fade-in duration-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-2">
                   {language === 'es' ? 'Formato Estructural' : 'Structural Format'}
               </div>
               <div className="max-h-60 overflow-y-auto no-scrollbar space-y-1">
                   {FRAMEWORKS.map(fw => (
                       <button
                           key={fw.value}
                           onClick={() => { onUpdateParams({ framework: fw.value }); setActiveMenu(null); }}
                           className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors group ${params.framework === fw.value ? "bg-white/10" : "hover:bg-white/5"}`}
                       >
                           <span className={`block font-bold ${params.framework === fw.value ? "text-white" : "text-slate-400"}`}>
                                {tConstants.frameworks[fw.value]?.label || fw.label}
                           </span>
                           <span className="block text-[10px] text-slate-600 group-hover:text-slate-500 mt-0.5">
                                {tConstants.frameworks[fw.value]?.desc}
                           </span>
                       </button>
                   ))}
               </div>
           </div>
       )}

       {activeMenu === "settings" && (
           <div className="mb-3 bg-[#0f172a] border border-slate-700/50 shadow-2xl rounded-xl p-4 w-72 animate-in slide-in-from-bottom-5 fade-in duration-200 text-slate-200">
                <div className="space-y-4">
                    {/* Carousel */}
                    <div className="flex items-center justify-between">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             {language === 'es' ? 'Modo Carrusel' : 'Carousel Mode'}
                         </span>
                         <button 
                            onClick={() => onUpdateParams({ generateCarousel: !params.generateCarousel })}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${params.generateCarousel ? "bg-brand-500" : "bg-slate-700"}`}
                         >
                             <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${params.generateCarousel ? "translate-x-4" : ""}`} />
                         </button>
                    </div>

                    <div className="h-px bg-slate-800" />

                    {/* Audience */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {language === 'es' ? 'Audiencia' : 'Audience'}
                        </label>
                        <input
                            type="text"
                            value={params.audience}
                            onChange={(e) => onUpdateParams({ audience: e.target.value })}
                            placeholder={language === 'es' ? 'Ej. CEOs...' : 'Ex. CEOs...'}
                            className="w-full text-xs bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-2 focus:outline-none focus:border-brand-500 text-slate-200 placeholder:text-slate-600"
                        />
                    </div>

                    {/* Length */}
                    <div className="space-y-1">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {language === 'es' ? 'Longitud' : 'Length'}
                        </label>
                        <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-700">
                            {LENGTH_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => onUpdateParams({ length: opt.value })}
                                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${params.length === opt.value ? "bg-brand-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Creativity */}
                    <div className="space-y-2 pt-1">
                         <div className="flex justify-between text-xs">
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                 {language === 'es' ? 'Creatividad' : 'Creativity'}
                             </span>
                             <span className="text-brand-400 font-bold">{params.creativityLevel}%</span>
                         </div>
                         <input 
                            type="range" 
                            min="0" max="100" 
                            value={params.creativityLevel} 
                            onChange={(e) => onUpdateParams({ creativityLevel: parseInt(e.target.value) })}
                            className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-500"
                         />
                    </div>
                </div>
           </div>
       )}

       {/* MAIN FLOATING BAR - REBUILT COMPACT */}
       <div className="bg-[#0B1120] p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-slate-800/60 flex items-center transition-all hover:border-slate-700/80">
           
           {/* 1. ESTILO */}
           <button 
                onClick={() => toggleMenu("tone")}
                className={`group flex items-center gap-3 px-4 py-2 rounded-full transition-all ${activeMenu === "tone" ? "bg-white/10" : "hover:bg-white/5"}`}
           >
                <Mic className={`w-3.5 h-3.5 ${activeMenu === "tone" ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300"} transition-colors`} />
                <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#64748b]">
                        {language === 'es' ? 'ESTILO' : 'STYLE'}
                    </span>
                    <span className={`text-[13px] leading-none font-semibold ${activeMenu === "tone" ? "text-white" : "text-slate-300 group-hover:text-white"} transition-colors whitespace-nowrap`}>
                        {params.tone === 'random' ? (language === 'es' ? '✨ Aleatorio' : '✨ Random') : (TONES.find(t => t.value === params.tone)?.label.split(' ')[0] || params.tone)}
                    </span>
                </div>
           </button>

           {/* Divider */}
           <div className="w-px h-8 bg-slate-800 mx-1" />

           {/* 2. ESTRUCTURA */}
           <button 
                onClick={() => toggleMenu("format")}
                className={`group flex items-center gap-3 px-4 py-2 rounded-full transition-all ${activeMenu === "format" ? "bg-white/10" : "hover:bg-white/5"}`}
           >
                <AlignLeft className={`w-3.5 h-3.5 ${activeMenu === "format" ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300"} transition-colors`} />
                <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#64748b]">
                        {language === 'es' ? 'ESTRUCTURA' : 'FRAMEWORK'}
                    </span>
                    <span className={`text-[13px] leading-none font-semibold ${activeMenu === "format" ? "text-white" : "text-slate-300 group-hover:text-white"} transition-colors whitespace-nowrap`}>
                         {params.framework === 'random' ? (language === 'es' ? '🎲 Aleatorio' : '🎲 Random') : (FRAMEWORKS.find(f => f.value === params.framework)?.label.split(' ')[0] || params.framework)}
                    </span>
                </div>
           </button>

           {/* Divider */}
           <div className="w-px h-8 bg-slate-800 mx-1" />

            {/* 3. SETTINGS */}
            <button 
                onClick={() => toggleMenu("settings")}
                className={`group flex flex-col items-center justify-center px-4 py-1 gap-1 rounded-full transition-all ${activeMenu === "settings" ? "bg-white/10" : "hover:bg-white/5"}`}
           >
                <Settings2 className={`w-4 h-4 ${activeMenu === "settings" ? "text-white" : "text-slate-500 group-hover:text-white"}`} />
                <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-400 uppercase tracking-wider">
                    {language === 'es' ? 'AJUSTES' : 'CONFIG'}
                </span>
           </button>

           {/* 4. GENERATE BUTTON */}
           <button
                onClick={onGenerate}
                disabled={isGenerating}
                className={`ml-3 px-6 h-11 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:scale-95 ${isGenerating ? "bg-indigo-900/50 text-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-[#4f46e5] to-[#3b82f6] hover:brightness-110 text-white border border-white/10"}`}
           >
                {isGenerating ? (
                    <Sparkles className="w-4 h-4 animate-pulse" />
                ) : (
                     <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-blue-100" />
                        <span className="text-[11px] tracking-[0.15em] font-bold">
                            {language === 'es' ? 'GENERAR' : 'GENERATE'}
                        </span>
                    </div>
                )}
           </button>
       </div>

    </div>
  );
};
