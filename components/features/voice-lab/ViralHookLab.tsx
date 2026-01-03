import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, RefreshCw, X, Zap } from 'lucide-react';
import { BrandVoice } from '../../../types';
import { generateHooks } from '../../../services/geminiService'; // Ensure this is imported
import { toast } from 'sonner';

interface ViralHookLabProps {
    voice: BrandVoice;
    isOpen: boolean;
    onClose: () => void;
}

const ViralHookLab: React.FC<ViralHookLabProps> = ({ voice, isOpen, onClose }) => {
    const [idea, setIdea] = useState('');
    const [hooks, setHooks] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!idea.trim()) return;
        setIsGenerating(true);
        try {
            const results = await generateHooks(idea, voice.id);
            setHooks(results);
        } catch (error) {
            toast.error("Failed to generate hooks");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                            Viral Hook Lab
                        </h2>
                        <p className="text-violet-100 text-sm mt-1">
                            Engineering attention using {voice.name}'s DNA.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Your Idea / Topic</label>
                        <div className="relative">
                            <textarea 
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                className="w-full p-4 pr-12 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none resize-none h-24 text-slate-700"
                                placeholder="e.g. The importance of sleep for productivity..."
                            />
                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || !idea.trim()}
                                className="absolute bottom-3 right-3 p-2 bg-violet-600 text-white rounded-lg shadow-lg hover:bg-violet-700 disabled:opacity-50 transition-all"
                            >
                                {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <AnimatePresence>
                        {hooks.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-3"
                            >
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Optimized Hooks</label>
                                {hooks.map((hook, idx) => (
                                    <motion.div 
                                        key={idx}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative bg-white border border-slate-200 hover:border-violet-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <p className="text-slate-700 font-medium pr-8">{hook}</p>
                                        <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(hook);
                                                toast.success("Hook copied!");
                                            }}
                                            className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-violet-600 transition-all bg-slate-50 hover:bg-violet-50 rounded-lg"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ViralHookLab;
