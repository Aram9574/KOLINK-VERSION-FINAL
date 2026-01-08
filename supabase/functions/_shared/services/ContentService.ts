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

export interface CarouselConfig {
    theme_id: string;
    settings: {
        aspect_ratio: string;
        dark_mode: boolean;
    };
}

export interface CarouselSlideData {
    id: string; // Add ID
    type: "intro" | "content" | "outro";
    layout_variant?: string; // Add variant
    content: {
        title: string;
        subtitle?: string;
        body: string;
        visual_hint?: string;
        cta_text?: string; // Legacy support or new CTA logic
    };
    design_overrides?: {
        swipe_indicator?: boolean;
    };
}

export interface CarouselGenerationResult {
    carousel_config: CarouselConfig; // Renamed from carousel_metadata
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
   * Generates a Viral LinkedIn Post.
   */
  async generatePost(
    params: GenerationParams,
    userContext: UserProfileContext
  ): Promise<GeneratedPost> {
    const frameworkInstruction = getFrameworkInstructions(params.framework);
    const emojiInstruction = getEmojiInstructions(params.emojiDensity);
    const lengthInstruction = getLengthInstructions(params.length);
    
    // Build context strings
    const behaviorContext = userContext.behavioral_dna 
        ? `\nBEHAVIORAL DNA:\n${userContext.behavioral_dna}` 
        : "";
        
    const voiceContext = userContext.brand_voice
        ? `\nBRAND VOICE:\n${userContext.brand_voice}`
        : "";

    const userProfileFull = `
    INDUSTRY: ${userContext.industry || "General"}
    EXPERTISE: ${userContext.xp || 0} XP
    HEADLINE: ${userContext.headline || ""}
    ${voiceContext}
    ${behaviorContext}
    `;

    const prompt = `
      ${PostGeneratorBrain.system_instruction}

      ### USER INPUT & CONTEXT
      TOPIC: ${params.topic}
      TARGET AUDIENCE: ${params.audience}
      
      ### CONFIGURATION (STRICT)
      FRAMEWORK: ${params.framework} -> ${frameworkInstruction}
      TONE: ${params.tone}
      EMOJI DENSITY: ${params.emojiDensity} -> ${emojiInstruction}
      LENGTH: ${params.length} -> ${lengthInstruction}
      CREATIVITY: ${params.creativityLevel}/10
      HASHTAGS: ${params.hashtagCount}
      CTA: ${params.includeCTA ? "Must include a Call to Conversation" : "No CTA"}
      LANGUAGE: ${params.outputLanguage || "es"}
      
      ### AUTHOR CONTEXT
      ${userProfileFull}
    `;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
      });

      const result = await model.generateContent({
        // @ts-ignore: Google Generative AI types might be strict
        // deno-lint-ignore no-explicit-any
        contents: [{ role: "user", parts: [{ text: prompt }] as any }],
        generationConfig: {
          temperature: 0.7,
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

      return this.extractJson(result.response.text()) as unknown as GeneratedPost;
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

    const repurposeService = new RepurposeService(this.geminiApiKey);
    let finalSource = source;
    let analysisStrategy = "";

    // 1. CONTENT FETCHING PHASE
    try {
      if (sourceType === 'youtube') {
           console.log(`Fetching YouTube transcript for ${source}...`);
           let videoId = source;
           if (source.includes('v=')) videoId = source.split('v=')[1].split('&')[0];
           else if (source.includes('youtu.be/')) videoId = source.split('youtu.be/')[1].split('?')[0];

           const transcript = await repurposeService.fetchYoutubeTranscript(videoId);
           finalSource = `[VIDEO TRANSCRIPT]:\n"${transcript}"\n\n(Source Video: ${source})`;
           analysisStrategy = "CONTENT TYPE: VIDEO TRANSCRIPT. \nSTRATEGY: Extract the core educational value. Ignore conversational filler. \nFRAGMENTATION: Break down the key lessons into atomic steps.";
      } 
      else if (sourceType === 'url') {
           console.log(`Scraping URL ${source}...`);
           const webContent = await repurposeService.scrapeUrl(source);
           finalSource = `[WEB ARTICLE CONTENT]:\n"${webContent}"\n\n(Source URL: ${source})`;
           analysisStrategy = "CONTENT TYPE: WEB ARTICLE. \nSTRATEGY: Summarize the main points. \nFRAGMENTATION: Turn sections into individual slides. Avoid walls of text.";
      }
      else if (sourceType === 'pdf') {
           console.log(`Extracting PDF content...`);
           const pdfContent = await repurposeService.extractPdfText(source);
           finalSource = `[PDF DOCUMENT CONTENT]:\n"${pdfContent}"`;
           analysisStrategy = "CONTENT TYPE: PDF DOCUMENT. \nSTRATEGY: Extract the core value and structured data. \nFRAGMENTATION: Use 'checklist' or 'comparison' layouts for data-heavy sections.";
      }
      else {
           // Default TEXT or TOPIC
           analysisStrategy = "CONTENT TYPE: RAW TOPIC/TEXT. \nSTRATEGY: Use your internal knowledge to build a comprehensive guide. \nFRAGMENTATION: 7-10 solid slides.";
      }
    } catch (error) {
       console.error("Repurposing Error:", error);
       analysisStrategy = `WARNING: Failed to fetch external content (${error instanceof Error ? error.message : 'Unknown'}). Treat the input "${source}" as a topic and use Google Search to find information about it.`;
    }

    const layoutStrategy = `
    LAYOUT STRATEGY (Use these heavily):
    - **checklist**: Use for ANY list of 3-5 items (lessons, tools, steps).
    - **comparison**: Use when contrasting "Old Way vs New Way" or "Mistake vs Fix".
    - **quote**: Use for high-impact statements, definitions, or contrarian points.
    - **big_number**: Use for statistics (e.g., "94%") or single powerful words (e.g., "STOP").
    - **code**: Use ONLY if the topic involves programming or prompts.
    - **default**: Use for standard text + image slides.
    `;

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
      
      PHASE 1: ANALYSIS STRATEGY & SMART FRAGMENTATION
      ${analysisStrategy}
      
      ${layoutStrategy}
      
      PHASE 2: NARRATIVE ARCHITECTURE
      Design a 7-12 slide carousel JSON following the Arc rules.
      
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
          temperature: 0.2, // Lower temp for struct adherence
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              carousel_config: {
                type: SchemaType.OBJECT,
                properties: {
                  theme_id: { type: SchemaType.STRING },
                  settings: {
                    type: SchemaType.OBJECT,
                    properties: {
                         aspect_ratio: { type: SchemaType.STRING },
                         dark_mode: { type: SchemaType.BOOLEAN }
                    }
                  }
                },
                required: ["theme_id", "settings"]
              },
              slides: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    id: { type: SchemaType.STRING },
                    type: { type: SchemaType.STRING, enum: ["intro", "content", "outro"] },
                    layout_variant: { type: SchemaType.STRING },
                    content: {
                        type: SchemaType.OBJECT,
                        properties: {
                            title: { type: SchemaType.STRING },
                            subtitle: { type: SchemaType.STRING },
                            body: { type: SchemaType.STRING },
                            visual_hint: { type: SchemaType.STRING }
                        },
                        required: ["title", "body"]
                    },
                    design_overrides: {
                        type: SchemaType.OBJECT,
                        properties: {
                            swipe_indicator: { type: SchemaType.BOOLEAN }
                        }
                    }
                  },
                  required: ["type", "layout_variant", "content"]
                },
              },
              linkedin_post_copy: { type: SchemaType.STRING }
            },
            required: ["carousel_config", "slides", "linkedin_post_copy"]
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

  /**
   * Refines a specific carousel slide based on user feedback or general polish.
   */
  async refineSlide(
    slideContent: { title: string; body: string; subtitle?: string; type: string },
    instruction: string = "Polish this slide for maximum impact and clarity on LinkedIn.",
    language: string = "es"
  ): Promise<Partial<CarouselSlideData>> {
      const prompt = `
        Act as a LinkedIn Content Strategist. 
        Refine the following carousel slide content based on this instruction: "${instruction}".
        
        CURRENT SLIDE CONTENT:
        Type: ${slideContent.type}
        Title: ${slideContent.title}
        Subtitle: ${slideContent.subtitle || "None"}
        Body: ${slideContent.body}
        
        RULES:
        1. Keep the same "Type".
        2. Improve the Title to be more magnetic/punchy.
        3. Clarify the Body text and make it professional yet engaging.
        4. Return ONLY a JSON object with "title", "body", and "subtitle".
        5. Maintain the original language (${language === "es" ? "Spanish" : "English"}).
      `;

      return await this.retryWithBackoff(async () => {
          const model = this.genAI.getGenerativeModel({ model: this.model });
          const result = await model.generateContent({
              // @ts-ignore: Parts mismatch
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                  temperature: 0.7,
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: SchemaType.OBJECT,
                      properties: {
                          title: { type: SchemaType.STRING },
                          subtitle: { type: SchemaType.STRING },
                          body: { type: SchemaType.STRING }
                      },
                      required: ["title", "body"]
                  } as Schema,
              }
          });

          return this.extractJson(result.response.text()) as unknown as Partial<CarouselSlideData>;
      });
  }
}
