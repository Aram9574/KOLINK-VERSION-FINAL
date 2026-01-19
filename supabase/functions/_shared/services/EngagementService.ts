import { BaseAIService } from "./BaseAIService.ts";
import { InsightResponderBrain } from "../prompts/InsightResponderBrain.ts";
// import { SchemaType, Schema, Part } from "@google/generative-ai"; // REMOVED

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
4. **ANÁLISIS VISUAL OBLIGATORIO:** Si recibes una imagen, NO la ignores. Tu respuesta DEBE demostrar que has analizado el contenido visual (descubre textos, gráficos, emociones en rostros o detalles del diseño). Usa esto para contextualizar tu respuesta.
5. **IDIOMA:** Responde exclusivamente en ${language === "es" ? "ESPAÑOL" : "INGLÉS"}.
${brandContext}
`;

    const fullSystemInstruction = `${InsightResponderBrain.system_instruction}\n\n${sessionSpecifics}`;

    return await this.retryWithBackoff(async () => {
      // Construct parts manually
      const parts: any[] = [];
      if (textContext) parts.push({ text: `POST TEXT CONTENT:\n${textContext}` });
      if (imageBase64) {
        // Extract real mime type if present in data URL, default to png
        const mimeType = imageBase64.match(/data:(.*?);base64/)?.[1] || "image/png";
        const cleanData = imageBase64.split(',')[1] || imageBase64;

        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: cleanData
          }
        });
      }

      // Construct payload for raw fetch
      const payload = {
        contents: [{ role: "user", parts }],
        system_instruction: { parts: [{ text: fullSystemInstruction }] },
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              suggested_replies: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    type: { type: "STRING" },
                    content: { type: "STRING" },
                    score: { type: "NUMBER" },
                    reasoning: { type: "STRING" },
                    expected_outcome: { type: "STRING" }
                  },
                  required: ["type", "content", "score", "reasoning", "expected_outcome"]
                }
              }
            },
            required: ["suggested_replies"]
          }
        }
      };

      console.log("[EngagementService] Sending payload to Gemini (Image present:", !!imageBase64, ")");
      // console.log("Payload:", JSON.stringify(payload, null, 2)); // Too verbose with image

      const data = await this.generateViaFetch(this.model, payload);
      
      console.log("[EngagementService] Received data from Gemini");

      // Handle raw content if present
      const textResult = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResult) {
          console.error("[EngagementService] No text result. Candidates:", JSON.stringify(data.candidates));
          throw new Error("No content returned from Gemini");
      }
      
      try {
        return JSON.parse(textResult);
      } catch (parseError) {
        console.error("[EngagementService] JSON Parse Error. Raw Text:", textResult);
        // Attempt to clean markdown code blocks if present (BaseAIService helper might be useful or direct regex)
        const cleanText = textResult.replace(/```json/g, "").replace(/```/g, "").trim();
        try {
            return JSON.parse(cleanText);
        } catch (retryError) {
            throw new Error("Failed to parse AI response as JSON: " + textResult.substring(0, 100) + "...");
        }
      }
    });
  }
}
