
import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, ArrowRight, UserPlus, LogIn, Linkedin } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { MARKETING_DOMAIN, APP_DOMAIN } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

interface LoginPageProps {
    language: 'es' | 'en';
}

// Simple Google Logo Component for brand accuracy
const GoogleLogo = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const LoginPage: React.FC<LoginPageProps> = ({ language }) => {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between Login and SignUp
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 🟢 API INTEGRATION POINT: EMAIL/PASSWORD
            let result;

            // Helper to add timeout to promises
            const withTimeout = (promise: Promise<any>, ms: number = 15000) => {
                return Promise.race([
                    promise,
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("La solicitud tardó demasiado. Por favor verifica tu conexión.")), ms)
                    )
                ]);
            };

            if (isLoginMode) {
                result = await withTimeout(supabase.auth.signInWithPassword({
                    email,
                    password
                }));
            } else {
                result = await withTimeout(supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: email.split('@')[0], // Default name
                            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
                        }
                    }
                }));
            }

            const { data, error } = result;

            if (error) {
                toast.error(error.message);
            } else {
                if (isLoginMode) {
                    toast.success("¡Bienvenido de nuevo!");
                    // Navigation handled by App.tsx auth listener
                } else {
                    if (data.session) {
                        toast.success("¡Cuenta creada exitosamente!");
                    } else {
                        toast.info("Revisa tu email para confirmar tu cuenta.");
                    }
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error("Ocurrió un error inesperado. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'linkedin') => {
        setIsLoading(true);
        console.log(`Initiating ${provider} login...`);

        // 🟢 API INTEGRATION POINT: SOCIAL OAUTH
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider === 'linkedin' ? 'linkedin_oidc' : provider,
            options: {
                redirectTo: `https://${APP_DOMAIN}/dashboard`
            }
        });

        if (error) {
            setIsLoading(false);
            toast.error(error.message);
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setEmail('');
        setPassword('');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
            <Helmet>
                <title>{isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta'} - Kolink</title>
                <meta name="description" content="Accede a Kolink para crear contenido viral para LinkedIn." />
            </Helmet>
            {/* Back Button */}
            {/* Back Button */}
            <a
                href={`https://${MARKETING_DOMAIN}`}
                className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Volver al Inicio
            </a>

            <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold font-display text-xl shadow-lg shadow-brand-500/30">
                            K
                        </div>
                        <span className="font-display font-bold text-3xl text-slate-900 tracking-tight">Kolink</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {isLoginMode ? "Bienvenido de nuevo" : "Crea tu cuenta"}
                    </h2>
                    <p className="text-slate-500">
                        {isLoginMode ? "Ingresa tus datos para acceder a tu estudio." : "Comienza tu viaje viral hoy."}
                    </p>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => handleSocialLogin('google')}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700 text-sm disabled:opacity-50"
                    >
                        <GoogleLogo />
                        Google
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSocialLogin('linkedin')}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl hover:bg-[#0077b5]/5 hover:border-[#0077b5]/30 transition-colors font-medium text-[#0077b5] text-sm disabled:opacity-50"
                    >
                        <Linkedin className="w-5 h-5 fill-current" />
                        LinkedIn
                    </button>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-400 font-medium">O continúa con email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-medium"
                                placeholder="tu@empresa.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                {isLoginMode ? "Iniciar Sesión" : "Crear Cuenta"}
                                {isLoginMode ? <LogIn className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                        {isLoginMode ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                        <button onClick={toggleMode} className="text-brand-600 font-bold hover:underline">
                            {isLoginMode ? "Crea una" : "Inicia sesión"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
