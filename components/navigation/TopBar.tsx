
import React from 'react';
import { Home, ChevronRight, Grid, Menu, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

import { translations } from '../../translations';
import { useUser } from '../../context/UserContext';
import { AppLanguage } from '../../types';

interface TopBarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onUpgrade?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ activeTab, onNavigate, onUpgrade }) => {
  const { language } = useUser();
  const t = translations[language];

  if (activeTab === 'home') return null;

  const getToolName = (id: string) => {
    switch(id) {
      case 'home': return t.dashboard.header.home;
      case 'create': return t.dashboard.header.create;
      case 'autopost': return t.dashboard.header.autopost;
      case 'insight-responder': return t.dashboard.header.responder;
      case 'chat': return t.dashboard.header.chat;
      case 'audit': return t.dashboard.header.audit;
      case 'history': return t.dashboard.header.history;
      case 'settings': return t.dashboard.header.settings;
      case 'carousel': return t.dashboard.header.carousel;
      case 'voice-lab': return t.dashboard.header.voice;
      case 'editor': return t.dashboard.header.editor;
      default: return id;
    }
  };

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
          <span className="hidden sm:inline">{t.dashboard.header.home}</span>
        </button>
        
        <ChevronRight className="w-4 h-4 text-slate-300" />
        
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            key={activeTab}
            className="flex items-center gap-2"
        >
            <span className="text-slate-900 font-bold bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-sm">
                {getToolName(activeTab)}
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
                {t.dashboard.header.upgrade}
            </button>
        )}
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
        >
          <Grid className="w-4 h-4" />
          <span className="hidden sm:inline">{t.dashboard.header.menu}</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
