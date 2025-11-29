import { createClient } from '@supabase/supabase-js'
import { UserProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  // Map DB snake_case to frontend camelCase
  console.log('Fetched profile raw data:', data);
  return {
    ...data,
    name: data.full_name || data.name || 'User',
    brandVoice: data.brand_voice,
    companyName: data.company_name,
    planTier: data.plan_tier,
    cancelAtPeriodEnd: data.cancel_at_period_end,
    twoFactorEnabled: data.two_factor_enabled,
    securityNotifications: data.security_notifications,
    hasOnboarded: data.has_onboarded,
  } as unknown as UserProfile;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  // Map frontend camelCase to DB snake_case
  const dbUpdates: any = { ...updates };

  // Handle name mapping
  if (updates.name !== undefined) {
    dbUpdates.full_name = updates.name;
    delete dbUpdates.name;
  }

  // Handle brandVoice mapping
  if (updates.brandVoice !== undefined) {
    dbUpdates.brand_voice = updates.brandVoice;
    delete dbUpdates.brandVoice;
  }

  // Handle companyName mapping
  if (updates.companyName !== undefined) {
    dbUpdates.company_name = updates.companyName;
    delete dbUpdates.companyName;
  }

  // Handle planTier mapping
  if (updates.planTier !== undefined) {
    dbUpdates.plan_tier = updates.planTier;
    delete dbUpdates.planTier;
  }

  // Handle cancelAtPeriodEnd mapping
  if (updates.cancelAtPeriodEnd !== undefined) {
    dbUpdates.cancel_at_period_end = updates.cancelAtPeriodEnd;
    delete dbUpdates.cancelAtPeriodEnd;
  }

  // Handle twoFactorEnabled mapping
  if (updates.twoFactorEnabled !== undefined) {
    dbUpdates.two_factor_enabled = updates.twoFactorEnabled;
    delete dbUpdates.twoFactorEnabled;
  }

  // Handle securityNotifications mapping
  if (updates.securityNotifications !== undefined) {
    dbUpdates.security_notifications = updates.securityNotifications;
    delete dbUpdates.securityNotifications;
  }

  // Handle hasOnboarded mapping
  if (updates.hasOnboarded !== undefined) {
    dbUpdates.has_onboarded = updates.hasOnboarded;
    delete dbUpdates.hasOnboarded;
  }

  console.log('Updating profile for:', userId, 'with updates:', dbUpdates);

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
  // Try RPC first if it existed, otherwise manual update
  // Since we didn't create RPC, we fetch, decrement, update
  // Or better: update credits = credits - 1

  // However, to return the new value, we can use select()

  const { data, error } = await supabase.rpc('decrement_credit', { user_id: userId });

  if (error) {
    // Fallback to direct update if RPC missing (though not atomic)
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

  return data; // RPC returns new credits usually
};

export const fetchUserPosts = async (userId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data.map(post => ({
    id: post.id,
    content: post.content,
    params: post.params,
    createdAt: new Date(post.created_at).getTime(),
    likes: post.viral_score || 0,
    views: 0,
    isAutoPilot: false, // Default for now, or add column if needed
    viralScore: post.viral_score,
    viralAnalysis: post.viral_analysis
  }));
};