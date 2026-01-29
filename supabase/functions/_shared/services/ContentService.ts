
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
  FEW_SHOT_COT
} from "../prompts.ts";
import { RepurposeService } from "./RepurposeService.ts";

/** 
 * Service for generating content via Gemini 
 */

// Force refresh service definition

export interface Idea {
  title: string;
  angle: string;
  description: string;
  suggested_format: string;
  viral_potential_score: number;
  ai_reasoning: string;
}

import { GenerationParams } from "../schemas.ts";
export type { GenerationParams };

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
    id: string; 
    type: "intro" | "content" | "outro";
    layout?: string;
    layout_variant?: string; 
    content: {
        title: string;
        subtitle?: string;
        body: string;
        visual_hint?: string;
        cta_text?: string;
        image_prompt?: string;
    };
    design_overrides?: {
        swipe_indicator?: boolean;
        highlight_color?: string;
    };
}

export interface CarouselGenerationResult {
    carousel_config: CarouselConfig;
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
  
  private getTemperature(level?: number | string): number {
    if (typeof level === 'number') {
        const normalized = Math.max(0, Math.min(100, level)) / 100;
        return 0.2 + (normalized * 0.75);
    }
    switch (level) {
        case 'high': return 0.95; 
        case 'low': return 0.3;   
        case 'medium': 
        default: return 0.7;      
    }
  }

