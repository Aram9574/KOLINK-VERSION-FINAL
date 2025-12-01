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
    avatarUrl: data.avatar_url,
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

  // Handle Gamification Fields
  if (updates.currentStreak !== undefined) {
    dbUpdates.current_streak = updates.currentStreak;
    delete dbUpdates.currentStreak;
  }

  if (updates.lastPostDate !== undefined) {
    // Convert number timestamp to ISO string for DB
    dbUpdates.last_post_date = new Date(updates.lastPostDate).toISOString();
    delete dbUpdates.lastPostDate;
  }

  if (updates.unlockedAchievements !== undefined) {
    dbUpdates.unlocked_achievements = updates.unlockedAchievements;
    delete dbUpdates.unlockedAchievements;
  }

  if (updates.autoPilot !== undefined) {
    dbUpdates.auto_pilot = updates.autoPilot;
    delete dbUpdates.autoPilot;
  }

  // xp and level match DB names (if we ignore case, but let's be safe)
  // DB is lowercase, JS is lowercase. No mapping needed for 'xp' and 'level' 
  // IF they are passed as 'xp' and 'level'.
  // Let's verify UserProfile interface.

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

export const syncUserProfile = async (user: any) => {
  if (!user || !user.id) return;

  const metadata = user.user_metadata || {};

  // Map LinkedIn OIDC data to our schema
  // LinkedIn OIDC provides: name, picture, email, sub (id)
  const updates: any = {
    id: user.id,
    email: user.email,
    updated_at: new Date().toISOString(),
  };

  // Only update fields if they exist in metadata to avoid overwriting with null
  if (metadata.full_name || metadata.name) {
    updates.full_name = metadata.full_name || metadata.name;
  }

  if (metadata.avatar_url || metadata.picture) {
    updates.avatar_url = metadata.avatar_url || metadata.picture;
  }

  // Map extended LinkedIn fields
  if (metadata.headline) updates.headline = metadata.headline;
  if (metadata.industry) updates.industry = metadata.industry;
  if (metadata.company) updates.company_name = metadata.company;
  if (metadata.position) updates.position = metadata.position;
  if (metadata.iss && metadata.sub) {
    // Construct public profile URL if possible, or store ID
    // updates.linkedin_url = ... (OIDC often doesn't give public URL directly)
  }

  // If it's a new user (we can check if created_at is very recent, or just upsert)
  // We'll just upsert. If they already exist, we update their info.

  console.log('Syncing user profile from auth provider:', updates);

  const { error } = await supabase
    .from('profiles')
    .upsert(updates, { onConflict: 'id' });

  if (error) {
    console.error('Error syncing user profile:', error);
  }
};