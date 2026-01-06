import React, { useState } from "react";
import {
    Sparkles,
    MessageSquare,
    LogOut,
    Settings,
    User,
    ChevronDown,
    Bell,
    CreditCard
} from "lucide-react";
import { AppLanguage, UserProfile } from "../../../types.ts";
import { Feedback } from "../../ui/feedback.tsx";
import { getAvatarUrl } from "../../../utils.ts";
import { motion, AnimatePresence } from "framer-motion";
import { hapticFeedback } from "../../../lib/animations.ts";
import { supabase } from "../../../services/supabaseClient.ts";

import NotificationBell from "../notifications/NotificationBell.tsx";

interface DashboardHeaderProps {
    user: UserProfile;
    language: AppLanguage;
    setLanguage: (lang: AppLanguage) => void;
    activeTab: string;
    setActiveTab: (tab: any) => void;
}

const getBreadcrumb = (tab: string) => {
    switch (tab) {
        case "create": return { parent: "Estudio", child: "Compositor" };
        case "history": return { parent: "Estudio", child: "Historial" };
        case "ideas": return { parent: "Estudio", child: "Generador" };
        case "carousel": return { parent: "Estudio", child: "Carrusel" };
        case "autopilot": return { parent: "Estudio", child: "AutoPilot" };
        case "voice-lab": return { parent: "Inteligencia", child: "Laboratorio de Voz" };
        case "audit": return { parent: "Inteligencia", child: "Auditoría de Perfil" };
        case "insight-responder": return { parent: "Inteligencia", child: "Asistente de Respuesta" };
        case "chat": return { parent: "Inteligencia", child: "Chat Experto" };
        case "settings": return { parent: "Cuenta", child: "Ajustes" };
        default: return { parent: "App", child: "Dashboard" };
    }
};

const DashboardHeader = ({ user, language, setLanguage, activeTab, setActiveTab }: DashboardHeaderProps) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const breadcrumb = getBreadcrumb(activeTab);

    return (
        <>
            <header className="sticky top-0 z-50 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    
                    {/* LEFT: Context / Breadcrumb */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center text-sm">
                            <span className="text-slate-500 font-medium">{breadcrumb.parent}</span>
                            <span className="mx-2 text-slate-300">/</span>
                            <span className="text-slate-900 font-semibold">{breadcrumb.child}</span>
                        </div>
                    </div>

                    {/* RIGHT: Command Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        
                        {/* Suggestions / Feedback Button */}
                        <div className="hidden md:block">
                            <Feedback label="Sugerencias" />
                        </div>

                        <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />

                        {/* Language Selector Removed as per strict Spanish requirement */}

                        {/* Notifications */}
                        <div className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                             <NotificationBell userId={user.id} language={language} />
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative ml-1">
                            <motion.button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 p-[1px] shadow-sm group-hover:shadow-md transition-all">
                                    <img
                                        src={getAvatarUrl(user)}
                                        alt="User"
                                        className="w-full h-full rounded-full object-cover bg-white"
                                    />
                                </div>
                            </motion.button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        {/* Backdrop to close */}
                                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                        
                                        {/* Dropdown Menu */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 top-full mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-xl border border-slate-200/50 shadow-xl shadow-slate-200/20 z-50 overflow-hidden"
                                        >
                                            <div className="p-3 border-b border-slate-100">
                                                <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                            
                                            <div className="p-1">
                                                <button 
                                                    onClick={() => {
                                                        setActiveTab('audit');
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                                >
                                                    <User size={16} strokeWidth={1.5} />
                                                    <span>Perfil</span>
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setActiveTab('settings');
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                                >
                                                    <CreditCard size={16} strokeWidth={1.5} />
                                                    <span>Suscripción</span>
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setActiveTab('settings');
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                                >
                                                    <Settings size={16} strokeWidth={1.5} />
                                                    <span>Ajustes</span>
                                                </button>
                                            </div>

                                            <div className="p-1 border-t border-slate-100">
                                                <button 
                                                    onClick={async () => {
                                                        await supabase.auth.signOut();
                                                    }}
                                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    <LogOut size={16} strokeWidth={1.5} />
                                                    <span>Cerrar Sesión</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                </div>
            </header>

        </>
    );
};

export default DashboardHeader;
