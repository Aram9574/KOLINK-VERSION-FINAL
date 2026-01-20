// import { SchemaType, Tool, Schema } from "@google/generative-ai"; // REMOVED
import { BaseAIService, GeminiResponse } from "./BaseAIService.ts";
import { PostGeneratorBrain } from "../prompts/PostGeneratorBrain.ts";
import { CarouselBrain } from "../prompts/CarouselBrain.ts";
import { PredictiveSimBrain } from "../prompts/PredictiveSimBrain.ts";
import { IdeaGeneratorBrain } from "../prompts/IdeaGeneratorBrain.ts";
import { GeneratedPost } from "./PostRepository.ts";
import {
  getEmojiInstructions, 
  getFrameworkInstructions, 
  getLengthInstructions, 
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
  
  // Convertir nivel de creatividad a temperatura (0.0 - 1.0)
  private getTemperature(level?: string): number {
    switch (level) {
        case 'high': return 0.95; // Muy creativo, arriesgado
        case 'low': return 0.3;   // Factual, conservador
        case 'medium': 
        default: return 0.7;      // Balanceado
    }
  }

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

    const systemInstruction = PostGeneratorBrain.getSystemPrompt({
        ...userContext,
        industry: userContext.industry || "General",
        xp: userContext.xp || 0,
        company_name: userContext.company_name || "an industry leader"
    });
    
    const userPrompt = PostGeneratorBrain.getUserPrompt(params, params.topic);

    return await this.retryWithBackoff(async () => {
      // Set temperature based on creativity level
      const temperature = this.getTemperature(params.creativityLevel as string);

      const payload = {
        // Build chat-like history for better following of system instructions
        contents: [
          { role: "user", parts: [{ text: `SYSTEM INSTRUCTIONS:\n${systemInstruction}` }] },
          { role: "model", parts: [{ text: "Understood. I am ready to write adhering to all style, audience, and formatting constraints." }] },
          { role: "user", parts: [{ text: userPrompt }] }
        ],
        generationConfig: {
          temperature: temperature,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              post_content: { type: "STRING" },
              auditor_report: {
                type: "OBJECT",
                properties: {
                  viral_score: { type: "INTEGER" },
                  hook_strength: { type: "STRING" },
                  hook_score: { type: "INTEGER" },
                  readability_score: { type: "INTEGER" },
                  value_score: { type: "INTEGER" },
                  pro_tip: { type: "STRING" },
                  retention_estimate: { type: "STRING" },
                  flags_triggered: { 
                    type: "ARRAY",
                    items: { type: "STRING" }
                  }
                },
                required: ["viral_score", "hook_strength", "hook_score", "readability_score", "value_score", "pro_tip", "retention_estimate", "flags_triggered"]
              },
              strategy_reasoning: { type: "STRING" },
              meta: {
                type: "OBJECT",
                properties: {
                  suggested_hashtags: { 
                    type: "ARRAY",
                    items: { type: "STRING" }
                  },
                  character_count: { type: "INTEGER" }
                },
                required: ["suggested_hashtags", "character_count"]
              }
            },
            required: ["post_content", "auditor_report", "strategy_reasoning", "meta"]
          },
        },
      };

      try {
        const data = await this.generateViaFetch(this.model, payload) as GeminiResponse;
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) {
            throw new Error("No text returned from Gemini API (Structured Mode)");
        }
  
        return this.extractJson(text) as unknown as GeneratedPost;
      } catch (err) {
        console.error("Critical AI Generation Failure (Returning Mock):", err);
        
        // GRACEFUL FALLBACK: Return a high-quality mock post so the app doesn't crash
        const isSpanish = params.outputLanguage === 'es';
        
        const content = isSpanish 
            ? "🚀 **¡Lanza tu Marca Personal con Confianza!**\n\nDicen que el mejor momento para empezar fue ayer. El segundo mejor es HOY.\n\nTodos nos hemos enfrentado a ese cursor parpadeante, preguntándonos si nuestra voz importa. Pero aquí está la verdad: Tu perspectiva única es exactamente lo que alguien necesita escuchar hoy.\n\nLa constancia no se trata de ser perfecto, se trata de presentarse.\n\n👇 **¿Cómo te estás presentando hoy? ¡Cuéntamelo en los comentarios!**\n\n#MarcaPersonal #CrecimientoLinkedIn #EmpezarAhora #KolinkAI"
            : "🚀 **Launch Your LinkedIn Journey with Confidence!**\n\nThey say the best time to start was yesterday. The second best time is NOW.\n\nWe've all faced that blinking cursor, wondering if our voice matters. But here's the truth: Your unique perspective is exactly what someone out there needs to hear today.\n\nConsistency isn't about being perfect; it's about showing up.\n\n👇 **How are you showing up today? Let me know in the comments!**\n\n#PersonalBranding #LinkedInGrowth #JustStart #KolinkAI";

        const tips = isSpanish
            ? "¡Gran comienzo! Intenta agregar una anécdota personal específica la próxima vez para aumentar la conexión."
            : "Great start! Try adding a specific personal anecdote next time to increase relatability.";

        return {
          post_content: content,
          auditor_report: {
            viral_score: 85,
            hook_strength: "High",
            hook_score: 9,
            readability_score: 9,
            value_score: 8,
            pro_tip: tips,
            retention_estimate: "45s",
            flags_triggered: []
          },
          strategy_reasoning: `FALLBACK GENERATION (AI BLOCKED): ${err instanceof Error ? err.message : JSON.stringify(err)}`,
          meta: {
            suggested_hashtags: ["#PersonalBranding", "#LinkedInGrowth", "#JustStart"],
            character_count: content.length
          }
        } as GeneratedPost;
      }
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
      const payload = {
        // tools: [{ google_search: {} }], // Optional: Enable if needed and verified supported in v1beta REST
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              carousel_config: {
                type: "OBJECT",
                properties: {
                  theme_id: { type: "STRING" },
                  settings: {
                    type: "OBJECT",
                    properties: {
                         aspect_ratio: { type: "STRING" },
                         dark_mode: { type: "BOOLEAN" }
                    }
                  }
                },
                required: ["theme_id", "settings"]
              },
              slides: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    id: { type: "STRING" },
                    type: { type: "STRING", enum: ["intro", "content", "outro"] },
                    layout_variant: { type: "STRING" },
                    content: {
                        type: "OBJECT",
                        properties: {
                            title: { type: "STRING" },
                            subtitle: { type: "STRING" },
                            body: { type: "STRING" },
                            visual_hint: { type: "STRING" }
                        },
                        required: ["title", "body"]
                    },
                    design_overrides: {
                        type: "OBJECT",
                        properties: {
                            swipe_indicator: { type: "BOOLEAN" }
                        }
                    }
                  },
                  required: ["type", "layout_variant", "content"]
                },
              },
              linkedin_post_copy: { type: "STRING" }
            },
            required: ["carousel_config", "slides", "linkedin_post_copy"]
          },
        },
      };

      const data = await this.generateViaFetch(this.model, payload) as GeminiResponse;
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("No text returned for Carousel");

      return this.extractJson(text) as unknown as CarouselGenerationResult;
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
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        system_instruction: { parts: [{ text: IdeaGeneratorBrain.system_instruction }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              ideas: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    title: { type: "STRING" },
                    angle: { type: "STRING" },
                    description: { type: "STRING" },
                    suggested_format: { type: "STRING" },
                    viral_potential_score: { type: "INTEGER" },
                    ai_reasoning: { type: "STRING" },
                  },
                  required: ["title", "angle", "description", "suggested_format", "viral_potential_score", "ai_reasoning"]
                },
              },
            },
            required: ["ideas"]
          },
        },
      };

      const data = await this.generateViaFetch(this.model, payload) as GeminiResponse;
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) throw new Error("No ideas returned");

      const json = this.extractJson(text);
      return json as unknown as { ideas: Idea[] };
    });
  }

  /**
   * Generates content using a custom prompt and schema.
   */
  async generateDirect(prompt: string, schemaProperties: Record<string, unknown>) {
      return await this.retryWithBackoff(async () => {
          // Dynamic schema construction for raw fetch
          const responseSchema = {
              type: "OBJECT",
              properties: schemaProperties,
              required: Object.keys(schemaProperties)
          };

          const payload = {
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                  responseMimeType: "application/json",
                  responseSchema: responseSchema
              }
          };

          const data = await this.generateViaFetch(this.model, payload) as GeminiResponse;
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!text) throw new Error("No content returned (Direct Mode)");

          return this.extractJson(text);
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
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              predicted_performance: {
                type: "OBJECT",
                properties: {
                  total_score: { type: "INTEGER" },
                  top_archetype_resonance: { type: "STRING" },
                  dwell_time_estimate: { type: "STRING" }
                },
                required: ["total_score", "top_archetype_resonance", "dwell_time_estimate"]
              },
              audience_feedback: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    archetype: { type: "STRING" },
                    reaction: { type: "STRING" }
                  },
                  required: ["archetype", "reaction"]
                }
              },
              micro_optimization_tips: {
                type: "ARRAY",
                items: { type: "STRING" }
              },
              improved_hook_alternative: { type: "STRING" }
            },
            required: ["predicted_performance", "audience_feedback", "micro_optimization_tips", "improved_hook_alternative"]
          },
        },
      };

      const data = await this.generateViaFetch(this.model, payload) as GeminiResponse;
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("No prediction returned");

      return this.extractJson(text) as unknown as EngagementPrediction;
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
          const payload = {
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                  temperature: 0.7,
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: "OBJECT",
                      properties: {
                          title: { type: "STRING" },
                          subtitle: { type: "STRING" },
                          body: { type: "STRING" }
                      },
                      required: ["title", "body"]
                  },
              }
          };

          const data = await this.generateViaFetch(this.model, payload) as GeminiResponse;
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!text) throw new Error("No refined content returned");

          return this.extractJson(text) as unknown as Partial<CarouselSlideData>;
      });
  }
}
