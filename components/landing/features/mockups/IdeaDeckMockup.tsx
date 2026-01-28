import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Copy, RefreshCw, X, Check } from 'lucide-react';

export const IdeaDeckMockup: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const ideas = [
        { title: "The 'Anti-Advice'", text: "Share a piece of common industry advice that is actually wrong. Explain why based on your experience." },
        { title: "Behind the Scenes", text: "Show a photo of your messy desk. Talk about the reality of building vs the polished social media image." },
        { title: "Transformation Story", text: "Break down a client case study: Where they were X months ago vs. where they are now." }
    ];

    const nextIdea = () => {
        setCurrentIndex((prev) => (prev + 1) % ideas.length);
    };

    return (
        <div className="bg-slate-900 w-full h-full min-h-[350px] flex items-center justify-center p-8 rounded-xl border border-slate-700 relative overflow-hidden font-sans">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-900"/>

            <div className="w-full max-w-xs relative z-10 aspect-[3/4]">
                <AnimatePresence mode='popLayout'>
                    <motion.div
                        key={currentIndex}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 1.1, opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute inset-0 bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center text-center justify-between border border-slate-200"
                    >
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mb-4">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                            <h3 className="font-bold text-slate-800 text-lg mb-2">{ideas[currentIndex].title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{ideas[currentIndex].text}</p>
                        </div>

                        <div className="flex w-full gap-3 mt-6">
                            <button onClick={nextIdea} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
                                <X className="w-5 h-5 mx-auto" />
                            </button>
                            <button onClick={nextIdea} className="flex-1 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20">
                                <Check className="w-5 h-5 mx-auto" />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
                
                {/* Stack Effect */}
                <div className="absolute top-4 left-4 right-4 bottom-[-16px] bg-white/10 rounded-xl -z-10 scale-[0.95]"/>
                <div className="absolute top-8 left-8 right-8 bottom-[-32px] bg-white/5 rounded-xl -z-20 scale-[0.9]"/>
            </div>
        </div>
    );
};
