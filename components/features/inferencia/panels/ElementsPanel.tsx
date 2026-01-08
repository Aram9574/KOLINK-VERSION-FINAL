import React from "react";
import { Square, Circle, Triangle, Star, ArrowRight, Heart } from "lucide-react";

interface ElementsPanelProps {
    onAddElement?: (type: 'shape', content: string) => void;
}

const ElementsPanel: React.FC<ElementsPanelProps> = ({ onAddElement }) => {
    const shapes = [
        { icon: Square, label: "Rectangle" },
        { icon: Circle, label: "Circle" },
        { icon: Triangle, label: "Triangle" },
        { icon: Star, label: "Star" },
        { icon: ArrowRight, label: "Arrow" },
        { icon: Heart, label: "Icon" },
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Shapes & Icons</h4>
                <div className="grid grid-cols-3 gap-3">
                    {shapes.map((Shape, i) => (
                        <button 
                            key={i} 
                            onClick={() => onAddElement?.('shape', Shape.label)}
                            className="aspect-square rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 text-slate-500 transition-all"
                        >
                            <Shape.icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{Shape.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Background Patterns</h4>
                 <div className="grid grid-cols-2 gap-2">
                     <div className="aspect-video bg-slate-100 rounded-lg animate-pulse"></div>
                     <div className="aspect-video bg-slate-100 rounded-lg animate-pulse"></div>
                 </div>
            </div>
        </div>
    );
};

export default ElementsPanel;
