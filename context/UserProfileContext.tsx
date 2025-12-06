import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile, AppLanguage } from '../types';
import { EMPTY_USER } from '../constants';
import { supabase } from '../services/supabaseClient';
import { fetchUserProfile, syncUserProfile } from '../services/userRepository';
import { toast } from 'sonner';
import { useAuth } from './UserContext';

interface UserProfileContextType {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
    isLoading: boolean;
    error: string | null;
    refreshProfile: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => void;
    setLanguage: (lang: AppLanguage) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user: authUser, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile>({ ...EMPTY_USER });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfileData = useCallback(async (userId: string) => {
        try {
            console.log("UserProfileProvider: Fetching profile for", userId);
            setIsLoading(true);
            let data = await fetchUserProfile(userId);

            console.log("UserProfileProvider: Initial fetch result:", data);

            if (!data) {
                // If profile doesn't exist yet, listen for its creation
                console.log("UserProfileProvider: Profile not found, listening for creation...");

                await new Promise<void>((resolve) => {
                    const channel = supabase
                        .channel(`public:profiles:id=eq.${userId}`)
                        .on(
                            'postgres_changes',
                            {
                                event: 'INSERT',
                                schema: 'public',
                                table: 'profiles',
                                filter: `id=eq.${userId}`
                            },
                            async (payload) => {
                                console.log("UserProfileProvider: Profile created event received!", payload);
                                data = payload.new as UserProfile;
                                supabase.removeChannel(channel);
                                resolve();
                            }
                        )
                        .subscribe();

                    // Safety timeout: stop waiting after 5 seconds to prevent infinite loading
                    setTimeout(() => {
                        console.log("UserProfileProvider: Profile creation timeout waiting for trigger");
                        supabase.removeChannel(channel);
                        resolve();
                    }, 5000);
                });

                // Double check if we didn't get data from payload (e.g. timeout)
                if (!data) {
                    console.log("UserProfileProvider: Re-attempting fetch after wait...");
                    data = await fetchUserProfile(userId);
                }
            }

            if (data) {
                console.log("UserProfileProvider: Profile loaded successfully:", data);
                setProfile(prev => ({ ...prev, ...data }));
                // Background sync
                if (authUser) {
                    syncUserProfile(authUser).catch(console.error);
                }
            } else {
                console.error("UserProfileProvider: Failed to load profile after waiting");
                // If we still don't have a profile, we should at least stop loading so the user can see the dashboard (even if empty)
                // This prevents the "Finalizando autenticación..." infinite loop
                setError("Failed to load profile");
            }
        } catch (err) {
            console.error("UserProfileProvider: Error fetching profile:", err);
            setError("Error fetching profile");
        } finally {
            console.log("UserProfileProvider: Finished loading profile state.");
            setIsLoading(false);
        }
    }, [authUser?.email]);

    useEffect(() => {
        if (authLoading) return;

        if (authUser?.id && !authUser.id.startsWith('mock-')) {
            fetchProfileData(authUser.id);
        } else if (authUser?.id && authUser.id.startsWith('mock-')) {
            // Mock user handling if needed, or just stop loading
            setIsLoading(false);
        } else {
            // No user, reset profile
            setProfile({ ...EMPTY_USER });
            setIsLoading(false);
        }
    }, [authUser?.id, authLoading, fetchProfileData]);

    const refreshProfile = async () => {
        if (authUser?.id) {
            await fetchProfileData(authUser.id);
        }
    };

    const updateProfile = (data: Partial<UserProfile>) => {
        setProfile(prev => ({ ...prev, ...data }));
    };

    const setLanguage = (lang: AppLanguage) => {
        setProfile(prev => ({ ...prev, language: lang }));
    };

    return (
        <UserProfileContext.Provider value={{
            profile,
            setProfile,
            isLoading,
            error,
            refreshProfile,
            updateProfile,
            setLanguage
        }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (context === undefined) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
};
