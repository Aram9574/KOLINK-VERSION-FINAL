import { BaseAIService } from "./BaseAIService.ts";
import { Schema, SchemaType } from "@google/generative-ai";
import { LinkedInAuditResult, LinkedInPDFData } from "../types.ts";

export class AuditService extends BaseAIService {
  /**
   * Extracts structured data from a LinkedIn profile PDF.
   */
  async extractLinkedInPDF(pdfBase64: string): Promise<LinkedInPDFData> {
    const prompt = `
      Extract professional info from this LinkedIn PDF into JSON:
      {
        "full_name": "string",
        "profile_url": "string",
        "headline": "string",
        "summary": "string",
        "occupation": "string",
        "experiences": [{"company": "string", "position": "string", "duration": "string", "description": "string"}],
        "skills": ["string"],
        "education": ["string"]
      }
    `;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { data: pdfBase64, mimeType: "application/pdf" } },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      });
      return JSON.parse(result.response.text());
    });
  }

  /**
   * Performs a comprehensive LinkedIn Profile Audit.
   */
  async analyzeLinkedInProfile(
    profileData: LinkedInPDFData & { avatar_url?: string; banner_url?: string | null },
    language: string = "es"
  ): Promise<LinkedInAuditResult> {
    const isSpanish = language === "es";
    const prompt = `
      Act as a Personal Branding Expert. Conduct an audit of this profile:
      ${JSON.stringify(profileData)}
      Output JSON with score, summary, and suggested optimizations for Headline/About/Experience.
      LANGUAGE: ${isSpanish ? "Spanish" : "English"}
    `;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      });
      return JSON.parse(response.response.text());
    });
  }

  /**
   * Analyzes content samples to extract a unique Brand Voice.
   */
  async analyzeVoice(contentSamples: string[], language: string = "es", imageBase64?: string) {
    const samples = contentSamples.join("\n---\n");
    let prompt = `
        Actúa como un Ingeniero de Análisis Lingüístico y Marca Personal.
        Tu objetivo es procesar un conjunto de textos y extraer un ADN Estilístico estructurado.
        
        Instrucciones de análisis:
        1. Estructura de Oración: Identifica si el autor prefiere oraciones cortas e impactantes o explicaciones médicas/técnicas profundas.
        2. Patrones de Hook: Analiza cómo abre sus posts (¿Pregunta retórica?, ¿Dato estadístico?, ¿Historia personal?).
        3. Vocabulario de Autoridad: Lista términos técnicos recurrentes del sector (Salud, IA, Emprendimiento).
        4. Frecuencia de Emojis y Formato: Determina el uso de listas, negritas y espacios en blanco.

        Samples to analyze:
        ${samples}
        
        Language: ${language}
    `;

    if (imageBase64) {
        prompt += `\n\n[VISUAL MIMICRY ENABLED]
        An image has been provided. Analyze the visual structure of the text in the image (line spacing, bold usage, list bullets style) and incorporate findings into 'formatting_rules'.`;
    }

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash", // Upgraded model for vision
        systemInstruction: "You are a specialized Ghostwriter AI.",
      });

      const parts: any[] = [{ text: prompt }];
      if (imageBase64) {
          parts.push({
              inlineData: {
                  mimeType: "image/png", // Assuming PNG, but could be dynamic
                  data: imageBase64.split(',')[1] || imageBase64
              }
          });
      }

      const response = await model.generateContent({
        contents: [{ role: "user", parts: parts }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING, description: "Style Name (e.g. 'Tech Visionary')" },
              description: { type: SchemaType.STRING, description: "Brief description of the voice" },
              keywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              stylisticDNA: {
                type: SchemaType.OBJECT,
                properties: {
                   tone: { type: SchemaType.STRING },
                   sentence_structure: { type: SchemaType.STRING },
                   hooks_dna: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                   technical_terms: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                   formatting_rules: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
                },
                required: ["tone", "sentence_structure", "hooks_dna", "technical_terms", "formatting_rules"]
              }
            },
            required: ["name", "description", "keywords", "stylisticDNA"],
          } as Schema,
        },
      });

      return JSON.parse(response.response.text());
    });
  }
}
