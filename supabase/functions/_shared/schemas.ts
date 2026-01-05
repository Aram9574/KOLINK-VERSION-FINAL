import { z } from "npm:zod@3.22.4";

export const GenerationParamsSchema = z.object({
  topic: z.string().min(1).max(5000),
  audience: z.string().max(200).optional().default("General Professional Audience"),
  tone: z.string().optional(),
  framework: z.string().optional(),
  emojiDensity: z.string().optional(),
  length: z.string().optional(),
  creativityLevel: z.number().min(0).max(100).optional(),
  hashtagCount: z.number().min(0).max(30).optional(),
  includeCTA: z.boolean().optional(),
  outputLanguage: z.enum(["en", "es"]).optional(),
  brandVoiceId: z.string().optional(),
  hookStyle: z.string().optional(),
  generateCarousel: z.boolean().optional(),
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
