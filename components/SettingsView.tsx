
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { UserProfile, AppLanguage } from '../types';
import { ACHIEVEMENTS, PLANS } from '../constants';
import { User, CreditCard, Shield, Save, Bell, Zap, Trophy, Lock, Download, ChevronRight, Mic, Check, Smartphone, AlertTriangle, LogOut, Globe, Building2, Briefcase } from 'lucide-react';
import { translations } from '../translations';
import Tooltip from './Tooltip';

import CancellationModal from './CancellationModal';
import { supabase } from '../services/supabaseClient';

interface SettingsViewProps {
    user: UserProfile;
    onUpgrade: () => void;
    onSave: (updates: Partial<UserProfile>) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpgrade, onSave }) => {

    const [brandVoice, setBrandVoice] = useState(user.brandVoice || '');
    const [companyName, setCompanyName] = useState(user.companyName || '');
    const [industry, setIndustry] = useState(user.industry || '');
    const [name, setName] = useState(user.name || '');
    const [headline, setHeadline] = useState(user.headline || '');
    const [language, setLanguage] = useState<AppLanguage>(user.language || 'en');
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled || false);
    const [securityNotifs, setSecurityNotifs] = useState(user.securityNotifications || true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [sessions, setSessions] = useState<any[]>([]);
    const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError("Las contraseñas no coinciden");
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setIsSavingPassword(true);
        try {
            // 1. Verify session is active before update
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) {
                throw new Error("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
            }

            // 2. Attempt Update
            const { data, error } = await supabase.auth.updateUser({ password: newPassword });
            console.log("Update User Result:", data, error);

            if (error) throw error;

            if (data.user && data.user.aud === 'authenticated') {
                toast.success("Contraseña actualizada exitosamente");
                // Optional: Clear form
                setShowChangePassword(false);
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.info("Revisa tu correo para confirmar el cambio.");
            }
        } catch (error: any) {
            console.error("Password change error:", error);
            toast.error(error.message || "Error al actualizar contraseña");

            // If session expired, maybe redirect? 
            // For now, the error message is enough.
        } finally {
            setIsSavingPassword(false);
        }
    };

    useEffect(() => {
        const fetchSessions = async () => {
            const deviceId = localStorage.getItem('kolink_device_id');
            setCurrentDeviceId(deviceId);

            const { data } = await supabase
                .from('user_sessions')
                .select('*')
                .order('last_seen', { ascending: false });

            if (data) setSessions(data);
        };

        fetchSessions();
    }, []);

    const handleRevokeSession = async (sessionId: string) => {
        const { error } = await supabase
            .from('user_sessions')
            .delete()
            .eq('id', sessionId);

        if (!error) {
            setSessions(prev => prev.filter(s => s.id !== sessionId));
        }
    };

    const t = translations[language].app.settings;

    const currentPlan = PLANS.find(p => p.id === user.planTier) || PLANS[0];
    const isUnlimited = currentPlan.credits === -1;

    // Dynamic Credit Max Logic:
    // We use the greater of:
    // 1. The Plan's default credits (e.g., 3 for Free)
    // 2. The User's recorded max capacity (maxCredits) - this handles refills/carry-over
    // 3. The User's CURRENT credits (fallback if maxCredits wasn't set correctly)
    // This ensures the bar is never > 100% and properly shows depletion from the "high water mark".
    const planCredits = currentPlan.credits === -1 ? 1000 : currentPlan.credits;
    const userMaxCredits = user.maxCredits || 0;
    const effectiveMax = Math.max(planCredits, userMaxCredits, user.credits);

    const progressPercent = isUnlimited ? 100 : Math.min(100, (user.credits / effectiveMax) * 100);

    const CHAR_LIMIT = 500;

    const handleSave = async () => {
        setIsSavingProfile(true);
        // Simulate a network delay for better UX perception
        await new Promise(resolve => setTimeout(resolve, 500));
        onSave({
            name,
            headline,
            brandVoice,
            companyName,
            industry,
            twoFactorEnabled: twoFactor,
            securityNotifications: securityNotifs,
            language: language
        });
        setIsSavingProfile(false);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-display font-bold text-slate-900">{t.title}</h1>
                <p className="text-slate-500">{t.subtitle}</p>
            </div>

            {/* Trophy Room (Gamification) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-orange-50 rounded-lg">
                        <Trophy className="w-5 h-5 text-orange-600" />
                    </div>
                    {t.trophyRoom}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {ACHIEVEMENTS.map(ach => {
                        const isUnlocked = user.unlockedAchievements.includes(ach.id);
                        return (
                            <div key={ach.id} className={`relative p-4 rounded-xl border transition-all ${isUnlocked ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50 border-slate-100 grayscale opacity-70'}`}>
                                {!isUnlocked && (
                                    <div className="absolute top-3 right-3 text-slate-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                )}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-sm ${isUnlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                    <Trophy className="w-5 h-5 fill-current" />
                                </div>
                                <h4 className="font-bold text-sm text-slate-900 mb-1">{ach.title}</h4>
                                <p className="text-xs text-slate-500 mb-2 h-8 leading-snug">{ach.description}</p>
                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                                    <Zap className="w-3 h-3 fill-current" />
                                    +{ach.xpReward} XP
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* General Preferences */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    {t.generalPrefs}
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors bg-slate-50/30">
                        <div>
                            <p className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                {t.languageLabel}
                                <Tooltip>{t.languageTooltip}</Tooltip>
                            </p>
                            <p className="text-xs text-slate-500">{t.languageDesc}</p>
                        </div>
                        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${language === 'en' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                🇺🇸 English
                            </button>
                            <button
                                onClick={() => setLanguage('es')}
                                className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${language === 'es' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                🇪🇸 Español
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Brand Voice Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm ring-1 ring-slate-900/5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Mic className="w-5 h-5 text-purple-600" />
                        </div>
                        {t.brandVoiceTitle}
                        <Tooltip>{t.brandVoiceTooltip}</Tooltip>
                    </h2>
                    {user.planTier === 'free' && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded uppercase tracking-wide">
                            {t.premiumFeature}
                        </span>
                    )}
                </div>
                <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                        {t.brandVoiceDesc}
                    </p>
                    <div className="relative">
                        <textarea
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm font-medium h-32 resize-none placeholder-slate-400 text-slate-700"
                            placeholder={t.brandVoicePlaceholder}
                            value={brandVoice}
                            maxLength={CHAR_LIMIT}
                            onChange={(e) => setBrandVoice(e.target.value)}
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none bg-slate-50/80 pl-2 rounded-md backdrop-blur-sm">
                            <span className={`text-xs font-medium transition-colors ${brandVoice.length >= CHAR_LIMIT ? 'text-red-500' : 'text-slate-400'}`}>
                                {brandVoice.length}/{CHAR_LIMIT}
                            </span>
                            <Mic className="w-4 h-4 text-slate-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    {t.profileTitle}
                </h2>
                <div className="grid gap-6 max-w-2xl">
                    <div className="flex items-center gap-4">
                        <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-sm" />
                        <div className="space-y-2">
                            <button className="text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors">
                                {t.uploadPhoto}
                            </button>
                            <p className="text-xs text-slate-400">Recommended: 400x400 px</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">{t.fullName}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">{t.jobTitle}</label>
                            <input
                                type="text"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Company Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5" />
                                {t.companyLabel}
                                <Tooltip>{t.companyTooltip}</Tooltip>
                            </label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="e.g. Kolink Inc."
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5" />
                                {t.industryLabel}
                                <Tooltip>{t.industryTooltip}</Tooltip>
                            </label>
                            <input
                                type="text"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                placeholder="e.g. SaaS, Fintech, Marketing"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">{t.headline}</label>
                        <input
                            type="text"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Security & Privacy Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-red-50 rounded-lg">
                        <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    {t.securityTitle}
                </h2>

                <div className="space-y-6">
                    <div className="grid gap-4">
                        {/* 2FA Toggle */}
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors bg-slate-50/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <Smartphone className="w-4 h-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-900">{t.twoFactor}</p>
                                    <p className="text-xs text-slate-500">{t.twoFactorDesc}</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={twoFactor}
                                    onChange={(e) => setTwoFactor(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>

                        {/* Security Notifications */}
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors bg-slate-50/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <AlertTriangle className="w-4 h-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-900">{t.securityAlerts}</p>
                                    <p className="text-xs text-slate-500">{t.securityAlertsDesc}</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={securityNotifs}
                                    onChange={(e) => setSecurityNotifs(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Change Password Section */}
                    <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Contraseña</h3>
                        {!showChangePassword ? (
                            <button
                                onClick={() => setShowChangePassword(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                <Lock className="w-4 h-4" />
                                Cambiar Contraseña
                            </button>
                        ) : (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                setPasswordError('');
                                            }}
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                setPasswordError('');
                                            }}
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                {passwordError && <p className="text-xs text-red-500 font-medium">{passwordError}</p>}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={isSavingPassword || !newPassword || !confirmPassword}
                                        className="px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
                                    >
                                        {isSavingPassword ? 'Guardando...' : 'Actualizar Contraseña'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowChangePassword(false);
                                            setNewPassword('');
                                            setConfirmPassword('');
                                            setPasswordError('');
                                        }}
                                        className="px-4 py-2 text-slate-500 text-sm font-medium hover:text-slate-700"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Active Sessions */}
                    <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">{t.activeSessions}</h3>
                        <div className="space-y-3">
                            {sessions.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No active sessions found.</p>
                            ) : (
                                sessions.map((session) => {
                                    const isCurrent = session.device_id === currentDeviceId;
                                    const lastSeen = new Date(session.last_seen).toLocaleDateString();

                                    return (
                                        <div key={session.id} className={`flex items-center justify-between text-sm ${!isCurrent ? 'opacity-80' : ''}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                                <div>
                                                    <p className="font-medium text-slate-700">
                                                        {session.device_info?.device === 'Desktop' ? 'Desktop' : session.device_info?.device || 'Unknown Device'}
                                                        {isCurrent && ' (This device)'}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {session.device_info?.os} • {session.device_info?.browser} • {session.ip_address}
                                                    </p>
                                                </div>
                                            </div>
                                            {isCurrent ? (
                                                <span className="text-xs text-slate-500">Active now</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleRevokeSession(session.id)}
                                                    className="text-xs text-red-500 hover:underline flex items-center gap-1"
                                                >
                                                    <LogOut className="w-3 h-3" /> Revoke
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing & Subscription */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center justify-between mb-6 relative z-10">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <CreditCard className="w-5 h-5 text-amber-600" />
                        </div>
                        {t.billingTitle}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${user.planTier !== 'free' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {currentPlan.name} Plan
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
                    {/* Current Plan Card */}
                    <div className="bg-slate-50/80 rounded-xl p-6 border border-slate-200 flex flex-col justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">{t.currentUsage}</p>
                            <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-3xl font-display font-bold text-slate-900">{isUnlimited ? '∞' : user.credits}</span>
                                <span className="text-sm font-medium text-slate-400">/ {isUnlimited ? '∞' : effectiveMax} credits</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                                <div className="bg-gradient-to-r from-brand-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                            <p className="text-xs text-slate-500">
                                {isUnlimited ? 'You are unstoppable.' : `Resets on ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`}
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-200/60 flex flex-col gap-2">
                            <button onClick={onUpgrade} className="text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1">
                                {t.manageSub} <ChevronRight className="w-4 h-4" />
                            </button>

                            {user.planTier !== 'free' && !user.cancelAtPeriodEnd && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="text-xs font-medium text-slate-400 hover:text-red-500 hover:underline flex items-center gap-1 w-fit transition-colors"
                                >
                                    Cancel Subscription
                                </button>
                            )}

                            {user.cancelAtPeriodEnd && (
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit">
                                    Cancels at period end
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Payment Method Card */}
                    <div className="bg-slate-50/80 rounded-xl p-6 border border-slate-200 flex flex-col justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">{t.paymentMethod}</p>
                            {user.planTier !== 'free' ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-8 bg-slate-800 rounded-md flex items-center justify-center text-white/90 text-[8px] font-mono tracking-widest relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent)]"></div>
                                        •••• 4242
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Visa ending in 4242</p>
                                        <p className="text-xs text-slate-500">Expires 12/25</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 opacity-60">
                                    <div className="w-12 h-8 bg-slate-200 rounded-md border border-slate-300"></div>
                                    <p className="text-sm text-slate-500">No payment method linked.</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-200/60">
                            <button className="text-sm font-bold text-slate-500 hover:text-slate-700 hover:underline">
                                {t.updatePayment}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Invoice History Removed as per request */}
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSavingProfile}
                    className={`flex items-center gap-2 px-8 py-3 text-white font-bold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait disabled:hover:translate-y-0
                    ${showSaved ? 'bg-green-500 shadow-green-500/20' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20'}
                `}
                >
                    {isSavingProfile ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : showSaved ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {isSavingProfile ? t.saving : showSaved ? t.saved : t.saveChanges}
                </button>
            </div>


            <CancellationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onCancelSuccess={() => {
                    // Refresh user profile or show success message
                    onSave({ ...user, cancelAtPeriodEnd: true }); // Optimistic update
                }}
                planName={user.planTier}
                planPrice={PLANS.find(p => p.id === user.planTier)?.price || 0}
                language={language}
            />
        </div >
    );
};

export default SettingsView;
