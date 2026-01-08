export enum ViralTone {
  PROFESSIONAL = "Professional",
  CONTROVERSIAL = "Controversial",
  EMPATHETIC = "Empathetic",
  EDUCATIONAL = "Educational",
  HUMOROUS = "Humorous",
  STORYTELLING = "Storytelling",
  INSPIRATIONAL = "Inspirational",
  PROMOTIONAL = "Promotional",
}

export enum ViralFramework {
  STANDARD = "STANDARD",
  LISTICLE = "LISTICLE",
  STORY = "STORY",
  CASE_STUDY = "CASE_STUDY",
  CONTRARIAN = "CONTRARIAN",
  VS_COMPARISON = "VS_COMPARISON",
  PAS = "PAS",
  AIDA = "AIDA",
  BAB = "BAB",
}

export enum EmojiDensity {
  MINIMAL = "MINIMAL",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
}

export enum PostLength {
  SHORT = "SHORT",
  MEDIUM = "MEDIUM",
  LONG = "LONG",
}

export type ViralHook =
  | "auto"
  | "question"
  | "statistic"
  | "negative"
  | "story"
  | "assertion";

export interface GenerationParams {
  topic: string;
  audience: string;
  tone: ViralTone | "random";
  framework: ViralFramework | "random";
  length: PostLength | "random";
  creativityLevel: number; // 0 to 100
  emojiDensity: EmojiDensity | "random";
  hashtagCount: number; // 0 to 5 (SEO Optimized)
  includeCTA: boolean;
  hookStyle?: ViralHook | "random";
  brandVoiceId?: string;
  outputLanguage?: "en" | "es";
  generateCarousel?: boolean; // Intent to generate carousel after post
}

export interface ViralAnalysis {
  hookScore: number; // 0-100
  readabilityScore: number; // 0-100
  valueScore: number; // 0-100
  feedback: string; // Specific tip to improve
}

export interface Post {
  id: string;
  content: string;
  params: GenerationParams;
  createdAt: number;
  likes: number; // Simulated viral score
  views: number; // Simulated reach
  isAutoPilot?: boolean; // New flag for automated posts
  viralScore?: number; // 0-100 (Calculated by AI)
  viralAnalysis?: ViralAnalysis;
  tags?: string[];
  isFavorite?: boolean;
  status?: "draft" | "scheduled" | "published";
  scheduledDate?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // key for lucide icon
  xpReward: number;
}

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

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  planName: string;
}

export type AppLanguage = "en" | "es";

export type AppTab =
  | "home"
  | "create"
  | "history"
  | "settings"
  | "autopilot"
  | "carousel"
  | "chat"
  | "editor"
  | "voice-lab"
  | "audit"
  | "insight-responder"


export interface AutoPilotConfig {
  enabled: boolean;
  frequency: "daily" | "weekly" | "biweekly" | "custom";
  days?: number[]; // 0=Sun, 1=Mon, etc. (Used for 'custom' frequency)
  time?: string; // HH:mm format (24h)
  nextRun: number; // Timestamp
  topics: string[]; // List of keywords to rotate
  tone: ViralTone;
  targetAudience: string;
  postCount: number; // Number of posts to generate per run
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

// --- Content Factory Types ---

export type ToneArchetype = "Educator" | "Challenger" | "Storyteller" | "Analyst";

export interface ExpertiseProfile {
    archetype: ToneArchetype;
    keywords: string[]; // e.g., "SaaS", "Growth", "AI"
    negativeKeywords: string[]; // e.g., "Politics", "Crypto"
    bioSummary?: string;
    industry?: string;
}

export type TrendCategory = "news" | "social" | "search" | "regulatory";

export interface Trend {
    id: string;
    title: string;
    summary: string;
    source: string;
    category: TrendCategory;
    matchScore: number; // 0-100
    timestamp: number;
    url?: string;
}

export interface ContentAngle {
    type: "visionary" | "implementer" | "analyst";
    title: string;
    hook: string;
    description: string;
}

export interface GeneratedPostContent {
    angle: "visionary" | "implementer" | "analyst";
    content: string;
    metadata?: any;
}

export interface UserProfile {
  id: string;
  email?: string; // Added for context convenience
  name: string;
  headline: string;
  avatarUrl: string;
  credits: number;
  maxCredits?: number; // Dynamic max capacity for progress bars
  isPremium: boolean;
  planTier: PlanTier;
  nextBillingDate?: number;
  cancelAtPeriodEnd?: boolean;
  hasOnboarded?: boolean;
  stripeCustomerId?: string;
  subscriptionId?: string;
  brandVoice?: string; // User defined brand voice description
  companyName?: string;
  industry?: string;
  position?: string;
  language: AppLanguage;
  // Security Settings
  twoFactorEnabled?: boolean;
  securityNotifications?: boolean;
  referredBy?: string; // ID of the referring user
  // Gamification Stats
  xp: number;
  level: number;
  currentStreak: number;
  lastPostDate: number | null; // Timestamp
  unlockedAchievements: string[]; // Array of Achievement IDs
  // AutoPilot
  autoPilot?: AutoPilotConfig;
  // Deletion Policy
  created_at?: string;
  scheduled_for_deletion?: boolean;
  deletion_date?: string;
  // Behavioral identity
  behavioral_dna?: BehavioralDNA;
}

export interface CustomSource {
  id: string;
  type: "link" | "image" | "text" | "drive";
  content: string; // URL, Base64 Image, Text content, or File ID
  name?: string; // Filename or Link title
  mimeType?: string; // Useful for drive files
}

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position?: "top" | "right" | "bottom" | "left";
}

