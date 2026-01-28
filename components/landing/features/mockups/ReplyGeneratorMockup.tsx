import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Wand2, ThumbsUp, Send } from 'lucide-react';

export const ReplyGeneratorMockup: React.FC = () => {
    const [selectedTone, setSelectedTone] = useState<'agree' | 'question' | 'debate'>('agree');
    
    const REPLIES = {
        agree: "Totally agree! Consistency is definitely the key to compounding growth on LinkedIn. 🚀",
        question: "Interesting point. Do you think this applies to smaller niches as well, or just broad markets?",
        debate: "I see your point, but I'd argue that quality beats consistency in 2026. Feeds are too saturated for average daily posts."
    };

    return (
        <div className="bg-slate-50 w-full h-full min-h-[350px] flex flex-col items-center justify-center p-8 rounded-xl border border-slate-200 font-sans">
            
            <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-lg p-6 space-y-6">
                
                {/* Internal Monologue / Post Context */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500 italic flex gap-2">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    Context: Post about "Consistency vs Quality"
                </div>

                {/* Tone Selectors */}
                <div className="flex gap-2">
                    {['agree', 'question', 'debate'].map((tone) => (
                        <button
                            key={tone}
                            onClick={() => setSelectedTone(tone as any)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all border ${
                                selectedTone === tone 
                                    ? 'bg-brand-50 border-brand-200 text-brand-700 ring-2 ring-brand-100 ring-offset-2' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {tone}
                        </button>
                    ))}
                </div>

                {/* Generated Reply */}
                <div className="relative">
                    <div className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-bold text-brand-500 uppercase flex items-center gap-1">
                        <Wand2 className="w-3 h-3" /> AI Draft
                    </div>
                    <AnimatePresence mode='wait'>
                        <motion.textarea
                            key={selectedTone}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="w-full h-24 p-4 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-100"
                            readOnly
                            value={REPLIES[selectedTone]}
                        />
                    </AnimatePresence>
                </div>

                {/* Action Bar */}
                <div className="flex justify-end gap-2">
                    <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-lg shadow-brand-600/20">
                        <Send className="w-3.5 h-3.5" /> Post Reply
                    </button>
                </div>

            </div>

        </div>
    );
};
