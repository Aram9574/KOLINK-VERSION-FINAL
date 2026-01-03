import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandVoice } from '../../../types';
import { Bot, AlertTriangle, CheckCircle2, Wand2, Type, Hash, Zap } from 'lucide-react';

interface ShadowingPlaygroundProps {
    activeVoice: BrandVoice | undefined;
}

const ShadowingPlayground: React.FC<ShadowingPlaygroundProps> = ({ activeVoice }) => {
    const [text, setText] = useState('');
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'warning' | 'info', message: string }[]>([]);

    useEffect(() => {
        if (!activeVoice || !activeVoice.stylisticDNA) return;
        analyzeText(text);
    }, [text, activeVoice]);

    const analyzeText = (inputText: string) => {
        if (!inputText.trim()) {
             setScore(0);
             setFeedback([]); 
             return; 
        }

        const dna = activeVoice?.stylisticDNA;
        let currentScore = 100;
        let newFeedback: any[] = [];

        // 1. Technical Terms Check
        const foundTerms = dna?.technical_terms.filter(term => inputText.toLowerCase().includes(term.toLowerCase())) || [];
        if (foundTerms.length === 0 && (dna?.technical_terms.length || 0) > 0) {
            currentScore -= 20;
            newFeedback.push({
                type: 'warning',
                message: `Missing key vocabulary: Try using terms like "${dna?.technical_terms.slice(0, 3).join(', ')}..."`
            });
        } else if (foundTerms.length > 0) {
            newFeedback.push({
                type: 'success',
                message: `Great use of authority terms: ${foundTerms.join(', ')}`
            });
        }

        // 2. Sentence Length Check (Simple heuristic)
        const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgLength = sentences.reduce((acc, s) => acc + s.split(' ').length, 0) / (sentences.length || 1);
        
        if (dna?.sentence_structure.toLowerCase().includes('short') && avgLength > 20) {
            currentScore -= 15;
            newFeedback.push({ type: 'warning', message: "Sentences are too long. This voice prefers punchy, short statements." });
        }

        // 3. Formatting
        if (dna?.formatting_rules.some(r => r.toLowerCase().includes('list')) && !inputText.includes('\n-')) {
            currentScore -= 10;
            newFeedback.push({ type: 'info', message: "Consider using bullet points to match the structural DNA." });
        }

        setScore(Math.max(0, currentScore));
        setFeedback(newFeedback);
    };

    if (!activeVoice) {
         return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-12 text-center">
                <Bot className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-slate-700">No Active Voice</h3>
                <p>Activate a voice in the Mimic Vault to start training.</p>
            </div>
         );
    }

    return (
        <div className="flex h-[calc(100vh-200px)] gap-6">
            {/* Editor Area */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm flex-1 overflow-hidden flex flex-col">
                    <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Shadowing Mode</span>
                        </div>
                        <div className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-100">
                             Mimicking: {activeVoice.name}
                        </div>
                    </div>
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 w-full p-8 outline-none resize-none font-mono text-slate-700 leading-relaxed text-lg placeholder:text-slate-300"
                        placeholder="Start typing... The AI Coach will guide your style in real-time."
                    />
                </div>
            </div>

            {/* Coach Sidebar */}
            <div className="w-80 flex flex-col gap-4">
                {/* Score Card */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-24 h-24" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Resonance Score</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-5xl font-bold tracking-tighter">{score}%</span>
                    </div>
                     <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                        <motion.div 
                            className={`h-full ${score > 80 ? 'bg-green-400' : score > 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                            animate={{ width: `${score}%` }}
                        />
                    </div>
                </div>

                {/* Feedback Stream */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 overflow-y-auto space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Bot className="w-3 h-3" />
                         AI Coach Stream
                    </h4>
                    
                    <AnimatePresence mode='popLayout'>
                        {feedback.length > 0 ? (
                            feedback.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`p-3 rounded-xl border text-sm ${
                                        item.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' :
                                        item.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                                        'bg-blue-50 border-blue-100 text-blue-800'
                                    }`}
                                >
                                    <div className="flex gap-2">
                                        {item.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                                        {item.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0" />}
                                        {item.type === 'info' && <Wand2 className="w-4 h-4 shrink-0" />}
                                        <p className="leading-snug">{item.message}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400 text-xs italic">
                                Start typing to receive stylistic feedback...
                            </div>
                        )}
                    </AnimatePresence>
                </div>
                
                 {/* DNA cheat sheet */}
                 {activeVoice.stylisticDNA && (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">DNA Cheat Sheet</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Type className="w-3 h-3 text-brand-500" />
                                <span className="font-medium">Tone:</span> {activeVoice.stylisticDNA.tone}
                            </div>
                             <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Hash className="w-3 h-3 text-brand-500" />
                                <span className="font-medium">Vocabulary:</span> {activeVoice.stylisticDNA.technical_terms.slice(0, 3).join(', ')}
                            </div>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default ShadowingPlayground;
