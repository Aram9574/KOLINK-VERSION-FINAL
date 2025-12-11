import React, { useState } from 'react';
import { UserProfile, AppLanguage } from '../../../types';
import { translations } from '../../../translations';
import { Shield, Lock } from 'lucide-react';
import { supabase } from '../../../services/supabaseClient';
import { toast } from 'sonner';

interface SecuritySettingsProps {
    user: UserProfile;
    language: AppLanguage;
    onSave: (updates: Partial<UserProfile>) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ user, language, onSave }) => {

    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const t = translations[language].app.settings;
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
                {language === 'es' ? 'Credenciales' : 'Credentials'}
            </h2>

            <div className="space-y-6">
                <div className="grid gap-4">
                    {/* Email Display */}
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                        <div>
                            <p className="font-bold text-sm text-slate-900">Email</p>
                            <p className="text-xs text-slate-500">
                                {language === 'es' ? 'Dirección asociada a tu cuenta' : 'Address associated with your account'}
                            </p>
                        </div>
                        <div className="text-sm font-medium text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                            {user.email || 'No email found'}
                        </div>
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


            </div>
        </div>
    );
};

export default SecuritySettings;
