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

// Lazy load components for better performance
const LandingPage = lazy(() => import("./components/landing/LandingPage"));
const LoginPage = lazy(() => import("./components/features/auth/LoginPage"));
const Dashboard = lazy(() =>
    import("./components/features/dashboard/Dashboard")
);
const CarouselStudio = lazy(() =>
    import("./components/features/generation/CarouselStudio")
);
const OnboardingFlow = lazy(() =>
    import("./components/features/onboarding/OnboardingFlow")
);
const UpgradeModal = lazy(() => import("./components/modals/UpgradeModal"));
const CancellationModal = lazy(() =>
    import("./components/modals/CancellationModal")
);
// AutoPilotView is still in root or needs move. Assuming root for now or next move.
// Ideally should be features/autopilot. Let's fix App.tsx assuming I will move it next.
// Or wait, I haven't moved it yet. I will leave it as is or move it now?
// I will move it now to avoid breaking.
const AutoPostView = lazy(() =>
    import("./components/features/autopost/AutoPostView")
);

const PrivacyPolicy = lazy(() => import("./components/landing/PrivacyPolicy"));
const TermsOfService = lazy(() =>
    import("./components/landing/TermsOfService")
);
const CookiesPage = lazy(() => import("./components/landing/CookiesPage"));
const AuthCallback = lazy(() => import("./components/features/auth/AuthCallback"));
const InfiniteGridDemo = lazy(() => import("./demo"));

const App: React.FC = () => {
    const { user, language, loading } = useUser();

    // Initialize session timeout monitoring
    useSessionTimeout();

    const [isTimeout, setIsTimeout] = useState(false);

    // Safety timeout for loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                console.warn("App: Loading state timed out. Forcing render.");
                setIsTimeout(true);
            }
        }, 8000); // 8 seconds max wait
        return () => clearTimeout(timer);
    }, [loading]);

    // Capture referral code from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const refCode = params.get("ref");
        if (refCode) {
            localStorage.setItem("kolink_referral_code", refCode);
            // Optional: Remove query param to clean URL
            // window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    if (loading && !isTimeout) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin">
                    </div>
                    <p className="text-slate-500 font-medium animate-pulse">
                        {language === "es"
                            ? "Cargando experiencia..."
                            : "Loading experience..."}
                    </p>
                    {/* Show a message if it's taking too long */}
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-center" richColors />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    element={
                        // If user is logged in, redirect to dashboard
                        user.id && !user.id.startsWith("mock-")
                            ? <Navigate to="/dashboard" replace />
                            : <LoginPage />
                    }
                />
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
                <Route
                    path="/auth/callback"
                    element={<AuthCallback />}
                />
                
                {/* Demo Routes */}
                <Route path="/grid-demo" element={<InfiniteGridDemo />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default App;
