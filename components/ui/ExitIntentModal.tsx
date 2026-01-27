
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { translations } from "../../translations";

const ExitIntentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { language } = useUser();
  const t = translations[language].cro.exitPopup;
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already shown in this session
    const shown = sessionStorage.getItem("exit_intent_shown");
    if (shown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger only if cursor leaves top of window (intent to close tab/address bar)
      if (e.clientY <= 0 && !hasShown && !sessionStorage.getItem("exit_intent_shown")) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exit_intent_shown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown]);

  const close = () => setIsOpen(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative"
            >
              
              <button 
                onClick={close}
                className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row">
                 {/* Visual Side (Hidden on mobile usually or stacked) */}
                 <div className="bg-brand-600 p-8 flex items-center justify-center md:w-1/3 text-white">
                    <Gift className="w-20 h-20 animate-bounce" />
                 </div>

                 {/* Content Side */}
                <div className="p-8 md:w-2/3">
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
                        {t.title}
                    </h3>
                    <p className="text-slate-500 font-medium mb-4 text-sm">
                        {t.subtitle}
                    </p>
                    
                    {!isSubmitted ? (
                        <>
                            <p className="text-slate-600 text-sm mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100 italic">
                                "{t.offer}"
                            </p>

                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setIsSubmitted(true);
                                    // In a real app, we would send this to a service
                                    console.log("Lead captured:", email);
                                }}
                                className="space-y-4"
                            >
                                <div className="space-y-1">
                                    <input 
                                        type="email"
                                        required
                                        placeholder={t.emailPlaceholder}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium transition-all shadow-sm"
                                    />
                                </div>
                                <motion.button 
                                    whileHover={{ y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2"
                                >
                                    {t.button}
                                </motion.button>
                                <button 
                                    type="button"
                                    onClick={close}
                                    className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-medium transition-colors"
                                >
                                    {t.decline}
                                </button>
                            </form>
                        </>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-emerald-500/30">
                                <Check className="w-8 h-8" />
                            </div>
                            <h4 className="text-emerald-900 font-bold text-lg mb-1">{t.success}</h4>
                            <p className="text-emerald-700 text-sm opacity-80">
                                {language === 'es' ? 'Prepárate para la viralidad.' : 'Get ready for virality.'}
                            </p>
                            <button 
                                onClick={close}
                                className="mt-6 text-emerald-600 font-bold text-xs uppercase tracking-widest hover:text-emerald-700 transition-colors"
                            >
                                {language === 'es' ? 'Cerrar' : 'Close'}
                            </button>
                        </motion.div>
                    )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentModal;
