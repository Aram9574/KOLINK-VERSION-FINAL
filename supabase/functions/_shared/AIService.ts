// @ts-ignore
import { GoogleGenAI, Type } from 'https://esm.sh/@google/genai'
import {
    SYSTEM_INSTRUCTION,
    VIRAL_EXAMPLES,
    getFrameworkInstructions,
    getEmojiInstructions,
    getLengthInstructions,
    getTemplates
} from './prompts.ts';

export interface GenerationParams {
    topic: string;
    audience: string;
    tone: string;
    framework: string;
    emojiDensity: string;
    length: string;
    creativityLevel: number;
    hashtagCount: number;
    includeCTA: boolean;
}

export interface UserProfileContext {
    brand_voice?: string;
    company_name?: string;
    industry?: string;
    headline?: string;
    xp?: number;
    language?: string;
}

/**
 * Service to handle interaction with Google Gemini via Generative AI.
 * Responsible for constructing prompts and parsing AI responses into structured JSON.
 */
export class AIService {
    private ai: GoogleGenAI;
    private model = 'gemini-3-pro-preview';

    /**
     * @param apiKey - The Google Gemini API Key.
     */
    constructor(apiKey: string) {
        this.ai = new GoogleGenAI({ apiKey });
    }

    /**
     * Generates a viral LinkedIn post based on user parameters and profile context.
     * 
     * @param params - The user-defined generation parameters (topic, tone, framework, etc.).
     * @param profile - The user's profile context (brand voice, industry, etc.) to personalize the output.
     * @returns Promise<any> - The structured JSON response containing the post content and analysis.
     * @throws {Error} if content generation fails or returns empty.
     */
    async generatePost(params: GenerationParams, profile: UserProfileContext) {
        const frameworkRules = getFrameworkInstructions(params.framework);
        const emojiRules = getEmojiInstructions(params.emojiDensity);
        const lengthRules = getLengthInstructions(params.length);
        const viralExample = VIRAL_EXAMPLES[params.framework as keyof typeof VIRAL_EXAMPLES] || "";

        const templates = getTemplates();

        const ctaInstruction = templates.cta_yes;

        const voiceInstruction = (profile.brand_voice && profile.brand_voice.length > 0)
            ? templates.voice_custom.replace('{{brand_voice}}', profile.brand_voice)
            : templates.voice_default.replace('{{tone}}', params.tone);

        const langInstruction = profile.language === 'es'
            ? templates.lang_es
            : templates.lang_en;

        const hashtagInstruction = `Use strictly ${params.hashtagCount} hashtags at the end of the post. They must be SEO optimized and relevant to the topic.`;

        // Construct Author Persona
        const authorPersona = templates.author_persona
            .replace('{{headline}}', profile.headline || "")
            .replace('{{industry}}', profile.industry || "")
            .replace('{{experience_level}}', (profile.xp || 0) > 1000 ? "Expert/Thought Leader" : "Rising Professional")
            .replace('{{company_name}}', profile.company_name || "");

        const prompt = templates.main_prompt
            .replace('{{topic}}', params.topic)
            .replace('{{audience}}', params.audience)
            .replace('{{voice_instruction}}', voiceInstruction)
            .replace('{{creativity_level}}', params.creativityLevel.toString())
            .replace('{{emoji_density}}', params.emojiDensity)
            .replace('{{length}}', params.length)
            .replace('{{cta_instruction}}', "YES (Auto-generated)")
            .replace('{{author_persona}}', authorPersona)
            .replace('{{viral_example}}', viralExample)
            .replace('{{framework_rules}}', frameworkRules)
            .replace('{{length_rules}}', lengthRules)
            .replace('{{emoji_rules}}', emojiRules)
            .replace('{{cta_instruction_detail}}', ctaInstruction)
            .replace('{{lang_instruction}}', langInstruction)
            .replace('{{hashtag_instruction}}', hashtagInstruction);

        return this.retryWithBackoff(async () => {
             const response = await this.ai.models.generateContent({
                model: this.model,
                contents: prompt,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    temperature: 0.7 + (params.creativityLevel / 200),
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            post_content: { type: Type.STRING, description: "The actual LinkedIn post text." },
                            overall_viral_score: { type: Type.INTEGER, description: "A holistic score from 0-100 predicting viral potential." },
                            hook_score: { type: Type.INTEGER, description: "Score 0-100 for the opening line." },
                            readability_score: { type: Type.INTEGER, description: "Score 0-100 for formatting and ease of reading." },
                            value_score: { type: Type.INTEGER, description: "Score 0-100 for the insight quality." },
                            feedback: { type: Type.STRING, description: "One specific, actionable tip to improve the post further." }
                        },
                        required: ["post_content", "overall_viral_score", "hook_score", "readability_score", "value_score", "feedback"]
                    }
                }
            });

            const text = response.text;
            if (!text) throw new Error("No content generated");

            return JSON.parse(text);
        });
    }

    private async retryWithBackoff<T>(operation: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
        try {
            return await operation();
        } catch (error: any) {
            if (retries > 0 && (error.status === 503 || error.message?.includes('overloaded'))) {
                console.log(`Model overloaded. Retrying in ${delay}ms... (${retries} retries left)`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.retryWithBackoff(operation, retries - 1, delay * 2);
            }
            throw error;
        }
    }
}
