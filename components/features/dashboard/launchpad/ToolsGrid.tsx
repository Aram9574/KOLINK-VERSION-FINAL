import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Crown, Grid, Sparkles, LucideIcon } from 'lucide-react';
import Tooltip from '../../../ui/Tooltip';
import Skeleton from '../../../ui/Skeleton';
import { UserProfile } from '../../../../types';

export interface ToolItem {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    color: string;
    bg: string;
    onClick: () => void;
    premium: boolean;
    badge?: string;
    colSpan?: string;
    disabled?: boolean;
}

interface ToolsGridProps {
    tools: ToolItem[];
    isLoading: boolean;
    user: UserProfile;
    language: string;
    onFeedbackOpen: () => void;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export const ToolsGrid: React.FC<ToolsGridProps> = ({ tools, isLoading, user, language, onFeedbackOpen }) => {
    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            {isLoading ? (
                [...Array(6)].map((_, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-white border border-slate-100 flex flex-col gap-6">
                        <Skeleton className="w-16 h-16 rounded-2xl" />
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </div>
                ))
            ) : (
                tools.map((tool) => (
                    <motion.button
                        key={tool.id}
                        id={`tool-${tool.id}`}
                        variants={item}
                        onClick={tool.disabled ? undefined : tool.onClick}
                        disabled={tool.disabled}
                        whileHover={tool.disabled ? {} : { y: -5, scale: 1.01 }}
                        whileTap={tool.disabled ? {} : { scale: 0.98 }}
                        className={`group relative text-left p-8 rounded-3xl glass-premium hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)] transition-all duration-500 overflow-hidden z-0 cursor-pointer ${tool.colSpan || 'col-span-1'} ${tool.disabled ? 'opacity-75 cursor-not-allowed grayscale-[0.5]' : ''}`}
                    >
                        {/* Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none" />

                        
                        {/* Gradient Background Wash */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${tool.bg} opacity-0 ${!tool.disabled && 'group-hover:opacity-100'} transition-opacity duration-500`} />
                        
                        {/* Accent Orb */}
                        <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${tool.color} opacity-[0.03] ${!tool.disabled && 'group-hover:opacity-1'} blur-3xl transition-all duration-500 rounded-full`} />

                        <div className="relative z-10 flex flex-col h-full gap-6">
                            <div className="flex justify-between items-start">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg text-white relative transform ${!tool.disabled && 'group-hover:scale-105 group-hover:rotate-1'} transition-transform duration-500`}>
                                    <tool.icon className="w-8 h-8" />
                                    {tool.premium && !user.isPremium && !tool.disabled && (
                                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                                            <Crown className="w-4 h-4 text-amber-500 fill-current" />
                                        </div>
                                    )}
                                    {/* Disabled / Coming Soon Badge */}
                                    {tool.disabled && (
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                                            <Tooltip>
                                                <div className="space-y-1.5">
                                                    <p className="font-bold flex items-center gap-1.5 text-brand-400">
                                                        <Grid className="w-3 h-3" />
                                                        {language === 'es' ? 'Próximamente' : 'Coming Soon'}
                                                    </p>
                                                    <p className="opacity-80">
                                                        {language === 'es' 
                                                            ? 'Estamos entrenando a la IA para analizar perfiles en profundidad. Disponible Q1 2026.' 
                                                            : 'We are training the AI to analyze profiles in depth. Available Q1 2026.'}
                                                    </p>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex flex-col items-end gap-2">
                                        {tool.badge && !tool.disabled && (
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm ${
                                            tool.badge === 'NUEVO' ? 'bg-brand-100 text-brand-600' : 
                                            tool.badge === 'POPULAR' ? 'bg-amber-100 text-amber-600' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {tool.badge}
                                        </span>
                                    )}
                                    {!tool.disabled && (
                                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                <ArrowRight className="w-4 h-4 text-slate-900" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex flex-col flex-1">
                                <h3 className={`text-xl font-bold text-slate-900 mb-2 ${!tool.disabled && 'group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700'} transition-colors`}>
                                    {tool.name}
                                </h3>
                                <p className={`text-slate-500 font-medium text-sm leading-relaxed ${!tool.disabled && 'group-hover:text-slate-600'} transition-colors`}>
                                    {tool.description}
                                </p>
                            </div>
                        </div>
                    </motion.button>
                ))
            )}

            {/* Quick Action Card (Static) */}
            <motion.div 
                variants={item}
                onClick={onFeedbackOpen}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="p-8 rounded-3xl bg-slate-50/50 border-2 border-dashed border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 flex flex-col items-center justify-center text-center gap-4 transition-all cursor-pointer group h-full min-h-[240px]"
            >
                <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">
                    <Sparkles className="w-6 h-6 text-slate-300 group-hover:text-brand-500 transition-colors" />
                </div>
                <div>
                    <p className="font-bold text-slate-900 mb-1">¿Falta algo?</p>
                    <p className="text-sm font-medium text-slate-500 group-hover:text-brand-600 transition-colors">Sugerir un nuevo módulo IA / Reportar Error</p>
                </div>
            </motion.div>
        </motion.div>
    );
};
