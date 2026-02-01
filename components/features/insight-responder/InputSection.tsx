import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, X, Upload, ScanLine } from 'lucide-react';

interface InputSectionProps {
    inputMode: 'image' | 'text';
    imagePreview: string | null;
    textContent: string;
    setTextContent: (val: string) => void;
    onImageSelect: (file: File) => void;
    onClearImage: (e: React.MouseEvent) => void;
    dragActive: boolean;
    setDragActive: (val: boolean) => void;
    isGenerating: boolean;
    translations: any;
}

const InputSection: React.FC<InputSectionProps> = ({
    inputMode,
    imagePreview,
    textContent,
    setTextContent,
    onImageSelect,
    onClearImage,
    dragActive,
    setDragActive,
    isGenerating,
    translations: t
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 p-5 shadow-sm relative overflow-hidden">
            {/* Glass Shine */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-0" />

            <div className="relative z-10">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">
                    {inputMode === 'image' ? t.modes.image : t.modes.text}
                </label>

                {inputMode === 'image' ? (
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => !imagePreview && fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer h-[280px] flex items-center justify-center ${
                            dragActive 
                                ? 'border-blue-500 bg-blue-50/50' 
                                : imagePreview 
                                    ? 'border-slate-200 bg-slate-50' 
                                    : 'border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30'
                        }`}
                    >
                        {imagePreview ? (
                            <div className="relative w-full h-full p-3 flex items-center justify-center">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="max-w-full max-h-full object-contain rounded-xl"
                                />
                                <button 
                                    onClick={onClearImage}
                                    className="absolute top-5 right-5 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg z-10"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {isGenerating && (
                                    <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <div className="flex items-center gap-3 bg-white/90 px-5 py-3 rounded-2xl shadow-xl">
                                            <ScanLine className="w-5 h-5 text-blue-600 animate-pulse" />
                                            <span className="text-sm font-bold text-slate-700">Analizando imagen...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-all">
                                    <Upload className="w-7 h-7 text-slate-400 group-hover:text-blue-600" />
                                </div>
                                <p className="text-sm font-bold text-slate-700 mb-1">{t.uploadImage}</p>
                                <p className="text-xs text-slate-400 font-medium">{t.dragDrop}</p>
                                <p className="text-[10px] text-slate-300 mt-2 font-bold uppercase tracking-widest">O pega con Cmd+V</p>
                            </div>
                        )}
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="relative">
                        <textarea 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl resize-none h-[280px] text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 outline-none transition-all placeholder:text-slate-300 font-medium leading-relaxed"
                            placeholder={t.textPlaceholder}
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                        />
                        {isGenerating && (
                            <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[2px] rounded-2xl flex items-center justify-center pointer-events-none">
                                <div className="flex items-center gap-3 bg-white/90 px-5 py-3 rounded-2xl shadow-xl">
                                    <ScanLine className="w-5 h-5 text-blue-600 animate-pulse" />
                                    <span className="text-sm font-bold text-slate-700">Procesando contexto...</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InputSection;
