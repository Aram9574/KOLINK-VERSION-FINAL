import React, { useState } from "react";
import { UserProfile, AppLanguage, ExpertiseProfile } from "../../../types.ts";
import PremiumLockOverlay from "../../ui/PremiumLockOverlay";

import ExpertiseDNA from "./ExpertiseDNA";
import ContentRadar from "./ContentRadar";
import StrategyTimeline from "./StrategyTimeline";
import { Zap, Layout, Calendar as CalendarIcon, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AutoPostStudioProps {
    user: UserProfile;
    language: AppLanguage;
    onViewPost: (post: any) => void;
    onUpgrade: () => void;
}

const AutoPostStudio: React.FC<AutoPostStudioProps> = ({ user, language }) => {
    const [activeTab, setActiveTab] = useState<'radar' | 'identity' | 'schedule'>('radar');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    if (!user.isPremium) {
        return (
            <PremiumLockOverlay 
                title="Fábrica de Contenido"
                description="Tu Director de Marketing (CMO) personal con IA. Analiza tendencias, define tu estrategia y agenda contenido automáticamente."
                icon={<Zap className="w-8 h-8" />}
            />
        );
    }

    const handleSaveIdentity = (profile: ExpertiseProfile) => {
        // Here we would save to Supabase
        console.log("Saving profile:", profile);
    };

    return (
        <div className="min-h-screen pb-20 bg-slate-50/50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-slate-900">Fábrica de Contenido</h2>
                <p className="text-slate-500 mt-1 max-w-2xl">
                    Agente Autónomo de Inteligencia Competitiva. Convierte tendencias globales en autoridad personal.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-white p-1 rounded-xl w-fit shadow-sm border border-slate-200 mb-8 sticky top-4 z-30">
                <button
                    onClick={() => setActiveTab('radar')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'radar' 
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    <Layout size={18} />
                    Radar de Tendencias
                </button>
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'schedule' 
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    <CalendarIcon size={18} />
                    Calendario Inteligente
                </button>
                <button
                    onClick={() => setActiveTab('identity')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'identity' 
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    <SlidersHorizontal size={18} />
                    ADN de Experticia
                </button>
            </div>

            {/* Content Area */}
            <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                    {activeTab === 'radar' && (
                        <motion.div 
                            key="radar"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <ContentRadar />
                        </motion.div>
                    )}

                    {activeTab === 'schedule' && (
                         <motion.div 
                            key="schedule"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <StrategyTimeline userId={user.id} refreshTrigger={refreshTrigger} />
                        </motion.div>
                    )}

                    {activeTab === 'identity' && (
                         <motion.div 
                            key="identity"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <ExpertiseDNA onSave={handleSaveIdentity} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AutoPostStudio;
