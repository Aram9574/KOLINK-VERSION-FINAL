import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown, AlertTriangle, Zap } from 'lucide-react';
import { hapticFeedback } from '../../../../lib/animations';

interface EditorFooterProps {
    grade: number;
    showGradeInfo: boolean;
    setShowGradeInfo: (show: boolean) => void;
    selectedMetric: string;
    showMetricsMenu: boolean;
    setShowMetricsMenu: (show: boolean) => void;
    charCount: number;
    wordCount: number;
    paragraphCount: number;
    sentenceCount: number;
    readTime: string;
    showLimitWarning: boolean;
    setShowLimitWarning: (show: boolean) => void;
    onPublish: () => void;
    language: string;
    labels: {
        grade: string;
        metrics: any;
        continueLinkedIn: string;
        readability: {
            title: string;
            subtitle: string;
            levels: { g: string; desc: string; color: string }[];
            tip: string;
        };
        limitWarning: {
            text: string;
            note: string;
        };
    };
    gradeInfoRef: React.RefObject<HTMLDivElement>;
    metricsMenuRef: React.RefObject<HTMLDivElement>;
    limitWarningRef: React.RefObject<HTMLDivElement>;
}

const EditorFooter: React.FC<EditorFooterProps> = ({
    grade,
    showGradeInfo,
    setShowGradeInfo,
    selectedMetric,
    showMetricsMenu,
    setShowMetricsMenu,
    charCount,
    wordCount,
    paragraphCount,
    sentenceCount,
    readTime,
    showLimitWarning,
    setShowLimitWarning,
    onPublish,
    language,
    labels,
    gradeInfoRef,
    metricsMenuRef,
    limitWarningRef
}) => {
    return (
        <div className="h-16 border-t border-slate-200/60 flex items-center justify-between px-6 bg-white shrink-0">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 relative" ref={gradeInfoRef}>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {labels.grade}:
                    </span>
                    <motion.button
                        type="button"
                        onClick={() => setShowGradeInfo(!showGradeInfo)}
                        {...hapticFeedback}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-bold transition-all shadow-sm
                            ${grade <= 5 ? "border-emerald-200 text-emerald-600 bg-emerald-50"
                                : grade <= 8 ? "border-blue-200 text-blue-600 bg-blue-50"
                                : grade <= 11 ? "border-amber-200 text-amber-600 bg-amber-50"
                                : "border-rose-200 text-rose-600 bg-rose-50"}
                        `}
                    >
                        {grade}
                    </motion.button>

                    {showGradeInfo && (
                        <div className="absolute bottom-full mb-4 left-0 w-[280px] bg-white border border-slate-200/60 rounded-xl shadow-2xl p-4 z-[110] animate-in fade-in slide-in-from-bottom-2 duration-200 overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-500" />
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4 text-brand-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{labels.readability.title}</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                        {labels.readability.subtitle}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {labels.readability.levels.map((level, i) => (
                                    <div key={i} className="flex items-center justify-between text-[10px] font-bold py-1 border-b border-slate-50 last:border-0">
                                        <span className={level.color}>{level.g}</span>
                                        <span className="text-slate-500">{level.desc}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-[10px] text-slate-400 italic">
                                {labels.readability.tip}
                            </p>
                        </div>
                    )}
                </div>

                <div className="relative" ref={metricsMenuRef}>
                    <motion.button
                        type="button"
                        onClick={() => setShowMetricsMenu(!showMetricsMenu)}
                        {...hapticFeedback}
                        className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50 rounded-lg transition-colors group"
                    >
                        <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 uppercase tracking-widest">
                            {selectedMetric === "characters" && `${charCount} ${labels.metrics.characters}`}
                            {selectedMetric === "words" && `${wordCount} ${labels.metrics.words}`}
                            {selectedMetric === "paragraphs" && `${paragraphCount} ${labels.metrics.paragraphs}`}
                            {selectedMetric === "sentences" && `${sentenceCount} ${labels.metrics.sentences}`}
                            {selectedMetric === "readTime" && `${readTime} ${labels.metrics.readingTime}`}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform ${showMetricsMenu ? "rotate-180" : ""}`} />
                    </motion.button>

                    {showMetricsMenu && (
                        <div className="absolute bottom-full mb-2 left-0 bg-white border border-slate-200/60 rounded-xl shadow-xl p-1 z-[100] min-w-[170px] animate-in fade-in slide-in-from-bottom-2 duration-200">
                            {[
                                { id: "characters", val: charCount, label: labels.metrics.characters },
                                { id: "words", val: wordCount, label: labels.metrics.words },
                                { id: "paragraphs", val: paragraphCount, label: labels.metrics.paragraphs },
                                { id: "sentences", val: sentenceCount, label: labels.metrics.sentences },
                                { id: "readTime", val: readTime, label: labels.metrics.readingTime },
                            ].map((m) => (
                                <motion.button
                                    type="button"
                                    key={m.id}
                                    onClick={() => {
                                        setShowMetricsMenu(false);
                                        // Parent handles state update via selective logic or a callback if fully decoupled
                                    }}
                                    {...hapticFeedback}
                                    className={`w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wide rounded-lg transition-colors flex items-center justify-between ${
                                        selectedMetric === m.id ? "bg-brand-50 text-brand-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                    }`}
                                >
                                    <span>{m.val} {m.label}</span>
                                    {selectedMetric === m.id && <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
                                </motion.button>
                            ))}
                        </div>
                    )}
                </div>

                {charCount > 3000 && (
                    <div className="relative" ref={limitWarningRef}>
                        <motion.button
                            type="button"
                            onClick={() => setShowLimitWarning(!showLimitWarning)}
                            {...hapticFeedback}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#EE5D28] text-white rounded-full text-xs font-bold hover:bg-[#D64D1C] transition-colors shadow-sm animate-in fade-in zoom-in duration-300 transform scale-100 opacity-100"
                        >
                            <AlertTriangle className="w-3.5 h-3.5 fill-white stroke-white" />
                            <span>{charCount} / 3000</span>
                        </motion.button>

                        {showLimitWarning && (
                            <div className="absolute bottom-full mb-4 left-0 w-[420px] bg-white border border-[#E76236] border-l-8 rounded-lg shadow-2xl p-5 z-[120] animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <p className="text-sm text-slate-700 font-medium mb-3 leading-relaxed">
                                    {labels.limitWarning.text}
                                </p>
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                                        <AlertTriangle className="w-4 h-4 text-[#EE5D28]" />
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        {labels.limitWarning.note}
                                    </p>
                                </div>
                                <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-b border-r border-[#E76236] transform rotate-45 z-10" />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <motion.button
                    type="button"
                    onClick={onPublish}
                    {...hapticFeedback}
                    className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 shadow-lg shadow-brand-500/10 transition-all flex items-center gap-2"
                >
                    {labels.continueLinkedIn}
                    <Zap className="w-4 h-4" />
                </motion.button>
            </div>
        </div>
    );
};

export default EditorFooter;
