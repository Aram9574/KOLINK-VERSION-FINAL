import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TacticsPanelProps {
    intent: string;
    setIntent: (val: string) => void;
    tone: string;
    setTone: (val: string) => void;
    handleGenerate: () => void;
    isGenerating: boolean;
    canGenerate: boolean;
    translations: any;
}

const TacticsPanel: React.FC<TacticsPanelProps> = ({
    intent,
    setIntent,
    tone,
    setTone,
    handleGenerate,
    isGenerating,
    canGenerate,
    translations: t
}) => {
    const quickTactics = [
        { label: "🤝 Agradecer", text: "Agradece el valor aportado y añade un matiz de mi propia experiencia que refuerce el punto principal." },
        { label: "❓ Retar", text: "Cuestiona con elegancia una de las premisas del post para iniciar un debate técnico sofisticado." },
        { label: "🚀 Potenciar", text: "Toma el punto principal y elévalo con una tendencia estratégica que viene para el 2026." },
        { label: "💡 Sintetizar", text: "Resume el valor del post en 3 puntos clave y añade un 'insight de trinchera' único." },
        { label: "🎯 Amplificar", text: "Expande el argumento principal con un caso de uso real o ejemplo concreto de mi industria." },
        { label: "🔍 Profundizar", text: "Toma un punto específico del post y desarróllalo con datos, métricas o frameworks técnicos." },
        { label: "🌉 Conectar", text: "Relaciona el tema del post con otra tendencia emergente o disciplina complementaria." }
    ];

    const toneOptions = [
        { id: t.tones.technical, icon: '🛡️' },
        { id: t.tones.supportive, icon: '💫' },
        { id: t.tones.contrarian, icon: '🔥' },
        { id: t.tones.connector, icon: '🔗' }
    ];

    return (
        <div className="space-y-4 flex flex-col">
            {/* Strategy Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 p-5 space-y-4 shadow-sm">
                <div>
                    <div className="flex justify-between items-center mb-2.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.intentLabel}</label>
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">PREMIUM</span>
                    </div>
                    
                    {/* Quick Tactic Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {quickTactics.map((item) => (
                            <motion.button
                                key={item.label}
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIntent(item.text)}
                                className={`text-[9px] font-bold px-2.5 py-1 rounded-xl border transition-all ${
                                    intent === item.text 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                                    : 'bg-slate-100/50 text-slate-600 border-slate-200 hover:bg-white hover:text-blue-600 hover:border-blue-300/50 hover:shadow-md'
                                }`}
                            >
                                {item.label}
                            </motion.button>
                        ))}
                    </div>

                    <textarea 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl resize-none h-20 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 outline-none transition-all placeholder:text-slate-300 font-medium leading-relaxed"
                        placeholder={t.intentPlaceholder}
                        value={intent}
                        onChange={(e) => setIntent(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2.5">{t.toneLabel}</label>
                    <div className="grid grid-cols-2 gap-2">
                        {toneOptions.map((tOption) => (
                            <motion.button
                                key={tOption.id}
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setTone(tOption.id)}
                                className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 ${
                                    tone === tOption.id 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-white hover:border-blue-200 hover:text-blue-600'
                                }`}
                            >
                                <span className="text-base">{tOption.icon}</span>
                                {tOption.id}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <motion.button 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    disabled={isGenerating || !canGenerate}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:hover:y-0 disabled:hover:shadow-none relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            {t.analyzing}
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            {t.generate}
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

export default TacticsPanel;
