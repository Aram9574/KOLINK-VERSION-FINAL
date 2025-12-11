import { supabase } from './supabaseClient';
import { UserProfile } from '../types';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        console.log(`Fetching profile for ${userId}...`);

        const fetchPromise = supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        const timeoutPromise = new Promise<{ data: null, error: any }>((_, reject) =>
            setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
        );

        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return {
            ...data,
            name: data.full_name || data.name || 'User',
            avatarUrl: data.avatar_url,
            credits: data.credits !== undefined ? data.credits : 0,
            headline: data.headline,
            industry: data.industry,
            position: data.position,
            brandVoice: data.brand_voice,
            companyName: data.company_name,
            planTier: data.plan_tier,
            cancelAtPeriodEnd: data.cancel_at_period_end,
            twoFactorEnabled: data.two_factor_enabled,
            securityNotifications: data.security_notifications,
            hasOnboarded: data.has_onboarded,
            xp: data.xp || 0,
            level: data.level || 1,
            currentStreak: data.current_streak || 0,
            lastPostDate: data.last_post_date ? new Date(data.last_post_date).getTime() : undefined,
            unlockedAchievements: data.unlocked_achievements || [],
            autoPilot: data.auto_pilot || { enabled: false, topics: [], frequency: 'daily' },
        } as unknown as UserProfile;
    } catch (err) {
        console.error("Exception in fetchUserProfile:", err);
        return null;
    }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
    const dbUpdates: any = { ...updates };

    if (updates.name !== undefined) {
        dbUpdates.full_name = updates.name;
        delete dbUpdates.name;
    }
    if (updates.brandVoice !== undefined) {
        dbUpdates.brand_voice = updates.brandVoice;
        delete dbUpdates.brandVoice;
    }
    if (updates.companyName !== undefined) {
        dbUpdates.company_name = updates.companyName;
        delete dbUpdates.companyName;
    }
    if (updates.planTier !== undefined) {
        dbUpdates.plan_tier = updates.planTier;
        delete dbUpdates.planTier;
    }
    if (updates.cancelAtPeriodEnd !== undefined) {
        dbUpdates.cancel_at_period_end = updates.cancelAtPeriodEnd;
        delete dbUpdates.cancelAtPeriodEnd;
    }
    if (updates.twoFactorEnabled !== undefined) {
        dbUpdates.two_factor_enabled = updates.twoFactorEnabled;
        delete dbUpdates.twoFactorEnabled;
    }
    if (updates.securityNotifications !== undefined) {
        dbUpdates.security_notifications = updates.securityNotifications;
        delete dbUpdates.securityNotifications;
    }
    if (updates.hasOnboarded !== undefined) {
        dbUpdates.has_onboarded = updates.hasOnboarded;
        delete dbUpdates.hasOnboarded;
    }
    if (updates.currentStreak !== undefined) {
        dbUpdates.current_streak = updates.currentStreak;
        delete dbUpdates.currentStreak;
    }
    if (updates.lastPostDate !== undefined) {
        dbUpdates.last_post_date = new Date(updates.lastPostDate).toISOString();
        delete dbUpdates.lastPostDate;
    }
    if (updates.unlockedAchievements !== undefined) {
        dbUpdates.unlocked_achievements = updates.unlockedAchievements;
        delete dbUpdates.unlockedAchievements;
    }
    const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId)
        .select();

    if (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
    console.log('Profile update success:', data);
};

export const deductUserCredit = async (userId: string): Promise<number> => {
    const { data, error } = await supabase.rpc('decrement_credit', { user_id: userId });

    if (error) {
        const { data: user, error: fetchError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (fetchError || !user) throw new Error('User not found');

        const newCredits = Math.max(0, user.credits - 1);

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits: newCredits })
            .eq('id', userId);

        if (updateError) throw updateError;
        return newCredits;
    }

    return data;
};

export const syncUserProfile = async (user: any) => {
    if (!user || !user.id) return;

    const metadata = user.user_metadata || {};

    const updates: any = {
        id: user.id,
        email: user.email,
        updated_at: new Date().toISOString(),
    };

    if (metadata.full_name || metadata.name) {
        updates.full_name = metadata.full_name || metadata.name;
    }
    if (metadata.avatar_url || metadata.picture) {
        updates.avatar_url = metadata.avatar_url || metadata.picture;
    }
    if (metadata.headline) updates.headline = metadata.headline;
    if (metadata.industry) updates.industry = metadata.industry;
    if (metadata.company) updates.company_name = metadata.company;
    if (metadata.position) updates.position = metadata.position;

    console.log('Syncing user profile from auth provider:', updates);

    const { error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });

    if (error) {
        console.error('Error syncing user profile:', error);
    }
};

import { BrandVoice } from '../types';

export const fetchBrandVoices = async (userId: string): Promise<BrandVoice[]> => {
    const { data, error } = await supabase
        .from('brand_voices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching brand voices:', error);
        return [];
    }

    // Map snake_case to camelCase
    return (data || []).map((v: any) => ({
        ...v,
        isActive: v.is_active
    }));
};

export const setBrandVoiceActive = async (userId: string, voiceId: string): Promise<void> => {
    // 1. Deactivate all for this user
    await supabase
        .from('brand_voices')
        .update({ is_active: false })
        .eq('user_id', userId);

    // 2. Activate the selected one
    const { error } = await supabase
        .from('brand_voices')
        .update({ is_active: true })
        .eq('id', voiceId);

    if (error) throw error;
};

export const createBrandVoice = async (userId: string, name: string, description: string): Promise<any> => {
    const { data, error } = await supabase
        .from('brand_voices')
        .insert([{ user_id: userId, name, description }])
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const updateBrandVoice = async (id: string, updates: { name?: string; description?: string }): Promise<any> => {
    const { data, error } = await supabase
        .from('brand_voices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const deleteBrandVoice = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('brand_voices')
        .delete()
        .eq('id', id);
    if (error) throw error;
};
