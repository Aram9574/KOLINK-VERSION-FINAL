import React, { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('kolink-cookie-consent');
        if (!consent) {
            // Small delay to not overwhelm user immediately
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('kolink-cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('kolink-cookie-consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
                >
                    <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md border border-slate-200 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
                        
                        <div className="flex items-start gap-4 max-w-2xl">
                            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0">
                                <Cookie className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg mb-1">Valoramos tu privacidad</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Utilizamos cookies tecnológicas y analíticas para mejorar tu experiencia en Kolink. 
                                    Al continuar navegando, aceptas nuestra <a href="/privacy" className="text-brand-600 font-bold hover:underline">Política de Privacidad</a>.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button 
                                onClick={handleDecline}
                                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors"
                            >
                                Rechazar
                            </button>
                            <button 
                                onClick={handleAccept}
                                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                            >
                                Aceptar Todo
                            </button>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
