import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { AppTab } from '../../../../types';
import { StatusBadge } from '../../../ui/StatusBadge';

interface MissionLogProps {
    onSelectTool: (tab: AppTab) => void;
}

export const MissionLog: React.FC<MissionLogProps> = ({ onSelectTool }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 glass-premium rounded-3xl p-8"
        >
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <Clock className="w-5 h-5" />
                    </div>
                    Registro de Misión
                </h3>
                <button onClick={() => onSelectTool('history')} className="px-4 py-2 rounded-full bg-slate-50 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors uppercase tracking-wider">Ver Historial</button>
            </div>

            <div className="relative pl-4 space-y-8 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-slate-200 before:content-['']">
                {/* Timeline Item 1: Current Focus */}
                <div className="relative">
                    <span className="absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full bg-brand-500 ring-4 ring-white" />
                    <div className="flex flex-col gap-2">
                        <StatusBadge status="processing" text="En Progreso" />
                        <h4 className="text-sm font-bold text-slate-900">Configuración de Marca Personal</h4>
                        <p className="text-sm text-slate-500">Completa tu biografía para desbloquear el modo Experto.</p>
                    </div>
                </div>
                
                {/* Timeline Item 2: Completed */}
                <div className="relative opacity-60">
                        <span className="absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full bg-slate-300 ring-4 ring-white" />
                        <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completado ayer</span>
                        <h4 className="text-sm font-bold text-slate-900">Registro en Plataforma</h4>
                        <p className="text-sm text-slate-500">Bienvenido al ecosistema Kolink.</p>
                        </div>
                </div>

                    {/* Call to Action Wrapper */}
                <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-brand-500">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Siguiente Paso: Crea tu primer Post</p>
                        <p className="text-xs text-slate-500">Gana +50 XP</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
