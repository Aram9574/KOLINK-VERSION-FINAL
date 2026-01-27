
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, UserPlus, Globe } from "lucide-react";
import { useUser } from "../../context/UserContext";

const FomoToast = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [event, setEvent] = useState({ title: "", desc: "", icon: Zap });
    const { language } = useUser();
    const isEs = language === "es";

    const events = isEs ? [
        { title: "Nuevo Creador", desc: "Alguien de Madrid se acaba de unir", icon: UserPlus },
        { title: "Viralidad", desc: "Post generado en finanzas: +50k vistas", icon: Zap },
        { title: "Expansión", desc: "Nuevo usuario Pro desde México", icon: Globe },
        { title: "Productividad", desc: "Alguien ahorró 4 horas hoy", icon: Zap },
    ] : [
        { title: "New Creator", desc: "Someone from London just joined", icon: UserPlus },
        { title: "Virality", desc: "Finance post generated: +50k views", icon: Zap },
        { title: "Expansion", desc: "New Pro user from NYC", icon: Globe },
        { title: "Productivity", desc: "Someone saved 4 hours today", icon: Zap },
    ];

    useEffect(() => {
        const trigger = () => {
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            setEvent(randomEvent);
            setIsVisible(true);

            setTimeout(() => {
                setIsVisible(false);
            }, 5000); // Show for 5s
        };

        const interval = setInterval(trigger, 20000); // Trigger every 20s
        // Initial trigger
        const timer = setTimeout(trigger, 5000);

        return () => {
             clearInterval(interval);
             clearTimeout(timer);
        };
    }, [language]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: -50, y: 50 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -50, y: 50 }}
                    className="fixed bottom-6 left-6 z-40 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-lg p-4 flex items-center gap-4 max-w-xs"
                >
                    <div className="bg-brand-50 p-2 rounded-full text-brand-500">
                        <event.icon size={20} />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{event.title}</h4>
                        <p className="text-sm text-slate-600 font-medium">{event.desc}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FomoToast;
