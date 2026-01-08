import React from "react";
import { Sparkles } from "lucide-react";

interface GeneratorPanelProps {
    onGenerate: (topic: string) => void;
    isLoading?: boolean;
}

const GeneratorPanel: React.FC<GeneratorPanelProps> = ({ onGenerate, isLoading }) => {
    const [topic, setTopic] = React.useState("");

    return (
        <div className="space-y-6">
            <div className="p-4 bg-brand-50 rounded-xl border border-brand-100">
                <div className="flex items-center gap-2 text-brand-700 font-bold mb-2">
                    <Sparkles className="w-4 h-4" />
                    <h3>AI Generator</h3>
                </div>
                <p className="text-xs text-brand-600 mb-4">
                    Describe your topic and let AI create the entire carousel structure for you.
                </p>
                <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full text-sm p-3 rounded-lg border border-brand-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none h-32 resize-none bg-white text-slate-700 placeholder:text-slate-400"
                    placeholder="E.g., 5 tips for productivity, How to learn React in 2026..."
                ></textarea>
                <div className="mt-4 flex gap-2">
                    <button 
                        onClick={() => onGenerate(topic)}
                        disabled={isLoading || !topic.trim()}
                        className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Carousel
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Input Source</h4>
                <div className="grid grid-cols-2 gap-2">
                    <button className="border border-slate-200 hover:border-brand-500 hover:bg-brand-50 rounded-lg p-3 text-left transition-all group">
                         <span className="block text-xs font-bold text-slate-700 group-hover:text-brand-700 mb-1">Topic</span>
                         <span className="block text-[10px] text-slate-400">From scratch</span>
                    </button>
                    <button className="border border-slate-200 hover:border-brand-500 hover:bg-brand-50 rounded-lg p-3 text-left transition-all group">
                         <span className="block text-xs font-bold text-slate-700 group-hover:text-brand-700 mb-1">URL / Article</span>
                         <span className="block text-[10px] text-slate-400">Convert content</span>
                    </button>
                    <button className="border border-slate-200 hover:border-brand-500 hover:bg-brand-50 rounded-lg p-3 text-left transition-all group">
                         <span className="block text-xs font-bold text-slate-700 group-hover:text-brand-700 mb-1">YouTube</span>
                         <span className="block text-[10px] text-slate-400">Summarize video</span>
                    </button>
                    <button className="border border-slate-200 hover:border-brand-500 hover:bg-brand-50 rounded-lg p-3 text-left transition-all group">
                         <span className="block text-xs font-bold text-slate-700 group-hover:text-brand-700 mb-1">PDF</span>
                         <span className="block text-[10px] text-slate-400">Extract insights</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneratorPanel;
