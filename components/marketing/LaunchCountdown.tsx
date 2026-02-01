import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Rocket, ChevronRight } from "lucide-react";
import { OfferClaimModal } from "./OfferClaimModal";

interface LaunchCountdownProps {
  language: string;
}

export const LaunchCountdown: React.FC<LaunchCountdownProps> = ({ language }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number } | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 10 minutes in milliseconds
    const OFFER_DURATION = 10 * 60 * 1000;
    const STORAGE_KEY = 'kolink_offer_start_time';
    
    let startTime = localStorage.getItem(STORAGE_KEY);
    
    if (!startTime) {
      const now = Date.now().toString();
      localStorage.setItem(STORAGE_KEY, now);
      startTime = now;
    }

    const calculateTimeLeft = () => {
      const start = parseInt(startTime!);
      const now = Date.now();
      const elapsed = now - start;
      const remaining = OFFER_DURATION - elapsed;

      if (remaining <= 0) {
        setIsVisible(false);
        return null;
      }

      return {
        minutes: Math.floor((remaining / 1000 / 60) % 60),
        seconds: Math.floor((remaining / 1000) % 60)
      };
    };

    const initial = calculateTimeLeft();
    if (!initial) {
      setIsVisible(false);
      return;
    }
    setTimeLeft(initial);

    const timer = setInterval(() => {
      const next = calculateTimeLeft();
      if (!next) {
        clearInterval(timer);
        setIsVisible(false);
      } else {
        setTimeLeft(next);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  if (!isVisible || !timeLeft) return null;

  return (
    <>
      <div className="w-full bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 overflow-hidden relative border-b border-amber-200/50 shadow-sm">
        {/* Animated Background Pulse */}
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-full bg-orange-200/40 blur-[80px]"
        />

        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Rocket size={18} className="animate-bounce" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-700/80 leading-none mb-1">
                {language === 'es' ? 'Oferta Exclusiva' : 'Exclusive Offer'}
              </span>
              <p className="text-sm font-black text-slate-900 leading-none tracking-tight">
                {language === 'es' ? '50% OFF Lifetime Deal - ¡Solo por unos minutos!' : '50% OFF Lifetime Deal - Only for minutes!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-2xl border border-amber-200/50 shadow-inner">
              <Timer size={14} className="text-orange-600 animate-pulse" />
              <div className="flex items-center gap-1.5 font-mono text-xl font-black text-slate-900">
                <span className="tabular-nums">{format(timeLeft.minutes)}</span>
                <span className="text-orange-300 animate-pulse">:</span>
                <span className="tabular-nums">{format(timeLeft.seconds)}</span>
              </div>
              <span className="text-[9px] font-black text-orange-700/60 uppercase tracking-widest ml-1 hidden sm:inline">
                {language === 'es' ? 'Restante' : 'Left'}
              </span>
            </div>

            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="h-10 px-8 bg-orange-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.1em] flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/25 active:shadow-inner"
            >
              {language === 'es' ? 'Aprovechar Oferta' : 'Claim Offer'}
              <ChevronRight size={14} strokeWidth={3} />
            </motion.button>
          </div>
        </div>
      </div>

      <OfferClaimModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        language={language}
      />
    </>
  );
};
