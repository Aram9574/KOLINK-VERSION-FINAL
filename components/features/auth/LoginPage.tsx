import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Lock, Mail } from "lucide-react";
import { supabase } from "../../../services/supabaseClient";
import { APP_DOMAIN } from "../../../constants";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { useUser } from "../../../context/UserContext";
import SocialLoginButtons from "./SocialLoginButtons";
import EmailAuthForm from "./EmailAuthForm";
import AuthVisuals from "./AuthVisuals";
import { Capacitor } from "@capacitor/core";

const LoginPage: React.FC = () => {
    const { language } = useUser();
    const navigate = useNavigate();
    const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedPolicy, setAcceptedPolicy] = useState(false);

    // Reset loading state if session is established or component re-mounts
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event) => {
                if (event === "SIGNED_IN" || event === "USER_UPDATED") {
                    setIsLoading(false);
                }
            },
        );

        // Safety timeout to prevent infinite loading state
        let timeout: NodeJS.Timeout;
        if (isLoading) {
            timeout = setTimeout(() => {
                setIsLoading(false);
            }, 10000); // 10 seconds safety
        }

        return () => {
            subscription.unsubscribe();
            if (timeout) clearTimeout(timeout);
        };
    }, [isLoading]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo:
                    `https://${APP_DOMAIN}/dashboard?reset_password=true`,
            });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success(
                    "Correo de recuperación enviado. Revisa tu bandeja de entrada.",
                );
                setIsForgotPasswordMode(false);
            }
        } catch (err) {
            console.error("Reset password error:", err);
            toast.error("Error al enviar el correo. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isLoginMode) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Navigation handled by App.tsx auth listener
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                        data: localStorage.getItem("kolink_referral_code")
                            ? {
                                referred_by: localStorage.getItem(
                                    "kolink_referral_code",
                                ),
                            }
                            : undefined,
                    },
                });
                if (error) throw error;
                toast.success("Cuenta creada. Por favor verifica tu correo.");
                setIsLoading(false);
            }
            setIsLoading(false);
        } catch (error: any) {
            console.error("Login Error:", error);
            let msg = error.message || "Error de autenticación";
            if (msg.includes("Failed to fetch")) {
                msg = language === "es" 
                    ? "Error de conexión. Verifica tu internet o si tienes un AdBlocker activo." 
                    : "Connection error. Check your internet or AdBlocker.";
            }
            toast.error(msg);
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: "google" | "linkedin_oidc") => {
        setIsLoading(true);
        try {
            const redirectTo = Capacitor.isNativePlatform()
                ? "com.aramzakzuk.kolink://login-callback"
                : `https://${APP_DOMAIN}/dashboard`;

            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            toast.error(error.message || `Error al iniciar con ${provider}`);
            setIsLoading(false);
        }
    };

    if (isForgotPasswordMode) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Helmet>
                    <title>
                        {language === "es"
                            ? "Recuperar Contraseña - Kolink"
                            : "Reset Password - Kolink"}
                    </title>
                </Helmet>
                <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 animate-in fade-in zoom-in duration-300">
                    <button
                        onClick={() => setIsForgotPasswordMode(false)}
                        className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        {language === "es"
                            ? "Volver al inicio de sesión"
                            : "Back to login"}
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-600">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            {language === "es"
                                ? "Recuperar Contraseña"
                                : "Reset Password"}
                        </h2>
                        <p className="text-slate-500 text-sm">
                            {language === "es"
                                ? "Ingresa tu correo y te enviaremos un enlace para restablecerla."
                                : "Enter your email and we will send you a reset link."}
                        </p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
                        >
                            {isLoading
                                ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )
                                : (
                                    <>
                                        {language === "es"
                                            ? "Enviar enlace"
                                            : "Send Link"}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            <Helmet>
                <title>
                    {isLoginMode
                        ? (language === "es"
                            ? "Iniciar Sesión - Kolink"
                            : "Login - Kolink")
                        : (language === "es"
                            ? "Crear Cuenta - Kolink"
                            : "Sign Up - Kolink")}
                </title>
            </Helmet>

            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 xl:p-24 bg-white relative z-10">
                <div className="max-w-md w-full mx-auto">
                    {/* Back to Home Button - Hidden on Mobile */}
                    {!Capacitor.isNativePlatform() && (
                        <Link
                            to="/"
                            className="inline-flex items-center text-slate-400 hover:text-brand-600 transition-colors mb-6 text-sm font-medium group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            {language === "es"
                                ? "Volver al inicio"
                                : "Back to Home"}
                        </Link>
                    )}

                    {/* Header */}
                    <div className="mb-10">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 font-display font-bold text-2xl text-slate-900 mb-8 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm shadow-md">
                                K
                            </div>
                            Kolink
                        </Link>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                            {isLoginMode
                                ? (language === "es"
                                    ? "Bienvenido de nuevo"
                                    : "Welcome back")
                                : (language === "es"
                                    ? "Comienza gratis"
                                    : "Get started for free")}
                        </h1>
                        <p className="text-slate-500 text-lg">
                            {isLoginMode
                                ? (language === "es"
                                    ? "Ingresa a tu estudio viral."
                                    : "Enter your viral studio.")
                                : (language === "es"
                                    ? "Únete a los creadores top 1%."
                                    : "Join the top 1% creators.")}
                        </p>
                    </div>

                    {/* Social Login */}
                    <SocialLoginButtons
                        language={language}
                        isLoading={isLoading}
                        onSocialLogin={handleSocialLogin}
                    />

                    <p className="text-center text-[10px] text-slate-400 mb-6">
                        {language === "es"
                            ? "Al continuar, aceptas nuestra política de tratamiento de datos."
                            : "By continuing, you agree to our data treatment policy."}
                    </p>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200/60/60">
                            </div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-400 font-medium">
                                {language === "es"
                                    ? "O continúa con email"
                                    : "Or continue with email"}
                            </span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <EmailAuthForm
                        language={language}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        isLoading={isLoading}
                        isLoginMode={isLoginMode}
                        setIsLoginMode={setIsLoginMode}
                        onForgotPassword={() => setIsForgotPasswordMode(true)}
                        onSubmit={handleAuth}
                        acceptedPolicy={acceptedPolicy}
                        setAcceptedPolicy={setAcceptedPolicy}
                    />
                </div>
            </div>

            {/* Right Side - Visual */}
            <AuthVisuals language={language} />
        </div>
    );
};

export default LoginPage;
