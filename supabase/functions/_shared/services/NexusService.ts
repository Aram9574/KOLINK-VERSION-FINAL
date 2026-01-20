import { BaseAIService } from "./BaseAIService.ts";
import { NexusBrain } from "../prompts/NexusBrain.ts";

export class NexusService extends BaseAIService {
  /**
   * Generates embeddings using Gemini's text-embedding-004.
   */
  async createEmbedding(text: string): Promise<number[]> {
    return await this.retryWithBackoff(async () => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${this.geminiApiKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: {
            parts: [{ text: text }]
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Embedding API Error: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      return data.embedding.values;
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
      const parts = [{ text: prompt }];
      
      if (imageBase64) {
        parts.push({
            inlineData: {
                mimeType: "image/png",
                data: imageBase64.split(',')[1] || imageBase64
            }
        } as any);
      }

      // Construct REST Payload manually
      const payload = {
        contents: [{ role: "user", parts: parts }],
        system_instruction: { parts: [{ text: roleDescription }] },
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              response: { type: "STRING" },
              strategic_insight: { type: "STRING" },
              suggested_actions: { 
                type: "ARRAY", 
                items: { type: "STRING" } 
              },
              rag_sources_used: { type: "BOOLEAN" },
              cloning_recommendation: { type: "STRING" },
              predictive_alert: { type: "STRING" }
            },
            required: ["response", "strategic_insight", "suggested_actions"]
          }
        }
      };

      const data: any = await this.generateViaFetch(this.model, payload);
      
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No content returned from AI");

      return this.extractJson(text);
    });
  }
}
