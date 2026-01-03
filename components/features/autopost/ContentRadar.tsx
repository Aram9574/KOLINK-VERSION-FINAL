
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Scan, UploadCloud, FileImage, X } from "lucide-react";

const ContentRadar: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [isScanning, setIsScanning] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (droppedFiles.length > 0) processFiles(droppedFiles);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
            processFiles(selectedFiles);
        }
    };

    const processFiles = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles]);
        // Simulate scanning effect
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 2000);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="col-span-12 mt-6">
            <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="relative bg-slate-900 rounded-2xl p-6 min-h-[160px] flex flex-col items-center justify-center overflow-hidden border border-slate-700/50 group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                 {/* Radar Grid Background */}
                 <div className="absolute inset-0 opacity-20 pointer-events-none" 
                      style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                 
                 {/* Scanning Beam */}
                 {isScanning && (
                     <motion.div 
                        initial={{ top: "-10%" }}
                        animate={{ top: "110%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-brand-500/20 to-transparent pointer-events-none z-0"
                     />
                 )}

                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                />

                 {files.length === 0 ? (
                     <div className="text-center z-10">
                        <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700 group-hover:border-brand-500/50 transition-colors">
                            <Scan className="text-brand-400 group-hover:scale-110 transition-transform duration-300" size={32} />
                        </div>
                        <h3 className="text-white font-bold text-lg">Radar de Contenido Multimodal</h3>
                        <p className="text-slate-400 text-sm mt-1">Arrastra capturas o ideas para alimentar la red neuronal.</p>
                     </div>
                 ) : (
                     <div className="w-full relative z-10">
                        <div className="flex justify-between items-center mb-4 px-2">
                             <span className="text-brand-300 font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isScanning ? "bg-brand-400 animate-pulse" : "bg-emerald-400"}`} />
                                {isScanning ? "Analizando Contexto..." : "Contexto Asegurado"}
                             </span>
                             <span className="text-slate-500 text-xs">{files.length} fuentes</span>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                            {files.map((file, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={i} 
                                    className="relative flex-shrink-0 w-32 h-24 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden group/item"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center z-0">
                                        <FileImage className="text-slate-600" />
                                    </div>
                                    <img 
                                        src={URL.createObjectURL(file)} 
                                        alt="preview" 
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/item:opacity-40 transition-opacity"
                                    />
                                    <button 
                                        onClick={() => removeFile(i)}
                                        className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-rose-500 rounded-md text-white opacity-0 group-hover/item:opacity-100 transition-all"
                                    >
                                        <X size={12} />
                                    </button>
                                </motion.div>
                            ))}
                            <div className="flex-shrink-0 w-32 h-24 border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-lg flex items-center justify-center text-slate-500 transition-colors">
                                <UploadCloud size={24} />
                            </div>
                        </div>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default ContentRadar;
