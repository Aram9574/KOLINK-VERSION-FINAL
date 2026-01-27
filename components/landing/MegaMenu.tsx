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
      <button className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${isOpen ? "text-brand-700 bg-white shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:text-brand-700 hover:bg-white/50"}`}>
        {title}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50 pointer-events-auto"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-2xl shadow-slate-900/10 min-w-[320px] lg:min-w-[480px] p-6 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.href}
                    onClick={item.onClick}
                    className="group flex gap-4 p-3 rounded-2xl hover:bg-slate-50/80 transition-all duration-300 border border-transparent hover:border-slate-100"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors flex items-center gap-1">
                        {item.title}
                        {item.external && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
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
