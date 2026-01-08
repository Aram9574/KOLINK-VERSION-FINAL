import React from "react";
import { Sparkles, AlignLeft, Type, Image as ImageIcon, Bold, Italic, AlignCenter } from "lucide-react";
import type { CarouselSlide, CarouselElement } from "../../../types/inferencia";

interface PropertiesPanelProps {
    slide: CarouselSlide;
    activeElement?: CarouselElement;
    onChange: (field: string, value: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ slide, activeElement, onChange }) => {
    
    if (!activeElement) {
        return (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm p-8 text-center bg-slate-50/50">
                 <div className="flex flex-col items-center gap-2">
                    <Sparkles className="w-8 h-8 text-slate-300" />
                    <p>Select an element to edit properties</p>
                 </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white flex flex-col">
            {/* Header */}
            <div className="h-14 border-b border-slate-100 flex items-center px-4 justify-between bg-white shrink-0">
                <span className="font-bold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-2">
                     {activeElement.type === "text" && <><Type className="w-4 h-4 text-brand-500" /> Text Properties</>}
                     {activeElement.type === "image" && <><ImageIcon className="w-4 h-4 text-brand-500" /> Image Properties</>}
                </span>
            </div>

            {/* Controls Content */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                
                {/* Text Editing Controls */}
                {activeElement.type === "text" && (
                    <>
                        {/* Content Input */}
                         <div className="flex flex-col gap-2">
                            <label className="text-[11px] uppercase font-bold text-slate-400">Content</label>
                            <textarea 
                                value={activeElement.content} 
                                onChange={(e) => onChange('content', e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-brand-500 outline-none w-full min-h-[80px] resize-none" 
                            />
                        </div>

                        <div className="w-full h-px bg-slate-100"></div>

                        {/* Typography */}
                        <div className="flex flex-col gap-4">
                            <label className="text-[11px] uppercase font-bold text-slate-400">Typography</label>
                            
                            <div className="flex items-center justify-between bg-slate-50 p-1 rounded-lg border border-slate-200">
                                <button 
                                    onClick={() => onChange('style.fontWeight', activeElement.style.fontWeight === 'bold' ? 'normal' : 'bold')}
                                    className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-all ${activeElement.style.fontWeight === 'bold' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    title="Bold"
                                >
                                    <Bold className="w-4 h-4" />
                                </button>
                                <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                <button 
                                    className="flex-1 flex items-center justify-center py-1.5 rounded-md text-slate-400 hover:text-slate-600"
                                    title="Italic (Coming Soon)"
                                >
                                    <Italic className="w-4 h-4" />
                                </button>
                                <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                 <button 
                                    className="flex-1 flex items-center justify-center py-1.5 rounded-md text-slate-400 hover:text-slate-600"
                                    title="Alignment (Coming Soon)"
                                >
                                    <AlignCenter className="w-4 h-4" />
                                </button>
                            </div>

                             <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-medium text-slate-500">Size (px)</label>
                                    <input 
                                        type="number" 
                                        value={parseInt(activeElement.style.fontSize as string)} 
                                        onChange={(e) => onChange('style.fontSize', `${e.target.value}px`)}
                                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-brand-500 outline-none" 
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-medium text-slate-500">Color</label>
                                    <div className="h-[38px] w-full border border-slate-200 rounded-lg overflow-hidden relative cursor-pointer">
                                        <input 
                                            type="color" 
                                            value={activeElement.style.color || "#000000"} 
                                            onChange={(e) => onChange('style.color', e.target.value)}
                                            className="absolute -top-2 -left-2 w-[150%] h-[150%] cursor-pointer p-0 m-0 border-0" 
                                        />
                                    </div>
                                </div>
                             </div>
                        </div>
                    </>
                )}

                {/* Image Editing Controls */}
                {activeElement.type === "image" && (
                     <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                             <div className="w-full aspect-square bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative group">
                                <img src={activeElement.content} alt="Selected" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">Change Image</span>
                                </div>
                             </div>
                             <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-transparent">
                                Replace Image
                            </button>
                        </div>
                        
                         <div className="flex flex-col gap-2">
                             <div className="flex justify-between">
                                 <label className="text-[11px] uppercase font-bold text-slate-400">Corner Radius</label>
                                 <span className="text-[10px] text-slate-500">{activeElement.style.borderRadius || '0px'}</span>
                             </div>
                             <input 
                                type="range" 
                                min="0" max="50"
                                value={parseInt(activeElement.style.borderRadius as string || "0")}
                                onChange={(e) => onChange('style.borderRadius', `${e.target.value}px`)}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600" 
                            />
                        </div>
                     </div>
                )}
            </div>
            
            {/* Footer / Delete Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                 <button className="w-full py-2.5 text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg text-sm font-bold transition-colors">
                    Delete Element
                </button>
            </div>
        </div>
    );
};

export default PropertiesPanel;
