
import React, { useState } from "react";
import { UserProfile, AppLanguage } from "../../../types.ts";
import PremiumLockOverlay from "../../ui/PremiumLockOverlay";

import PillarsConfig from "./PillarsConfig";
import ContentRadar from "./ContentRadar";
import StrategyTimeline from "./StrategyTimeline";
import { motion } from "framer-motion";
import { Zap, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "../../../services/supabaseClient";
import { toast } from "sonner";

interface AutoPostStudioProps {
    user: UserProfile;
    language: AppLanguage;
    onViewPost: (post: any) => void;
    onUpgrade: () => void;
}

const AutoPostStudio: React.FC<AutoPostStudioProps> = ({ user, language }) => {
    if (!user.isPremium) {
        return (
            <PremiumLockOverlay 
                title="AutoPost Pilot"
                description={language === "es" 
                    ? "Automatización estratégica de contenido. Deja que KOLINK encuentre tendencias y publique por ti manteniendo tu ADN estilístico 24/7." 
                    : "Strategic content automation. Let KOLINK find trends and post for you while maintaining your stylistic DNA 24/7."}
                icon={<Zap className="w-8 h-8" />}
            />
        );
    }
    const [isSystemActive, setIsSystemActive] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleGenerateSchedule = async () => {
        setIsGenerating(true);
        const toastId = toast.loading("Analizando pilares y generando estrategia...");

        try {
            const { data, error } = await supabase.functions.invoke('autopilot-scheduler', {
                body: { user_id: user.id }
            });

            if (error) throw error;

            toast.success("¡Estrategia generada con éxito!", { id: toastId });
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error(error);
            toast.error("Error al generar la estrategia.", { 
                id: toastId,
                description: error.message || "Verifica tu conexión o intenta de nuevo."
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Context Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">AutoPost Studio</h2>
                    <p className="text-slate-500 mt-1">Centro de Comando Estratégico para Contenido Automatizado.</p>
                </div>
                <button 
                    onClick={handleGenerateSchedule}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-95"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Generando...
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            Generar Calendario
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
                
                {/* 1. Status Removed - Redundant */}
                
                {/* 2. Pillars Configuration (12 Cols) */}
                <div className="col-span-12">
                   <PillarsConfig userId={user.id} />
                </div>


                
                {/* 3. Content Radar (Full Width) */}
                <ContentRadar />

                {/* 4. Timeline (Full Width) */}
                <StrategyTimeline userId={user.id} refreshTrigger={refreshTrigger} />

            </div>
        </div>
    );
};

export default AutoPostStudio;
