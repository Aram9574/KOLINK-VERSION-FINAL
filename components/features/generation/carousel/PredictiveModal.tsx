import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';
import { translations } from '@/translations';
import { useUser } from '@/context/UserContext';

export interface EngagementPrediction {
  predicted_performance: {
    total_score: number;
    top_archetype_resonance: string;
    dwell_time_estimate: string;
  };
  audience_feedback: {
    archetype: string;
    reaction: string;
  }[];
  micro_optimization_tips: string[];
  improved_hook_alternative: string;
}

interface PredictiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  data: EngagementPrediction | null;
}

export const PredictiveModal: React.FC<PredictiveModalProps> = ({ isOpen, onClose, isLoading, data }) => {
  const { language } = useUser();
  const t = translations[language || 'en'].carouselStudio.ai;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2 text-brand-600">
              <Sparkles className="w-5 h-5" />
              <h2 className="font-bold text-lg">{t.predict}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 scroll-smooth">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center py-12 space-y-4">
                   <div className="relative w-16 h-16">
                       <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                       <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin" />
                   </div>
                   <p className="text-slate-500 font-medium animate-pulse">{t.analyzing}</p>
               </div>
            ) : data ? (
               <div className="space-y-8">
                  
                  {/* Score Section */}
                  <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-1 bg-slate-900 text-white p-5 rounded-xl flex flex-col items-center justify-center text-center shadow-lg shadow-brand-500/10 border border-slate-800">
                          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{t.score}</span>
                          <div className="relative mb-2">
                             <span className="text-5xl font-black bg-gradient-to-br from-brand-400 to-white bg-clip-text text-transparent">
                                {data.predicted_performance.total_score}
                             </span>
                             <span className="text-slate-500 text-lg">/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-brand-500 rounded-full" 
                                style={{ width: `${data.predicted_performance.total_score}%` }}
                              />
                          </div>
                      </div>

                      <div className="col-span-2 grid grid-cols-2 gap-4">
                          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex flex-col justify-center">
                              <div className="flex items-center gap-2 mb-2 text-emerald-700 font-semibold">
                                  <Users className="w-4 h-4" />
                                  <span className="text-xs uppercase">Top Resonance</span>
                              </div>
                              <p className="text-lg font-bold text-slate-800 leading-tight">
                                  {data.predicted_performance.top_archetype_resonance}
                              </p>
                          </div>
                          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-col justify-center">
                              <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold">
                                  <TrendingUp className="w-4 h-4" />
                                  <span className="text-xs uppercase">Est. Dwell Time</span>
                              </div>
                              <p className="text-lg font-bold text-slate-800 leading-tight">
                                  {data.predicted_performance.dwell_time_estimate}
                              </p>
                          </div>
                      </div>
                  </section>

                   {/* Micro Optimizations */}
                   <section className="space-y-3">
                       <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                           <Zap className="w-4 h-4 text-amber-500" />
                           {t.tips}
                       </h3>
                       <div className="space-y-2">
                           {data.micro_optimization_tips.map((tip, idx) => (
                               <div key={idx} className="flex gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-amber-200 transition-colors">
                                   <div className="flex-shrink-0 mt-0.5 w-5 h-5 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold">
                                       {idx + 1}
                                   </div>
                                   <p className="text-sm text-slate-600 leading-relaxed">{tip}</p>
                               </div>
                           ))}
                       </div>
                   </section>

                   {/* Improved Hook */}
                   <section className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                           <Sparkles className="w-24 h-24 text-brand-500" />
                       </div>
                       <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                           <Sparkles className="w-4 h-4 text-brand-500" />
                           {t.hook}
                       </h3>
                       <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm font-medium text-slate-700 text-base">
                           "{data.improved_hook_alternative}"
                       </div>
                   </section>

                   {/* Audience Feedback */}
                   <section className="space-y-3">
                       <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                           <Users className="w-4 h-4 text-slate-500" />
                           {t.feedback}
                       </h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {data.audience_feedback.map((feedback, idx) => (
                               <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                   <span className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider">
                                       {feedback.archetype}
                                   </span>
                                   <p className="text-sm text-slate-700 italic">
                                       "{feedback.reaction}"
                                   </p>
                               </div>
                           ))}
                       </div>
                   </section>
                   
               </div>
            ) : (
                <div className="text-center py-12 text-slate-400">
                    No data available.
                </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
