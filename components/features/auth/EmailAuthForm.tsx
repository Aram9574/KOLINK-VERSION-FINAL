import React, { useState } from "react";
import { Eye, EyeOff, Lock, LogIn, Mail, UserPlus } from "lucide-react";
import { AppLanguage } from "../../../types";

interface EmailAuthFormProps {
    language: AppLanguage;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    isLoading: boolean;
    isLoginMode: boolean;
    setIsLoginMode: (isLogin: boolean) => void;
    onForgotPassword: () => void;
    onSubmit: (e: React.FormEvent) => void;
    acceptedPolicy: boolean;
    setAcceptedPolicy: (val: boolean) => void;
}

const EmailAuthForm: React.FC<EmailAuthFormProps> = ({
    language,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isLoginMode,
    setIsLoginMode,
    onForgotPassword,
    onSubmit,
    acceptedPolicy,
    setAcceptedPolicy,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <>
            <form onSubmit={onSubmit} className="space-y-5">
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
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                            placeholder="tu@email.com"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-slate-700">
                            {language === "es" ? "Contraseña" : "Password"}
                        </label>
                        {isLoginMode && (
                            <button
                                type="button"
                                onClick={onForgotPassword}
                                className="text-sm font-medium text-brand-600 hover:text-brand-700"
                            >
                                {language === "es"
                                    ? "¿Olvidaste tu contraseña?"
                                    : "Forgot password?"}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        >
                            {showPassword
                                ? <EyeOff className="w-5 h-5" />
                                : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {!isLoginMode && (
                    <div className="flex items-start gap-3 select-none">
                        <div className="flex items-center h-5">
                            <input
                                id="policy"
                                type="checkbox"
                                checked={acceptedPolicy}
                                onChange={(e) =>
                                    setAcceptedPolicy(e.target.checked)}
                                className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500 cursor-pointer"
                            />
                        </div>
                        <label
                            htmlFor="policy"
                            className="text-xs text-slate-500 cursor-pointer"
                        >
                            {language === "es"
                                ? "He leído y acepto la "
                                : "I have read and accept the "}
                            <a
                                href="/privacidad"
                                target="_blank"
                                className="text-brand-600 font-bold hover:underline"
                            >
                                {language === "es"
                                    ? "Política de Tratamiento de Datos"
                                    : "Data Treatment Policy"}
                            </a>
                        </label>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || (!isLoginMode && !acceptedPolicy)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20"
                >
                    {isLoading
                        ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )
                        : (
                            <>
                                {isLoginMode
                                    ? (
                                        <>
                                            <LogIn className="w-4 h-4" />
                                            {language === "es"
                                                ? "Iniciar Sesión"
                                                : "Sign In"}
                                        </>
                                    )
                                    : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            {language === "es"
                                                ? "Crear Cuenta"
                                                : "Create Account"}
                                        </>
                                    )}
                            </>
                        )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-slate-600">
                    {isLoginMode
                        ? (language === "es"
                            ? "¿No tienes cuenta?"
                            : "Don't have an account?")
                        : (language === "es"
                            ? "¿Ya tienes cuenta?"
                            : "Already have an account?")}{" "}
                    <button
                        onClick={() => setIsLoginMode(!isLoginMode)}
                        className="font-bold text-brand-600 hover:text-brand-700 transition-colors"
                    >
                        {isLoginMode
                            ? (language === "es"
                                ? "Regístrate gratis"
                                : "Sign up for free")
                            : (language === "es" ? "Inicia sesión" : "Sign in")}
                    </button>
                </p>
            </div>
        </>
    );
};

export default EmailAuthForm;
