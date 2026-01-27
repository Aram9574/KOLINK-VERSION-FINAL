
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { translations } from "../../translations";

const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useUser();
  const t = translations[language].cro.sticky;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 600px (past hero)
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           initial={{ y: 100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: 100, opacity: 0 }}
           transition={{ type: "spring", stiffness: 260, damping: 20 }}
           className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto"
        >
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 text-white pl-6 pr-2 py-2 rounded-full shadow-2xl shadow-brand-500/20 flex items-center gap-4 md:gap-8 justify-between">
             <div className="hidden md:flex items-center gap-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>{t.text}</span>
             </div>
             
             <button
               onClick={() => navigate("/login")}
               className="bg-white text-slate-900 px-6 py-2 rounded-full text-sm font-bold hover:bg-brand-50 transition-colors flex items-center gap-2 group whitespace-nowrap"
             >
               {t.button}
               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTA;
