import React, { useState } from "react";
import { CAROUSEL_TEMPLATES, CarouselTemplate } from "./templates";
import {
    ChevronDown,
    Heart,
    Monitor,
    Palette,
    Shield,
    Sparkles,
    Zap,
} from "lucide-react";

interface TemplateSelectorProps {
    selectedTemplateId: string;
    onSelect: (templateId: string) => void;
}

const CategoryIcon = ({ category }: { category: string }) => {
    switch (category) {
        case "Professional":
            return <Shield size={10} className="text-blue-500" />;
        case "Creative":
            return <Zap size={10} className="text-amber-500" />;
        case "Dark":
            return <Monitor size={10} className="text-slate-400" />;
        case "Minimal":
            return <Heart size={10} className="text-rose-400" />;
        case "Premium":
            return <Sparkles size={10} className="text-indigo-500" />;
        default:
            return null;
    }
};

const MiniPreview = ({ template }: { template: CarouselTemplate }) => {
    // A simplified CSS representation of the template's vibe
    return (
        <div
            className={`w-full aspect-[4/5] rounded-lg border border-slate-200/60/60 overflow-hidden relative shadow-inner group-hover/card:shadow-md transition-all duration-500 ${
                template.styles.container.replace("aspect-[4/5]", "")
            }`}
            style={{ fontSize: "4px" }}
        >
            <div className="p-2 flex flex-col h-full gap-1">
                {/* Simulated Logo */}
                <div className="w-2 h-2 rounded-full bg-current opacity-20 mb-1" />

                {/* Simulated Title Lines */}
                <div className="w-[80%] h-[2px] bg-current opacity-40 rounded-full" />
                <div className="w-[60%] h-[2px] bg-current opacity-30 rounded-full" />

                {/* Simulated Content Lines */}
                <div className="mt-2 space-y-0.5">
                    <div className="w-full h-[1px] bg-current opacity-10 rounded-full" />
                    <div className="w-full h-[1px] bg-current opacity-10 rounded-full" />
                    <div className="w-[90%] h-[1px] bg-current opacity-10 rounded-full" />
                </div>

                <div className="flex-1" />

                {/* Simulated Footer */}
                <div className="flex justify-between items-center opacity-20">
                    <div className="w-4 h-[1px] bg-current rounded-full" />
                    <div className="w-1 h-1 bg-current rounded-full" />
                </div>
            </div>

            {/* Decorative shape simulation if template has it */}
            {template.elements?.showDecorativeShapes && (
                <div
                    className={`absolute top-0 right-0 w-4 h-4 rounded-full opacity-20 blur-[4px] ${
                        template.previewColor.startsWith("#f")
                            ? "bg-blue-500"
                            : "bg-white"
                    }`}
                />
            )}
        </div>
    );
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    selectedTemplateId,
    onSelect,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedTemplate =
        CAROUSEL_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
        CAROUSEL_TEMPLATES[0];

    return (
        <div className="flex flex-col items-center w-full">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-4 px-5 py-2.5 bg-white border border-slate-200/60/60 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group relative overflow-hidden"
            >
                <div className="flex items-center gap-3 relative z-10">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        <Palette size={18} />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                            Estilo Visual
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">
                                {selectedTemplate.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[8px] font-black uppercase tracking-wider text-slate-500">
                                {selectedTemplate.category}
                            </span>
                        </div>
                    </div>
                </div>
                <div
                    className={`ml-2 p-1 rounded-lg text-slate-300 group-hover:text-blue-500 transition-all duration-500 ${
                        isOpen ? "rotate-180 text-blue-500" : ""
                    }`}
                >
                    <ChevronDown size={18} strokeWidth={1.5} />
                </div>
            </button>

            {/* Pocket Content */}
            {isOpen && (
                <div className="w-full max-w-4xl mt-6 p-8 bg-white/80 backdrop-blur-xl border border-slate-200/60/60 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-500 z-50 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-black text-slate-900">
                                Explora Plantillas
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                Diseños premium optimizados para LinkedIn
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {[
                                "Professional",
                                "Creative",
                                "Dark",
                                "Minimal",
                                "Premium",
                            ].map((cat) => (
                                <div
                                    key={cat}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/60/60 text-[9px] font-bold text-slate-400"
                                >
                                    <CategoryIcon category={cat} />
                                    {cat}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {CAROUSEL_TEMPLATES.map((template) => {
                            const isSelected =
                                selectedTemplateId === template.id;
                            return (
                                <button
                                    key={template.id}
                                    onClick={() => {
                                        onSelect(template.id);
                                        setIsOpen(false);
                                    }}
                                    className={`group/card relative p-2 rounded-xl border transition-all duration-500 flex flex-col gap-3 ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50/30 ring-4 ring-blue-500/5 shadow-lg"
                                            : "border-slate-200/60/60 bg-white hover:border-blue-200 hover:shadow-xl hover:-translate-y-1"
                                    }`}
                                >
                                    <MiniPreview template={template} />

                                    <div className="px-1 space-y-0.5">
                                        <div className="flex items-center justify-between gap-1">
                                            <span
                                                className={`text-[10px] font-black truncate ${
                                                    isSelected
                                                        ? "text-blue-600"
                                                        : "text-slate-700 group-hover/card:text-blue-500 transition-colors"
                                                }`}
                                            >
                                                {template.name}
                                            </span>
                                            <CategoryIcon
                                                category={template.category}
                                            />
                                        </div>
                                        <p className="text-[8px] text-slate-400 font-medium leading-[1.3] block line-clamp-2">
                                            {template.description}
                                        </p>
                                    </div>

                                    {isSelected && (
                                        <div className="absolute top-3 right-3 bg-blue-500 text-white p-1 rounded-full shadow-lg animate-in zoom-in-50 duration-500">
                                            <Sparkles size={10} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
