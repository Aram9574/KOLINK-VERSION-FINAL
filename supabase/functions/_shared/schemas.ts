import { z } from 'https://esm.sh/zod@3.22.4';

// Define enums to match those in types.ts (manually kept in sync for simple isomorphic setup)
export const ViralToneEnum = z.enum([
    'Professional & Authoritative',
    'Controversial & Bold',
    'Empathetic & Vulnerable',
    'Educational & Insightful',
    'Witty & Humorous',
    'Narrative & Personal'
]);

// Map legacy string values to Enum values if needed, or just allow string for flexibility if frontend sends raw strings
// The frontend types.ts defines Enum Values (e.g. 'Professional & Authoritative')
// But simpler keys (like 'professional') might be used in the UI state? 
// Checking the usage in GeneratorForm:
// It iterates Object.values(ViralTone). So it uses the full string.

export const GenerationParamsSchema = z.object({
    topic: z.string().min(1, "Topic is required").max(5000, "Topic is too long"),
    audience: z.string().max(200, "Audience description is too long").optional().default("General Professional Audience"),
    tone: z.string().optional().default("Professional & Authoritative"), // Allow string, or use ViralToneEnum
    framework: z.string().optional().default("Problem - Agitate - Solution"),
    emojiDensity: z.string().optional().default("Moderate (Engaging)"),
    length: z.string().optional().default("Medium"),
    creativityLevel: z.number().min(0).max(100).optional().default(50),
    includeCTA: z.boolean().optional().default(true)
});

export type GenerationParams = z.infer<typeof GenerationParamsSchema>;
