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
            // CRITICAL: If we have a hash with access_token OR a code query param (PKCE), we are in an OAuth callback.
            const isOAuthCallback = (window.location.hash && window.location.hash.includes('access_token')) ||
                (window.location.search && window.location.search.includes('code='));

            let session = null;

            // If NOT in OAuth callback, try to get session normally.
            // If IN OAuth callback, skip initial getSession to avoid race/hang, and let the listener/poller handle it.
            if (!isOAuthCallback) {
                console.log("Checking session (Standard)...");
                // Add a small timeout to getSession so it doesn't hang forever
                const sessionPromise = supabase.auth.getSession();
                const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) => setTimeout(() => resolve({ data: { session: null } }), 2000));

                const { data } = await Promise.race([sessionPromise, timeoutPromise]);
                session = data.session;
                console.log("Session check complete:", session ? "Found" : "None/Timeout");
            } else {
                console.log("OAuth callback detected. Skipping initial getSession to prevent hang.");
            }

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



            if (!session && isOAuthCallback) {
                console.log("OAuth callback detected (Hash or PKCE), waiting for onAuthStateChange...");
                // MANUAL RECOVERY: Poll for session
                let attempts = 0;
                const recoveryInterval = setInterval(async () => {
                    attempts++;
                    console.log(`OAuth Recovery Attempt ${attempts}...`);
                    const { data: { session: recoverySession } } = await supabase.auth.getSession();

                    if (recoverySession) {
                        console.log("Recovered session via polling! Updating state immediately.");
                        clearInterval(recoveryInterval);

                        // FORCE STATE UPDATE
                        const metadata = recoverySession.user.user_metadata || {};
                        setUser(prev => ({
                            ...prev,
                            id: recoverySession.user.id,
                            email: recoverySession.user.email,
                            name: metadata.full_name || metadata.name || prev.name || 'Creator',
                            avatarUrl: metadata.avatar_url || metadata.picture || prev.avatarUrl,
                        }));
                        setLoading(false);

                        // Sync profile in background
                        fetchUserProfile(recoverySession.user.id).then(profile => {
                            if (profile) setUser(prev => ({ ...prev, ...profile }));
                        });
                    }
                    if (attempts > 10) clearInterval(recoveryInterval);
                }, 1000);
            } else {
                // If we have a session, or if we are NOT in an OAuth flow, stop loading.
                // If session exists, we already fetched profile above.
                setLoading(false);
            }
        };

        checkSession();

        // SAFETY TIMEOUT: Force stop loading after 8 seconds.
        // We avoid await here to prevent hanging if Supabase is unresponsive.
        const safetyTimeout = setTimeout(async () => {
            console.warn("Loading state timed out. Checking session one last time...");
            const { data: { session: timeoutSession } } = await supabase.auth.getSession();

            if (timeoutSession) {
                console.log("Session found during timeout check. Recovering...");
                const metadata = timeoutSession.user.user_metadata || {};
                setUser(prev => ({
                    ...prev,
                    id: timeoutSession.user.id,
                    email: timeoutSession.user.email,
                    name: metadata.full_name || metadata.name || prev.name || 'Creator',
                    avatarUrl: metadata.avatar_url || metadata.picture || prev.avatarUrl,
                }));
                setLoading(false);
            } else {
                setLoading(prev => {
                    if (prev) {
                        console.warn("Loading state timed out. Forcing render.");
                        return false;
                    }
                    return prev;
                });
            }
        }, 8000);

        return () => clearTimeout(safetyTimeout);
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
    }, []); // CRITICAL: Empty dependency array to ensure listener survives URL changes (hash removal)

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
