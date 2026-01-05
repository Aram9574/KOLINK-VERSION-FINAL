import { BaseAIService } from "./BaseAIService.ts";
import { NexusBrain } from "../prompts/NexusBrain.ts";
import { SchemaType, Schema, Part } from "@google/generative-ai";

export class NexusService extends BaseAIService {
  /**
   * Generates embeddings using Gemini's text-embedding-004.
   */
  async createEmbedding(text: string): Promise<number[]> {
    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: "text-embedding-004",
      });
      const result = await model.embedContent(text);
      return result.embedding.values;
    });
  }

  /**
   * Generates a response from the LinkedIn Expert persona using RAG context.
   */
  async generateExpertResponse(
    query: string,
    context: string,
    language: string = "es",
    imageBase64?: string,
    mode: "advisor" | "ghostwriter" = "advisor",
    personalContext: string = ""
  ) {
    const isSpanish = language === "es";
    
    // NEW SOTA SYSTEM PROMPT
    let roleDescription = NexusBrain.system_instruction;
    if (mode === "ghostwriter") {
        roleDescription += "\nTu objetivo específico ahora es REDACTAR posts de LinkedIn listos para publicar, con el tono del usuario.";
    }

    if (personalContext) {
        roleDescription += `\n\nCONTEXTO PSICOLÓGICO Y CONDUCTUAL DEL USUARIO:\n${personalContext}\nUsa esto para que la conversación se sienta profundamente personal y proactiva.`;
    }

    const prompt = `
      You are Nexus (KOLINK Expert).
      
      Your mission is to help the user master LinkedIn, go viral, and build their personal brand.
      
      MODE: ${mode.toUpperCase()}
      
      Legacy Expert Core Rules:
      1. Respond concisely, practically, and professionally.
      2. Use the provided context to enrich your answer if relevant.
      3. If the user asks something outside of LinkedIn, kindly redirect them.
      4. Structure your response with bullets if necessary for better readability.
      5. Maintain a motivating but realistic tone.
      
      Modo Específico:
      ${mode === "advisor" ? 
        "Advisor: Da consejos tácticos, accionables y directos. Prohibido el relleno. Sé preciso, profesional y técnico." : 
        "Ghostwriter: Redacta contenido listo para publicar usando el ADN del usuario."}
      
      KNOWLEDGE (RAG): 
      ${context || "No context provided."}
      
      USER QUERY: "${query}"
      LANGUAGE: ${isSpanish ? "Spanish" : "English"}
    `;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model, // Uses default gemini-3.0-flash
        systemInstruction: roleDescription,
      });

      const parts: Part[] = [{ text: prompt }];
      
      if (imageBase64) {
        parts.push({
            inlineData: {
                mimeType: "image/png",
                data: imageBase64.split(',')[1] || imageBase64
            }
        });
      }

      const response = await model.generateContent({
        contents: [{ role: "user", parts: parts }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              response: { type: SchemaType.STRING },
              strategic_insight: { type: SchemaType.STRING },
              suggested_actions: { 
                type: SchemaType.ARRAY, 
                items: { type: SchemaType.STRING } 
              },
              rag_sources_used: { type: SchemaType.BOOLEAN },
              cloning_recommendation: { type: SchemaType.STRING },
              predictive_alert: { type: SchemaType.STRING }
            },
            required: ["response", "strategic_insight", "suggested_actions"]
          } as Schema
        }
      });

      return this.extractJson(response.response.text());
    });
  }
}
