import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dna, 
  BrainCircuit, 
  Clock, 
  Zap, 
  Sparkles, 
  TrendingUp,
  Fingerprint
} from 'lucide-react';
import { BehavioralDNA } from '../../../types';

interface UserDNACardProps {
  dna?: BehavioralDNA;
  isLoading?: boolean;
}

export const UserDNACard: React.FC<UserDNACardProps> = ({ dna, isLoading }) => {
  const isSyncing = !dna || dna.archetype === "Aprendiendo...";

  if (isLoading) {
    return (
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-sm animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-20 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-sm group hover:border-brand-200/60 transition-all duration-300"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Dna className="w-24 h-24 rotate-12" />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
          <Fingerprint className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Identidad Digital</h3>
          <p className="text-[10px] text-slate-400 font-medium tracking-tight">Análisis de ADN Conductual SOTA</p>
        </div>
        {isSyncing && (
          <motion.div 
            animate={{ opacity: [1, 0.5, 1] }} 
            transition={{ duration: 2, repeat: Infinity }}
            className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-[10px] font-bold text-amber-600 border border-amber-100"
          >
            <Zap className="w-3 h-3" />
            VINCULANDO...
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        {/* Arquetipo */}
        <div className="p-4 bg-gradient-to-br from-brand-50/50 to-white border border-brand-100/30 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Arquetipo Maestro</span>
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          </div>
          <p className="text-lg font-bold text-slate-900 leading-tight">
            {dna?.archetype || "Analista de Datos"}
          </p>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
            {dna?.behavioral_summary || "Observando patrones para mimetizar tu voz..."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Flujo Pico</span>
            </div>
            <p className="text-sm font-bold text-slate-700">
              {dna?.peak_hours?.[0] ? `${dna.peak_hours[0]}` : "--:--"}
            </p>
          </div>
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-1.5 text-slate-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Tono Dominante</span>
            </div>
            <p className="text-sm font-bold text-slate-700">
              {dna?.dominant_tone || "Calculando..."}
            </p>
          </div>
        </div>

        {/* Personality Traits */}
        <div className="flex flex-wrap gap-1.5">
          {dna?.personality_traits?.map((trait, idx) => (
            <span 
              key={idx}
              className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 shadow-sm"
            >
              #{trait}
            </span>
          )) || Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-5 w-12 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
          <BrainCircuit className="w-3 h-3" />
          <span>Sincronizado con Gemini 2.0</span>
        </div>
        <span className="text-[9px] text-slate-300">
          Act: {dna?.last_updated ? new Date(dna.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
        </span>
      </div>
    </motion.div>
  );
};
