import React, { lazy, Suspense, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import { Toaster } from "sonner"; // Removed Sonner
import { useUser } from "./context/UserContext";
import { useSessionTimeout } from "./hooks/useSessionTimeout";
import ProtectedRoute from "./components/features/auth/ProtectedRoute";
import { useToast } from "./context/ToastContext";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { supabase } from "./services/supabaseClient";

// Lazy load components specific to Mobile Flow
const LoginPage = lazy(() => import("./components/features/auth/LoginPage"));
// IMPORTANT: Importing the MOBILE dashboard
const MobileDashboard = lazy(() =>
    import("./components/features/dashboard/MobileDashboard")
);

const OnboardingFlow = lazy(() =>
    import("./components/features/onboarding/OnboardingFlow")
);

const PrivacyPolicy = lazy(() => import("./components/landing/PrivacyPolicy"));
const TermsOfService = lazy(() =>
    import("./components/landing/TermsOfService")
);
const CookiesPage = lazy(() => import("./components/landing/CookiesPage"));

const MobileApp: React.FC = () => {
    const { user, language, loading } = useUser();
    const toast = useToast();

    // Initialize session timeout monitoring
    useSessionTimeout();

    const [isTimeout, setIsTimeout] = useState(false);

    // Safety timeout for loading state - reduced for better perception
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                console.warn(
                    "MobileApp: Loading state timed out. Forcing render.",
                );
                setIsTimeout(true);
            }
        }, 5000); // Reduced to 5s
        return () => clearTimeout(timer);
    }, [loading]);

    // Capture referral code from URL/DeepLink
    useEffect(() => {
        // Simple check for now, deep links might need more logic later
        const params = new URLSearchParams(window.location.search);
        const refCode = params.get("ref");
        if (refCode) {
            localStorage.setItem("kolink_referral_code", refCode);
        }
    }, []);

    // Handle Mobile Auth Logic (Deep Links)
    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        const handleAuthURL = async (urlString: string) => {
            console.log("Processing Auth URL:", urlString);
            try {
                const url = new URL(urlString);
                const hash = url.hash.substring(1);
                const search = url.search.substring(1);
                const params = new URLSearchParams(hash || search);

                const access_token = params.get("access_token");
                const refresh_token = params.get("refresh_token");
                const provider_token = params.get("provider_token");
                const code = params.get("code");

                if (provider_token) {
                    console.log("Found provider_token in URL, storing...");
                    localStorage.setItem("linkedin_provider_token", provider_token);
                }

                if (access_token && refresh_token) {
                    toast.info("Iniciando sesión...", "Conectando");
                    console.log(
                        "Direct tokens found. Has access_token:",
                        !!access_token,
                        "Has provider_token (URL):",
                        !!provider_token,
                    );

                    // @ts-ignore
                    const { error } = await supabase.auth.setSession({
                        access_token,
                        refresh_token,
                    });
                    if (error) throw error;
                    toast.success("¡Sesión iniciada!", "Bienvenido");
                } else if (code) {
                    toast.info("Canjeando código de acceso...", "Procesando");
                    const { data, error } = await supabase.auth
                        // @ts-ignore
                        .exchangeCodeForSession(code);
                    if (error) throw error;

                    // Capture provider_token from exchange if available
                    if (data?.session?.provider_token) {
                        console.log(
                            "Found provider_token in code exchange, storing...",
                        );
                        localStorage.setItem(
                            "linkedin_provider_token",
                            data.session.provider_token,
                        );
                    }

                    toast.success("¡Acceso verificado!", "Listo");
                }
            } catch (e: any) {
                console.error("Auth URL Error:", e);
                toast.error(
                    "Error en la autenticación: " + (e.message || "URL no válida"), "Error"
                );
            }
        };

        const appUrlOpenListener = CapacitorApp.addListener("appUrlOpen", async (data: any) => {
             handleAuthURL(data.url);
        });

        CapacitorApp.getLaunchUrl().then((data) => {
            if (data?.url) {
                handleAuthURL(data.url);
            }
        });

        return () => {
            appUrlOpenListener.then(listener => listener.remove());
        };

    }, []); // Run once on mount

    if (loading && !isTimeout) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-8 animate-in fade-in duration-700">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-500/20 rotate-12">
                            <span className="text-3xl font-display font-bold text-white -rotate-12">
                                K
                            </span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-amber-400 rounded-full border-4 border-white animate-pulse">
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">
                            KOLINK
                        </h2>
                        <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-600 rounded-full animate-loading-bar w-1/3">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Routes>
                {
                    /*
                 MOBILE ROUTING RULES:
                 1. No Landing Page -> Redirect root to Login
                */
                }
                <Route
                    path="/"
                    element={user.id && !user.id.startsWith("mock-")
                        ? <Navigate to="/dashboard" replace />
                        : <Navigate to="/login" replace />}
                />

                <Route
                    path="/login"
                    element={user.id && !user.id.startsWith("mock-")
                        ? <Navigate to="/dashboard" replace />
                        : <LoginPage />}
                />

                {/* Terms & Privacy are still needed for App Store review compliance */}
                <Route
                    path="/privacy"
                    element={<PrivacyPolicy language={language} />}
                />
                <Route
                    path="/terms"
                    element={<TermsOfService language={language} />}
                />
                <Route
                    path="/cookies"
                    element={<CookiesPage language={language} />}
                />

                {/* Protected Routes - Loads MobileDashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <MobileDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default MobileApp;
