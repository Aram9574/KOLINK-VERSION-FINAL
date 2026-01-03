
import React from "react";
import { motion } from "framer-motion";
import { Activity, Power } from "lucide-react";

interface StatusCardProps {
    isActive: boolean;
    onToggle: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({ isActive, onToggle }) => {
    return (
        <div className="col-span-12 lg:col-span-4 h-full min-h-[200px] bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`} />

            <div className="flex justify-between items-start z-10">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Estado del Sistema</h3>
                    <p className="text-sm text-slate-500">Motor AutoPilot</p>
                </div>
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full ${isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"} transition-colors duration-300`}>
                    <Activity size={20} />
                     {isActive && (
                        <span className="absolute inset-0 rounded-full border border-emerald-500 animate-ping opacity-20" />
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 z-10">
                <div className="flex flex-col">
                    <span className={`text-2xl font-display font-bold ${isActive ? "text-emerald-600" : "text-slate-400"}`}>
                        {isActive ? "ACTIVO" : "INACTIVO"}
                    </span>
                    <span className="text-xs text-slate-400">
                        {isActive ? "Prox. ejecución en 14h" : "Pausado"}
                    </span>
                </div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onToggle}
                    className={`h-10 px-6 rounded-full font-semibold text-sm transition-all shadow-sm flex items-center gap-2 ${
                        isActive 
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                >
                    <Power size={14} />
                    {isActive ? "Desactivar" : "Activar"}
                </motion.button>
            </div>
        </div>
    );
};

export default StatusCard;
