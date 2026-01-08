import React from "react";
import { motion } from "framer-motion";
import { Trash2, Copy, ArrowLeft, ArrowRight } from "lucide-react";
import type { CarouselSlide as CarouselSlideType, CarouselTheme } from "../../../types/inferencia";

interface CarouselSlideProps {
    slide: CarouselSlideType;
    theme: CarouselTheme;
    isActive: boolean;
    activeElementId: string | null;
    onClick: () => void;
    onDelete: (e: React.MouseEvent) => void;
    onMoveLeft: (e: React.MouseEvent) => void;
    onMoveRight: (e: React.MouseEvent) => void;
    onSelectElement: (id: string, e: React.MouseEvent) => void;
    index: number;
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({ slide, theme, isActive, activeElementId, onClick, onDelete, onMoveLeft, onMoveRight, onSelectElement, index }) => {
    return (
        <motion.div 
            layoutId={`slide-${slide.id}`}
            onClick={onClick}
            className={`
                w-[320px] h-[400px] bg-white rounded-3xl shadow-xl flex-shrink-0
                relative group isolate overflow-hidden transition-all duration-300 cursor-pointer carousel-slide-export 
                bg-white
                ${isActive 
                    ? "ring-4 ring-brand-500 ring-offset-4 ring-offset-slate-50 scale-105 z-10 shadow-2xl shadow-brand-500/20" 
                    : "ring-1 ring-slate-200 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 opacity-100"
                }
            `}
            style={{ backgroundColor: theme.colors.background }}
        >
            {/* Slide Number Badge */}
            <div className="absolute top-4 left-4 z-20 w-6 h-6 rounded-full bg-black/10 backdrop-blur text-[10px] font-bold flex items-center justify-center text-slate-700">
                {index + 1}
            </div>

            {/* Content Area - Render Elements */}
            <div className="w-full h-full p-8 relative">
                {slide.elements.map(element => (
                    <div 
                        key={element.id}
                        className="absolute text-center"
                        style={{
                            left: element.x,
                            top: element.y,
                            width: element.width,
                            height: element.height,
                            color: theme.colors.text,
                            ...element.style
                        }}
                    >
                        {element.type === 'text' && element.content}
                        {element.type === 'image' && <img src={element.content} alt="" className="w-full h-full object-cover rounded-lg" />}
                    </div>
                ))}
            </div>
            
            {/* Hover Actions */}
            <div className={`absolute top-2 right-2 z-20 flex gap-1 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <button 
                    onClick={onMoveLeft}
                    className="p-1.5 bg-white/90 backdrop-blur shadow-sm rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Move Left"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                 <button 
                    onClick={onMoveRight}
                    className="p-1.5 bg-white/90 backdrop-blur shadow-sm rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Move Right"
                >
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-6 bg-slate-200/50 mx-0.5"></div>
                <button 
                    onClick={onDelete}
                    className="p-1.5 bg-white/90 backdrop-blur shadow-sm rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors"
                    title="Delete"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 bg-white/90 backdrop-blur shadow-sm rounded-lg hover:bg-slate-50 hover:text-brand-500 text-slate-400 transition-colors" title="Duplicate">
                    <Copy className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    );
};

export default CarouselSlide;
