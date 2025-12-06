import React from 'react';
import { UserProfile, AppLanguage } from '../types';
import { updateUserProfile } from '../services/userRepository';

interface UseUserSyncProps {
    user: UserProfile;
    setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
    language: AppLanguage;
    setLanguage: (lang: AppLanguage) => void;
}

export const useUserSync = ({ user, setUser, language, setLanguage }: UseUserSyncProps) => {
    const handleUpdateUser = async (updates: Partial<UserProfile>) => {
        if (updates.language && updates.language !== language) {
            setLanguage(updates.language);
        }
        setUser(prev => ({ ...prev, ...updates }));
        try {
            await updateUserProfile(user.id, updates);
        } catch (e) {
            console.error("Background update failed", e);
        }
    };

    return { handleUpdateUser };
};
