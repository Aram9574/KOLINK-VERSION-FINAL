import React, { useState, useEffect } from 'react';
import { UserProfile, AppLanguage } from '../../../types';
import { translations } from '../../../translations';
import { Shield, Smartphone, AlertTriangle, Lock, LogOut } from 'lucide-react';
import { supabase } from '../../../services/supabaseClient';
import { toast } from 'sonner';

interface SecuritySettingsProps {
    user: UserProfile;
    language: AppLanguage;
    onSave: (updates: Partial<UserProfile>) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ user, language, onSave }) => {
    const [twoFactor, setTwoFactor] = useState<boolean>(user.twoFactorEnabled || false);
    const [securityNotifs, setSecurityNotifs] = useState<boolean>(user.securityNotifications || true);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [sessions, setSessions] = useState<any[]>([]);
    const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

    const t = translations[language].app.settings;

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
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
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
                                onChange={(e) => {
                                    setTwoFactor(e.target.checked);
                                    onSave({ twoFactorEnabled: e.target.checked });
                                }}
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
                                onChange={(e) => {
                                    setSecurityNotifs(e.target.checked);
                                    onSave({ securityNotifications: e.target.checked });
                                }}
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
    );
};

export default SecuritySettings;
