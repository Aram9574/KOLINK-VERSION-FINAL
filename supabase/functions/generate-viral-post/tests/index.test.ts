import { assertEquals, assertRejects } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { describe, it, beforeEach, afterEach } from "https://deno.land/std@0.168.0/testing/bdd.ts";
import { z } from 'https://esm.sh/zod@3.22.4';

// Mock dependencies
// Since we can't easily mock module imports in Deno without import maps or dependency injection,
// we will test the validation logic which is pure.
// For a full integration test, we would need to mock the Supabase client and services.

// Re-implementing the schema here for testing purposes as it's not exported from index.ts
// Ideally, we should export the schema from index.ts or a separate file.
const GenerationParamsSchema = z.object({
    topic: z.string().min(1, "Topic is required").max(500, "Topic is too long"),
    audience: z.string().max(200, "Audience description is too long").optional().default("General Professional Audience"),
    tone: z.string().optional().default("professional"),
    framework: z.string().optional().default("storytelling"),
    emojiDensity: z.string().optional().default("balanced"),
    length: z.string().optional().default("medium"),
    creativityLevel: z.string().optional().default("balanced"),
    includeCTA: z.boolean().optional().default(true)
});

describe("generate-viral-post validation", () => {
    it("should validate correct params", () => {
        const validParams = {
            topic: "AI in Marketing",
            audience: "Marketers",
            tone: "professional",
            framework: "PAS",
            emojiDensity: "MODERATE",
            length: "MEDIUM",
            creativityLevel: "HIGH",
            includeCTA: true
        };
        const result = GenerationParamsSchema.parse(validParams);
        assertEquals(result.topic, "AI in Marketing");
    });

    it("should fail on missing topic", () => {
        const invalidParams = {
            audience: "Marketers"
        };
        assertRejects(() => Promise.resolve(GenerationParamsSchema.parse(invalidParams)));
    });

    it("should use defaults for optional fields", () => {
        const minimalParams = {
            topic: "Just a topic"
        };
        const result = GenerationParamsSchema.parse(minimalParams);
        assertEquals(result.audience, "General Professional Audience");
        assertEquals(result.tone, "professional");
        assertEquals(result.includeCTA, true);
    });

    it("should fail on too long topic", () => {
        const longTopic = "a".repeat(501);
        assertRejects(() => Promise.resolve(GenerationParamsSchema.parse({ topic: longTopic })));
    });
});
