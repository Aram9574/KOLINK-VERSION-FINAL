import { SchemaType, Tool, Schema } from "@google/generative-ai";
import { BaseAIService } from "./BaseAIService.ts";
import { PostGeneratorBrain } from "../prompts/PostGeneratorBrain.ts";
import { CarouselBrain } from "../prompts/CarouselBrain.ts";
import { PredictiveSimBrain } from "../prompts/PredictiveSimBrain.ts";
import { IdeaGeneratorBrain } from "../prompts/IdeaGeneratorBrain.ts";
import { GeneratedPost } from "./PostRepository.ts";
import { 
  getEmojiInstructions, 
  getFrameworkInstructions, 
  getLengthInstructions, 
  getTemplates, 
  VIRAL_EXAMPLES 
} from "../prompts.ts";
import { RepurposeService } from "./RepurposeService.ts";

export interface Idea {
  title: string;
  angle: string;
  description: string;
  suggested_format: string;
  viral_potential_score: number;
  ai_reasoning: string;
}

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
  hookStyle?: string;
  generateCarousel?: boolean;
}

export interface UserProfileContext {
  brand_voice?: string;
  company_name?: string;
  industry?: string;
  headline?: string;
  xp?: number;
  language?: string;
  behavioral_dna?: string;
}

export interface CarouselSlideData {
    type: "intro" | "content" | "outro";
    title: string;
    subtitle?: string;
    body: string;
    cta_text?: string;
    visual_hint?: string;
}

export interface CarouselMetadata {
    topic: string;
    total_slides: number;
    suggested_color_palette: string[];
}

export interface CarouselGenerationResult {
    carousel_metadata: CarouselMetadata;
    slides: CarouselSlideData[];
    linkedin_post_copy: string;
}

export interface EngagementPrediction {
  predicted_performance: {
    total_score: number;
    top_archetype_resonance: string;
    dwell_time_estimate: string;
  };
  audience_feedback: {
    archetype: string;
    reaction: string;
  }[];
  micro_optimization_tips: string[];
  improved_hook_alternative: string;
}

