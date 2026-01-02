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
  async analyzeVoice(contentSamples: string[], language: string = "es") {
    const samples = contentSamples.join("\n---\n");
    const prompt = `
        You are an expert Brand Strategist.
        Analyze these LinkedIn samples to extract a "Brand Voice" for an LLM.
        Samples:
        ${samples}
        Language: ${language}
    `;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        systemInstruction: "You are a brand voice analyst.",
      });

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
              keywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            },
            required: ["name", "description", "keywords"],
          } as Schema,
        },
      });

      return JSON.parse(response.response.text());
    });
  }
}
