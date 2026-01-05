import { GoogleGenerativeAI } from "@google/generative-ai";

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
   * Helper to extract JSON from AI response, stripping markdown markers if present.
   */
  protected extractJson(text: string): Record<string, unknown> {
    try {
      // Find the first { and last }
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start === -1 || end === -1) {
          throw new Error("No JSON object found in response: " + text);
      }
      const jsonStr = text.substring(start, end + 1);
      return JSON.parse(jsonStr);
    } catch (_error) {
      console.error("[BaseAIService] Failed to parse JSON:", text);
      throw new Error("INTERNAL_JSON_PARSE_ERROR");
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
