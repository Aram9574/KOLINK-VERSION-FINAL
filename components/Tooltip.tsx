import React from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ children }) => (
  <div className="relative group cursor-help inline-flex ml-1.5 align-middle">
    <div className="bg-slate-100 rounded-full p-0.5 hover:bg-brand-100 hover:text-brand-600 text-slate-400 transition-colors">
        <Info className="w-3 h-3" />
    </div>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] pointer-events-none transform translate-y-2 group-hover:translate-y-0 border border-slate-800 font-normal leading-relaxed text-left">
        {children}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
    </div>
  </div>
);

export default Tooltip;