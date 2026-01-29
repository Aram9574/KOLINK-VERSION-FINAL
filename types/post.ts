import { z } from 'zod';

// ... existing types ...

export const PostContentSchema = z.object({
    id: z.string().optional(),
    content: z.string(),
    metadata: z.any().optional(),
    angle: z.enum(["visionary", "implementer", "analyst"]).optional(),
    viralScore: z.number().optional(),
    viralAnalysis: z.any().optional(),
    gamification: z.any().optional(),
    credits: z.number().optional(),
});

export type GeneratedPostContent = z.infer<typeof PostContentSchema>;

export interface Trend {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: TrendCategory;
  timestamp: string;
  matchScore: number;
  url?: string;
}

export interface ContentAngle {
  title: string;
  hook: string;
  description?: string;
}

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
  creativityLevel: number;
  emojiDensity: EmojiDensity | "random";
  hashtagCount: number;
  includeCTA: boolean;
  hookStyle?: ViralHook | "random";
  brandVoiceId?: string;
  outputLanguage?: "en" | "es";
  generateCarousel?: boolean;
}

export interface ViralAnalysis {
  hookScore: number;
  readabilityScore: number;
  valueScore: number;
  feedback: string;
}

import { PostID } from './branded';

export interface Post {
  id: PostID;
  content: string;
  params: GenerationParams;
  createdAt: number;
  likes: number;
  views: number;
  isAutoPilot?: boolean;
  viralScore?: number;
  viralAnalysis?: ViralAnalysis;
  tags?: string[];
  isFavorite?: boolean;
  status?: "draft" | "scheduled" | "published";
  scheduledDate?: number;
}

export interface GeneratedPostContent {
    angle: "visionary" | "implementer" | "analyst";
    content: string;
    metadata?: any;
}
