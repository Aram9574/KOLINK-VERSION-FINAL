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
    
    let roleDescription = "";
    if (mode === "ghostwriter") {
        roleDescription = isSpanish 
            ? "ROLE: Eres un Ghostwriter experto. Tu objetivo es REDACTAR posts de LinkedIn listos para publicar, con el tono del usuario."
            : "ROLE: You are an expert Ghostwriter. Your goal is to WRITE LinkedIn posts ready to publish, matching the user's tone.";
    } else {
        roleDescription = isSpanish
            ? "ROLE: Eres Nexus, un estratega de élite en LinkedIn. Tu objetivo es dar consejos tácticos y accionables."
            : "ROLE: You are Nexus, an elite LinkedIn strategist. Your goal is to provide tactical and actionable advice.";
    }

    const prompt = `
      You are the "KOLINK Expert" (Nexus).
      MODE: ${mode.toUpperCase()}
      KNOWLEDGE (RAG): ${context || "No context."}
      USER QUERY: "${query}"
      LANGUAGE: ${isSpanish ? "Spanish" : "English"}
      
      ${roleDescription}
    `;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash", // Force Flash for multimodal
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

      return response.response.text().replace(/\*\*/g, "");
    });
  }
}
