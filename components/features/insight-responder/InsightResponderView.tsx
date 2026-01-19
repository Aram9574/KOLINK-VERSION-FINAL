import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ScanLine, Sparkles, Send, X, Image as ImageIcon } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { toast } from 'sonner';
import { generateInsightReply } from '../../../services/geminiService';
import ReplyVariants from './ReplyVariants';
import ValueMeter from './ValueMeter';
import { translations } from '../../../translations';
import { AppLanguage } from '../../../types';
import { useCredits } from '../../../hooks/useCredits';

import PremiumLockOverlay from "../../ui/PremiumLockOverlay";

const InsightResponderView: React.FC = () => {
    const { user, language } = useUser();
    const t = translations[language as AppLanguage].app.sidebar.insight;
    const { checkCredits } = useCredits();

    if (!user.isPremium) {
        return (
            <PremiumLockOverlay 
                title={t.title}
                description={t.subtitle}
                icon={<MessageCircle className="w-8 h-8" />}
            />
        );
    }

    const [dragActive, setDragActive] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [intent, setIntent] = useState('');
    const [tone, setTone] = useState(t.tones.technical);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Results
    const [replies, setReplies] = useState<any[]>([]);
    const [activeReply, setActiveReply] = useState<any | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Paste Handler
    React.useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.indexOf('image') !== -1) {
                    const blob = item.getAsFile();
                    if (blob) {
                        handleImageSelect(blob);
                        toast.success("¡Imagen pegada del portapapeles!");
                    }
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    const compressImage = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 1024;
                    const MAX_HEIGHT = 1024;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleImageSelect = async (file: File) => {
        if (file.size > 10 * 1024 * 1024) { // Allow up to 10MB input, we will compress it
            toast.error("Imagen muy pesada. Máx 10MB.");
            return;
        }

        const toastId = toast.loading("Procesando imagen...");
        try {
            const compressedBase64 = await compressImage(file);
            setImagePreview(compressedBase64);
            setImageFile(file); // Keep original file ref if needed, but preview is what we use for payload
            toast.dismiss(toastId);
        } catch (error) {
            console.error(error);
            toast.error("Error al procesar la imagen.");
            toast.dismiss(toastId);
        }
    };

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
            handleImageSelect(e.dataTransfer.files[0]);
        }
    };

    const handleGenerate = async () => {
        if (!imageFile && !intent.trim()) {
            toast.error("Por favor sube una imagen o describe tu intención.");
            return;
        }

        // Credit Check (Cost: 1)
        if (!checkCredits(1)) return;

        setIsGenerating(true);
        setReplies([]);
        setActiveReply(null);

        try {
            const payload: any = {
                userIntent: intent,
                tone, 
                textContext: !imageFile ? intent : undefined // Fallback if no image
            };

            if (imagePreview) {
                payload.imageBase64 = imagePreview;
            }

            const results = await generateInsightReply(payload);
            
            if (results && results.length > 0) {
                setReplies(results);
                setActiveReply(results[0]); // Default to first
                toast.success("¡Insights generados con éxito!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al generar insights. Inténtalo de nuevo.");
        } finally {
            setIsGenerating(false);
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageFile(null);
        setImagePreview(null);
    };

    return (
        <div className="h-full w-full bg-slate-50 relative overflow-hidden flex flex-col">
             {/* Background Grid */}
             <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '32px 32px'
                    }}
            />

            {/* Header */}
            <div className="relative z-10 pt-6 px-6 pb-4 border-b border-slate-200/50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-indigo-600" />
                        {t.title}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {t.subtitle} {user.brandVoice ? <span className="font-semibold text-indigo-600">{user.brandVoice}</span> : 'tu voz única'}.
                    </p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
                <div className="max-w-7xl mx-auto pb-20 space-y-6">
                    
                    {/* Top Row: Dropzone (Left) & Inputs (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Dropzone */}
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`relative bg-white rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group min-h-[300px] flex flex-col items-center justify-center
                                ${imagePreview ? 'border-indigo-200' : dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'}
                            `}
                        >
                             {/* Laser Scan Animation */}
                             {isGenerating && imagePreview && (
                                <motion.div 
                                    className="absolute top-0 left-0 w-full h-1 bg-cyan-400 blur-sm shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20"
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                             )}
                             
                             <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                             />

                             {imagePreview ? (
                                <>
                                    <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-slate-900/10 transition-colors z-0" />
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-4 z-0" />
                                    <button 
                                        onClick={clearImage}
                                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-slate-500 hover:text-red-500 z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                             ) : (
                                 <div className="text-center p-8 pointer-events-none">
                                    <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                        <ScanLine className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{t.uploadTitle}</h3>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
                                        {t.uploadDesc}
                                    </p>
                                    <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                                        <ImageIcon className="w-3 h-3" />
                                        Arrastra, Pega (Ctrl+V) o Clic
                                    </div>
                                    {dragActive && (
                                        <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center rounded-2xl">
                                            <p className="font-bold text-indigo-600">¡Suelta la imagen aquí!</p>
                                        </div>
                                    )}
                                 </div>
                             )}
                        </div>

                        {/* Intent & Tone */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm flex flex-col">
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold uppercase text-slate-500">{t.intentLabel}</label>
                                    <span className="text-[10px] text-indigo-500 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">Pro Tip: Sé específico</span>
                                </div>
                                
                                {/* Quick Intents */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {[
                                        { label: "🤝 Agradecer", text: "Agradece por el insight y comparte una breve experiencia personal relacionada." },
                                        { label: "❓ Preguntar", text: "Haz una pregunta reflexiva para fomentar la discusión en los comentarios." },
                                        { label: "🤔 Debatir", text: "Presenta un contraargumento educado validando primero su punto." },
                                        { label: "😂 Humor", text: "Haz una broma profesional y ligera relacionada con el tema." }
                                    ].map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => setIntent(item.text)}
                                            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>

                                <textarea 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl resize-none h-32 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
                                    placeholder={t.intentPlaceholder}
                                    value={intent}
                                    onChange={(e) => setIntent(e.target.value)}
                                />
                            </div>

                             <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">{t.toneLabel}</label>
                                <div className="relative">
                                    <select 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-colors pr-10"
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                    >
                                        <option value={t.tones.technical}>{t.tones.technical}</option>
                                        <option value={t.tones.supportive}>{t.tones.supportive}</option>
                                        <option value={t.tones.contrarian}>{t.tones.contrarian}</option>
                                        <option value={t.tones.connector}>{t.tones.connector}</option>
                                        <option value={t.tones.empathetic}>{t.tones.empathetic}</option>
                                    </select>
                                    <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || (!imageFile && !intent)}
                                className="w-full mt-auto py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {t.analyzing || "Analizando..."}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        {t.generate || "Generar Insights"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Bottom Row: Results */}
                    <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                {t.suggestions}
                                {replies.length > 0 && <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{replies.length} opciones</span>}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-400">Impulsado por</span>
                                <span className="text-xs font-bold px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Gemini 2.0 Flash
                                </span>
                            </div>
                         </div>
                         
                         {replies.length > 0 ? (
                             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <ReplyVariants 
                                    variants={replies} 
                                    onCopy={(content) => toast.success("¡Copiado al portapapeles!")}
                                />
                                {activeReply && (
                                    <div className="pt-4 border-t border-slate-200">
                                        <ValueMeter score={replies.reduce((max, r) => Math.max(max, r.score || 0), 0)} />
                                    </div>
                                )}
                             </div>
                         ) : (
                             // Empty State
                             <div className="h-full min-h-[150px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                                    <MessageCircle className="w-6 h-6 text-slate-300" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mb-1">Sin Insights aún</h4>
                                <p className="text-slate-500 text-xs max-w-sm">
                                    Sube una captura de un post para generar opciones de respuesta de alta autoridad.
                                </p>
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightResponderView;
