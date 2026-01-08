import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, UserCheck, Hash, Ban, Save } from 'lucide-react';
import { ExpertiseProfile, ToneArchetype } from '../../../types';
import { toast } from 'sonner';

interface ExpertiseDNAProps {
    initialProfile?: ExpertiseProfile;
    onSave: (profile: ExpertiseProfile) => void;
}

const ARCHETYPES = [
    {
        id: 'Educator',
        icon: '📚',
        title: 'El Educador',
        desc: 'Se enfoca en tutoriales, guías prácticas y clarificar conceptos complejos.',
    },
    {
        id: 'Challenger',
        icon: '⚡',
        title: 'El Challenger',
        desc: 'Cuestiona el status quo, ofrece opiniones contrarias y genera debate.',
    },
    {
        id: 'Storyteller',
        icon: '📖',
        title: 'El Narrador',
        desc: 'Usa experiencias personales e historias para conectar emocionalmente.',
    },
    {
        id: 'Analyst',
        icon: '📊',
        title: 'El Analista',
        desc: 'Basado en datos, objetivo, se enfoca en tendencias, números y ROI.',
    },
];

const ExpertiseDNA: React.FC<ExpertiseDNAProps> = ({ initialProfile, onSave }) => {
    const [profile, setProfile] = useState<ExpertiseProfile>(
        initialProfile || {
            archetype: 'Educator',
            keywords: [],
            negativeKeywords: [],
        }
    );

    const [keywordInput, setKeywordInput] = useState('');
    const [negKeywordInput, setNegKeywordInput] = useState('');

    const handleAddKeyword = (e: React.KeyboardEvent, type: 'positive' | 'negative') => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = type === 'positive' ? keywordInput.trim() : negKeywordInput.trim();
            if (!val) return;

            if (type === 'positive') {
                if (!profile.keywords.includes(val)) {
                    setProfile((prev) => ({ ...prev, keywords: [...prev.keywords, val] }));
                }
                setKeywordInput('');
            } else {
                if (!profile.negativeKeywords.includes(val)) {
                    setProfile((prev) => ({ ...prev, negativeKeywords: [...prev.negativeKeywords, val] }));
                }
                setNegKeywordInput('');
            }
        }
    };

    const removeKeyword = (val: string, type: 'positive' | 'negative') => {
        if (type === 'positive') {
            setProfile((prev) => ({ ...prev, keywords: prev.keywords.filter((k) => k !== val) }));
        } else {
            setProfile((prev) => ({ ...prev, negativeKeywords: prev.negativeKeywords.filter((k) => k !== val) }));
        }
    };

    const handleSave = () => {
        onSave(profile);
        toast.success("ADN de Experticia Actualizado", {
            description: "Tu motor de piloto automático ahora se alineará con esta identidad."
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Brain size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">ADN de Experticia</h3>
                        <p className="text-sm text-slate-500">Define quién eres para que la IA suene como tú.</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                >
                    <Save size={16} />
                    Guardar Configuración
                </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Archetype Selector */}
                <div>
                    <h4 className="flex items-center gap-2 font-semibold text-slate-800 mb-4">
                        <UserCheck size={18} className="text-indigo-500" />
                        Arquetipo de Voz
                    </h4>
                    <div className="space-y-3">
                        {ARCHETYPES.map((arch) => (
                            <motion.button
                                key={arch.id}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setProfile((prev) => ({ ...prev, archetype: arch.id as any }))}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                                    profile.archetype === arch.id
                                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600/20'
                                        : 'border-slate-100 hover:border-slate-300'
                                }`}
                            >
                                <span className="text-2xl bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                                    {arch.icon}
                                </span>
                                <div>
                                    <h5 className={`font-bold ${profile.archetype === arch.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                                        {arch.title}
                                    </h5>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        {arch.desc}
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Right: Keywords Engine */}
                <div className="space-y-8">
                    {/* Authority Keywords */}
                    <div>
                        <h4 className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
                            <Hash size={18} className="text-emerald-500" />
                            Palabras Clave de Autoridad
                        </h4>
                        <p className="text-xs text-slate-500 mb-3">Temas por los que quieres ser conocido (ej: "Ventas SaaS", "Legal Tech").</p>
                        
                        <div className="bg-white border border-slate-200 rounded-xl p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                            <AnimatePresence>
                                {profile.keywords.map((k) => (
                                    <motion.span
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        key={k}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-100"
                                    >
                                        {k}
                                        <button onClick={() => removeKeyword(k, 'positive')} className="hover:text-emerald-900 transition-colors">×</button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                            <input
                                type="text"
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyDown={(e) => handleAddKeyword(e, 'positive')}
                                placeholder="Añadir palabra clave y Enter..."
                                className="flex-1 min-w-[140px] px-2 py-1 outline-none text-sm text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Negative Keywords */}
                    <div>
                        <h4 className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
                            <Ban size={18} className="text-rose-500" />
                            Palabras Clave Negativas
                        </h4>
                        <p className="text-xs text-slate-500 mb-3">Temas que la IA debe evitar absolutamente.</p>
                        
                        <div className="bg-white border border-slate-200 rounded-xl p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
                             <AnimatePresence>
                                {profile.negativeKeywords.map((k) => (
                                    <motion.span
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        key={k}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-700 text-sm font-medium rounded-full border border-rose-100"
                                    >
                                        {k}
                                        <button onClick={() => removeKeyword(k, 'negative')} className="hover:text-rose-900 transition-colors">×</button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                            <input
                                type="text"
                                value={negKeywordInput}
                                onChange={(e) => setNegKeywordInput(e.target.value)}
                                onKeyDown={(e) => handleAddKeyword(e, 'negative')}
                                placeholder="Añadir tema prohibido..."
                                className="flex-1 min-w-[140px] px-2 py-1 outline-none text-sm text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertiseDNA;
