import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Wand2 } from 'lucide-react';

export const AIContentMockup: React.FC = () => {
    const [step, setStep] = useState<'input' | 'generating' | 'done'>('input');
    const [inputValue, setInputValue] = useState("");
    const targetText = "How to build a personal brand in 2026";

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        
        if (step === 'input') {
            if (inputValue.length < targetText.length) {
                timeout = setTimeout(() => {
                    setInputValue(targetText.slice(0, inputValue.length + 1));
                }, 50);
            } else {
                timeout = setTimeout(() => setStep('generating'), 1000);
            }
        } else if (step === 'generating') {
            timeout = setTimeout(() => setStep('done'), 1500);
        } else if (step === 'done') {
            timeout = setTimeout(() => {
                setStep('input');
                setInputValue("");
            }, 4000);
        }

        return () => clearTimeout(timeout);
    }, [step, inputValue]);

    return (
        <div className="bg-slate-900 w-full h-full min-h-[350px] flex flex-col items-center justify-center p-8 rounded-xl border border-slate-700 relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500 rounded-full blur-[100px] opacity-20"></div>

             <div className="w-full max-w-md relative z-10">
                 {/* Input Phase */}
                 {step === 'input' && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-2xl"
                     >
                         <div className="flex items-center gap-2 mb-4 text-brand-300 font-medium text-sm">
                             <Sparkles className="w-4 h-4" /> 
                             AI Topic Generator
                         </div>
                         <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 flex items-center justify-between">
                             <span className="text-slate-200 font-mono text-sm">{inputValue}<span className="animate-pulse">|</span></span>
                             <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
                                 <ArrowRight className="w-3 h-3 text-white" />
                             </div>
                         </div>
                     </motion.div>
                 )}

                 {/* Generating Phase */}
                 {step === 'generating' && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4 py-12"
                     >
                         <div className="relative">
                             <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-brand-500 animate-spin"></div>
                             <Wand2 className="w-6 h-6 text-brand-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                         </div>
                         <p className="text-slate-300 font-medium animate-pulse">Analyzing topic...</p>
                     </motion.div>
                 )}

                 {/* Result Phase */}
                 {step === 'done' && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-3 gap-3"
                     >
                         {[1, 2, 3].map((i) => (
                             <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="aspect-[4/5] bg-white rounded-lg p-2 shadow-xl flex flex-col gap-2"
                             >
                                 <div className="w-full h-1/2 bg-slate-100 rounded flex items-center justify-center">
                                     <div className={`w-6 h-6 rounded-full ${i === 1 ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                                 </div>
                                 <div className="space-y-1">
                                     <div className="w-full h-1.5 bg-slate-200 rounded-full"></div>
                                     <div className="w-2/3 h-1.5 bg-slate-200 rounded-full"></div>
                                 </div>
                             </motion.div>
                         ))}
                     </motion.div>
                 )}
             </div>
        </div>
    );
};
