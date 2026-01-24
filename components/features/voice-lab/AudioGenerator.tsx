import React, { useState } from 'react';
import { Play, Download, Wand2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { BrandVoice, AppLanguage } from '../../../types';
import { useUser } from '../../../context/UserContext';
import { toast } from 'sonner';

interface AudioGeneratorProps {
    voices: BrandVoice[];
}

const AudioGenerator: React.FC<AudioGeneratorProps> = ({ voices }) => {
    const { language } = useUser();
    const isEs = language === 'es';
    const [text, setText] = useState('');
    const [selectedVoice, setSelectedVoice] = useState<string>(voices[0]?.id || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!text) return;
        setIsGenerating(true);
        
        // Simulation of API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsGenerating(false);
        setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"); // Mock Audio
        toast.success(isEs ? "Audio generado con éxito" : "Audio generated successfully");
    };

    return (
        <div className="h-full flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Input Section */}
            <div className="card-nexus p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-brand-600" />
                        {isEs ? 'Generador de Audio' : 'Audio Generator'}
                    </h3>
                    <div className="flex items-center gap-2">
                         <select 
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2 focus:ring-brand-500 focus:border-brand-500"
                        >
                            {voices.map(v => (
                                <option key={v.id} value={v.id}>{v.styleName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={isEs ? "Escribe el texto que quieres que tu clon lea..." : "Type text for your clone to read..."}
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all resize-none mb-4 font-medium text-slate-700 placeholder:text-slate-400"
                />

                <div className="flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={!text || isGenerating}
                        className="btn-nexus-primary flex items-center gap-2 px-6"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                {isEs ? 'Sintetizando...' : 'Synthesizing...'}
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4" />
                                {isEs ? 'Generar Voz' : 'Generate Voice'}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Result Section */}
            {audioUrl && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-nexus p-6 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                                <Play className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">
                                    {isEs ? 'Voz Sintetizada' : 'Synthesized Voice'}
                                </h4>
                                <p className="text-xs text-slate-400">
                                    {isEs ? 'Generado por ElevenLabs Turbo v2.5' : 'Generated via ElevenLabs Turbo v2.5'}
                                </p>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Pro-Max Waveform Visualizer */}
                    <div className="h-16 flex items-center justify-center gap-1 mb-4 opacity-80">
                         {[...Array(48)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1 bg-brand-500 rounded-full"
                                animate={{ 
                                    height: [
                                        10, 
                                        Math.sin(i * 0.5) * 20 + 20, 
                                        Math.sin(i * 0.8) * 15 + 15,
                                        10
                                    ] 
                                }}
                                transition={{ 
                                    duration: 1.5, 
                                    repeat: Infinity, 
                                    delay: i * 0.02,
                                    ease: "easeInOut"
                                }}
                            />
                         ))}
                    </div>

                    <audio controls src={audioUrl} className="w-full opacity-60 hover:opacity-100 transition-opacity" />
                </motion.div>
            )}
        </div>
    );
};

export default AudioGenerator;
