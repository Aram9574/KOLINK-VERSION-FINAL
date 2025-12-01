
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
    // Version Check Log
    useEffect(() => {
        console.log("SettingsView v2.1 loaded - Separate saving states");
    }, []);
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
            {/* ... (omitted parts) ... */}

            <button
                onClick={handleChangePassword}
                disabled={isSavingPassword || !newPassword || !confirmPassword}
                className="px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
                {isSavingPassword ? 'Guardando...' : 'Actualizar Contraseña'}
            </button>

            {/* ... (omitted parts) ... */}

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
