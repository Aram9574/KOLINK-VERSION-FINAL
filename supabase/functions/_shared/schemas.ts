import { z } from "npm:zod@3.22.4";

export const GenerationParamsSchema = z.object({
  topic: z.string().min(3).max(500),
  audience: z.string().min(3).max(200),
  tone: z.string(),
  framework: z.string(),
  emojiDensity: z.string(),
  length: z.string(),
  creativityLevel: z.number().min(0).max(100),
  hashtagCount: z.number().min(0).max(5),
  includeCTA: z.boolean(),
  outputLanguage: z.enum(["en", "es"]).optional(),
  brandVoiceId: z.string().optional(),
});

export const VariationParamsSchema = z.object({
  postId: z.string().uuid(),
  count: z.number().min(1).max(5).default(3),
});

export const ProfileAuditSchema = z.object({
  fullName: z.string(),
  headline: z.string().optional(),
  about: z.string().optional(),
  experience: z.array(z.object({
    role: z.string(),
    company: z.string(),
    description: z.string().optional(),
  })).optional(),
});
