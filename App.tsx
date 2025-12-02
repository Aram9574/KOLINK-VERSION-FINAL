import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase, fetchUserProfile, syncUserProfile } from './services/supabaseClient';
import { UserProfile, AppLanguage } from './types';
import { MOCK_USER, EMPTY_USER, MARKETING_DOMAIN, APP_DOMAIN } from './constants';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import { Toaster, toast } from 'sonner';

const App: React.FC = () => {
    const [language, setLanguage] = useState<AppLanguage>('es');
    const [user, setUser] = useState<UserProfile>({
        ...EMPTY_USER,
        language: 'es'
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Domain Logic
    const hostname = window.location.hostname;
    const isMarketingDomain = hostname.includes(MARKETING_DOMAIN);

    useEffect(() => {
        // Check active session
        const checkSession = async () => {
            console.log("Checking session...");
            const { data: { session } } = await supabase.auth.getSession();
            console.log("Session check complete:", session ? "Found" : "None");

            if (session) {
                try {
                    console.log("Fetching profile...");
                    const profile = await fetchUserProfile(session.user.id);
                    console.log("Profile fetched:", profile ? "Found" : "Not Found");
                    if (profile) {
                        setUser(prev => ({ ...prev, ...profile }));
                        setLanguage(profile.language || 'es');
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            }

            // CRITICAL: If we have a hash with access_token, we are likely in an OAuth callback.
            // Do NOT turn off loading yet, let onAuthStateChange handle it to avoid race conditions.
            const isOAuthCallback = window.location.hash && window.location.hash.includes('access_token');
            if (!session && isOAuthCallback) {
                console.log("OAuth callback detected, waiting for onAuthStateChange...");
            } else {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state change:", event);
            if (session) {
                // 1. IMMEDIATE UPDATE: Allow access immediately using Auth data
                const metadata = session.user.user_metadata || {};
                setUser(prev => ({
                    ...prev,
                    id: session.user.id,
                    email: session.user.email,
                    // Optimistically set name/avatar from metadata to unblock Dashboard
                    name: metadata.full_name || metadata.name || prev.name || 'Creator',
                    avatarUrl: metadata.avatar_url || metadata.picture || prev.avatarUrl,
                }));

                // IMMEDIATE UNBLOCK: Stop loading and redirect NOW. 
                // Don't wait for profile fetch.
                setLoading(false);

                // ONLY redirect if NOT on marketing domain
                if (!isMarketingDomain && (location.pathname === '/login' || location.pathname === '/')) {
                    navigate('/dashboard');
                }

                // 2. Sync & Fetch Profile in Background
                // Always sync on session presence to ensure profile exists (e.g. after DB reset or hard refresh)
                await syncUserProfile(session.user).catch(console.error);

                fetchUserProfile(session.user.id)
                    .then(profile => {
                        if (profile) {
                            setUser(prev => ({ ...prev, ...profile }));
                            setLanguage(profile.language || 'es');
                        } else {
                            console.error("Profile missing for authenticated user. Logging out.");
                            handleLogout();
                        }
                    })
                    .catch(err => {
                        console.error("Error loading profile:", err);
                        // If error is critical, maybe logout? For now, keep session but log error.
                    });
            } else {
                // Reset to empty state on logout
                setUser({
                    ...EMPTY_USER,
                    language: 'es'
                });
                if (event === 'SIGNED_OUT') {
                    setLoading(false);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [location.pathname, isMarketingDomain]);

    // Keep user language in sync with app state
    useEffect(() => {
        if (user.language !== language) {
            setUser(prev => ({ ...prev, language }));
        }
    }, [language]);

    const handleLogout = async () => {
        // Optimistic logout: Clear state immediately so the router knows we are out
        setUser({ ...EMPTY_USER, language });

        await supabase.auth.signOut();
        localStorage.removeItem('kolink_history');
        localStorage.removeItem('kolink_device_id');
        navigate('/login');
    };

    // Protected Route wrapper
    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
        if (loading) {
            return (
                <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
                    <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Cargando tu estudio...</p>
                </div>
            );
        }

        // If user is not authenticated (using mock ID check as proxy for now, ideally check session)
        // But since we set MOCK_USER on logout, we need to check if it's a real user ID
        // Real Supabase IDs are UUIDs, Mock IDs start with 'mock-'
        if (!user.id || user.id.startsWith('mock-')) {
            return <Navigate to="/login" replace />;
        }
        return <>{children}</>;
    };

    // REMOVED: Global loading block that blocked the Landing Page
    // if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-50">Loading...</div>;

    // 1. Marketing Domain Logic (kolink.es)
    if (isMarketingDomain) {
        // CRITICAL: If we receive an OAuth callback here (e.g. Supabase redirected to Site URL instead of App Domain),
        // we must forward it to the App Domain so the session is established there.
        if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('error'))) {
            console.log("OAuth callback detected on Marketing Domain. Forwarding to App Domain...");
            window.location.href = `https://${APP_DOMAIN}/dashboard${window.location.hash}`;
            return null;
        }

        // Allow Legal Pages
        if (location.pathname === '/privacy') {
            return <PrivacyPolicy language={language} />;
        }
        if (location.pathname === '/terms') {
            return <TermsOfService language={language} />;
        }

        // Force Landing Page at root
        if (location.pathname === '/') {
            return (
                <>
                    <Toaster position="top-center" richColors />
                    <LandingPage language={language} setLanguage={setLanguage} user={user} />
                </>
            );
        }
        // Redirect any other path to App Domain
        window.location.href = `https://${APP_DOMAIN}${location.pathname}`;
        return null;
    }

    // 2. App Domain Logic (kolink-jade.vercel.app)
    return (
        <>
            <Toaster position="top-center" richColors />
            <Routes>
                {/* Redirect root to Login on App Domain */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={
                    // If user is logged in, redirect to dashboard
                    user.id && !user.id.startsWith('mock-') ? <Navigate to="/dashboard" replace /> :
                        <LoginPage language={language} />
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard
                            user={user}
                            setUser={setUser}
                            language={language}
                            setLanguage={setLanguage}
                            onLogout={handleLogout}
                        />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </>
    );
};

export default App;
