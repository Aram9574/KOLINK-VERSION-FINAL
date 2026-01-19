
import React from 'react';
import { Home, ChevronRight, Grid, Menu, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopBarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onUpgrade?: () => void;
}

const toolNames: Record<string, string> = {
  home: 'Command Center',
  create: 'Redactor de Posts',
  autopost: 'Programador Inteligente',
  'insight-responder': 'Asistente de Engagement',
  chat: 'Estratega Personal IA',
  audit: 'Auditor de Perfil',
  history: 'Biblioteca de Contenido',
  settings: 'Configuración',
  carousel: 'Estudio de Carruseles',

  'voice-lab': 'Voice Lab',
  editor: 'Editor'
};

const TopBar: React.FC<TopBarProps> = ({ activeTab, onNavigate, onUpgrade }) => {
  if (activeTab === 'home') return null;

  return (
    <div className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3 text-sm">
        <button 
          onClick={() => onNavigate('home')}
          className="text-slate-500 hover:text-brand-600 transition-all flex items-center gap-1.5 font-medium group"
        >
          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-brand-50 transition-colors">
            <Home className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">Inicio</span>
        </button>
        
        <ChevronRight className="w-4 h-4 text-slate-300" />
        
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            key={activeTab}
            className="flex items-center gap-2"
        >
            <span className="text-slate-900 font-bold bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-sm">
                {toolNames[activeTab] || activeTab}
            </span>
            {activeTab === 'chat' && (
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
        </motion.div>
      </div>

      <div className="flex items-center gap-2">
        {onUpgrade && (
            <button
                onClick={onUpgrade}
                className="hidden md:flex bg-gradient-to-r from-brand-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all items-center gap-2"
            >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Mejorar Plan
            </button>
        )}
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
        >
          <Grid className="w-4 h-4" />
          <span className="hidden sm:inline">Menú</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
