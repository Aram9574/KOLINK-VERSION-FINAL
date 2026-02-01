import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Target, Sliders, Sparkles, Brain, Shield, TrendingUp, Award } from 'lucide-react';

const InsightResponderGuide: React.FC = () => {
    const steps = [
        {
            icon: Upload,
            title: "1. Captura o Pega",
            description: "Sube una captura de un post de LinkedIn o pega el texto directamente",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600"
        },
        {
            icon: Target,
            title: "2. Define tu Intención",
            description: "Elige una táctica rápida o escribe tu estrategia de engagement",
            bgColor: "bg-cyan-50",
            iconColor: "text-cyan-600"
        },
        {
            icon: Sliders,
            title: "3. Selecciona el Tono",
            description: "Técnico, Supportive, Contrarian o Connector según tu objetivo",
            bgColor: "bg-indigo-50",
            iconColor: "text-indigo-600"
        },
        {
            icon: Sparkles,
            title: "4. Genera Respuestas",
            description: "La IA creará 3 variantes optimizadas para maximizar autoridad y dwell time",
            bgColor: "bg-sky-50",
            iconColor: "text-sky-600"
        }
    ];

    const features = [
        { icon: Brain, label: "Análisis Multimodal", desc: "Gemini 3.0 analiza imagen + texto" },
        { icon: Shield, label: "Arquetipos de Autoridad", desc: "Challenger, Catalyst, Bridge" },
        { icon: Award, label: "Anti-AI Detection", desc: "Respuestas 100% humanas" },
        { icon: TrendingUp, label: "Scoring de Impacto", desc: "Medidor de autoridad 0-100" }
    ];

    return (
        <div className="h-full overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto py-6 px-6"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">
                        Insight Responder Premium
                    </h2>
                    <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium leading-relaxed">
                        Genera comentarios de <span className="text-blue-600 font-bold">alta autoridad</span> que maximizan el engagement y posicionan tu marca como líder de pensamiento.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/80 backdrop-blur-md rounded-xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 ${step.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Features Grid */}
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white mb-6">
                    <h3 className="text-base font-black mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Tecnología Premium 2026
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <feature.icon className="w-4 h-4 text-white/80 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold">{feature.label}</p>
                                    <p className="text-[10px] text-white/70 font-medium">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center pb-4">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                        👆 Comienza subiendo una captura o pegando texto arriba
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default InsightResponderGuide;
