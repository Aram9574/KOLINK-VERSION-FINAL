import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, FileText, Check, Loader2, Scan, Save, Fingerprint, Sparkles, AlertCircle, Upload, FileUp, Cpu } from 'lucide-react';
import { UserProfile, Post } from '../../../types';
import { analyzeBrandVoice, BrandVoiceAnalysisResult } from '../../../services/geminiService';
import { toast } from 'sonner';

interface DNAScannerProps {
    user: UserProfile;
    posts: Post[];
    onSave: (result: BrandVoiceAnalysisResult) => Promise<void>;
    isSaving: boolean;
}

const DNAScanner: React.FC<DNAScannerProps> = ({ user, posts, onSave, isSaving }) => {
    const [scannerMode, setScannerMode] = useState<'history' | 'manual' | 'upload' | 'visual'>('history');
    const [manualText, setManualText] = useState('');
    const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<BrandVoiceAnalysisResult | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const validPosts = posts.filter(p => p.content && p.content.length > 50).slice(0, 20);

    const togglePostSelection = (postId: string) => {
        setSelectedPostIds(prev =>
            prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : prev.length < 5 ? [...prev, postId] : prev
        );
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
             setFile(f);
             toast.success("PDF Selected: " + f.name);
             setScannerMode('upload');
             setManualText(`[PDF CONTENT SIMULATION] Analysis of ${f.name}`);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setImageFile(f);
            setScannerMode('visual');
            toast.success("Visual sample uploaded: " + f.name);
        }
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        
        try {
            let samples: string[] = [];
            let imageBase64: string | undefined;

            if (scannerMode === 'history') {
                if (selectedPostIds.length === 0) {
                    toast.error("Select at least one post");
                    setIsAnalyzing(false);
                    return;
                }
                samples = validPosts
                    .filter(p => selectedPostIds.includes(p.id))
                    .map(p => p.content);
            } else if (scannerMode === 'visual') {
                 if (!imageFile) {
                    toast.error("Please upload an image");
                    setIsAnalyzing(false);
                    return;
                 }
                const reader = new FileReader();
                imageBase64 = await new Promise((resolve) => {
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(imageFile);
                });
                samples = ["(Visual Analysis Request)"]; // Placeholder content to trigger prompt
            } else {
                if (manualText.length < 50) { 
                    toast.error("Please provide valid content");
                    setIsAnalyzing(false);
                    return;
                }
                samples = [manualText];
            }

            // Cinematic delay for effect
            await new Promise(r => setTimeout(r, 2500)); 

            const result = await analyzeBrandVoice({
                contentSamples: samples,
                language: user.language || 'en',
                imageBase64
            });

            setAnalysisResult(result);
        } catch (error) {
            console.error(error);
            toast.error("Analysis failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (analysisResult) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-5xl mx-auto space-y-6"
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
                    {/* Header */}
                    <div className="bg-slate-900/95 p-6 flex items-center justify-between text-white relative overflow-hidden">
                         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center backdrop-blur-md border border-indigo-400/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                <Cpu className="w-7 h-7 text-indigo-300" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    Stylistic DNA Formulated
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                </h2>
                                <p className="text-indigo-200/60 text-sm font-mono">
                                    {analysisResult.stylisticDNA ? "Advanced Ghostwriting Model" : "Standard Voice Model"}
                                </p>
                            </div>
                        </div>
                        <div className="px-4 py-1.5 bg-green-500/10 text-green-400 text-xs font-mono font-bold uppercase tracking-widest rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                            Ready to Clone
                        </div>
                    </div>
                    
                    <div className="p-8 space-y-8 bg-gradient-to-b from-white to-slate-50/50">
                        {/* Main Analysis Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            
                            {/* Left Column: Core Identity */}
                            <div className="md:col-span-8 space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Voice Identity</label>
                                    <h3 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{analysisResult.styleName}</h3>
                                    <p className="text-slate-600 leading-relaxed bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-sm">
                                        {analysisResult.toneDescription}
                                    </p>
                                </div>

                                {/* Deep Stylistic DNA */}
                                {analysisResult.stylisticDNA && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
                                             <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 block">Sentence Structure</label>
                                             <p className="text-indigo-900 text-sm font-medium">{analysisResult.stylisticDNA.sentence_structure}</p>
                                        </div>
                                         <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl">
                                             <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2 block">Technical Depth</label>
                                              <div className="flex flex-wrap gap-1">
                                                {analysisResult.stylisticDNA.technical_terms?.map((term, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-white text-purple-700 text-[10px] font-bold rounded-md border border-purple-100 shadow-sm">
                                                        {term}
                                                    </span>
                                                ))}
                                              </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Right Column: Tactics & Hooks */}
                            <div className="md:col-span-4 space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Detected Keywords</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(analysisResult.keywords || []).map((k, i) => (
                                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                                                #{k}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Hook DNA */}
                                <div>
                                    <label className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Fingerprint className="w-3 h-3" />
                                        Viral Hook Patterns
                                    </label>
                                    <div className="space-y-2">
                                        {/* Fallback to hooks_dna if available, else hookPatterns */}
                                        {(analysisResult.stylisticDNA?.hooks_dna || analysisResult.hookPatterns?.map(p => p.pattern) || []).map((pattern, idx) => (
                                            <div key={idx} className="group relative overflow-hidden bg-white border border-brand-100 rounded-lg p-3 shadow-sm hover:border-brand-300 transition-colors">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500"></div>
                                                <p className="text-xs text-slate-600 font-medium pl-2 italic">"{typeof pattern === 'string' ? pattern : (pattern as any).pattern}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Footer Controls */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/60">
                            <button
                                onClick={() => setAnalysisResult(null)}
                                className="px-6 py-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-medium transition-colors text-sm"
                            >
                                Discard Analysis
                            </button>
                            <button
                                onClick={() => onSave(analysisResult)}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-xl hover:scale-105 transition-all text-sm"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save to Mimic Vault
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
             <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden relative">
                {/* Scanner Interface */}
                <div className="relative h-1 bg-slate-100 w-full overflow-hidden">
                    {isAnalyzing && (
                        <motion.div 
                            className="absolute inset-y-0 w-2/3 bg-gradient-to-r from-transparent via-brand-500 to-transparent blur-md"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                        />
                    )}
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
                        The Mimic Engine
                        <span className="block text-sm font-normal text-slate-500 mt-2 font-mono">Reverse-engineer any creator's voice algorithm</span>
                    </h2>

                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setScannerMode('history')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border transition-all text-sm font-medium ${
                                scannerMode === 'history' 
                                    ? 'bg-slate-100 border-slate-300 text-slate-900' 
                                    : 'border-transparent text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <History className="w-4 h-4" />
                            Post History
                        </button>
                        <button
                            onClick={() => setScannerMode('manual')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border transition-all text-sm font-medium ${
                                scannerMode === 'manual' 
                                    ? 'bg-slate-100 border-slate-300 text-slate-900' 
                                    : 'border-transparent text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            Paste Text / URL
                        </button>
                         <button
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border transition-all text-sm font-medium ${
                                scannerMode === 'upload' 
                                    ? 'bg-slate-100 border-slate-300 text-slate-900' 
                                    : 'border-transparent text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <FileUp className="w-4 h-4" />
                            Upload PDF
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                            accept=".pdf,.txt" 
                            className="hidden" 
                        />
                         <button
                            onClick={() => imageInputRef.current?.click()}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border transition-all text-sm font-medium ${
                                scannerMode === 'visual' 
                                    ? 'bg-slate-100 border-slate-300 text-slate-900' 
                                    : 'border-transparent text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <Scan className="w-4 h-4" />
                            Visual Mimicry
                        </button>
                        <input 
                            type="file" 
                            ref={imageInputRef} 
                            onChange={handleImageUpload} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>

                    <div className="min-h-[250px] bg-slate-50 rounded-xl border border-slate-200/60 p-1">
                        {scannerMode === 'history' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
                                {validPosts.length > 0 ? validPosts.slice(0, 4).map(post => (
                                    <div
                                        key={post.id}
                                        onClick={() => togglePostSelection(post.id)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all text-sm relative group bg-white ${
                                            selectedPostIds.includes(post.id)
                                                ? 'border-brand-500 shadow-md shadow-brand-500/10 ring-1 ring-brand-500/20'
                                                : 'border-slate-200 hover:border-brand-300 hover:shadow-sm'
                                        }`}
                                    >
                                        <p className="line-clamp-3 text-slate-600 leading-relaxed mb-3 font-mono text-xs">
                                            {post.content}
                                        </p>
                                        <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            {selectedPostIds.includes(post.id) && (
                                                <div className="w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center">
                                                    <Check className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 flex flex-col items-center justify-center h-48 text-slate-400">
                                        <History className="w-8 h-8 mb-2 opacity-50" />
                                        <p>No post history available</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full p-2">
                                <textarea
                                    value={manualText}
                                    onChange={(e) => setManualText(e.target.value)}
                                    className="w-full h-64 p-4 rounded-lg bg-white border border-slate-200 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none resize-none font-mono text-sm leading-relaxed text-slate-700"
                                    placeholder={
                                        scannerMode === 'upload' 
                                        ? "Review the content extracted from your PDF below before scanning..." 
                                        : scannerMode === 'visual'
                                        ? "Visual Analysis Mode: Upload an image to extract formatting rules (bold usage, spacing, list styles)..."
                                        : "Paste a Linkedin post URL or raw text from a creator here (e.g. Justin Welsh). The Engine will clone their rhythm, hooks, and vocabulary..."
                                    }
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || (scannerMode === 'history' && selectedPostIds.length === 0)}
                            className="relative group px-10 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative flex items-center gap-3">
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin text-brand-400" />
                                        <span className="tracking-wide">DECODING DNA...</span>
                                    </>
                                ) : (
                                    <>
                                        <Scan className="w-5 h-5 text-brand-400" />
                                        <span className="tracking-wide">INITIALIZE SCAN</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DNAScanner;
