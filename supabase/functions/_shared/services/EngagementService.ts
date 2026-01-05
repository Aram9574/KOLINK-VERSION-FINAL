import { BaseAIService } from "./BaseAIService.ts";
import { InsightResponderBrain } from "../prompts/InsightResponderBrain.ts";
import { SchemaType, Schema, Part } from "@google/generative-ai";

export class EngagementService extends BaseAIService {
  async generateInsightReply(params: {
    textContext?: string;
    imageBase64?: string;
    userIntent?: string;
    tone?: string;
    brandVoiceData?: { stylisticDNA?: string; description?: string };
    language?: string;
  }) {
    const { textContext, imageBase64, userIntent, tone, brandVoiceData, language } = params;
    
    const brandContext = brandVoiceData 
        ? `\n\nUSER BRAND VOICE DNA:\n${JSON.stringify(brandVoiceData.stylisticDNA || brandVoiceData.description)}` 
        : "";

    const sessionSpecifics = `
### INSTRUCCIONES DE SESIÓN (PRIORIDAD MÁXIMA):
1. **INTENCIÓN DEL USUARIO:** "${userIntent || "Aportar valor estratégico y fomentar conversación"}"
2. **TONO REQUERIDO:** "${tone || "Autoridad Profesional"}"
3. **CUMPLIMIENTO:** Debes integrar estricta y creativamente la INTENCIÓN y el TONO en cada una de las 3 variantes generadas. No ignores la intención del usuario a favor de los arquetipos estándar.
4. **IDIOMA:** Responde exclusivamente en ${language === "es" ? "ESPAÑOL" : "INGLÉS"}.
${brandContext}
`;

    const fullSystemInstruction = `${InsightResponderBrain.system_instruction}\n\n${sessionSpecifics}`;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        systemInstruction: fullSystemInstruction,
      });

      const parts: Part[] = [];
      if (textContext) parts.push({ text: `POST TEXT CONTENT:\n${textContext}` });
      if (imageBase64) {
        parts.push({
          inlineData: {
            mimeType: "image/png",
            data: imageBase64.split(',')[1] || imageBase64
          }
        });
      }

      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              suggested_replies: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    type: { type: SchemaType.STRING },
                    content: { type: SchemaType.STRING },
                    score: { type: SchemaType.NUMBER },
                    reasoning: { type: SchemaType.STRING },
                    expected_outcome: { type: SchemaType.STRING }
                  },
                  required: ["type", "content", "score", "reasoning", "expected_outcome"]
                }
              }
            },
            required: ["suggested_replies"]
          } as Schema,
        }
      });

      return this.extractJson(result.response.text());
    });
  }
}
