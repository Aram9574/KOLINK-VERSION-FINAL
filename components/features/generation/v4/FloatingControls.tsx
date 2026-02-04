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
import { analytics } from "../../../../services/analyticsService";
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
        
       {/* MENU POPUPS */}
       {activeMenu === "tone" && (
           <div className="mb-3 bg-white/95 backdrop-blur-xl border border-white/20 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] rounded-2xl p-2 w-64 animate-in slide-in-from-bottom-5 fade-in duration-200">
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">
                   {language === 'es' ? 'Tono de Voz' : 'Tone of Voice'}
               </div>
               <div className="max-h-60 overflow-y-auto no-scrollbar space-y-1">
                   {TONES.map(tone => (
                       <button
                           key={tone.value}
                           onClick={() => { 
                               onUpdateParams({ tone: tone.value }); 
                               setActiveMenu(null); 
                               analytics.track('tone_changed', { tone: tone.value });
                           }}
                           className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${params.tone === tone.value ? "bg-brand-50 text-brand-700 shadow-sm" : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"}`}
                       >
                           {tConstants.tones[tone.value]?.label || tone.label}
                       </button>
                   ))}
               </div>
           </div>
       )}

       {activeMenu === "format" && (
           <div className="mb-3 bg-white/95 backdrop-blur-xl border border-white/20 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] rounded-2xl p-2 w-72 animate-in slide-in-from-bottom-5 fade-in duration-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">
                   {language === 'es' ? 'Formato Estructural' : 'Structural Format'}
               </div>
               <div className="max-h-60 overflow-y-auto no-scrollbar space-y-1">
                   {FRAMEWORKS.map(fw => (
                       <button
                           key={fw.value}
                           onClick={() => { 
                               onUpdateParams({ framework: fw.value }); 
                               setActiveMenu(null); 
                               analytics.track('feature_viewed', { feature: 'framework', value: fw.value });
                           }}
                           className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all group ${params.framework === fw.value ? "bg-brand-50 shadow-sm" : "hover:bg-slate-50"}`}
                       >
                           <span className={`block font-bold ${params.framework === fw.value ? "text-brand-700" : "text-slate-700 group-hover:text-slate-900"}`}>
                                {tConstants.frameworks[fw.value]?.label || fw.label}
                           </span>
                           <span className={`block text-[10px] mt-0.5 ${params.framework === fw.value ? "text-brand-600/80" : "text-slate-500 group-hover:text-slate-600"}`}>
                                {tConstants.frameworks[fw.value]?.desc}
                           </span>
                       </button>
                   ))}
               </div>
           </div>
       )}

       {activeMenu === "settings" && (
           <div className="mb-3 bg-white/95 backdrop-blur-xl border border-white/20 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] rounded-2xl p-4 w-72 animate-in slide-in-from-bottom-5 fade-in duration-200">
                <div className="space-y-4">
                    {/* Carousel */}
                    <div className="flex items-center justify-between">
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                             {language === 'es' ? 'Modo Carrusel' : 'Carousel Mode'}
                         </span>
                         <button 
                            onClick={() => onUpdateParams({ generateCarousel: !params.generateCarousel })}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${params.generateCarousel ? "bg-brand-500" : "bg-slate-200"}`}
                         >
                             <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${params.generateCarousel ? "translate-x-4" : ""}`} />
                         </button>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Audience */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {language === 'es' ? 'Audiencia' : 'Audience'}
                        </label>
                        <input
                            type="text"
                            value={params.audience}
                            onChange={(e) => onUpdateParams({ audience: e.target.value })}
                            placeholder={language === 'es' ? 'Ej. CEOs...' : 'Ex. CEOs...'}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-slate-800 placeholder:text-slate-400 transition-all"
                        />
                    </div>

                    {/* Length */}
                    <div className="space-y-1">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {language === 'es' ? 'Longitud' : 'Length'}
                        </label>
                        <div className="flex flex-col gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                            {LENGTH_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => onUpdateParams({ length: opt.value })}
                                    className={`w-full py-2 px-3 text-[10px] font-bold uppercase rounded-md transition-all text-left flex justify-between items-center ${params.length === opt.value ? "bg-white text-brand-700 shadow-sm ring-1 ring-black/5" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
                                >
                                    <span>{opt.label}</span>
                                    {params.length === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Creativity */}
                    <div className="space-y-2 pt-1">
                         <div className="flex justify-between text-xs">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                 {language === 'es' ? 'Creatividad' : 'Creativity'}
                             </span>
                             <span className="text-brand-600 font-bold">{params.creativityLevel}%</span>
                         </div>
                         <input 
                            type="range" 
                            min="0" max="100" 
                            value={params.creativityLevel} 
                            onChange={(e) => onUpdateParams({ creativityLevel: parseInt(e.target.value) })}
                            className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-500"
                         />
                    </div>
                </div>
           </div>
       )}

       {/* MAIN FLOATING BAR - LIGHT GLASSMORPHISM */}
       <div className="bg-white/80 backdrop-blur-2xl p-1.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 ring-1 ring-slate-900/5 flex items-center transition-all hover:scale-[1.01]">
           
           {/* 1. BUTTON: TONE/STYLE */}
           <button 
                onClick={() => toggleMenu("tone")}
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-full transition-all ${activeMenu === "tone" ? "bg-white shadow-sm ring-1 ring-black/5" : "hover:bg-slate-100/80"}`}
           >
                <div className={`p-1 rounded-full ${activeMenu === "tone" ? "bg-brand-50 text-brand-600" : "text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-200/50"} transition-colors`}>
                    <Mic className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-400">
                        {language === 'es' ? 'ESTILO' : 'STYLE'}
                    </span>
                    <span className={`text-[13px] leading-none font-semibold ${activeMenu === "tone" ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"} transition-colors whitespace-nowrap`}>
                        {params.tone === 'random' ? (language === 'es' ? '✨ Aleatorio' : '✨ Random') : (TONES.find(t => t.value === params.tone)?.label.split(' ')[0] || params.tone)}
                    </span>
                </div>
           </button>

           {/* Divider */}
           <div className="w-px h-8 bg-slate-200 mx-1" />

           {/* 2. BUTTON: FRAMEWORK */}
           <button 
                onClick={() => toggleMenu("format")}
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-full transition-all ${activeMenu === "format" ? "bg-white shadow-sm ring-1 ring-black/5" : "hover:bg-slate-100/80"}`}
           >
                 <div className={`p-1 rounded-full ${activeMenu === "format" ? "bg-purple-50 text-purple-600" : "text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-200/50"} transition-colors`}>
                    <AlignLeft className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-400">
                        {language === 'es' ? 'ESTRUCTURA' : 'FRAMEWORK'}
                    </span>
                    <span className={`text-[13px] leading-none font-semibold ${activeMenu === "format" ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"} transition-colors whitespace-nowrap`}>
                         {params.framework === 'random' ? (language === 'es' ? '🎲 Aleatorio' : '🎲 Random') : (FRAMEWORKS.find(f => f.value === params.framework)?.label.split(' ')[0] || params.framework)}
                    </span>
                </div>
           </button>

           {/* Divider */}
           <div className="w-px h-8 bg-slate-200 mx-1" />

            {/* 3. BUTTON: SETTINGS */}
            <button 
                onClick={() => toggleMenu("settings")}
                className={`group flex flex-col items-center justify-center px-4 py-1 gap-1 rounded-full transition-all ${activeMenu === "settings" ? "bg-white shadow-sm ring-1 ring-black/5" : "hover:bg-slate-100/80"}`}
           >
                <Settings2 className={`w-4 h-4 ${activeMenu === "settings" ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`} />
                <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-wider">
                    {language === 'es' ? 'AJUSTES' : 'CONFIG'}
                </span>
           </button>

           {/* 4. GENERATE BUTTON */}
           <button
                onClick={onGenerate}
                disabled={isGenerating}
                className={`ml-3 px-6 h-12 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${isGenerating ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" : "bg-slate-900 text-white hover:bg-black ring-1 ring-black/5"}`}
           >
                {isGenerating ? (
                    <Sparkles className="w-4 h-4 animate-pulse" />
                ) : (
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
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
