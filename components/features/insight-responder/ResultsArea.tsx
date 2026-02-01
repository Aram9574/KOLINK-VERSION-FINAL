import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import ReplyVariants from './ReplyVariants';
import ValueMeter from './ValueMeter';
import InsightResponderGuide from './InsightResponderGuide';
import Skeleton from '../../ui/Skeleton';

interface ResultsAreaProps {
    isGenerating: boolean;
    replies: any[];
    activeReply: any | null;
    onCopy: (content: string) => void;
}

const ResultsArea: React.FC<ResultsAreaProps> = ({
    isGenerating,
    replies,
    activeReply,
    onCopy
}) => {
    return (
        <div className="h-full flex flex-col bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200/50 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            Sugerencias IA
                            {replies.length > 0 && (
                                <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest"
                                >
                                    {replies.length}
                                </motion.span>
                            )}
                        </h3>
                        <p className="text-slate-500 text-[10px] font-medium mt-0.5">Optimizadas para autoridad y dwell time</p>
                    </div>
                </div>
            </div>

            {/* Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[calc(100vh-400px)]">
                {isGenerating ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-5 space-y-4 shadow-sm">
                                <div className="flex justify-between">
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                    <Skeleton className="h-6 w-10 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-3/4" />
                                </div>
                                <Skeleton className="h-16 w-full rounded-2xl" />
                            </div>
                        ))}
                    </div>
                ) : replies.length > 0 ? (
                    <ReplyVariants 
                        variants={replies} 
                        onCopy={onCopy}
                        compact={true}
                    />
                ) : (
                    <InsightResponderGuide />
                )}
            </div>

            {/* Value Meter (Sticky Bottom) */}
            {replies.length > 0 && activeReply && (
                <div className="p-6 border-t border-slate-200/50 bg-white/80 backdrop-blur-sm">
                    <ValueMeter score={replies.reduce((max, r) => Math.max(max, r.score || 0), 0)} compact={true} />
                </div>
            )}
        </div>
    );
};

export default ResultsArea;
