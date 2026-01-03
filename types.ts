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
  | "create"
  | "history"
  | "settings"
  | "autopilot"
  | "carousel"
  | "chat"
  | "editor"
  | "voice-lab"
  | "audit"
  | "insight-responder";

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
}

export interface BrandVoice {
  id: string;
  user_id: string;
  name: string;
  description: string;
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
  score: number;
  summary: string;
  headline: {
    current: string;
    suggested: string;
    analysis: string;
  };
  about: {
    analysis: string;
    suggested: string;
    missingKeywords: string[];
  };
  experience: ExperienceItem[];
  skills: {
    current: string[];
    missing: string[];
    analysis: string;
  };
}

export interface LinkedInAudit {
  id: string;
  user_id: string;
  profile_url: string;
  results: LinkedInAuditResult;
  created_at: string;
}

