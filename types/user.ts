export type PlanTier = "free" | "pro" | "viral";

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  price: number;
  description: string;
  credits: number; // -1 for unlimited
  features: string[];
  highlight?: boolean;
  stripePriceId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // key for lucide icon
  xpReward: number;
}

export interface BehavioralDNA {
    archetype: string;
    dominant_tone: string;
    peak_hours: string[];
    preferred_formats: string[];
    last_updated: string | null;
    personality_traits: string[];
    behavioral_summary?: string;
}

export interface AutoPilotConfig {
  enabled: boolean;
  frequency: "daily" | "weekly" | "biweekly" | "custom";
  days?: number[]; // 0=Sun, 1=Mon, etc. (Used for 'custom' frequency)
  time?: string; // HH:mm format (24h)
  nextRun: number; // Timestamp
  topics: string[]; // List of keywords to rotate
  tone: string; // Refined to string to avoid circular dependency with ViralTone if needed
  targetAudience: string;
  postCount: number; // Number of posts to generate per run
}

export interface UserProfile {
  id: string;
  email?: string;
  name: string;
  headline: string;
  avatarUrl: string;
  credits: number;
  maxCredits?: number;
  isPremium: boolean;
  planTier: PlanTier;
  nextBillingDate?: number;
  cancelAtPeriodEnd?: boolean;
  hasOnboarded?: boolean;
  stripeCustomerId?: string;
  subscriptionId?: string;
  brandVoice?: string;
  brand_colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  companyName?: string;
  industry?: string;
  position?: string;
  language: "en" | "es";
  twoFactorEnabled?: boolean;
  securityNotifications?: boolean;
  referredBy?: string;
  xp: number;
  level: number;
  currentStreak: number;
  lastPostDate: number | null;
  unlockedAchievements: string[];
  autoPilot?: AutoPilotConfig;
  created_at?: string;
  scheduled_for_deletion?: boolean;
  deletion_date?: string;
  behavioral_dna?: BehavioralDNA;
}

export interface UserSubscription {
    id: string;
    user_id: string;
    plan_type: PlanTier;
    status: "active" | "canceled" | "past_due" | "incomplete";
    billing_cycle: "mensual" | "anual";
    price: number;
    credits_limit: number;
    reset_date: string;
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
    canceled_at?: string;
    created_at: string;
    updated_at: string;
}

export interface ExpertiseProfile {
  archetype: string;
  keywords: string[];
  negativeKeywords: string[];
  bioSummary?: string;
}
