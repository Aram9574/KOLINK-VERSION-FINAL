import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Scan, Activity, Fingerprint, Loader2, Bot, Lock } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { usePosts } from '../../../context/PostContext';
import { fetchBrandVoices, createBrandVoice, deleteBrandVoice, setBrandVoiceActive } from '../../../services/voiceRepository';
import { updateUserProfile } from '../../../services/userRepository';
import { BrandVoice } from '../../../types';
import { BrandVoiceAnalysisResult } from '../../../services/geminiService';
import { toast } from 'sonner';
import { analytics } from '../../../services/analyticsService';

import MimicVault from './MimicVault';
import DNAScanner from './DNAScanner';
import AuthorityGap from './AuthorityGap';
import ShadowingPlayground from './ShadowingPlayground';


import AudioGenerator from './AudioGenerator';
import { Mic2 } from 'lucide-react';

type LabTab = 'vault' | 'scanner' | 'authority' | 'shadowing' | 'audio';

import PremiumLockOverlay from '../../ui/PremiumLockOverlay';

const VoiceLabView: React.FC = () => {
    const { user, setUser, language } = useUser();
    const { posts } = usePosts();
    
    // State
    const [activeTab, setActiveTab] = useState<LabTab>('vault');
    const [voices, setVoices] = useState<BrandVoice[]>([]);
    const [isLoadingVoices, setIsLoadingVoices] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Initial Load
    useEffect(() => {
        loadVoices();
    }, [user.id]);

    const loadVoices = async () => {
        setIsLoadingVoices(true);
        if (user.id) {
            const data = await fetchBrandVoices(user.id);
            setVoices(data);
        }
        setIsLoadingVoices(false);
    };

    const handleSetActive = async (voice: BrandVoice) => {
        setVoices(prev => prev.map(v => ({ ...v, isActive: v.id === voice.id })));
        if (user.id) {
             // Optimistic update local
             setUser(prev => ({ ...prev, brandVoice: voice.description }));

            await setBrandVoiceActive(user.id, voice.id);
             // Sync with profile for legacy generation compatibility
             await updateUserProfile(user.id, { brandVoice: voice.description });

            toast.success(language === 'es' ? 'Voz activada correctamente' : 'Voice activated successfully');
        }
    };

    const handleDeleteVoice = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(language === 'es' ? '¿Borrar esta voz?' : 'Delete this voice?')) {
            await deleteBrandVoice(id);
            setVoices(prev => prev.filter(v => v.id !== id));
            toast.success("Voice deleted");
        }
    };

    const handleSaveAnalysis = async (result: BrandVoiceAnalysisResult) => {
        if (!user.id) return;
        setIsSaving(true);
        try {
            const newVoice = await createBrandVoice(
                user.id, 
                result.styleName, 
                result.toneDescription,
                result.hookPatterns,
                result.stylisticDNA || {}
            );
            
            if (newVoice) {
                setVoices(prev => [newVoice, ...prev]);
                
                 // Sync with profile
                 setUser(prev => ({ ...prev, brandVoice: result.toneDescription }));
                 await updateUserProfile(user.id, { brandVoice: result.toneDescription });

                 toast.success("Voice DNA Saved!");
                 
                 // ANALYTICS: Track success
                 analytics.track('voice_cloning_success', {
                     style_name: result.styleName,
                     has_dna: !!result.stylisticDNA
                 });

                 setActiveTab('vault');
            }
        } catch (e) {
            toast.error("Failed to save voice");
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const activeVoice = voices.find(v => v.isActive);

    // Premium Lock for Voice Lab
    if (!user.isPremium) {
        return (
            <PremiumLockOverlay 
                title={language === 'es' ? 'Laboratorio de Voz' : 'Voice Lab'}
                description={language === 'es' 
                    ? 'Clona tu voz y estilo de escritura para generar contenido indistinguible de ti.' 
                    : 'Clone your voice and writing style to generate content indistinguishable from you.'}
                icon={<Fingerprint className="w-8 h-8" />}
            />
        );
    }

    return (
        <div className="h-full w-full bg-slate-50 relative overflow-hidden flex flex-col">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '32px 32px'
                    }}
            />

            {/* Header / Nav */}
            <div className="relative z-10 pt-6 px-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <Fingerprint className="w-6 h-6 text-brand-600" />
                        {language === 'es' ? 'Laboratorio de Voz' : 'Voice Lab'}
                    </h1>
                </div>
                
                {/* Tab Switcher */}
                <div className="flex bg-white p-1 rounded-xl border border-slate-200/60 shadow-sm gap-1">
                     <motion.button 
                         whileHover={{ y: -1 }}
                         whileTap={{ scale: 0.98 }}
                         onClick={() => setActiveTab('scanner')}
                         className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'scanner' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        <Scan className="w-4 h-4" />
                        DNA Scanner
                    </motion.button>
                    <motion.button 
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('vault')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'vault' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        <Database className="w-4 h-4" />
                        Mimic Vault
                    </motion.button>
                    <motion.button 
                         whileHover={{ y: -1 }}
                         whileTap={{ scale: 0.98 }}
                         onClick={() => setActiveTab('authority')}
                         className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'authority' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        <Activity className="w-4 h-4" />
                        Authority Radar
                    </motion.button>
                    <motion.button 
                         whileHover={{ y: -1 }}
                         whileTap={{ scale: 0.98 }}
                         onClick={() => setActiveTab('audio')}
                         className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'audio' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        <Mic2 className="w-4 h-4" />
                        Audio Gen
                    </motion.button>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6">
                 {activeTab === 'vault' && (
                    <MimicVault 
                        voices={voices} 
                        isLoading={isLoadingVoices} 
                        onSetActive={handleSetActive} 
                        onDelete={handleDeleteVoice}
                        onCreateNew={() => setActiveTab('scanner')}
                        onTrain={(voice) => {
                             handleSetActive(voice);
                             setActiveTab('shadowing');
                        }}
                    />
                 )}
                 {activeTab === 'scanner' && (
                    <DNAScanner 
                        user={user} 
                        posts={posts} 
                        onSave={handleSaveAnalysis}
                        isSaving={isSaving}
                    />
                 )}
                 {activeTab === 'authority' && (
                    <AuthorityGap 
                        user={user} 
                        activeVoice={activeVoice}
                    />
                 )}
                 {activeTab === 'shadowing' && (
                    <div className="h-full flex flex-col">
                        <button 
                            onClick={() => setActiveTab('vault')}
                            className="self-start mb-4 px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 uppercase tracking-wider"
                        >
                            ← Back to Vault
                        </button>
                        <ShadowingPlayground 
                            activeVoice={activeVoice}
                        />
                    </div>
                 )}
                 {activeTab === 'audio' && (
                    <AudioGenerator voices={voices} />
                 )}
            </div>
        </div>
    );
};

export default VoiceLabView;