export interface StylisticDNA {
    tone: string;
    sentence_structure: string;
    hooks_dna: string[];
    technical_terms: string[];
    formatting_rules: string[];
    rhythm?: string;
    vocabulary_profile?: string[];
    authority_level?: string;
    forbidden_patterns?: string[];
    punctuation_style?: string;
}

export interface BrandVoice {
  id: string;
  user_id: string;
  name: string;
  description: string;
  voice_name?: string; // SOTA field
  mimicry_instructions?: string; // SOTA field
  hookPatterns?: { category: string; pattern: string; example: string }[];
  stylisticDNA?: StylisticDNA;
  isActive?: boolean;
  created_at?: string;
}

export interface AuditSection {
  score: number;
  feedback: string;
  suggestion?: string;
  improvements_per_job?: string[];
  missing_critical_skills?: string[];
}

export interface AuditResult {
  global_score: number;
  industry_detected: string;
  brand_consistency: string;
  action_plan: string[];
  sections_audit: {
    headline: AuditSection;
    about: AuditSection;
    experience: AuditSection;
    skills_languages: AuditSection;
  };
}
export interface ExperienceItem {
  company: string;
  position: string;
  analysis: string;
  suggestions: string[];
}

export interface LinkedInAuditResult {
  authority_score: number;
  visual_score: number;
  brutal_diagnosis: string;
  quick_wins: string[];
  strategic_roadmap: {
    headline: string;
    about: string;
    experience: string;
  };
  visual_critique: string;
  technical_seo_keywords: string[];
  source_type?: "hybrid" | "pdf" | "visual";
  processed_data?: {
    name?: string;
    headline?: string;
    about?: string;
    company?: string;
    location?: string;
    skills?: string[];
    experiences?: { company: string; position: string; duration: string; description: string }[];
    education?: string[];
  };
}

export interface LinkedInAudit {
  id: string;
  user_id: string;
  profile_url: string;
  results: LinkedInAuditResult;
  created_at: string;
}


export interface LinkedInProfileData {
  full_name?: string;
  name?: string;
  profile_url?: string | null;
  headline?: string;
  summary?: string;
  about?: string;
  occupation?: string;
  company?: string;
  location?: string;
  experiences?: { company: string; position: string; duration: string; description: string }[];
  skills?: string[];
  education?: string[];
  scraped_data?: Record<string, unknown>;
}

export interface Fragment {
    id: string;
    user_id: string;
    name: string;
    content: string;
    usage_count: number;
    created_at: string;
    updated_at: string;
}

export interface NexusConversation {
    id: string;
    user_id: string;
    messages: Record<string, any>[]; // Or a more specific Message type if available
    context_data: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface Draft {
    id: string;
    user_id: string;
    type: "post" | "carousel";
    content: Record<string, any>;
    last_saved_at: string;
    created_at: string;
}

export interface ScheduledPost {
    id: string;
    user_id: string;
    post_id: string;
    scheduled_datetime: string;
    status: "pending" | "published" | "failed";
    linkedin_scheduled_id?: string;
    created_at: string;
    updated_at: string;
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

export interface UserFeedback {
    id: string;
    user_id: string | null;
    content: string;
    rating: number | null;
    status: "new" | "reviewed" | "resolved";
    created_at: string;
}
