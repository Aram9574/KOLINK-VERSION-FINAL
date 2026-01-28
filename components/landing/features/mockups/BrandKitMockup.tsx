import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Check, RefreshCw } from 'lucide-react';

export const BrandKitMockup: React.FC = () => {
    const [isApplied, setIsApplied] = useState(false);

    const toggleBrand = () => setIsApplied(!isApplied);

    const defaultStyle = {
        bg: "bg-slate-100",
        cardBg: "bg-white",
        textColor: "text-slate-800",
        accentColor: "bg-slate-300",
        font: "font-sans"
    };

    const brandStyle = {
        bg: "bg-brand-50",
        cardBg: "bg-white",
        textColor: "text-brand-900",
        accentColor: "bg-brand-600",
        font: "font-display"
    };

    const currentStyle = isApplied ? brandStyle : defaultStyle;

    return (
        <div className="bg-white w-full h-full min-h-[350px] flex overflow-hidden rounded-xl border border-slate-200">
            {/* Brand Sidebar */}
            <div className="w-1/3 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        K
                    </div>
                    <span className="font-bold text-slate-700">Kolink Brand</span>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Palette className="w-3 h-3" /> Colors
                        </div>
                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-600 shadow-sm border border-brand-700/10"></div>
                            <div className="w-8 h-8 rounded-full bg-brand-100 shadow-sm border border-brand-200"></div>
                            <div className="w-8 h-8 rounded-full bg-slate-900 shadow-sm border border-slate-700"></div>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Type className="w-3 h-3" /> Fonts
                        </div>
                        <div className="text-sm font-display font-medium text-slate-700 bg-white p-2 rounded border border-slate-200">
                            Inter & Playfair
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
                    <button
                        onClick={toggleBrand}
                        className={`w-full py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${isApplied ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20'}`}
                    >
                        {isApplied ? (
                            <>
                                <RefreshCw className="w-4 h-4" /> Reset
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" /> Apply Brand
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className={`flex-1 ${currentStyle.bg} flex items-center justify-center p-8 transition-colors duration-500`}>
                <motion.div
                    layout
                    className={`${currentStyle.cardBg} w-48 aspect-[4/5] rounded-xl shadow-xl p-4 flex flex-col items-center justify-center text-center gap-3 border ${isApplied ? 'border-brand-100' : 'border-slate-200'} transition-colors duration-500`}
                >
                    <div className={`w-12 h-12 rounded-full ${currentStyle.accentColor} mb-2 transition-colors duration-500 flex items-center justify-center`}>
                        <div className="w-6 h-6 bg-white/30 rounded-full" />
                    </div>
                    
                    <h3 className={`text-lg font-bold leading-tight ${currentStyle.textColor} ${isApplied ? 'font-display' : 'font-sans'} transition-all duration-500`}>
                        Brand Consistency
                    </h3>
                    
                    <p className={`text-xs opacity-70 ${currentStyle.textColor} transition-colors duration-500`}>
                        Apply your visual identity in one click.
                    </p>

                    <div className={`w-full h-1 mt-auto rounded-full ${currentStyle.accentColor} opacity-50 transition-colors duration-500`} />
                </motion.div>
            </div>
        </div>
    );
};
