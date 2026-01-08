import React, { useState } from "react";
import { AppLanguage, UserProfile } from "../../../types";
import { ACHIEVEMENTS } from "../../../constants";
import { Check, Lock, Save, Trophy, Zap, User, CreditCard, Shield, ChevronRight } from "lucide-react";
import { translations } from "../../../translations";
import { toast } from "sonner";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import BillingSettings from "./BillingSettings";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsViewProps {
    user: UserProfile;
    onUpgrade: () => void;
    onSave: (updates: Partial<UserProfile>) => void;
    onLogout?: () => Promise<void>;
}

type SettingsTab = "profile" | "billing" | "security" | "achievements" | "support";

const SettingsView: React.FC<SettingsViewProps> = (
    { user, onUpgrade, onSave, onLogout },
) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
    const [language, setLanguage] = useState<AppLanguage>(
        user.language || "es",
    );
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    // State for Profile Settings (lifted up to handle "Save All" button)
    const [profileUpdates, setProfileUpdates] = useState<Partial<UserProfile>>(
        {},
    );

    const t = translations[language].app.settings;

    const handleSave = async () => {
        setIsSavingProfile(true);
        await new Promise((resolve) => setTimeout(resolve, 800));

        onSave({
            ...profileUpdates,
            language: language,
        });

        setIsSavingProfile(false);
        setShowSaved(true);
        toast.success(
            language === "es"
                ? "Se han guardado los cambios con éxito."
                : "Changes saved successfully.",
        );
        setTimeout(() => setShowSaved(false), 2000);
    };

    const handleProfileUpdate = (updates: Partial<UserProfile>) => {
        setProfileUpdates((prev) => ({ ...prev, ...updates }));
    };

    const tabs = [
        { id: "profile", label: language === 'es' ? 'Perfil' : 'Profile', icon: User, color: "blue" },
        { id: "billing", label: language === 'es' ? 'Suscripción' : 'Subscription', icon: CreditCard, color: "amber" },
        { id: "security", label: language === 'es' ? 'Seguridad' : 'Security', icon: Shield, color: "rose" },
        { id: "achievements", label: language === 'es' ? 'Logros' : 'Achievements', icon: Trophy, color: "orange" },
        { id: "support", label: language === 'es' ? 'Soporte' : 'Support', icon: User, color: "indigo" },
    ];

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
                        {t.title}
                    </h1>
                    <p className="text-slate-500 font-medium">{t.subtitle}</p>
                </div>
                
                {/* Save Button for Desktop */}
                <div className="hidden md:block">
                    <motion.button
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        disabled={isSavingProfile}
                        className={`flex items-center gap-2 px-6 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70
                            ${showSaved ? "bg-emerald-500 shadow-emerald-500/20" : "bg-brand-600 shadow-brand-500/25 hover:bg-brand-700"}
                        `}
                    >
                        {isSavingProfile ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : showSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {isSavingProfile ? t.saving : showSaved ? t.saved : t.saveChanges}
                    </motion.button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Navigation Sidebar */}
                <aside className="w-full lg:w-64 flex flex-row lg:flex-col gap-1 p-1 bg-slate-100/50 rounded-2xl border border-slate-200/60 overflow-x-auto lg:overflow-visible no-scrollbar">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as SettingsTab)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap lg:w-full group
                                    ${isActive 
                                        ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" 
                                        : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                    }
                                `}
                            >
                                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? `bg-${tab.color}-50 text-${tab.color}-600` : "bg-slate-200/50 text-slate-400 group-hover:bg-slate-200"}`}>
                                    <Icon strokeWidth={2} className="w-4 h-4" />
                                </div>
                                <span>{tab.label}</span>
                                {isActive && <motion.div layoutId="active-tab-indicator" className="ml-auto hidden lg:block"><ChevronRight className="w-4 h-4 text-slate-300" /></motion.div>}
                            </button>
                        );
                    })}
                </aside>

                {/* Content Area */}
                <main className="flex-1 w-full min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-soft-glow p-6 lg:p-8"
                        >
                            {activeTab === "profile" && (
                                <ProfileSettings
                                    user={user}
                                    language={language}
                                    setLanguage={setLanguage}
                                    onSave={handleProfileUpdate}
                                    onUpgrade={onUpgrade}
                                />
                            )}
                            
                            {activeTab === "billing" && (
                                <BillingSettings
                                    user={user}
                                    language={language}
                                    onUpgrade={onUpgrade}
                                    onSave={onSave}
                                />
                            )}

                            {activeTab === "security" && (
                                <SecuritySettings
                                    user={user}
                                    language={language}
                                    onSave={onSave}
                                />
                            )}

                            {activeTab === "achievements" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="p-3 bg-orange-50 rounded-2xl">
                                            <Trophy strokeWidth={1.5} className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">{t.trophyRoom}</h2>
                                            <p className="text-sm text-slate-500">Completa desafíos para desbloquear recompensas exclusivas.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {ACHIEVEMENTS.map((ach) => {
                                            const isUnlocked = user.unlockedAchievements?.includes(ach.id);
                                            return (
                                                <div
                                                    key={ach.id}
                                                    className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                                                        isUnlocked
                                                            ? "bg-amber-50/30 border-amber-200/50 shadow-sm"
                                                            : "bg-slate-50 border-slate-200/60 grayscale opacity-80"
                                                    }`}
                                                >
                                                    {!isUnlocked && (
                                                        <div className="absolute top-4 right-4 text-slate-300">
                                                            <Lock strokeWidth={2} className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${
                                                            isUnlocked
                                                                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-200/50"
                                                                : "bg-slate-200 text-slate-400"
                                                        }`}
                                                    >
                                                        <Trophy strokeWidth={2} className="w-6 h-6" />
                                                    </div>
                                                    <h4 className="font-bold text-slate-900 mb-1">{ach.title}</h4>
                                                    <p className="text-xs text-slate-500 mb-4 leading-relaxed min-h-[2.5rem] line-clamp-2">
                                                        {ach.description}
                                                    </p>
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isUnlocked ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-400"}`}>
                                                        <Zap strokeWidth={2.5} className="w-3 h-3 fill-current" />
                                                        +{ach.xpReward} XP
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            )}

                            {activeTab === "support" && (
                                <div className="space-y-6 text-center py-10">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {(t as any).support?.title || "Need Help?"}
                                    </h3>
                                    <p className="text-slate-500 max-w-sm mx-auto">
                                        {(t as any).support?.subtitle || "Our support team is ready to help you."}
                                    </p>
                                    <div className="pt-4">
                                        <a 
                                            href={`mailto:${(t as any).support?.email || "info@kolink.es"}`}
                                            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors inline-block"
                                        >
                                            {(t as any).support?.cta || "Contact Support"}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile Save Button (Sticky/Floating) */}
            <div className="fixed bottom-24 left-0 right-0 px-4 z-40 md:hidden">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isSavingProfile}
                    className={`w-full flex items-center justify-center gap-2 py-4 text-white font-bold rounded-2xl shadow-xl transition-all duration-300
                        ${showSaved ? "bg-emerald-500" : "bg-brand-600"}
                    `}
                >
                    {isSavingProfile ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : showSaved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {isSavingProfile ? t.saving : showSaved ? t.saved : t.saveChanges}
                </motion.button>
            </div>
            
            {/* Logout Link */}
            <div className="mt-12 pt-8 border-t border-slate-200/60 flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                    <a href="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</a>
                    <span className="text-slate-200">•</span>
                    <a href="/terms" className="hover:text-brand-600 transition-colors">Terms of Service</a>
                </div>
                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="text-slate-400 hover:text-rose-500 text-sm font-bold flex items-center gap-2 transition-colors py-2 px-4 rounded-xl hover:bg-rose-50"
                    >
                        <Lock className="w-4 h-4 rotate-180" />
                        {language === "es" ? "Cerrar sesión" : "Logout"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SettingsView;
