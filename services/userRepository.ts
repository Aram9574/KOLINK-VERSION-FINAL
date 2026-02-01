import { supabase } from './supabaseClient';
import { UserProfile } from '../types';
import { fetchActiveSubscription } from './subscriptionRepository';
import { Database } from '../types/supabase';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        console.log(`Fetching profile for ${userId}...`);

        const fetchProfilePromise = supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        const fetchSubPromise = fetchActiveSubscription(userId);

        const timeoutPromise = new Promise<{ data: null, error: any }>((_, reject) =>
            setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
        );

        const [profileResult, subscription] = await Promise.all([
            Promise.race([fetchProfilePromise, timeoutPromise]),
            fetchSubPromise
        ]);

        const { data, error } = profileResult as { data: Database['public']['Tables']['profiles']['Row'] | null, error: any };

        if (error || !data) {
            console.error('Error fetching profile:', error || 'No data');
            return null;
        }

        // Determine effective plan tier from subscription table (source of truth)
        // If no active subscription found, fallback to database plan_tier
        const effectivePlanTier = subscription?.plan_type || data.plan_tier || 'free';
        const isPremium = effectivePlanTier === 'pro' || effectivePlanTier === 'viral';

        return {
            ...data,
            name: data.full_name || 'User',
            avatarUrl: data.avatar_url || '',
            credits: data.credits ?? 0,
            headline: data.headline || '',
            industry: data.industry || '',
            position: data.position || '',
            brandVoice: data.active_voice_id || undefined,
            companyName: data.company_name || '',
            
            // Subscription overrides
            planTier: (effectivePlanTier as any), // Cast to PlanTier enum
            subscriptionId: subscription?.id || data.subscription_id || undefined,
            cancelAtPeriodEnd: subscription?.status === 'canceled', // Check subscription status
            stripeCustomerId: subscription?.stripe_customer_id || data.stripe_customer_id || undefined,
            nextBillingDate: subscription?.reset_date ? new Date(subscription.reset_date).getTime() : undefined,

            twoFactorEnabled: data.two_factor_enabled ?? undefined,
            securityNotifications: data.security_notifications ?? undefined,
            hasOnboarded: data.has_onboarded ?? undefined,
            xp: data.xp ?? 0,
            level: data.level ?? 1,
            currentStreak: data.current_streak ?? 0,
            lastPostDate: data.last_post_date ? new Date(data.last_post_date).getTime() : null,
            unlockedAchievements: data.unlocked_achievements || [],
            autoPilot: data.auto_pilot as any || { enabled: false, topics: [], frequency: 'daily' },
            isPremium: isPremium,
            totalGenerations: data.total_generations ?? 0,
            lastAhaMomentAt: data.last_aha_moment_at ? new Date(data.last_aha_moment_at).getTime() : undefined,
        };
    } catch (err) {
        console.error("Exception in fetchUserProfile:", err);
        return null;
    }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
    const dbUpdates: Database['public']['Tables']['profiles']['Update'] = {};

    if (updates.name !== undefined) dbUpdates.full_name = updates.name;
    if (updates.brandVoice !== undefined) dbUpdates.active_voice_id = updates.brandVoice;
    if (updates.companyName !== undefined) dbUpdates.company_name = updates.companyName;
    if (updates.planTier !== undefined) dbUpdates.plan_tier = updates.planTier;
    // Note: cancel_at_period_end is handled in subscription repository
    if (updates.twoFactorEnabled !== undefined) dbUpdates.two_factor_enabled = updates.twoFactorEnabled;
    if (updates.securityNotifications !== undefined) dbUpdates.security_notifications = updates.securityNotifications;
    if (updates.hasOnboarded !== undefined) dbUpdates.has_onboarded = updates.hasOnboarded;
    if (updates.currentStreak !== undefined) dbUpdates.current_streak = updates.currentStreak;
    if (updates.lastPostDate !== undefined) {
        dbUpdates.last_post_date = updates.lastPostDate ? new Date(updates.lastPostDate).toISOString() : null;
    }
    if (updates.unlockedAchievements !== undefined) dbUpdates.unlocked_achievements = updates.unlockedAchievements;
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
    if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
    if (updates.level !== undefined) dbUpdates.level = updates.level;
    if (updates.headline !== undefined) dbUpdates.headline = updates.headline;
    if (updates.industry !== undefined) dbUpdates.industry = updates.industry;
    if (updates.position !== undefined) dbUpdates.position = updates.position;
    if (updates.language !== undefined) dbUpdates.language = updates.language;
    if (updates.totalGenerations !== undefined) dbUpdates.total_generations = updates.totalGenerations;
    if (updates.lastAhaMomentAt !== undefined) {
        dbUpdates.last_aha_moment_at = updates.lastAhaMomentAt ? new Date(updates.lastAhaMomentAt).toISOString() : null;
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
    const { data, error } = await supabase.rpc('decrement_credit', { target_user_id: userId });

    if (error) {
        const { data: user, error: fetchError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (fetchError || !user) throw new Error('User not found');

        const newCredits = Math.max(0, (user.credits ?? 0) - 1);

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits: newCredits })
            .eq('id', userId);

        if (updateError) throw updateError;
        return newCredits;
    }

    // Increment total generations for lifecycle tracking
    await supabase.rpc('increment_total_generations', { target_user_id: userId });

    return data ?? 0;
};

export const syncUserProfile = async (user: { id: string; email?: string; user_metadata?: any }) => {
    if (!user || !user.id) return;

    const metadata = user.user_metadata || {};

    const updates: Database['public']['Tables']['profiles']['Insert'] = {
        id: user.id,
        email: user.email || '',
        updated_at: new Date().toISOString(),
        xp: 150, // Endowed Progress EFFECT: Start with 150 XP instead of 0
        level: 1,
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

// Brand voice functions moved to voiceRepository.ts
