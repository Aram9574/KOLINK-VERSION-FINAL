import { SchemaType, Tool, Schema } from "@google/generative-ai";
import { BaseAIService } from "./BaseAIService.ts";
import { 
  getEmojiInstructions, 
  getFrameworkInstructions, 
  getLengthInstructions, 
  getTemplates, 
  SYSTEM_INSTRUCTION, 
  VIRAL_EXAMPLES 
} from "../prompts.ts";

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
  outputLanguage?: string;
  brandVoiceId?: string;
}

export interface UserProfileContext {
  brand_voice?: string; // Resolved description, not the column
  company_name?: string;
  industry?: string;
  headline?: string;
  xp?: number;
  language?: string;
}

export class ContentService extends BaseAIService {
  /**
   * Generates a viral LinkedIn post.
   */
  async generatePost(params: GenerationParams, profile: UserProfileContext) {
    const templates = getTemplates();
    const frameworkRules = getFrameworkInstructions(params.framework);
    const emojiRules = getEmojiInstructions(params.emojiDensity);
    const lengthRules = getLengthInstructions(params.length);
    const viralExample = VIRAL_EXAMPLES[params.framework as keyof typeof VIRAL_EXAMPLES] || "";

    const ctaInstruction = params.includeCTA ? templates.cta_yes : "";
    const hashtagInstruction = `Use strictly ${params.hashtagCount || 0} hashtags at the end of the post. They must be SEO optimized and relevant to the topic.`;

    const voiceInstruction = (profile.brand_voice && profile.brand_voice.length > 0)
      ? templates.voice_custom.replace("{{brand_voice}}", profile.brand_voice)
      : templates.voice_default.replace("{{tone}}", params.tone);

    const langInstruction = (params.outputLanguage || profile.language) === "es"
      ? templates.lang_es
      : templates.lang_en;

    const authorPersona = templates.author_persona
      .replace("{{headline}}", profile.headline || "")
      .replace("{{industry}}", profile.industry || "")
      .replace("{{experience_level}}", (profile.xp || 0) > 1000 ? "Expert" : "Professional")
      .replace("{{company_name}}", profile.company_name || "");

    const prompt = templates.main_prompt
      .replace("{{topic}}", params.topic)
      .replace("{{audience}}", params.audience)
      .replace("{{voice_instruction}}", voiceInstruction)
      .replace("{{creativity_level}}", params.creativityLevel.toString())
      .replace("{{emoji_density}}", params.emojiDensity)
      .replace("{{length}}", params.length)
      .replace("{{author_persona}}", authorPersona)
      .replace("{{viral_example}}", viralExample)
      .replace("{{framework_rules}}", frameworkRules)
      .replace("{{length_rules}}", lengthRules)
      .replace("{{emoji_rules}}", emojiRules)
      .replace("{{lang_instruction}}", langInstruction)
      .replace("{{cta_instruction_detail}}", ctaInstruction)
      .replace("{{hashtag_instruction}}", hashtagInstruction);

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const response = await model.generateContent({
        // @ts-ignore: Google Generative AI types might be strict, casting parts to any for flex
        // deno-lint-ignore no-explicit-any
        contents: [{ role: "user", parts: [{ text: prompt }] as any }],
        generationConfig: {
          temperature: 0.7 + (params.creativityLevel / 200),
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              post_content: { type: SchemaType.STRING },
              overall_viral_score: { type: SchemaType.INTEGER },
              hook_score: { type: SchemaType.INTEGER },
              readability_score: { type: SchemaType.INTEGER },
              value_score: { type: SchemaType.INTEGER },
              feedback: { type: SchemaType.STRING },
            },
            required: ["post_content", "overall_viral_score", "feedback"],
          } as Schema,
        },
      });

      return JSON.parse(response.response.text());
    });
  }

  /**
   * Generates a LinkedIn Carousel JSON.
   */
  async generateCarousel(
    source: string,
    _sourceType: string,
    styleFragments: string[],
    language: string = "es"
  ) {
    const styleContext = styleFragments.length > 0
      ? `Tone and style examples from the user:\n${styleFragments.join("\n---\n")}`
      : "Tone: Professional and engaging.";

    const _hasCalculatedContent = source.includes("[VIDEO TRANSCRIPT]") || source.includes("[WEB CONTENT]");
    
    const prompt = `
      Act as a Lead Content Strategist & LinkedIn Viral Growth Expert.
      Analyze the source and transform it into a 7-12 slide carousel JSON.
      SOURCE: ${source}
      STYLE: ${styleContext}
      LANGUAGE: ${language === "es" ? "Spanish" : "English"}
    `;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        // @ts-ignore: Tool definition mismatch in SDK types vs Runtime
        tools: [{ googleSearch: {} }] as unknown as Tool[],
      });

      const result = await model.generateContent({
        // @ts-ignore: Google Generative AI types might be strict, casting parts to any for flex
        // deno-lint-ignore no-explicit-any
        contents: [{ role: "user", parts: [{ text: prompt }] as any }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              carousel_config: {
                type: SchemaType.OBJECT,
                properties: {
                  slides_count: { type: SchemaType.INTEGER },
                  tone: { type: SchemaType.STRING },
                  target_audience: { type: SchemaType.STRING },
                  core_value: { type: SchemaType.STRING },
                  analysis: { type: SchemaType.STRING },
                },
                required: ["slides_count", "tone", "target_audience", "core_value", "analysis"],
              },
              slides: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    number: { type: SchemaType.INTEGER },
                    title: { type: SchemaType.STRING },
                    content: { type: SchemaType.STRING },
                  },
                },
              },
            },
          } as Schema,
        },
      });

      return JSON.parse(result.response.text().replace(/\*\*/g, ""));
    });
  }

  /**
   * Generates 5 viral ideas.
   */
  async generateIdeas(topic: string, language: string = "es") {
    const isSpanish = language === "es";
    const prompt = isSpanish
      ? `Genera 5 ideas virales para posts de LinkedIn sobre: ${topic}.`
      : `Generate 5 viral ideas for LinkedIn posts about: ${topic}.`;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
      });

      const response = await model.generateContent({
        // @ts-ignore: Google Generative AI types might be strict, casting parts to any for flex
        // deno-lint-ignore no-explicit-any
        contents: [{ role: "user", parts: [{ text: prompt }] as any }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              ideas: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    title: { type: SchemaType.STRING },
                    description: { type: SchemaType.STRING },
                    type: { type: SchemaType.STRING },
                  },
                },
              },
            },
          } as Schema,
        },
      });

      return JSON.parse(response.response.text());
    });
  }
}