  /**
   * Generates a Viral LinkedIn Post.
   */
  async generatePost(
    params: GenerationParams,
    userContext: UserProfileContext
  ): Promise<GeneratedPost> {
    const frameworkInstruction = getFrameworkInstructions(params.framework || '');
    const emojiInstruction = getEmojiInstructions(params.emojiDensity || 'medium');
    const lengthInstruction = getLengthInstructions(params.length || 'medium');
    
    // Build context strings
    const behaviorContext = userContext.behavioral_dna 
        ? `\nBEHAVIORAL DNA:\n${userContext.behavioral_dna}` 
        : "";
        
    const voiceContext = userContext.brand_voice
        ? `\nBRAND VOICE:\n${userContext.brand_voice}`
        : "";

    // Append technical instructions to system prompt
    const technicalRules = `
    FRAMEWORK: ${frameworkInstruction}
    EMOJI DENSITY: ${emojiInstruction}
    LENGTH TARGET: ${lengthInstruction}
    `;

    const systemInstruction = PostGeneratorBrain.getSystemPrompt({
        ...userContext,
        industry: userContext.industry || "General",
        xp: userContext.xp || 0,
        company_name: userContext.company_name || "an industry leader"
    });

    const userPrompt = PostGeneratorBrain.getUserPrompt(params, params.topic);

    // Build Few-Shot CoT String
    const fewShotString = `
    ### EXAMPLES OF STRATEGIC THINKING & OUTPUT:
    ${JSON.stringify(FEW_SHOT_COT || [], null, 2)}
    `;
    
    // Enforce strict JSON schema in the prompt to help the model
    const strictSchemaInstruction = `
    IMPORTANT: You MUST return a valid JSON object. Do not include markdown formatting like \`\`\`json.
    Structure:
    {
      "post_content": "The actual post text...",
      "auditor_report": {
        "viral_score": 85,
        "hook_strength": "High",
        "hook_score": 90,
        "readability_score": 88,
        "value_score": 85,
        "pro_tip": "Advice...",
        "retention_estimate": "30s",
        "flags_triggered": []
      },
      "strategy_reasoning": "Detaield Chain of Thought analysis here...",
      "meta": {
        "suggested_hashtags": ["#tag"],
        "character_count": 150
      }
    }
    `;

    return await this.retryWithBackoff(async () => {
      // Set temperature based on creativity level
      const temperature = this.getTemperature(params.creativityLevel);

      const payload = {
        contents: [
          { role: "user", parts: [{ text: `SYSTEM INSTRUCTIONS:\n${systemInstruction}\n\n${behaviorContext}\n${voiceContext}\n\n${technicalRules}` }] },
          { role: "model", parts: [{ text: "Understood. I am the KOLINK AI engine. I will follow the PCTF framework and the Thinking Phase (CoT)." }] },
          { role: "user", parts: [{ text: `${fewShotString}\n\n${userPrompt}\n\nExtra Output Rules:\n${strictSchemaInstruction}` }] }
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

      const data = await this.generateViaFetch(this.model, payload) as GeminiResponse;
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
          throw new Error("No text returned from KOLINK AI engine.");
      }

      const json = this.extractJson(text);
       if (!json.post_content || !json.auditor_report) {
         throw new Error("Invalid AI response structure: Missing post_content or auditor_report");
      }
      return json as unknown as GeneratedPost;
    });
  }

  
  /**
   * Generates a LinkedIn Carousel JSON.
   */
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
      ? `\nBRAND VOICE INSTRUCTIONS (CRITICAL - YOU MUST ADOPT THIS VOICE):\n${profileContext.brand_voice}`
      : "Brand Voice: Neutral, Professional.";

    const repurposeService = new RepurposeService(this.geminiApiKey);
    let finalSource = source;
    let analysisStrategy = "";

    try {
      if (sourceType === 'youtube') {
           const transcript = await repurposeService.fetchYoutubeTranscript(source); 
           finalSource = `[VIDEO TRANSCRIPT]:\n"${transcript}"`;
      } 
      else if (sourceType === 'url') {
           const webContent = await repurposeService.scrapeUrl(source);
           finalSource = `[WEB ARTICLE CONTENT]:\n"${webContent}"`;
      }
      else if (sourceType === 'pdf') {
           const pdfContent = await repurposeService.extractPdfText(source);
           finalSource = `[PDF DOCUMENT CONTENT]:\n"${pdfContent}"`;
      }
      else {
           analysisStrategy = "CONTENT TYPE: RAW TOPIC/TEXT. \nSTRATEGY: Use your internal knowledge to build a comprehensive guide. \nFRAGMENTATION: 7-10 solid slides.";
      }
    } catch (error) {
       console.error("[ContentService] Repurposing Error:", error);
       analysisStrategy = `WARNING: Failed to fetch external content. Treat the input "${source}" as a topic.`;
    }

    const layoutStrategy = `
    SMART LAYOUT STRATEGY (Available Variants):
    - **intro**: MUST be the first slide. High impact title.
    - **classic**: Standard Body + Title. Use for narrative flow.
    - **checklist**: Use for ANY list of 3-5 items (lessons, steps, tools).
    - **comparison**: Use when contrasting "Old Way vs New Way" or "Mistake vs Fix".
    - **quote**: Use for high-impact statements, definitions, or contrarian points.
    - **big-number**: Use for statistics (e.g., "94%") or single powerful words (e.g., "STOP").
    - **code**: Use ONLY if the topic involves programming or prompts.
    - **outro**: MUST be the last slide. CTA focused.
    
    DESIGN RULES (CRITICAL):
    1. **NO EMPTY SLIDES**: Every single slide MUST have substantial content in the 'body' field (min 30 words) unless it's a cover/quote. NEVER use placeholders like "Insert text here".
    2. **VARIETY IS KEY**: Do NOT use 'classic' layout more than twice in a row. Use 'checklist' for steps, 'quote' for insights, 'big-number' for stats.
    3. **CANVA QUALITY**: Imagine each slide is a premium Canva template. The text must be punchy, styled, and complete.
    4. **DENSITY MATTERS**: Users want value. Don't be vague. Give specific tools, numbers, or frameworks. E.g., instead of "Use AI tools", say "Use ChatGPT (ideation) + Midjourney (visuals)".
    5. **NO GENERIC HEADERS**: Avoid "Introduction" or "Conclusion". Use "Why this matters" or "The Bottom Line".
    `;

    const prompt = `
    ${CarouselBrain.system_instruction}
    
    Act as a Lead Content Strategist & LinkedIn Viral Growth Expert.
    Your mission is to analyze the provided INPUT SOURCE and transform it into a high-impact LinkedIn Carousel.

    INPUT SOURCE:
    ${finalSource}
    
    USER CONTEXT LAYERS:
    1. ${styleContext}
    2. ${dnaInstruction}
    3. ${userVoice}
    
    PHASE 1: ANALYSIS STRATEGY & SMART FRAGMENTATION
    ${analysisStrategy}
    
    PHASE 2: LAYOUT SELECTION
    ${layoutStrategy}
    
    PHASE 3: NARRATIVE ARCHITECTURE
    Design a 8-12 slide carousel JSON following the Arc rules.
    - Slide 1 (Intro): Magnetic Headline + Subheadline.
    - Slide 2 (Context): Why this matters now.
    - Middle Slides: The "Meat" of the content. High value.
    - Last Slide (Outro): Strong Call to Action.
    
    Ensure the Tone and Voice match the USER CONTEXT perfectly.
    IMPORTANT: Provide FULL sentences and deep value in 'body'. Do not summarize too much.

      LANGUAGE: ${language === "es" ? "Spanish" : "English"}
    `;

    return await this.retryWithBackoff(async () => {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3, 
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
                    layout: { 
                        type: "STRING", 
                        enum: ["classic", "image-focused", "minimal", "split", "quote", "big-number", "checklist", "code", "comparison", "intro", "outro"] 
                    },
                    content: {
                        type: "OBJECT",
                        properties: {
                            title: { type: "STRING" },
                            subtitle: { type: "STRING" },
                            body: { type: "STRING" },
                            cta_text: { type: "STRING" },
                            image_prompt: { type: "STRING" }
                        },
                        required: ["title", "body"]
                    },
                    design_overrides: {
                        type: "OBJECT",
                        properties: {
                            swipe_indicator: { type: "BOOLEAN" },
                            highlight_color: { type: "STRING" }
                        }
                    }
                  },
                  required: ["type", "layout", "content"]
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
   * Predicts the performance of a post or carousel approaches.
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
   * Refines a specific carousel slide.
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

  /**
   * Translates an entire carousel to a target language.
   */
  async translateCarousel(
    slides: CarouselSlideData[],
    targetLanguage: string
  ): Promise<{ slides: CarouselSlideData[] }> {
      const prompt = `
        You are an expert translator and cultural adapter for LinkedIn content.
        Translate the following JSON slides content to ${targetLanguage}.
        
        INSTRUCTIONS:
        1. Translate 'title', 'subtitle', 'body', 'cta_text' fields accurately.
        2. Adapt cultural references or idioms to be natural in ${targetLanguage}.
        3. Maintain the exact JSON structure and all other fields (id, type, layout, visual_hint).
        4. Do not translate technical keys or enums (like 'type', 'layout').
        5. Ensure the tone remains professional yet viral/engaging.

        SLIDES JSON:
        ${JSON.stringify(slides)}
      `;

      return await this.retryWithBackoff(async () => {
        const payload = {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2, // Lower temp for translation accuracy
            responseMimeType: "application/json",
            responseSchema: {
               type: "OBJECT",
               properties: {
                 slides: {
                   type: "ARRAY",
                   items: {
                     type: "OBJECT",
                     properties: {
                       id: { type: "STRING" },
                       type: { type: "STRING" },
                       layout: { type: "STRING" },
                       content: {
                           type: "OBJECT",
                           properties: {
                               title: { type: "STRING" },
                               subtitle: { type: "STRING" },
                               body: { type: "STRING" },
                               cta_text: { type: "STRING" },
                               visual_hint: { type: "STRING" },
                               image_prompt: { type: "STRING" }
                           },
                           required: ["title", "body"]
                       },
                       design_overrides: { type: "OBJECT", properties: {
                           swipe_indicator: { type: "BOOLEAN" },
                           highlight_color: { type: "STRING" }
                       } }
                     },
                     required: ["id", "type", "layout", "content"]
                   }
                 }
               },
               required: ["slides"]
            }
          }
        };

        const data = await this.generateViaFetch(this.model, payload) as GeminiResponse;
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error("No translation returned");

        return this.extractJson(text) as unknown as { slides: CarouselSlideData[] };
      });
  }
}
