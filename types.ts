

export enum ViralTone {
  PROFESSIONAL = 'Professional & Authoritative',
  CONTROVERSIAL = 'Controversial & Bold',
  EMPATHETIC = 'Empathetic & Vulnerable',
  EDUCATIONAL = 'Educational & Insightful',
  HUMOROUS = 'Witty & Humorous',
  STORYTELLING = 'Narrative & Personal'
}

export enum ViralFramework {
  PAS = 'Problem - Agitate - Solution',
  AIDA = 'Attention - Interest - Desire - Action',
  BAB = 'Before - After - Bridge',
  LISTICLE = 'Listicle / Bullet Points',
  CONTRARIAN = 'Contrarian Take (The "Unpopular Opinion")',
  STORY = 'Hero\'s Journey (Micro-Story)'
}

export enum EmojiDensity {
  MINIMAL = 'Minimal (Professional)',
  MODERATE = 'Moderate (Engaging)',
  HIGH = 'High (Visual/Playful)'
}

export enum PostLength {
  SHORT = 'Short',
  MEDIUM = 'Medium',
  LONG = 'Long'
}

export interface GenerationParams {
  topic: string;
  audience: string;
  tone: ViralTone;
  framework: ViralFramework;
  length: PostLength;
  creativityLevel: number; // 0 to 100
  emojiDensity: EmojiDensity;
  includeCTA: boolean;
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
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // key for lucide icon
  xpReward: number;
}

export type PlanTier = 'free' | 'pro' | 'viral';

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
  status: 'Paid' | 'Pending' | 'Failed';
  planName: string;
}

export type AppLanguage = 'en' | 'es';

export interface AutoPilotConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'custom';
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
  name: string;
  headline: string;
  avatarUrl: string;
  credits: number;
  maxCredits?: number; // Dynamic max capacity for progress bars
  isPremium: boolean;
  planTier: PlanTier;
  nextBillingDate?: number;
  cancelAtPeriodEnd?: boolean;
  hasOnboarded: boolean;
  brandVoice?: string; // User defined brand voice description
  companyName?: string;
  industry?: string;
  position?: string;
  language: AppLanguage;
  // Security Settings
  twoFactorEnabled?: boolean;
  securityNotifications?: boolean;
  // Gamification Stats
  xp: number;
  level: number;
  currentStreak: number;
  lastPostDate: number | null; // Timestamp
  unlockedAchievements: string[]; // Array of Achievement IDs
  // AutoPilot
  autoPilot: AutoPilotConfig;
}

export interface CustomSource {
  id: string;
  type: 'link' | 'image' | 'text' | 'drive';
  content: string; // URL, Base64 Image, Text content, or File ID
  name?: string; // Filename or Link title
  mimeType?: string; // Useful for drive files
}