export class ContentService extends BaseAIService {
  /**
   * Generates a viral LinkedIn post.
   */
  async generatePost(params: GenerationParams, profile: UserProfileContext): Promise<GeneratedPost> {
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

    const hookInstruction = params.hookStyle 
      ? `\n- **Gancho Específico (Hook Style):** ${params.hookStyle}. Comienza el post respetando estrictamente esta estructura de gancho.`
      : "";

    const carouselInstruction = params.generateCarousel
      ? `\n- **Intento de Carrusel:** Este post debe servir como base para un carrusel. Sé visual y estructurado en puntos clave.`
      : "";

    const langInstruction = (params.outputLanguage || profile.language) === "es"
      ? templates.lang_es
      : templates.lang_en;

    const authorPersona = templates.author_persona
      .replace("{{headline}}", profile.headline || "")
      .replace("{{industry}}", profile.industry || "")
      .replace("{{experience_level}}", (profile.xp || 0) > 1000 ? "Expert" : "Professional")
      .replace("{{company_name}}", profile.company_name || "");

    const dnaInstruction = profile.behavioral_dna 
      ? `\n\nUSER BEHAVIORAL DNA (Use this to match their deep personality and tendencies):\n${profile.behavioral_dna}`
      : "";

    const prompt = (templates.main_prompt + dnaInstruction)
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
      .replace("{{cta_instruction}}", params.includeCTA ? "Yes" : "No")
      .replace("{{cta_instruction_detail}}", ctaInstruction)
      .replace("{{hashtag_instruction}}", hashtagInstruction)
      .replace("{{hook_instruction}}", hookInstruction)
      .replace("{{carousel_instruction}}", carouselInstruction);

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        systemInstruction: PostGeneratorBrain.system_instruction,
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
              auditor_report: {
                type: SchemaType.OBJECT,
                properties: {
                  viral_score: { type: SchemaType.INTEGER },
                  hook_strength: { type: SchemaType.STRING },
                  hook_score: { type: SchemaType.INTEGER },
                  readability_score: { type: SchemaType.INTEGER },
                  value_score: { type: SchemaType.INTEGER },
                  pro_tip: { type: SchemaType.STRING },
                  retention_estimate: { type: SchemaType.STRING },
                  flags_triggered: { 
                    type: SchemaType.ARRAY, 
                    items: { type: SchemaType.STRING } 
                  }
                },
                required: ["viral_score", "hook_strength", "hook_score", "readability_score", "value_score", "pro_tip", "retention_estimate", "flags_triggered"]
              },
              strategy_reasoning: { type: SchemaType.STRING },
              meta: {
                type: SchemaType.OBJECT,
                properties: {
                  suggested_hashtags: { 
                    type: SchemaType.ARRAY, 
                    items: { type: SchemaType.STRING } 
                  },
                  character_count: { type: SchemaType.INTEGER }
                },
                required: ["suggested_hashtags", "character_count"]
              }
            },
            required: ["post_content", "auditor_report", "strategy_reasoning", "meta"]
          } as Schema,
        },
      });

      const json = this.extractJson(response.response.text());
      return json as unknown as GeneratedPost;
    });
  }

  /**
   * Generates a LinkedIn Carousel JSON.
   */
  async generateCarousel(
    source: string,
    sourceType: string,
    styleFragments: string[],
    language: string = "es",
    profileContext?: UserProfileContext
  ): Promise<CarouselGenerationResult> {
    const styleContext = styleFragments.length > 0
      ? `Tone and style examples from the user:\n${styleFragments.join("\n---\n")}`
      : "Tone: Professional and engaging.";

    const dnaInstruction = profileContext?.behavioral_dna 
      ? `\n\nUSER BEHAVIORAL DNA (Integrate this persona into the carousel style):\n${profileContext.behavioral_dna}`
      : "";

    const userVoice = profileContext?.brand_voice
      ? `\nBRAND VOICE INSTRUCTIONS:\n${profileContext.brand_voice}`
      : "";

    const repurposeService = new RepurposeService();
    let finalSource = source;
    let analysisStrategy = "";

    // 1. CONTENT FETCHING PHASE
    try {
      if (sourceType === 'youtube') {
           console.log(`Fetching YouTube transcript for ${source}...`);
           // Extract video ID from flexible inputs (url or id)
           let videoId = source;
           if (source.includes('v=')) videoId = source.split('v=')[1].split('&')[0];
           else if (source.includes('youtu.be/')) videoId = source.split('youtu.be/')[1].split('?')[0];

           const transcript = await repurposeService.fetchYoutubeTranscript(videoId);
           finalSource = `[VIDEO TRANSCRIPT]:\n"${transcript}"\n\n(Source Video: ${source})`;
           analysisStrategy = "The content provided is a VIDEO TRANSCRIPT. Extract the core educational value, ignore conversational filler, and structure the key lessons into a carousel.";
      } 
      else if (sourceType === 'url') {
           console.log(`Scraping URL ${source}...`);
           const webContent = await repurposeService.scrapeUrl(source);
           finalSource = `[WEB ARTICLE CONTENT]:\n"${webContent}"\n\n(Source URL: ${source})`;
           analysisStrategy = "The content provided is a WEB ARTICLE. Summarize the main points and turn the key insights into a slide-by-slide narrative.";
      }
      else {
           // Default TEXT or TOPIC
           analysisStrategy = "The input is a user-provided topic or text. Use your 'googleSearch' tool to find relevant, high-performing content to ground your carousel if the input is sparse.";
      }
    } catch (error) {
       console.error("Repurposing Error:", error);
       // Fallback: If fetch fails, treat as topic/metadata and ask AI to search or improvise
       analysisStrategy = `WARNING: Failed to fetch external content (${error instanceof Error ? error.message : 'Unknown'}). Treat the input "${source}" as a topic and use Google Search to find information about it.`;
    }

    const prompt = `
      ${CarouselBrain.system_instruction}
      
      Act as a Lead Content Strategist & LinkedIn Viral Growth Expert.
      Your mission is to analyze the provided INPUT SOURCE and transform it into a high-impact LinkedIn Carousel.

      INPUT SOURCE:
      ${finalSource}
      
      USER STYLE CONTEXT:
      ${styleContext}
      ${dnaInstruction}
      ${userVoice}
      ${styleContext}
      
      PHASE 1: ANALYSIS STRATEGY
      ${analysisStrategy}
      
      PHASE 2: NARRATIVE ARCHITECTURE
      Design a 7-12 slide carousel JSON.
      - SLIDE 1 (Type: intro): Hook the reader immediately. Big title.
      - SLIDES 2-N (Type: content): Deliver value. One idea per slide.
      - FINAL SLIDE (Type: outro): Strong Call to Action (CTA).
      
      USER DNA: 
      ${dnaInstruction}

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
              carousel_metadata: {
                type: SchemaType.OBJECT,
                properties: {
                  topic: { type: SchemaType.STRING },
                  total_slides: { type: SchemaType.INTEGER },
                  suggested_color_palette: { 
                    type: SchemaType.ARRAY, 
                    items: { type: SchemaType.STRING } 
                  }
                },
                required: ["topic", "total_slides", "suggested_color_palette"]
              },
              slides: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    type: { type: SchemaType.STRING, enum: ["intro", "content", "outro"] },
                    title: { type: SchemaType.STRING },
                    subtitle: { type: SchemaType.STRING },
                    body: { type: SchemaType.STRING },
                    cta_text: { type: SchemaType.STRING },
                    visual_hint: { type: SchemaType.STRING }
                  },
                  required: ["type", "title", "body"]
                },
              },
              linkedin_post_copy: { type: SchemaType.STRING }
            },
            required: ["carousel_metadata", "slides", "linkedin_post_copy"]
          } as Schema,
        },
      });

      return this.extractJson(result.response.text()) as unknown as CarouselGenerationResult;
    });
  }

  /**
   * Generates 5 viral ideas.
   */
  async generateIdeas(topic: string, language: string = "es"): Promise<{ ideas: Idea[] }> {
    const isSpanish = language === "es";
    const prompt = isSpanish
      ? `Genera 5 ideas virales para posts de LinkedIn sobre: ${topic}.`
      : `Generate 5 viral ideas for LinkedIn posts about: ${topic}.`;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        systemInstruction: IdeaGeneratorBrain.system_instruction,
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
                    angle: { type: SchemaType.STRING },
                    description: { type: SchemaType.STRING },
                    suggested_format: { type: SchemaType.STRING },
                    viral_potential_score: { type: SchemaType.INTEGER },
                    ai_reasoning: { type: SchemaType.STRING },
                  },
                  required: ["title", "angle", "description", "suggested_format", "viral_potential_score", "ai_reasoning"]
                },
              },
            },
            required: ["ideas"]
          } as Schema,
        },
      });

      const json = this.extractJson(response.response.text());
      return json as unknown as { ideas: Idea[] };
    });
  }

  /**
   * Generates content using a custom prompt and schema.
   */
  async generateDirect(prompt: string, schemaProperties: Record<string, unknown>) {
      return await this.retryWithBackoff(async () => {
          const model = this.genAI.getGenerativeModel({
              model: this.model,
          });

          // @ts-ignore: Dynamic schema construction
          const responseSchema: Schema = {
              type: SchemaType.OBJECT,
              // deno-lint-ignore no-explicit-any
              properties: schemaProperties as any,
              required: Object.keys(schemaProperties)
          };

          const result = await model.generateContent({
              // @ts-ignore: GenAI types mismatch with current version
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                  responseMimeType: "application/json",
                  responseSchema: responseSchema
              }
          });

          return this.extractJson(result.response.text());
      });
  }

  /**
   * Predicts the performance of a post or carousel using the "The Crowd Proxy" approach.
   */
  async predictPerformance(content: string, language: string = "es"): Promise<EngagementPrediction> {
    
    const prompt = `
      ${PredictiveSimBrain.system_instruction}

      INPUT CONTENT TO ANALYZE:
      ${content}

      LANGUAGE OF ANALYSIS: ${language === "es" ? "Spanish" : "English"}
    `;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
      });

      const result = await model.generateContent({
        // @ts-ignore: Google Generative AI types might be strict, casting parts to any for flex
        // deno-lint-ignore no-explicit-any
        contents: [{ role: "user", parts: [{ text: prompt }] as any }],
        generationConfig: {
          temperature: 0.4, // Balanced for critique but creative suggestions
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              predicted_performance: {
                type: SchemaType.OBJECT,
                properties: {
                  total_score: { type: SchemaType.INTEGER },
                  top_archetype_resonance: { type: SchemaType.STRING },
                  dwell_time_estimate: { type: SchemaType.STRING }
                },
                required: ["total_score", "top_archetype_resonance", "dwell_time_estimate"]
              },
              audience_feedback: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    archetype: { type: SchemaType.STRING },
                    reaction: { type: SchemaType.STRING }
                  },
                  required: ["archetype", "reaction"]
                }
              },
              micro_optimization_tips: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
              },
              improved_hook_alternative: { type: SchemaType.STRING }
            },
            required: ["predicted_performance", "audience_feedback", "micro_optimization_tips", "improved_hook_alternative"]
          } as Schema,
        },
      });

      return this.extractJson(result.response.text()) as unknown as EngagementPrediction;
    });
  }
}
