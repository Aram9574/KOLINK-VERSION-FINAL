import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { translations } from '../../translations';
import { AppLanguage } from '../../types';

interface PremiumLockOverlayProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const PremiumLockOverlay: React.FC<PremiumLockOverlayProps> = ({ title, description, icon }) => {
    const { language } = useUser();
    const t = translations[language as AppLanguage].common?.premiumLock || {
        unlockNow: language === 'es' ? 'Desbloquear Ahora' : 'Unlock Now',
        premiumFeature: language === 'es' ? 'Función Premium' : 'Premium Feature',
        availableOn: language === 'es' ? 'Disponible en planes Pro y Viral' : 'Available on Pro and Viral plans'
    };

    const handleUnlock = () => {
        window.location.href = '/settings';
    };

    return (
        <div className="h-full w-full bg-slate-50/50 flex items-center justify-center relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-md mx-6 text-center space-y-6 p-8 bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl"
            >
                <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
                    <div className="text-white">
                        {icon}
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="py-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 text-sm font-bold">
                        <Lock size={16} />
                        {t.premiumFeature}
                    </div>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUnlock}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                    <Sparkles className="w-4 h-4 text-brand-400 group-hover:rotate-12 transition-transform" />
                    {t.unlockNow}
                </motion.button>
                
                <p className="text-xs text-slate-400 font-medium">
                    {t.availableOn}
                </p>
            </motion.div>
        </div>
    );
};

export default PremiumLockOverlay;
