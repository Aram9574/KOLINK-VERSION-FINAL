import {
  GoogleGenerativeAI,
  Schema,
  SchemaType,
  Tool,
} from "@google/generative-ai";
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

    return await this.retryWithBackoff(async () => {
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
   * Generates a LinkedIn Carousel JSON using Native Gemini Analysis (Grounding).
   */
  async generateCarousel(
    source: string,
    sourceType: string,
    styleFragments: string[],
    _profile: UserProfileContext,
    language: string = "es",
  ) {
    const styleContext = styleFragments.length > 0
      ? `Tone and style examples from the user:\n${
        styleFragments.join("\n---\n")
      }`
      : "Tone: Professional and engaging.";

    // Detect if we have actual content or just a URL reference
    const hasCalculatedContent = source.includes("[VIDEO TRANSCRIPT]") ||
      source.includes("[WEB CONTENT]") || source.includes("[RAW TEXT]");
    const isMetadataOnly = source.includes("[VIDEO METADATA]") ||
      source.includes("[WEB METADATA]");

    let analysisStrategy = "";
    if (hasCalculatedContent) {
      analysisStrategy =
        "The content has been pre-extracted for you. ANALYZE THE TEXT PROVIDED IN 'INPUT SOURCE' DEEPLY. Do NOT use Google Search to find this content again, as you already have it. Focus on the text.";
    } else if (isMetadataOnly) {
      analysisStrategy =
        "The input is a URL where auto-extraction failed. YOU MUST USE your 'googleSearch' tool to find the content of this URL. If you cannot find it, infer from the URL text itself.";
    } else {
      analysisStrategy =
        "The input is likely a raw topic or query. Use your 'googleSearch' tool to find relevant, high-performing content about this topic to ground your carousel.";
    }

    const prompt = `
      Act as a Lead Content Strategist & LinkedIn Viral Growth Expert. You are Kolink's most advanced Carousel Architect.
      
      Your mission is to analyze the provided INPUT SOURCE and transform it into a high-impact, narrative-driven LinkedIn Carousel.

      INPUT SOURCE:
      ${source}
      
      USER STYLE CONTEXT:
      ${styleContext}
      
      PHASE 1: ANALYSIS STRATEGY
      ${analysisStrategy}
      
      PHASE 2: DEEP CONTENT DECONSTRUCTION
      After analyzing the content, identify:
      - Who is the ideal reader?
      - What is the single most provocative or valuable insight?
      - What is the 'Enemy' and the 'Promised Land'?

      PHASE 3: NARRATIVE ARCHITECTURE
      Apply Kolink's viral strategies: Short sentences, high impact, and voice cloning from the user's style.
      
      INSTRUCTIONS:
      1. Design a 7-12 slide carousel. 
      2. Slide 1 (Hook): Must stop the scroll. Bold and controversial.
      3. Slides 2-N: Each slide represents ONE clear idea/step. Use bolding.
      4. Final Slide (CTA): Driven by value.
      
      JSON STRUCTURE:
      {
        "carousel_config": { 
          "slides_count": number, 
          "tone": "string", 
          "target_audience": "string",
          "core_value": "string",
          "analysis": "Brief deconstruction of the source material" 
        },
        "slides": [
          { "number": 1, "title": "Headline", "content": "Subtext" },
          { "number": 2, "title": "Section Title", "content": "Narrative" }
        ]
      }
      
      IMPORTANT: All content in the JSON (titles, subtexts, analysis, etc.) MUST be written in ${
      language === "es" ? "SPANISH (Español)" : "ENGLISH"
    }.
      Ensure 'content' is formatted for readability. Output ONLY the JSON.
    `;

    return await this.retryWithBackoff(async () => {
      console.log(
        `[AIService] Generating from ${sourceType}. Has Content: ${hasCalculatedContent}`,
      );

      const fullPrompt = `
        ${prompt}
        
        CRITICAL GUIDELINES:
        1. IF CONTENT IS PROVIDED: Base your carousel 100% on the text provided in the [TAGS].
        2. IF URL ONLY: Use search to find it. If you cannot find it, infer the likely topic from the URL logic or fail gracefully.
        3. VIRALITY: You must make it viral, but maximize value.
        4. ANALYSIS FIELD: Quote a specific sentence from the source in the 'analysis' field to prove grounding.
      `;

      const model = this.genAI.getGenerativeModel({
        model: this.model,
        // @ts-ignore: googleSearch is the correct grounding tool for public Gemini API
        tools: [
          {
            googleSearch: {},
          },
        ] as unknown as Tool[],
      });

      console.log(`[AIService] Sending request to Gemini (${this.model})...`);
      try {
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.1, // Keep strict
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
                  required: [
                    "slides_count",
                    "tone",
                    "target_audience",
                    "core_value",
                    "analysis",
                  ],
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
                    required: ["number", "title", "content"],
                  },
                },
              },
              required: ["carousel_config", "slides"],
            } as Schema,
          },
        });

        const responseText = result.response.text();
        console.log(
          `[AIService] Gemini Response received. Length: ${responseText.length}`,
        );
        return JSON.parse(responseText);
      } catch (geminiError: unknown) {
        console.error(`[AIService] Gemini API Error:`, geminiError);
        throw geminiError;
      }
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

  /**
   * Generates a response from the LinkedIn Expert persona using RAG context.
   */
  async generateExpertResponse(
    query: string,
    context: string,
    language: string = "es",
  ) {
    const isSpanish = language === "es";
    const prompt = `
      ${
      isSpanish
        ? `Eres el "KOLINK Expert", un asistente de IA especializado en LinkedIn.
      Tu misión es ayudar al usuario a dominar LinkedIn, ser viral y construir su marca personal.

      CONTEXTO DE CONOCIMIENTO (RAG):
      ${
          context ||
          "No hay contexto específico disponible. Responde con tus conocimientos generales sobre LinkedIn."
        }

      CONSULTA DEL USUARIO:
      "${query}"

      INSTRUCCIONES:
      1. Responde de forma concisa, práctica y profesional.
      2. Usa el contexto proporcionado para enriquecer tu respuesta si es relevante.
      3. Si el usuario pregunta algo fuera de LinkedIn, redirígelo amablemente.
      4. Estructura tu respuesta con bullets si es necesario para facilitar la lectura.
      5. Mantén un tono motivador pero realista.

      Responde directamente al usuario.`
        : `You are the "KOLINK Expert", an AI assistant specialized in LinkedIn.
      Your mission is to help the user master LinkedIn, go viral, and build their personal brand.

      KNOWLEDGE CONTEXT (RAG):
      ${
          context ||
          "No specific context available. Answer with your general knowledge about LinkedIn."
        }

      USER QUERY:
      "${query}"

      INSTRUCTIONS:
      1. Respond concisely, practically, and professionally.
      2. Use the provided context to enrich your answer if relevant.
      3. If the user asks something outside of LinkedIn, kindly redirect them.
      4. Structure your response with bullets if necessary for better readability.
      5. Maintain a motivating but realistic tone.

      Respond directly to the user.`
    }
    `;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        systemInstruction: isSpanish
          ? "Eres un experto en crecimiento orgánico en LinkedIn y marca personal."
          : "You are an expert in LinkedIn organic growth and personal branding.",
      });

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      return response.response.text();
    });
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 2000,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      if (
        retries > 0 &&
        (err.status === 503 || err.message?.includes("overloaded"))
      ) {
        await new Promise((r) => setTimeout(r, delay));
        return this.retryWithBackoff(operation, retries - 1, delay * 2);
      }
      throw error;
    }
  }
}
