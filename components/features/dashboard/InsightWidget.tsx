import React, { useState, useEffect } from 'react';
import {
    X,
    ChevronRight,
    Lightbulb,
    Sparkles,
    Zap,
    TrendingUp,
    AlertTriangle,
    Smartphone,
    Monitor,
    Clock
} from 'lucide-react';
import { AppLanguage } from '../../../types';
import { ALGORITHM_TIPS_CONTENT } from '../../../constants';

interface InsightWidgetProps {
    language: AppLanguage;
}

const InsightWidget: React.FC<InsightWidgetProps> = ({ language }) => {
    const [isOpen, setIsOpen] = useState(true); // Default open
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-advance tips locally
    const nextTip = () => {
        setCurrentTipIndex(prev => (prev + 1) % 10);
    };

    // Auto-advance timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (!isHovered && isOpen) {
            interval = setInterval(() => {
                nextTip();
            }, 7000);
        }
        return () => clearInterval(interval);
    }, [isHovered, isOpen]);

    const TIP_ICONS = [
        <Clock className="w-5 h-5" />,
        <Clock className="w-5 h-5" />,
        <AlertTriangle className="w-5 h-5" />,
        <TrendingUp className="w-5 h-5" />,
        <Smartphone className="w-5 h-5" />,
        <Zap className="w-5 h-5" />,
        <Monitor className="w-5 h-5" />,
        <TrendingUp className="w-5 h-5" />,
        <AlertTriangle className="w-5 h-5" />,
        <Lightbulb className="w-5 h-5" />
    ];

    const TIP_COLORS = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-orange-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-teal-500',
        'bg-cyan-500',
        'bg-rose-500',
        'bg-amber-500'
    ];

    const currentTipsContent = language === 'es' ? ALGORITHM_TIPS_CONTENT.es : ALGORITHM_TIPS_CONTENT.en;
    const activeTipContent = currentTipsContent[currentTipIndex];
    const activeTipIcon = TIP_ICONS[currentTipIndex % TIP_ICONS.length];
    const activeTipColor = TIP_COLORS[currentTipIndex % TIP_COLORS.length];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

            {/* Expanded Content Card */}
            {isOpen && (
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="w-80 bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 origin-bottom-right"
                >
                    <div className="p-4 relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 ${activeTipColor} opacity-10 rounded-full blur-2xl transition-all duration-500`} />
                        <div className={`absolute -bottom-10 -left-10 w-24 h-24 ${activeTipColor} opacity-10 rounded-full blur-2xl transition-all duration-500`} />

                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-xl ${activeTipColor} bg-opacity-10 text-${activeTipColor.replace('bg-', '')}`}>
                                    {activeTipIcon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">
                                        {language === 'es' ? 'Tip del Algoritmo' : 'Algorithm Tip'}
                                    </h4>
                                    <span className="text-[10px] uppercase font-bold text-brand-600 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                                        LIVE
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="h-20 overflow-y-auto no-scrollbar relative">
                            <p key={currentTipIndex} className="text-slate-700 text-sm leading-relaxed mb-4 relative z-10 font-medium animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {activeTipContent.desc}
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={nextTip}
                                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors px-2 py-1 rounded-lg hover:bg-brand-50"
                            >
                                {language === 'es' ? 'Siguiente consejo' : 'Next tip'}
                                <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`group flex items-center gap-3 p-1.5 pr-4 pl-1.5 bg-white border border-slate-200 shadow-lg shadow-brand-500/10 hover:shadow-xl hover:shadow-brand-500/20 hover:border-brand-200 transition-all duration-300 rounded-full ${isOpen ? 'bg-brand-50 border-brand-200' : ''}`}
            >
                <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}
                >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                    <Sparkles className="w-5 h-5 fill-current" />
                </div>

                <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                        {language === 'es' ? 'Asistente' : 'Assistant'}
                    </span>
                    <span className="text-sm font-bold text-slate-800 leading-none group-hover:text-brand-700 transition-colors">
                        {language === 'es' ? 'Insights' : 'Insights'}
                    </span>
                </div>

                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce shadow-sm" />
                )}
            </button>
        </div>
    );
};

export default InsightWidget;
