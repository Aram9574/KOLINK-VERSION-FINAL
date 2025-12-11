import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { BrandVoice, AppLanguage } from '../../../types';
import { translations } from '../../../translations';
import { fetchBrandVoices, createBrandVoice, updateBrandVoice, deleteBrandVoice, setBrandVoiceActive } from '../../../services/userRepository';
import { Plus, Trash2, Edit2, CheckCircle, Circle, Mic2, Star, MoreVertical } from 'lucide-react';
import VoiceAnalyzer from './VoiceAnalyzer';
import { BrandVoiceAnalysisResult } from '../../../services/geminiService';
import { toast } from 'sonner';

interface BrandVoiceManagerProps {
    userId: string;
    language: AppLanguage;
}

const BrandVoiceManager: React.FC<BrandVoiceManagerProps> = ({ userId, language }) => {
    const [voices, setVoices] = useState<BrandVoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingVoice, setEditingVoice] = useState<BrandVoice | null>(null);
    const [showAnalyzer, setShowAnalyzer] = useState(false);

    // Form State
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');

    useEffect(() => {
        loadVoices();
    }, [userId]);

    const loadVoices = async () => {
        setIsLoading(true);
        const data = await fetchBrandVoices(userId);
        setVoices(data);
        setIsLoading(false);
    };

    const handleSetActive = async (voice: BrandVoice) => {
        // Optimistic update
        setVoices(prev => prev.map(v => ({ ...v, isActive: v.id === voice.id })));
        await setBrandVoiceActive(userId, voice.id);
        toast.success(language === 'es' ? 'Voz activa actualizada' : 'Active voice updated');
    };

    const handleDelete = async (voiceId: string) => {
        if (confirm(language === 'es' ? '¿Estás seguro de eliminar esta voz?' : 'Are you sure you want to delete this voice?')) {
            await deleteBrandVoice(voiceId);
            setVoices(prev => prev.filter(v => v.id !== voiceId));
            toast.success("Voice deleted");
        }
    };

    const handleSave = async () => {
        if (!formName.trim() || !formDescription.trim()) {
            toast.error("Name and description are required");
            return;
        }

        if (editingVoice) {
            const success = await updateBrandVoice(editingVoice.id, {
                name: formName,
                description: formDescription
            });
            if (success) {
                setVoices(prev => prev.map(v => v.id === editingVoice.id ? { ...v, name: formName, description: formDescription } : v));
                setEditingVoice(null);
                toast.success("Voice updated");
            }
        } else {
            const newVoice = await createBrandVoice(userId, {
                name: formName,
                description: formDescription
            });
            if (newVoice) {
                setVoices(prev => [newVoice, ...prev]);
                setIsCreating(false);
                toast.success("Voice created");
            }
        }

        // Reset form
        setFormName('');
        setFormDescription('');
        setShowAnalyzer(false);
    };

    const startAnalysis = () => {
        setShowAnalyzer(true);
    };

    const handleAnalysisComplete = (result: BrandVoiceAnalysisResult) => {
        setFormName(result.styleName);
        setFormDescription(result.toneDescription);
        setShowAnalyzer(false);
        if (!isCreating && !editingVoice) {
            setIsCreating(true);
        }
    };

    if (isLoading) return <div className="p-4 text-center text-slate-500">Loading voices...</div>;

    const isFormOpen = isCreating || editingVoice;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">
                    {language === 'es' ? 'Gestor de Voces de Marca' : 'Brand Voice Manager'}
                </h3>
                {!isFormOpen && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {language === 'es' ? 'Nueva Voz' : 'New Voice'}
                    </button>
                )}
            </div>

            {isFormOpen ? (
                <div className="bg-white border boundary-slate-200 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-slate-800">
                            {editingVoice ? (language === 'es' ? 'Editar Voz' : 'Edit Voice') : (language === 'es' ? 'Crear Nueva Voz' : 'Create New Voice')}
                        </h4>
                        {!showAnalyzer && (
                            <button
                                onClick={startAnalysis}
                                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md flex items-center gap-1 hover:bg-purple-200 transition-colors"
                            >
                                <Mic2 className="w-3 h-3" />
                                {language === 'es' ? 'Analizar con IA' : 'Analyze with AI'}
                            </button>
                        )}
                    </div>

                    {showAnalyzer ? (
                        <VoiceAnalyzer
                            language={language}
                            onAnalysisComplete={handleAnalysisComplete}
                            onCancel={() => setShowAnalyzer(false)}
                        />
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {language === 'es' ? 'Nombre de la Voz' : 'Voice Name'}
                                </label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="e.g. Professional, Casual, LinkedIn Guru..."
                                    className="w-full rounded-lg border-slate-300 focus:ring-brand-500 focus:border-brand-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {language === 'es' ? 'Descripción del Tono (Prompt)' : 'Tone Description (Prompt)'}
                                </label>
                                <textarea
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    placeholder="Describe how this voice sounds. Be specific about sentence structure, vocabulary, and emotion."
                                    className="w-full h-32 rounded-lg border-slate-300 focus:ring-brand-500 focus:border-brand-500 text-sm"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    {language === 'es'
                                        ? 'Este texto se enviará a la IA para instruirla sobre cómo escribir.'
                                        : 'This text will be sent to the AI to instruct it on how to write.'}
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setIsCreating(false);
                                        setEditingVoice(null);
                                        setFormName('');
                                        setFormDescription('');
                                    }}
                                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 shadow-sm transition-all"
                                >
                                    Save Voice
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid gap-3">
                    {voices.length === 0 ? (
                        <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <Mic2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No custom voices found.</p>
                            <p className="text-sm text-slate-400">Create one to personalize your content.</p>
                        </div>
                    ) : (
                        voices.map(voice => (
                            <div key={voice.id} className={`group relative bg-white border rounded-xl p-4 transition-all ${voice.isActive ? 'border-brand-500 ring-1 ring-brand-500 shadow-sm' : 'border-slate-200 hover:border-brand-300'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <button
                                            onClick={() => handleSetActive(voice)}
                                            className={`mt-1 flex-shrink-0 transition-colors ${voice.isActive ? 'text-brand-600' : 'text-slate-300 hover:text-brand-400'}`}
                                            title={voice.isActive ? "Active Voice" : "Set Active"}
                                        >
                                            {voice.isActive ? <CheckCircle className="w-5 h-5 fill-brand-50" /> : <Circle className="w-5 h-5" />}
                                        </button>
                                        <div>
                                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                {voice.name}
                                                {voice.isActive && <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Active</span>}
                                            </h4>
                                            <p className="text-sm text-slate-500 line-clamp-2 mt-1">{voice.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingVoice(voice);
                                                setFormName(voice.name);
                                                setFormDescription(voice.description);
                                            }}
                                            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(voice.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default BrandVoiceManager;
