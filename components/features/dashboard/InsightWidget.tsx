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
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

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

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer Container */}
            <div 
                className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 ease-in-out transform ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="h-full w-96 max-w-[90vw] bg-white shadow-2xl border-l border-slate-200 flex flex-col relative">
                    
                    {/* Drawer Header */}
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-brand-500/20 shadow-lg">
                                <Sparkles className="w-5 h-5 fill-current" />
                             </div>
                             <div>
                                <h3 className="font-bold text-slate-900 text-base">
                                    {language === 'es' ? 'Manual de Viralidad' : 'Virality Playbook'}
                                </h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                    {language === 'es' ? 'ESTRATEGIAS PROBADAS' : 'PROVEN STRATEGIES'}
                                </p>
                             </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Drawer Content - Scrollable List */}
                    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-4">
                        
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-1">
                            {language === 'es' ? 'Reglas de Oro' : 'Golden Rules'}
                        </div>

                        {currentTipsContent.map((tip, index) => {
                            const icon = TIP_ICONS[index % TIP_ICONS.length];
                            const color = TIP_COLORS[index % TIP_COLORS.length];
                            
                            return (
                                <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group">
                                    <div className="flex gap-3">
                                        <div className={`mt-0.5 min-w-[32px] w-8 h-8 rounded-lg ${color} bg-opacity-10 text-${color.replace('bg-', '')}-600 flex items-center justify-center`}>
                                            {icon}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-slate-800 text-sm mb-1 group-hover:text-${color.replace('bg-', '')}-600 transition-colors`}>
                                                {tip.title}
                                            </h4>
                                            <p className="text-slate-600 text-xs leading-relaxed">
                                                {tip.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg mt-6">
                             <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                {language === 'es' ? 'Pro Tip' : 'Pro Tip'}
                             </h4>
                             <p className="text-xs text-slate-300 leading-relaxed">
                                 {language === 'es' 
                                    ? 'La viralidad no es suerte, es ingeniería. Aplica al menos 3 de estas reglas en cada post.' 
                                    : 'Virality is not luck, it\'s engineering. Apply at least 3 of these rules in every post.'}
                             </p>
                        </div>
                        
                        <div className="h-8"></div> {/* Bottom spacer */}
                    </div>
                    
                    {/* Toggle Handle */}
                    {!isOpen && (
                         <div className="absolute top-24 -left-12">
                             <button
                                onClick={() => setIsOpen(true)}
                                className="w-12 h-12 bg-white rounded-l-xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border-y border-l border-slate-100 flex items-center justify-center hover:bg-slate-50 text-brand-600 hover:text-brand-700 hover:w-14 transition-all duration-200 group relative"
                             >
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white"></div>
                                <Lightbulb className="w-6 h-6 fill-brand-100" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce shadow-sm" />
                             </button>
                         </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default InsightWidget;
