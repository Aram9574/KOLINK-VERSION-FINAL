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

const InsightResponderView: React.FC = () => {
    const { user, language } = useUser();
    const t = translations[language as AppLanguage].app.sidebar.insight;

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
                        toast.success("Image pasted from clipboard!");
                    }
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    const handleImageSelect = (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image too large. Max 5MB.");
            return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        if (!imageFile && !intent.trim()) {
            toast.error("Please provide an image or describes your intent.");
            return;
        }

        setIsGenerating(true);
        setReplies([]);
        setActiveReply(null);

        try {
            const payload: any = {
                userIntent: intent,
                tone, // Backend will see localized string, but prompt handles generic instructions well. 
                      // Ideally map back to English for consistent backend prompting if needed, 
                      // but Gemini is multilingual.
                textContext: !imageFile ? intent : undefined // Fallback if no image
            };

            if (imagePreview) {
                payload.imageBase64 = imagePreview;
            }

            const results = await generateInsightReply(payload);
            
            if (results && results.length > 0) {
                setReplies(results);
                setActiveReply(results[0]); // Default to first
                toast.success("Insights generated successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate insights. Please try again.");
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
                        {t.subtitle} {user.brandVoice ? <span className="font-semibold text-indigo-600">{user.brandVoice}</span> : 'your unique voice'}.
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
                            className={`relative bg-white rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group min-h-[300px] flex flex-col items-center justify-center
                                ${imagePreview ? 'border-indigo-200' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'}
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
                                 <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                        <ScanLine className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{t.uploadTitle}</h3>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
                                        {t.uploadDesc}
                                    </p>
                                    <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                                        <ImageIcon className="w-3 h-3" />
                                        Supports PNG, JPG, WebP
                                    </div>
                                 </div>
                             )}
                        </div>

                        {/* Intent & Tone */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm flex flex-col">
                            <div className="flex-1">
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">{t.intentLabel}</label>
                                <textarea 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl resize-none h-32 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
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
                                        {t.analyzing || "Scanning..."}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        {t.generate || "Generate Insights"}
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
                                {replies.length > 0 && <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{replies.length} options</span>}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-400">Powered by</span>
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
                                    onCopy={(content) => toast.success("Copied to clipboard")}
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
                                <h4 className="text-sm font-bold text-slate-900 mb-1">No Insights Yet</h4>
                                <p className="text-slate-500 text-xs max-w-sm">
                                    Upload a post screenshot to generate high-authority reply options.
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
