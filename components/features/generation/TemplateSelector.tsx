import React, { useState } from "react";
import { CAROUSEL_TEMPLATES, CarouselTemplate } from "./templates";
import { ChevronDown, Palette } from "lucide-react";

interface TemplateSelectorProps {
    selectedTemplateId: string;
    onSelect: (templateId: string) => void;
}

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
            {/* Pocket Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group"
            >
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Palette size={18} />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-500 transition-colors">
                            Plantilla Seleccionada
                        </span>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor:
                                        selectedTemplate.previewColor,
                                }}
                            />
                            <span className="text-sm font-black text-slate-900 dark:text-white">
                                {selectedTemplate.name}
                            </span>
                        </div>
                    </div>
                </div>
                <div
                    className={`ml-4 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500 transition-all ${
                        isOpen
                            ? "rotate-180 bg-blue-50 dark:bg-blue-900/50 text-blue-600"
                            : ""
                    }`}
                >
                    <ChevronDown size={16} />
                </div>
            </button>

            {/* The Pocket Content */}
            {isOpen && (
                <div className="w-full max-w-2xl mt-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-xl animate-in fade-in zoom-in-95 duration-300 z-50">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                                    title={template.description}
                                    className={`relative p-3 rounded-xl border font-bold text-xs transition-all duration-300 flex items-center gap-2 ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 shadow-sm scale-[1.02]"
                                            : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{
                                            backgroundColor:
                                                template.previewColor,
                                        }}
                                    />
                                    <span className="truncate">
                                        {template.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
