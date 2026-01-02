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
    language: string = "es"
  ) {
    const isSpanish = language === "es";
    const prompt = `
      You are the "KOLINK Expert".
      KNOWLEDGE (RAG): ${context || "No context."}
      USER QUERY: "${query}"
      LANGUAGE: ${isSpanish ? "Spanish" : "English"}
    `;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        systemInstruction: isSpanish
          ? "Eres un experto en crecimiento orgánico en LinkedIn."
          : "You are an expert in LinkedIn organic growth.",
      });

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      return response.response.text().replace(/\*\*/g, "");
    });
  }
}
