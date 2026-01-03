import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, Trash2, Mic, Activity, CheckCircle, Circle, Scan, Zap, Bot } from 'lucide-react';
import { BrandVoice } from '../../../types';
import { useUser } from '../../../context/UserContext';
import ViralHookLab from './ViralHookLab';

interface MimicVaultProps {
    voices: BrandVoice[];
    isLoading: boolean;
    onSetActive: (voice: BrandVoice) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
    onCreateNew: () => void;
    onTrain: (voice: BrandVoice) => void; 
}

const MimicVault: React.FC<MimicVaultProps> = ({ voices, isLoading, onSetActive, onDelete, onCreateNew, onTrain }) => {
    const { language } = useUser();
    const [hookLabVoice, setHookLabVoice] = React.useState<BrandVoice | null>(null);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ... stats ... */}
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {voices.map((voice) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={voice.id}
                            className={`group relative p-5 bg-white rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                                voice.isActive
                                    ? 'border-brand-500 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/20'
                                    : 'border-slate-200/60 hover:border-brand-200 hover:shadow-md'
                            }`}
                            onClick={() => onSetActive(voice)}
                        >
                            {/* Actions Overlay (Hover) - visible on active too */}
                            <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                                 <button
                                    onClick={(e) => { e.stopPropagation(); setHookLabVoice(voice); }}
                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm border border-indigo-100"
                                    title="Generate Viral Hooks"
                                >
                                    <Zap className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onTrain(voice); }}
                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors shadow-sm border border-emerald-100"
                                    title="Train (Shadowing Gym)"
                                >
                                    <Bot className="w-4 h-4" />
                                </button>
                                 <button
                                    onClick={(e) => onDelete(voice.id, e)}
                                    className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-slate-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                             {/* Active Indicator Background */}
                             {voice.isActive && (
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <BadgeCheck className="w-24 h-24 rotate-12" />
                                </div>
                             )}

                            <div className="flex justify-between items-start relative z-10 pb-10"> {/* Added padding bottom for actions */}
                                <div className="flex gap-4">
                                     {/* Radio Circle */}
                                    <div className={`mt-1 transition-all duration-300 ${
                                            voice.isActive ? 'text-brand-600 scale-110' : 'text-slate-300 group-hover:text-brand-400'
                                        }`}>
                                        {voice.isActive ? <CheckCircle className="w-6 h-6 fill-brand-50" /> : <Circle className="w-6 h-6" />}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            {voice.name}
                                            {voice.isActive && (
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                                                    Active
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-slate-500 text-sm mt-1 line-clamp-2 max-w-sm mb-3">
                                            {voice.description}
                                        </p>
                                        
                                        {/* Hooks Badges */}
                                        {voice.hookPatterns && voice.hookPatterns.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {voice.hookPatterns.slice(0, 2).map((h, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-slate-100/80 text-slate-600 text-[10px] font-medium rounded-md border border-slate-200/50">
                                                        {h.category}
                                                    </span>
                                                ))}
                                                {voice.hookPatterns.length > 2 && (
                                                    <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[10px] font-medium rounded-md">
                                                        +{voice.hookPatterns.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {/* Empty State / Add New */}
                {voices.length === 0 && !isLoading && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-white/40 border border-dashed border-slate-300 rounded-2xl">
                         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Mic className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">
                             {language === 'es' ? 'Bóveda Vacía' : 'Empty Vault'}
                        </h3>
                        <p className="text-slate-500 mb-6 text-sm">
                            {language === 'es' ? 'No tienes huellas de voz guardadas.' : 'No voice fingerprints saved yet.'}
                        </p>
                        <button
                            onClick={onCreateNew}
                             className="px-6 py-2 bg-brand-600 text-white rounded-xl font-medium shadow-lg shadow-brand-500/20 hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            <Scan className="w-4 h-4" />
                            {language === 'es' ? 'Crear Primera Voz' : 'Create First Voice'}
                        </button>
                    </div>
                )}
            </div>
            
            {/* Components */}
            {hookLabVoice && (
                <ViralHookLab 
                    voice={hookLabVoice} 
                    isOpen={!!hookLabVoice} 
                    onClose={() => setHookLabVoice(null)} 
                />
            )}
        </div>
    );
};

export default MimicVault;
