import { z, ZodSchema } from "npm:zod";

export interface GeminiCandidate {
  content?: {
    parts?: { text?: string }[];
  };
}

export interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

export class BaseAIService {
  protected readonly MODEL = "gemini-3-flash-preview";
  protected get model() { return this.MODEL; }
  protected geminiApiKey: string;

  constructor(geminiApiKey: string) {
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is required");
    }
    this.geminiApiKey = geminiApiKey.trim();
  }

  protected async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retries = 5,
    delay = 4000,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      // Handle 429 (Too Many Requests) and 503 (Service Unavailable)
      if (
        retries > 0 &&
        (err.status === 503 || err.status === 429 || err.message?.includes("overloaded") || err.message?.includes("Resource exhausted"))
      ) {
        console.log(`[BaseAIService] Service overloaded/exhausted. Retrying in ${delay}ms... (${retries} left)`);
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
      // 1. Remove markdown code blocks if present
      let cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      // 2. Find the first '{' and last '}' to handle any preamble/postscript
      const start = cleanText.indexOf('{');
      const end = cleanText.lastIndexOf('}');
      
      if (start === -1 || end === -1) {
          throw new Error("No JSON object found in response: " + text.substring(0, 100) + "...");
      }
      
      cleanText = cleanText.substring(start, end + 1);
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("[BaseAIService] Failed to parse JSON:", error);
      console.error("[BaseAIService] Original Text:", text); // Log the full text for debugging
      throw new Error("AI returned invalid JSON. Please try again.");
    }
  }

  /**
   * Raw Fetch implementation to bypass SDK runtime issues in Deno.
   */
  protected async generateViaFetch(
    model: string,
    payload: Record<string, unknown>,
  ): Promise<unknown> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiApiKey}`;
    
    // Log intent (masked)
    console.log(`[BaseAIService] Calling Gemini API (${model})...`);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errText = await response.text();
        const maskedUrl = url.replace(this.geminiApiKey, "***");
        
        // Detailed logging of the error
        console.error(`[BaseAIService] API Error ${response.status} at ${maskedUrl}`);
        console.error(`[BaseAIService] Error Body: ${errText}`);
        
        throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
    }

    return await response.json();
  }

  /**
   * Generates raw text without structured JSON.
   */
  async generateRawText(prompt: string, systemInstruction: string = "Generate ONLY the raw text requested. No introduction, no markdown.") {
    return await this.retryWithBackoff(async () => {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        system_instruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
            temperature: 0.7
        }
      };

      const data = await this.generateViaFetch(this.MODEL, payload) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) throw new Error("No text returned from Gemini API");

      return text.trim().replace(/\*\*/g, "");
    });
  }

  /**
   * Generates content and validates it against a Zod schema.
   * Retries automatically if validation fails.
   */
  async generateWithSchema<T>(
    model: string,
    input: string | { text?: string; inline_data?: { mime_type: string; data: string } }[],
    schema: ZodSchema<T>,
    systemInstruction: string = "You are a helpful AI assistant. Output strictly valid JSON.",
    responseSchema?: Record<string, unknown>
  ): Promise<T> {
    return await this.retryWithBackoff(async () => {
      const config: Record<string, unknown> = {
          temperature: 0.2,
          response_mime_type: "application/json"
      };
      if (responseSchema) {
          config.response_schema = responseSchema;
      }

      const parts = typeof input === 'string' ? [{ text: input }] : input;

      const payload = {
        contents: [{ role: "user", parts: parts }],
        system_instruction: { parts: [{ text: systemInstruction }] },
        generationConfig: config
      };

      try {
        const data = await this.generateViaFetch(model, payload) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error("No text returned from Gemini API");

        // Parse JSON
        const json = this.extractJson(text);

        // Validate with Zod
        const parsed = schema.parse(json);
        return parsed;

      } catch (err: unknown) {
        // Enhance error message for debugging
        const error = err as Error;
        if (error instanceof z.ZodError) {
             console.error(`[BaseAIService] Schema Validation Failed:`, JSON.stringify(error.errors, null, 2));
             throw new Error(`AI Response failed schema validation: ${error.message}`);
        }
        throw error;
      }
    });
  }
}
