import React, { useState } from 'react';
import { UserProfile, AppLanguage } from '../../../types';
import { translations } from '../../../translations';
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';
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
    const [showPass, setShowPass] = useState(false);

    const t = translations[language].app.settings;
    
    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError(language === 'es' ? "Las contraseñas no coinciden" : "Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError(language === 'es' ? "La contraseña debe tener al menos 6 caracteres" : "Password must be at least 6 characters");
            return;
        }

        setIsSavingPassword(true);
        try {
            // @ts-ignore
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) {
                throw new Error(language === 'es' ? "Tu sesión ha expirado. Por favor inicia sesión nuevamente." : "Your session has expired. Please log in again.");
            }

            // @ts-ignore
            const { data, error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) throw error;

            if (data.user && data.user.aud === 'authenticated') {
                toast.success(language === 'es' ? "Contraseña actualizada exitosamente" : "Password updated successfully");
                setShowChangePassword(false);
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.info(language === 'es' ? "Revisa tu correo para confirmar el cambio." : "Check your email to confirm the change.");
            }
        } catch (error: any) {
            toast.error(error.message || "Error");
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Account Credentials */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{language === 'es' ? 'Credenciales de Acceso' : 'Access Credentials'}</h3>
                </div>

                <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors hover:bg-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-400">
                            <Mail size={20} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Email</p>
                            <p className="font-bold text-slate-900">{user.email || 'No email found'}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Password Management */}
            <section className="pt-8 border-t border-slate-100 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{language === 'es' ? 'Seguridad y Privacidad' : 'Security & Privacy'}</h3>
                </div>

                {!showChangePassword ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-all group">
                        <div className="space-y-1">
                            <p className="font-bold text-slate-900">{language === 'es' ? 'Contraseña' : 'Password'}</p>
                            <p className="text-xs text-slate-500">{language === 'es' ? 'Actualiza tu contraseña periódicamente por seguridad.' : 'Update your password periodically for security.'}</p>
                        </div>
                        <button
                            onClick={() => setShowChangePassword(true)}
                            className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
                        >
                            <Lock size={14} />
                            {language === 'es' ? 'Cambiar Contraseña' : 'Change Password'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 ml-1">{language === 'es' ? 'Nueva Contraseña' : 'New Password'}</label>
                                <div className="relative">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setPasswordError('');
                                        }}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button 
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 ml-1">{language === 'es' ? 'Confirmar Contraseña' : 'Confirm Password'}</label>
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setPasswordError('');
                                    }}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        
                        {passwordError && (
                            <p className="text-xs text-rose-500 font-bold bg-rose-50 p-3 rounded-lg border border-rose-100">{passwordError}</p>
                        )}
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleChangePassword}
                                disabled={isSavingPassword || !newPassword || !confirmPassword}
                                className="px-6 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 disabled:opacity-50 transition-all shadow-lg shadow-rose-200"
                            >
                                {isSavingPassword ? (language === 'es' ? 'Guardando...' : 'Saving...') : (language === 'es' ? 'Actualizar Contraseña' : 'Update Password')}
                            </button>
                            <button
                                onClick={() => {
                                    setShowChangePassword(false);
                                    setNewPassword('');
                                    setConfirmPassword('');
                                    setPasswordError('');
                                }}
                                className="px-6 py-2.5 text-slate-500 text-xs font-bold hover:text-slate-700 transition-all"
                            >
                                {language === 'es' ? 'Cancelar' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default SecuritySettings;
