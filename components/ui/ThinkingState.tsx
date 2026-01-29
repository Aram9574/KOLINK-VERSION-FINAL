import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Cpu, Database } from 'lucide-react';

interface ThinkingStateProps {
    language?: 'en' | 'es';
    className?: string;
}

export const ThinkingState: React.FC<ThinkingStateProps> = ({
    language = 'es',
    className = ""
}) => {
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = language === 'es' ? [
        "Analizando tu sector...",
        "Buscando patrones de viralidad...",
        "Redactando un hook magnético...",
        "Estructurando el contenido (PAS)...",
        "Optimizando para el algoritmo...",
        "Añadiendo el último toque de magia...",
    ] : [
        "Analyzing your industry...",
        "Searching for virality patterns...",
        "Craving a magnetic hook...",
        "Structuring content (PAS)...",
        "Optimizing for the algorithm...",
        "Adding the final touch of magic...",
    ];

    const icons = [Sparkles, Brain, Cpu, Database];
    const Icon = icons[messageIndex % icons.length];

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
            <div className="relative mb-8">
                {/* Outer Glow */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-x-[-20px] inset-y-[-20px] bg-brand-500/20 blur-2xl rounded-full"
                />
                
                {/* Floating Icon */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative bg-white p-6 rounded-3xl shadow-soft-glow border border-brand-100 text-brand-600"
                >
                    <Icon className="w-10 h-10" />
                </motion.div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={messageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center"
                >
                    <h3 className="text-slate-900 font-bold text-lg tracking-tight mb-2">
                        {language === 'es' ? 'Preparando tu éxito...' : 'Preparing your success...'}
                    </h3>
                    <p className="text-slate-500 font-medium text-sm">
                        {messages[messageIndex]}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex gap-1.5 mt-8">
                {messages.map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ 
                            scale: i === messageIndex ? 1.5 : 1,
                            backgroundColor: i === messageIndex ? "#0a66c2" : "#e2e8f0"
                        }}
                        className="w-1.5 h-1.5 rounded-full"
                    />
                ))}
            </div>
        </div>
    );
};
