import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, Brain, Share2, Loader2, Target } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { toast } from 'sonner';
import { ViralResultCard } from '../features/editor/layout/ViralResultCard';

interface ViralScoreResult {
    score: number;
    archetype: string;
    analysis: string;
    tips: string[];
    viral_coefficient: string;
}

export const ViralCalculator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ViralScoreResult | null>(null);

    const handleCalculate = async () => {
        if (!topic.trim()) {
            toast.error('Por favor, cuéntame tu idea primero');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const { data, error } = await supabase.functions.invoke('generate-viral-score', {
                body: { topic, language: 'es' }
            });

            if (error) throw error;
            setResult(data);
            toast.success('¡Análisis completado!');
        } catch (err) {
            console.error(err);
            toast.error('Hubo un error al calcular el potencial. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative py-24 px-4 overflow-hidden bg-white">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Calculador de <span className="text-brand-600">Potencial Viral</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Nuestro motor de IA analiza tu contenido basándose en los marcos de viralidad más exitosos de 2025. Descubre si tu post está listo para romper el feed.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Input Section */}
                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="p-8 bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-brand-50 rounded-xl text-brand-600">
                                <Brain size={24} />
                            </div>
                            <span className="font-semibold text-slate-800">Cerebro KOLINK AI</span>
                        </div>

                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Escribe el borrador de tu post o tu idea principal aquí..."
                            className="w-full h-48 p-5 bg-slate-50/50 border border-slate-100 rounded-2xl resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-slate-700 leading-relaxed"
                        />

                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCalculate}
                            disabled={loading}
                            className="w-full mt-6 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Escaneando viralidad...</span>
                                </>
                            ) : (
                                <>
                                    <Zap size={20} fill="currentColor" />
                                    <span>Calcular Potencial</span>
                                </>
                            )}
                        </motion.button>
                    </motion.div>

                    {/* Result Section */}
                    <AnimatePresence mode="wait">
                        {!result && !loading && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center"
                            >
                                <Target className="text-slate-300 mb-4" size={48} strokeWidth={1} />
                                <p className="text-slate-400 font-medium">Escribe tu idea para ver el análisis</p>
                            </motion.div>
                        )}

                        {loading && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl p-12"
                            >
                                <div className="space-y-6 w-full">
                                    <div className="h-12 w-24 bg-slate-200 rounded-full animate-pulse mx-auto" />
                                    <div className="h-8 w-3/4 bg-slate-200 rounded-xl animate-pulse mx-auto" />
                                    <div className="space-y-3">
                                        <div className="h-4 w-full bg-slate-100 rounded-full animate-pulse" />
                                        <div className="h-4 w-5/6 bg-slate-100 rounded-full animate-pulse" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {result && (
                            <ViralResultCard 
                                result={result} 
                                language="es" 
                                onClose={() => setResult(null)} 
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default ViralCalculator;
