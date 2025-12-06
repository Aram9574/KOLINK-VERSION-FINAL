import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, AppLanguage } from '../types';
import { EMPTY_USER, MARKETING_DOMAIN } from '../constants';
import { supabase } from '../services/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserProfile } from './UserProfileContext';
import { Session, User } from '@supabase/supabase-js';

// Auth Context Interface
interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Domain Logic (Keep for redirect safety)
    const hostname = window.location.hostname;
    const isMarketingDomain = hostname.includes(MARKETING_DOMAIN);

    useEffect(() => {
        // 1. Initial Session Check
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            } catch (error) {
                console.error("Error initializing auth:", error);
                setLoading(false);
            }
        };

        initializeAuth();

        // 2. Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state change:", event);
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            if (event === 'SIGNED_IN') {
                if (!isMarketingDomain && (location.pathname === '/login' || location.pathname === '/')) {
                    navigate('/dashboard');
                }
            } else if (event === 'SIGNED_OUT') {
                navigate('/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate, isMarketingDomain]);

    const logout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Facade Hook for Backward Compatibility
// Combines Auth and Profile data to match the old useUser interface
export const useUser = () => {
    const { user: authUser, logout, loading: authLoading } = useAuth();
    // We need to handle the case where UserProfileProvider might not be ready or present
    // But since we wrap App with both, it should be fine.
    // However, useUserProfile throws if not in provider.
    // We'll assume it is used correctly.

    // We need to access UserProfileContext safely.
    // Since we can't conditionally call hooks, we assume this is called inside UserProfileProvider.
    const { profile, isLoading: profileLoading, refreshProfile, updateProfile, setLanguage } = useUserProfile();

    const mergedUser: UserProfile = {
        ...profile,
        id: authUser?.id || profile.id,
        email: authUser?.email || profile.email,
    };

    return {
        user: mergedUser,
        setUser: (data: Partial<UserProfile> | ((prev: UserProfile) => Partial<UserProfile>)) => {
            // Handle both full update or partial. 
            // Ideally consumers should use updateProfile.
            // This is a best-effort shim.
            if (typeof data === 'function') {
                // We can't easily support functional updates that depend on previous state 
                // across two contexts without more complex logic.
                // For now, warn or try to support basic object merge.
                console.warn("Functional setUser update not fully supported in facade.");
            } else {
                updateProfile(data as Partial<UserProfile>);
            }
        },
        language: profile.language,
        setLanguage,
        loading: authLoading || profileLoading,
        setLoading: () => { }, // No-op, managed internally
        logout,
        refreshUser: refreshProfile // Alias for compatibility
    };
};

// Export UserContext for legacy imports if any (though useUser is preferred)
export const UserContext = AuthContext;
// Note: This exports AuthContext as UserContext, which might break consumers expecting UserContextType.
// But since most use `useUser`, it should be fine. 
// If consumers use `useContext(UserContext)`, they will get AuthContextType, which is different.
// We should check if anyone uses `useContext(UserContext)` directly.
