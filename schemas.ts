import { z } from 'zod';

export const ViralToneEnum = z.enum([
    'Professional & Authoritative',
    'Controversial & Bold',
    'Empathetic & Vulnerable',
    'Educational & Insightful',
    'Witty & Humorous',
    'Narrative & Personal'
]);

export const GenerationParamsSchema = z.object({
    topic: z.string().min(1, "Topic is required").max(5000, "Topic is too long"),
    audience: z.string().max(200, "Audience description is too long").optional().default("General Professional Audience"),
    tone: z.string().optional().default("Professional & Authoritative"),
    framework: z.string().optional().default("Problem - Agitate - Solution"),
    emojiDensity: z.string().optional().default("Moderate (Engaging)"),
    length: z.string().optional().default("Medium"),
    creativityLevel: z.number().min(0).max(100).optional().default(50),
    includeCTA: z.boolean().optional().default(true),
    hashtagCount: z.number().min(0).max(30).optional().default(3),
    hookStyle: z.string().optional(),
    brandVoiceId: z.string().optional(),
    outputLanguage: z.enum(["en", "es"]).optional(),
    generateCarousel: z.boolean().optional()
});

export type GenerationParams = z.infer<typeof GenerationParamsSchema>;
