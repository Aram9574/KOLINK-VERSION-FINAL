import React from "react";
import type { CarouselTheme } from "../../../types/inferencia";

interface TextPanelProps {
    theme: CarouselTheme;
    setTheme: React.Dispatch<React.SetStateAction<CarouselTheme>>;
    onAddText?: () => void;
}

const TextPanel: React.FC<TextPanelProps> = ({ theme, setTheme, onAddText }) => {
    
    const updateFont = (heading: string, body: string) => {
        setTheme(prev => ({
            ...prev,
            fonts: { heading, body }
        }));
    };

    return (
        <div className="space-y-6">
            <button 
                onClick={onAddText}
                className="w-full py-3 bg-brand-50 text-brand-600 font-bold rounded-xl border border-brand-200 hover:bg-brand-100 transition-colors flex items-center justify-center gap-2"
            >
                <span className="text-xl">+</span> Add Text Box
            </button>

            <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Font Pairings</h4>
                <div className="space-y-2">
                    <button 
                        onClick={() => updateFont('Inter', 'Inter')}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${theme.fonts.heading === 'Inter' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-500 hover:bg-slate-50'}`}
                    >
                         <h5 className="font-bold text-slate-900 mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Inter Bold</h5>
                         <p className="text-xs text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>Inter Regular for body text</p>
                    </button>
                    <button 
                        onClick={() => updateFont('Playfair Display', 'Lato')}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${theme.fonts.heading === 'Playfair Display' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-500 hover:bg-slate-50'}`}
                    >
                         <h5 className="font-bold text-slate-900 mb-0.5 text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Playfair</h5>
                         <p className="text-xs text-slate-500" style={{ fontFamily: 'Lato, sans-serif' }}>Lato Regular for body text</p>
                    </button>
                    <button 
                         onClick={() => updateFont('Oswald', 'Open Sans')}
                         className={`w-full text-left p-3 rounded-lg border transition-all ${theme.fonts.heading === 'Oswald' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-500 hover:bg-slate-50'}`}
                    >
                         <h5 className="font-bold text-slate-900 mb-0.5 text-lg uppercase tracking-wider" style={{ fontFamily: 'Oswald, sans-serif' }}>OSWALD</h5>
                         <p className="text-xs text-slate-500" style={{ fontFamily: 'Open Sans, sans-serif' }}>Open Sans for body text</p>
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                 <h4 className="font-bold text-slate-900 text-sm">Text Settings</h4>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase">Size</label>
                        <input type="range" className="w-full accent-brand-600" />
                    </div>
                    <div className="space-y-1">
                         <label className="text-[10px] text-slate-500 font-bold uppercase">Line Height</label>
                        <input type="range" className="w-full accent-brand-600" />
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default TextPanel;
