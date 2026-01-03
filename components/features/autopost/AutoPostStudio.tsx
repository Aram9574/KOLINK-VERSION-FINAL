
import React, { useState } from "react";
import { UserProfile, AppLanguage } from "../../../types.ts";

import PillarsConfig from "./PillarsConfig.tsx";
import ContentRadar from "./ContentRadar.tsx";
import StrategyTimeline from "./StrategyTimeline.tsx";
import { motion } from "framer-motion";

interface AutoPostStudioProps {
    user: UserProfile;
    language: AppLanguage;
    onViewPost: (post: any) => void;
    onUpgrade: () => void;
}

const AutoPostStudio: React.FC<AutoPostStudioProps> = ({ user, language }) => {
    const [isSystemActive, setIsSystemActive] = useState(false);

    return (
        <div className="min-h-screen pb-20">
            {/* Context Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-slate-900">AutoPost Studio</h2>
                <p className="text-slate-500 mt-1">Centro de Comando Estratégico para Contenido Automatizado.</p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                
                {/* 1. Status Removed - Redundant */}
                
                {/* 2. Pillars Configuration (12 Cols) */}
                <div className="col-span-12">
                   <PillarsConfig />
                </div>


                
                {/* 3. Content Radar (Full Width) */}
                <ContentRadar />

                {/* 4. Timeline (Full Width) */}
                <StrategyTimeline />

            </div>
        </div>
    );
};

export default AutoPostStudio;
