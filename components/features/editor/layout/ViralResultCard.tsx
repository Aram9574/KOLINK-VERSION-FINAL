import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Zap, Share2, Target, X, Trophy } from 'lucide-react';
import { type AppLanguage } from '../../../types';
import { translations } from '../../../../translations';

interface ViralScoreResult {
    score: number;
    archetype: string;
    analysis: string;
    tips: string[];
    viral_coefficient: string;
}

interface ViralResultCardProps {
    result: ViralScoreResult;
    onClose: () => void;
    language: string;
}

export const ViralResultCard: React.FC<ViralResultCardProps> = ({ result, onClose, language }) => {
    const t = translations[language as AppLanguage].app.editor.viralAnalysis;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full p-6 bg-brand-600 rounded-3xl text-white shadow-2xl relative overflow-hidden"
        >
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Rocket size={120} />
            </div>

            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-20"
            >
                <X size={20} />
            </button>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-brand-100 font-medium text-xs mb-1 uppercase tracking-wider">{t.score}</p>
                        <div className="text-5xl font-black">{result.score}%</div>
                    </div>
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold border border-white/20">
                        {result.viral_coefficient} {t.coefficient}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <Trophy size={18} className="text-brand-200" />
                        {result.archetype}
                    </h3>
                    <p className="text-brand-50 leading-relaxed text-sm italic bg-brand-700/30 p-3 rounded-xl border border-white/5">
                        "{result.analysis}"
                    </p>
                </div>

                <div className="space-y-3 mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-200">{t.tips}</p>
                    {result.tips.map((tip, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="flex items-start gap-2 bg-white/10 p-2.5 rounded-xl border border-white/5 text-xs"
                        >
                            <Zap size={12} className="mt-1 shrink-0 text-brand-300" fill="currentColor" />
                            <span>{tip}</span>
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        const shareText = `¡KOLINK AI me ha dado un Score Viral del ${result.score}%! 🚀\n\nMi arquetipo es: ${result.archetype}\n\nPrueba tu potencial viral en KOLINK: ${window.location.origin}`;
                        navigator.clipboard.writeText(shareText);
                        // Optional: trigger a success toast if we pass a toast prop or use global context
                        // but keeping it simple here.
                        globalThis.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`, "_blank");
                    }}
                    className="w-full py-3 bg-white text-brand-600 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:bg-brand-50 transition-colors"
                >
                    <Share2 size={16} />
                    {t.share}
                </motion.button>
            </div>
        </motion.div>
    );
};
