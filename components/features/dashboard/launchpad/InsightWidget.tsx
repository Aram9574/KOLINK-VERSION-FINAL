import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { MagicButton } from '../../../ui/MagicButton';
import Tooltip from '../../../ui/Tooltip';
import Skeleton from '../../../ui/Skeleton';
import { AppTab } from '../../../../types';

interface InsightWidgetProps {
    isLoading: boolean;
    language: string;
    onSelectTool: (tab: AppTab) => void;
    postsThisWeek: number;
    weeklyGoal: number;
    nextMilestone: string;
}

export const InsightWidget: React.FC<InsightWidgetProps> = ({ 
    isLoading, 
    language, 
    onSelectTool, 
    postsThisWeek, 
    weeklyGoal, 
    nextMilestone 
}) => {
    return (
        <motion.div 
            id="insight-widget"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="card-nexus p-8 overflow-hidden relative group"
        >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Sparkles className="w-48 h-48 text-brand-500" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                    <Zap className="w-5 h-5 fill-current" />
                </div>
                Insights de Crecimiento IA
            </h3>

                <div className="flex flex-col gap-6 relative z-10">
                    {isLoading ? (
                        <div className="space-y-4 w-full">
                            <Skeleton className="h-20 w-full rounded-2xl" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 flex-1" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group-hover:border-brand-100 group-hover:bg-brand-50/30 transition-colors">
                                <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-3 bg-brand-100/50 w-fit px-2 py-1 rounded">Próximo Hito</p>
                                <p className="text-sm text-slate-700 font-bold leading-relaxed">
                                    {language === 'es' 
                                        ? `¡Estás cerca del ${nextMilestone}! Gana más XP publicando.` 
                                        : `You're close to ${nextMilestone}! Earn XP by posting.`}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-5 p-2">
                                <div className="flex-1">
                                    <div className="flex justify-between mb-2">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{language === 'es' ? 'Meta Semanal' : 'Weekly Goal'}</p>
                                        <span className="text-xs font-bold text-slate-900">{postsThisWeek}/{weeklyGoal}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                            className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-1000" 
                                            style={{ width: `${Math.min(100, (postsThisWeek / weeklyGoal) * 100)}%` }}
                                            />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            <Tooltip>
                <p>Abre el chat con el Estratega IA para analizar tus métricas.</p>
            </Tooltip>
            <MagicButton
                onClick={() => onSelectTool('chat')}
                className="w-full mt-2"
                icon={<Sparkles className="w-4 h-4" />}
            >
                    Optimizar Estrategia
            </MagicButton>
        </motion.div>
    );
};
