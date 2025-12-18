import React, { lazy, Suspense, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import { useUser } from "./context/UserContext";
import { useSessionTimeout } from "./hooks/useSessionTimeout";
import ProtectedRoute from "./components/features/auth/ProtectedRoute";

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

    // Initialize session timeout monitoring
    useSessionTimeout();

    const [isTimeout, setIsTimeout] = useState(false);

    // Safety timeout for loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                console.warn(
                    "MobileApp: Loading state timed out. Forcing render.",
                );
                setIsTimeout(true);
            }
        }, 8000);
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

    if (loading && !isTimeout) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin">
                    </div>
                    {/* Simplified Loading for Mobile */}
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-center" richColors />
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
