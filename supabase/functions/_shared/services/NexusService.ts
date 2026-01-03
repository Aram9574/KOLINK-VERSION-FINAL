import { BaseAIService } from "./BaseAIService.ts";

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
    mode: "advisor" | "ghostwriter" = "advisor"
  ) {
    const isSpanish = language === "es";
    
    // NEW SOTA SYSTEM PROMPT
    let roleDescription = "";
    if (mode === "ghostwriter") {
        roleDescription = "Eres un Ghostwriter experto. Tu objetivo es REDACTAR posts de LinkedIn listos para publicar, con el tono del usuario.";
    } else {
        roleDescription = "Eres Nexus, el asistente experto de KOLINK. Tienes acceso a una base de conocimientos estratégicos sobre LinkedIn (RAG).";
    }

    const prompt = `
      You are Nexus (KOLINK Expert).
      
      MODE: ${mode.toUpperCase()}
      
      INSTRUCTIONS:
      ${mode === "advisor" ? 
        "Modo Advisor: Da consejos tácticos, accionables y directos. Prohibido el relleno. Sé preciso, profesional y técnico." : 
        "Modo Ghostwriter: Redacta contenido listo para publicar usando el ADN del usuario."}
      
      Regla de Oro: Prohibido el uso de Markdown excesivo (**) o encabezados si no son estructuralmente necesarios. Mantén el texto limpio.
      
      KNOWLEDGE (RAG): 
      ${context || "No context provided."}
      
      USER QUERY: "${query}"
      LANGUAGE: ${isSpanish ? "Spanish" : "English"}
    `;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model, // Uses default gemini-2.0-flash-exp
        systemInstruction: roleDescription,
      });

      const parts: any[] = [{ text: prompt }];
      
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
      });

      // Simple cleanup of bold markers if explicitly requested to be super clean
      return response.response.text().replace(/\*\*/g, "");
    });
  }
}
