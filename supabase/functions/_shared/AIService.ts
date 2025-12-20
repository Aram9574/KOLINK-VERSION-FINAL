import { GoogleGenerativeAI } from "npm:@google/generative-ai@^0.12.0";
import {
  getEmojiInstructions,
  getFrameworkInstructions,
  getLengthInstructions,
  getTemplates,
  SYSTEM_INSTRUCTION,
  VIRAL_EXAMPLES,
} from "./prompts.ts";

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
}

export interface UserProfileContext {
  brand_voice?: string;
  company_name?: string;
  industry?: string;
  headline?: string;
  xp?: number;
  language?: string;
}

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model = "gemini-3-flash-preview";

  constructor(geminiApiKey: string) {
    this.genAI = new GoogleGenerativeAI(geminiApiKey);
  }

  /**
   * Generates a viral LinkedIn post.
   */
  async generatePost(params: GenerationParams, profile: UserProfileContext) {
    const frameworkRules = getFrameworkInstructions(params.framework);
    const emojiRules = getEmojiInstructions(params.emojiDensity);
    const lengthRules = getLengthInstructions(params.length);
    const viralExample =
      VIRAL_EXAMPLES[params.framework as keyof typeof VIRAL_EXAMPLES] || "";
    const templates = getTemplates();

    const voiceInstruction =
      (profile.brand_voice && profile.brand_voice.length > 0)
        ? templates.voice_custom.replace("{{brand_voice}}", profile.brand_voice)
        : templates.voice_default.replace("{{tone}}", params.tone);

    const langInstruction = (params.outputLanguage || profile.language) === "es"
      ? templates.lang_es
      : templates.lang_en;

    const authorPersona = templates.author_persona
      .replace("{{headline}}", profile.headline || "")
      .replace("{{industry}}", profile.industry || "")
      .replace(
        "{{experience_level}}",
        (profile.xp || 0) > 1000 ? "Expert" : "Professional",
      )
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
      .replace("{{lang_instruction}}", langInstruction);

    return this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7 + (params.creativityLevel / 200),
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              post_content: { type: "STRING" },
              overall_viral_score: { type: "INTEGER" },
              hook_score: { type: "INTEGER" },
              readability_score: { type: "INTEGER" },
              value_score: { type: "INTEGER" },
              feedback: { type: "STRING" },
            },
            required: ["post_content", "overall_viral_score", "feedback"],
          } as any,
        },
      });

      return JSON.parse(response.response.text());
    });
  }

  /**
   * Generates a LinkedIn Carousel JSON using CoT and RAG style fragments.
   */
  async generateCarousel(
    sourceText: string,
    styleFragments: string[],
    profile: UserProfileContext,
  ) {
    const styleContext = styleFragments.length > 0
      ? `Tone and style examples from the user:\n${
        styleFragments.join("\n---\n")
      }`
      : "Tone: Professional and engaging.";

    const prompt = `
      Act as a Senior Content Strategist. Create a LinkedIn Carousel (native PDF format logic) based on the following content.
      
      SOURCE CONTENT:
      ${sourceText}
      
      USER STYLE CONTEXT:
      ${styleContext}
      
      INSTRUCTIONS:
      1. Use Chain of Thought: First analyze the 5-10 key points.
      2. Design a hook (Slide 1), narrative body, and final CTA.
      3. Apply "Voice Cloning": Mimic the emoji usage, sentence length, and tone of the style examples.
      4. Ensure visibility: Short sentences, high impact.
      5. Output MUST be strictly JSON.
      
      JSON STRUCTURE:
      {
        "carousel_config": { "slides_count": 10, "tone": "Expert", "analysis": "CoT reasoning here" },
        "slides": [
          { "number": 1, "title": "Headline", "content": "Subtext" }
        ]
      }
    `;

    return this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({ model: this.model }); // Use global model
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      });
      return JSON.parse(response.response.text());
    });
  }

  /**
   * Generates embeddings using OpenAI's text-embedding-3-small.
   */
  /**
   * Generates embeddings using Gemini's text-embedding-004.
   */
  async createEmbedding(text: string): Promise<number[]> {
    const model = this.genAI.getGenerativeModel({
      model: "text-embedding-004",
    });
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    return embedding.values;
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 2000,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (
        retries > 0 &&
        (error.status === 503 || error.message?.includes("overloaded"))
      ) {
        await new Promise((r) => setTimeout(r, delay));
        return this.retryWithBackoff(operation, retries - 1, delay * 2);
      }
      throw error;
    }
  }
}
