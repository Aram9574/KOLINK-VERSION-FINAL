
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';

interface StickyCTAHeaderProps {
  showAfterScrollY?: number;
}

export const StickyCTAHeader: React.FC<StickyCTAHeaderProps> = ({ showAfterScrollY = 600 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const t = translations[user?.language || 'es'];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > showAfterScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScrollY]);

  // Don't show if user is already logged in (optional check, dependent on strategy)
  // For now, we show it on landing pages regardless, or hide if user is logged in?
  // Strategy: If user is logged in, maybe show "Go to Dashboard" instead. 
  // But strictly for "Get Started" CRO, let's assume this is for visitors.
  if (user?.id && !user.id.startsWith('mock-')) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-3 px-4 md:px-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                 <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="font-bold text-slate-900 hidden md:inline-block">Kolink</span>
              <span className="text-sm text-slate-500 hidden lg:inline-block ml-2 border-l border-slate-300 pl-3">
                 {t.hero?.subtitle ? t.hero.subtitle.split('.')[0] : "Crea contenido viral con IA"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600 hidden md:inline-block">
                {t.pricing?.footer?.split('.')[0] || "Prueba gratis sin tarjeta"}
              </span>
              <Button 
                onClick={() => navigate('/login')}
                className="bg-brand-600 hover:bg-brand-700 text-white gap-2 shadow-lg shadow-brand-500/20"
              >
                <Sparkles className="w-4 h-4" />
                {t.hero?.ctaPrimary || "Empezar Gratis"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
