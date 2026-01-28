import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Layout, Zap, UserCheck, MessageSquare, Lightbulb,
  Building2, Scale, Rocket, Megaphone, HeartPulse,
  Rss, HelpCircle, PlayCircle, Info, CreditCard, Users,
  ChevronDown, ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

interface MegaMenuProps {
  title: string;
  items: any[];
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ title, items, isOpen, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 ${isOpen ? "text-brand-700 bg-white shadow-nexus ring-1 ring-slate-100" : "text-slate-600 hover:text-brand-700 hover:bg-white/60"}`}>
        {title}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} strokeWidth={2.5} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50 pointer-events-auto"
          >
            <div className="bg-white border border-slate-200/60 rounded-[2.5rem] shadow-2xl shadow-slate-900/15 min-w-[340px] lg:min-w-[580px] p-6 lg:p-8 overflow-hidden relative group/menu">
              {/* Subtle Ambient Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-400 opacity-5 blur-[100px] pointer-events-none group-hover/menu:opacity-10 transition-opacity duration-700" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 relative z-10">
                {items.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.href}
                    onClick={item.onClick}
                    className="group flex gap-4 p-4 rounded-3xl hover:bg-white transition-all duration-300 border border-transparent hover:border-slate-100 hover:shadow-soft-glow relative active:scale-[0.98]"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${item.accentColor ? `bg-${item.accentColor}-50 text-${item.accentColor}-600` : "bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600"}`}>
                      {React.cloneElement(item.icon, { strokeWidth: 1.5, className: "w-6 h-6 transition-transform group-hover:scale-110 duration-500" })}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-black text-slate-900 group-hover:text-brand-700 transition-colors tracking-tight">
                          {item.title}
                        </h4>
                        {item.badge && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-brand-100/50 text-brand-600 uppercase tracking-widest border border-brand-200/30">
                            {item.badge}
                          </span>
                        )}
                        {item.external && <ExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium group-hover:text-slate-600 transition-colors">
                        {item.desc}
                      </p>
                    </div>

                    {/* Arrow Indicator on hover */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-600">
                      <motion.div whileHover={{ x: 2 }}>
                        <ChevronDown className="-rotate-90 w-4 h-4" strokeWidth={3} />
                      </motion.div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MegaMenu;
