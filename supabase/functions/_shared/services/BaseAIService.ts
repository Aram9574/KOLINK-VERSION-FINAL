import { GoogleGenerativeAI } from "npm:@google/generative-ai@^0.21.0";

export class BaseAIService {
  protected genAI: GoogleGenerativeAI;
  protected model = "gemini-3-flash-preview";

  constructor(geminiApiKey: string) {
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is required");
    }
    this.genAI = new GoogleGenerativeAI(geminiApiKey);
  }

  protected async retryWithBackoff<T>(
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
        (err.status === 503 || err.status === 429 || err.message?.includes("overloaded"))
      ) {
        console.log(`[BaseAIService] Service overloaded. Retrying in ${delay}ms... (${retries} left)`);
        await new Promise((r) => setTimeout(r, delay));
        return this.retryWithBackoff(operation, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  /**
   * Generates raw text without structured JSON.
   */
  async generateRawText(prompt: string, systemInstruction: string = "Generate ONLY the raw text requested. No introduction, no markdown.") {
    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        systemInstruction,
      });

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      return response.response.text().trim().replace(/\*\*/g, "");
    });
  }
}
