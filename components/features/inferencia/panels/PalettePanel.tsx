import React from "react";
import type { CarouselTheme } from "../../../types/inferencia";

interface PalettePanelProps {
    theme: CarouselTheme;
    setTheme: React.Dispatch<React.SetStateAction<CarouselTheme>>;
}

const PalettePanel: React.FC<PalettePanelProps> = ({ theme, setTheme }) => {
    
    const updateColor = (key: keyof CarouselTheme['colors'], value: string) => {
        setTheme(prev => ({
            ...prev,
            colors: {
                ...prev.colors,
                [key]: value
            }
        }));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Theme Colors</h4>
                <div className="grid gap-3">
                    <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:border-slate-200">
                        <span className="text-xs text-slate-600 font-medium">Background</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-mono">{theme.colors.background}</span>
                            <input 
                                type="color" 
                                value={theme.colors.background}
                                onChange={(e) => updateColor('background', e.target.value)}
                                className="w-6 h-6 rounded-full border border-slate-200 shadow-sm cursor-pointer p-0 overflow-hidden" 
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:border-slate-200">
                        <span className="text-xs text-slate-600 font-medium">Primary Text</span>
                        <div className="flex items-center gap-2">
                             <span className="text-xs text-slate-400 font-mono">{theme.colors.text}</span>
                             <input 
                                type="color" 
                                value={theme.colors.text}
                                onChange={(e) => updateColor('text', e.target.value)}
                                className="w-6 h-6 rounded-full border border-slate-200 shadow-sm cursor-pointer p-0 overflow-hidden" 
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:border-slate-200">
                        <span className="text-xs text-slate-600 font-medium">Accent</span>
                        <div className="flex items-center gap-2">
                             <span className="text-xs text-slate-400 font-mono">{theme.colors.accent}</span>
                             <input 
                                type="color" 
                                value={theme.colors.accent}
                                onChange={(e) => updateColor('accent', e.target.value)}
                                className="w-6 h-6 rounded-full border border-slate-200 shadow-sm cursor-pointer p-0 overflow-hidden" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Presets</h4>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        "#0F172A", 
                        "#2563EB", 
                        "#4F46E5", 
                        "#7C3AED",
                        "#16A34A",
                        "#D97706",
                        "#E11D48",
                        "#000000"
                    ].map((bg, i) => (
                        <button 
                            key={i} 
                            onClick={() => updateColor('background', bg)}
                            className="h-10 rounded-lg shadow-sm hover:scale-105 transition-transform border border-slate-200"
                            style={{ backgroundColor: bg }}
                        ></button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PalettePanel;
