import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Type, Palette, Download, ChevronRight, ChevronLeft, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';

export const CarouselEditorMockup: React.FC = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    
    // Auto-advance slides every few seconds to show "editing" flow
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const slides = [
        {
            title: "5 Tips for Better SEO",
            subtitle: "Swipe to learn ->",
            bg: "bg-indigo-600",
            text: "text-white"
        },
        {
            title: "1. Optimize Title Tags",
            subtitle: "Make them punchy and relevant.",
            bg: "bg-white",
            text: "text-slate-900"
        },
        {
            title: "Summary",
            subtitle: "Save this post for later!",
            bg: "bg-slate-900",
            text: "text-white"
        }
    ];

    return (
        <div className="bg-slate-100 w-full h-full min-h-[400px] flex flex-col font-sans overflow-hidden rounded-xl border border-slate-200">
            {/* Header */}
            <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                        <Layers className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">Carousel Studio</span>
                </div>
                <div className="flex gap-2">
                    <div className="h-2 w-20 bg-slate-200 rounded-full"></div>
                    <button 
                        onClick={() => setIsExporting(true)}
                        className="px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-md flex items-center gap-1 hover:bg-brand-700 transition-colors"
                    >
                        <Download className="w-3 h-3" />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-6">
                    <div className="p-2 bg-brand-50 rounded-lg text-brand-600 cursor-pointer hover:bg-brand-100 transition-colors">
                        <Layout className="w-5 h-5" />
                    </div>
                    <div className="p-2 text-slate-400 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors">
                        <Type className="w-5 h-5" />
                    </div>
                    <div className="p-2 text-slate-400 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors">
                        <Palette className="w-5 h-5" />
                    </div>
                    <div className="p-2 text-slate-400 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                </div>

                {/* Main Canvas */}
                <div className="flex-1 bg-slate-100 flex items-center justify-center relative p-8">
                    {/* Slide Preview */}
                    <div className="relative w-64 aspect-[4/5] shadow-xl rounded-lg overflow-hidden border border-slate-200/50 group">
                         <AnimatePresence mode='wait'>
                            <motion.div
                                key={activeSlide}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className={`w-full h-full flex flex-col items-center justify-center p-6 text-center ${slides[activeSlide].bg}`}
                            >
                                <h2 className={`text-2xl font-bold mb-4 font-display leading-tight ${slides[activeSlide].text}`}>
                                    {slides[activeSlide].title}
                                </h2>
                                <p className={`text-sm opacity-80 ${slides[activeSlide].text}`}>
                                    {slides[activeSlide].subtitle}
                                </p>
                                
                                <div className="absolute bottom-4 right-4 flex gap-1">
                                    <div className={`w-8 h-1 rounded-full ${activeSlide === 0 ? 'bg-current opacity-100' : 'bg-current opacity-30'}`} />
                                    <div className={`w-8 h-1 rounded-full ${activeSlide === 1 ? 'bg-current opacity-100' : 'bg-current opacity-30'}`} />
                                    <div className={`w-8 h-1 rounded-full ${activeSlide === 2 ? 'bg-current opacity-100' : 'bg-current opacity-30'}`} />
                                </div>
                            </motion.div>
                         </AnimatePresence>

                         {/* Hover Controls */}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-white/90 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-4 border-t border-slate-200">
                             <button onClick={() => setActiveSlide(prev => (prev - 1 + 3) % 3)} className="p-1 hover:bg-slate-200 rounded">
                                 <ChevronLeft className="w-4 h-4 text-slate-600" />
                             </button>
                             <span className="text-xs font-mono text-slate-500 self-center">Slide {activeSlide + 1}/3</span>
                             <button onClick={() => setActiveSlide(prev => (prev + 1) % 3)} className="p-1 hover:bg-slate-200 rounded">
                                 <ChevronRight className="w-4 h-4 text-slate-600" />
                             </button>
                        </div>
                    </div>
                    
                    {/* Background decoration */}
                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 right-10 p-3 bg-white rounded-lg shadow-lg border border-slate-100"
                    >
                         <div className="flex items-center gap-2">
                             <Sparkles className="w-4 h-4 text-yellow-500" />
                             <span className="text-xs font-bold text-slate-700">AI Magic On</span>
                         </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
