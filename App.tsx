import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase, fetchUserProfile } from './services/supabaseClient';
import { UserProfile, AppLanguage } from './types';
import { MOCK_USER, MARKETING_DOMAIN, APP_DOMAIN } from './constants';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import { Toaster } from 'sonner';

const App: React.FC = () => {
    const [language, setLanguage] = useState<AppLanguage>('es');
    const [user, setUser] = useState<UserProfile>({
        ...MOCK_USER,
        language: 'es'
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session) {
                try {
                    const profile = await fetchUserProfile(session.user.id);
                    if (profile) {
                        setUser(prev => ({ ...prev, ...profile }));
                        setLanguage(profile.language || 'es');
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchUserProfile(session.user.id).then(profile => {
                    if (profile) {
                        setUser(prev => ({ ...prev, ...profile }));
                        setLanguage(profile.language || 'es');
                    }
                });
            } else {
                // Reset to mock/initial state on logout
                setUser({
                    ...MOCK_USER,
                    language: 'es'
                });
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Keep user language in sync with app state
    useEffect(() => {
        if (user.language !== language) {
            setUser(prev => ({ ...prev, language }));
        }
    }, [language]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('kolink_history');
        localStorage.removeItem('kolink_device_id');
        navigate('/');
    };

    // Protected Route wrapper
    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
        if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-50">Loading...</div>;

        // If user is not authenticated (using mock ID check as proxy for now, ideally check session)
        // But since we set MOCK_USER on logout, we need to check if it's a real user ID
        // Real Supabase IDs are UUIDs, Mock IDs start with 'mock-'
        if (!user.id || user.id.startsWith('mock-')) {
            return <Navigate to="/login" replace />;
        }
        return <>{children}</>;
    };

    if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-50">Loading...</div>;

    // Domain-based Routing Logic
    const hostname = window.location.hostname;
    const isMarketingDomain = hostname.includes(MARKETING_DOMAIN);
    const isAppDomain = hostname.includes(APP_DOMAIN) || hostname.includes('localhost'); // Treat localhost as app domain for dev

    // 1. Marketing Domain Logic (kolink.es)
    if (isMarketingDomain) {
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
