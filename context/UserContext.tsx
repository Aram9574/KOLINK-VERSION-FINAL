import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile, AppLanguage } from '../types';
import { EMPTY_USER, MARKETING_DOMAIN } from '../constants';
import { supabase } from '../services/supabaseClient';
import { fetchUserProfile, syncUserProfile } from '../services/userRepository';
import { useNavigate, useLocation } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';

// Unified User Context Interface
interface UserContextType {
    user: UserProfile;
    authUser: User | null;
    session: Session | null;
    loading: boolean;
    logout: () => Promise<void>;
    setUser: (data: Partial<UserProfile> | ((prev: UserProfile) => Partial<UserProfile>)) => void; // Legacy support
    updateProfile: (data: Partial<UserProfile>) => void;
    refreshUser: () => Promise<void>;
    setLanguage: (lang: AppLanguage) => void;
    language: AppLanguage;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Auth State
    const [session, setSession] = useState<Session | null>(null);
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Profile State
    const [profile, setProfile] = useState<UserProfile>({ ...EMPTY_USER });
    const [profileLoading, setProfileLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    // Domain Logic
    const hostname = window.location.hostname;
    const isMarketingDomain = hostname.includes(MARKETING_DOMAIN);

    // --- 1. Auth Logic ---
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setAuthUser(session?.user ?? null);
                setAuthLoading(false);
            } catch (error) {
                console.error("Error initializing auth:", error);
                setAuthLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state change:", event);
            setSession(session);
            setAuthUser(session?.user ?? null);
            setAuthLoading(false);

            if (event === 'SIGNED_IN') {
                if (!isMarketingDomain && (location.pathname === '/login' || location.pathname === '/')) {
                    navigate('/dashboard');
                }
            } else if (event === 'SIGNED_OUT') {
                navigate('/login');
                setProfile({ ...EMPTY_USER });
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate, isMarketingDomain]);

    // --- 2. Profile Logic ---
    const fetchProfileData = useCallback(async (userId: string) => {
        try {
            console.log("UserProvider: Fetching profile for", userId);
            setProfileLoading(true);
            let data = await fetchUserProfile(userId);

            if (!data) {
                // Wait for creation if new user
                await new Promise<void>((resolve) => {
                    const channel = supabase
                        .channel(`public:profiles:id=eq.\${userId}`)
                        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles', filter: `id=eq.\${userId}` },
                            async (payload) => {
                                data = payload.new as UserProfile;
                                supabase.removeChannel(channel);
                                resolve();
                            })
                        .subscribe();

                    setTimeout(() => {
                        supabase.removeChannel(channel);
                        resolve();
                    }, 5000);
                });
                if (!data) data = await fetchUserProfile(userId);
            }

            if (data) {
                setProfile(prev => ({ ...prev, ...data }));
                if (authUser) syncUserProfile(authUser).catch(console.error);
            }
        } catch (err) {
            console.error("UserProvider: Error fetching profile:", err);
        } finally {
            setProfileLoading(false);
        }
    }, [authUser]);

    useEffect(() => {
        if (authLoading) return;

        if (authUser?.id && !authUser.id.startsWith('mock-')) {
            fetchProfileData(authUser.id);
        } else {
            setProfile({ ...EMPTY_USER });
            setProfileLoading(false);
        }
    }, [authUser?.id, authLoading, fetchProfileData]);

    // --- 3. Actions ---
    const logout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setAuthUser(null);
        navigate('/login');
    };

    const updateProfile = (data: Partial<UserProfile>) => {
        setProfile(prev => ({ ...prev, ...data }));
    };

    const setUser = (data: Partial<UserProfile> | ((prev: UserProfile) => Partial<UserProfile>)) => {
        if (typeof data === 'function') {
            setProfile(prev => ({ ...prev, ...data(prev) }));
        } else {
            updateProfile(data);
        }
    };

    const refreshUser = async () => {
        if (authUser?.id) await fetchProfileData(authUser.id);
    };

    const setLanguage = (lang: AppLanguage) => {
        setProfile(prev => ({ ...prev, language: lang }));
    };

    // Construct the merged user object for backward compatibility
    // but preferred to use specific fields if possible.
    // The previous 'useUser' hook returned the merged object as 'user'.
    const mergedUser: UserProfile = {
        ...profile,
        id: authUser?.id || profile.id,
        email: authUser?.email || profile.email,
    };

    return (
        <UserContext.Provider value={{
            user: mergedUser,
            authUser,
            session,
            loading: authLoading || profileLoading,
            logout,
            setUser,
            updateProfile,
            refreshUser,
            setLanguage,
            language: profile.language
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Deprecated export (kept if needed for import compatibility, but changed to UserProvider)
export { UserProvider as AuthProvider };
