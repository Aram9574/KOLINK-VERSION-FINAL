import { BaseAIService } from "./BaseAIService.ts";
import { Schema, SchemaType, Part } from "@google/generative-ai";
import { LinkedInAuditResult, LinkedInPDFData, LinkedInProfileData } from "../types.ts";
import pdf from "pdf-parse";
import { Buffer } from "node:buffer";

export class AuditService extends BaseAIService {
  /**
   * Extracts structured data from a LinkedIn profile PDF.
   */
  async extractLinkedInPDF(pdfBase64: string): Promise<LinkedInPDFData> {
    const prompt = `
      Extract professional info from this LinkedIn PDF into JSON.
      CRITICAL: You MUST extract the LinkedIn Profile URL (e.g. linkedin.com/in/username). Look for it in the 'Contact' section, header, or footer. If you find a public profile ID (e.g. 'aram-zakzuk-123'), construct the full URL.
      
      JSON Structure:
      {
        "full_name": "string",
        "profile_url": "string | null", 
        "headline": "string",
        "summary": "string",
        "occupation": "string",
        "experiences": [{"company": "string", "position": "string", "duration": "string", "description": "string"}],
        "skills": ["string"],
        "education": ["string"]
      }
    `;

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { data: pdfBase64, mimeType: "application/pdf" } },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      });
      return JSON.parse(result.response.text());
    });
  }

  /**
   * Fallback: Deterministic URL extraction using pdf-parse.
   * AI sometimes misses the URL in the text layer. This is a regex-based safety net.
   */
  async extractPdfUrlDeterministic(pdfBase64: string): Promise<string | null> {
      try {
          console.log(`[AuditService] Deterministic Extraction: Input PDF Base64 length: ${pdfBase64.length}`);
          const buffer = Buffer.from(pdfBase64, 'base64');
          const data = await pdf(buffer);
          const text = data.text;
          
          console.log(`[AuditService] PDF Text extracted (${text.length} chars). Snippet: ${text.substring(0, 100)}...`);

          // Relaxed Regex: Optional protocol, optional www
          // Matches: linkedin.com/in/username, www.linkedin.com/in/username, https://...
          const urlRegex = /((https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9%\-_]+)/i;
          const match = text.match(urlRegex);

          if (match && match[0]) {
              console.log("[AuditService] Deterministic URL found:", match[0]);
              // Ensure protocol is present
              let url = match[0];
              if (!url.startsWith("http")) {
                  url = "https://" + url;
              }
              return url;
          }
          
          console.log("[AuditService] No URL found deterministically. Searching manually in text dump...");
          // Fallback: search for "linkedin.com/in" index
          const idx = text.indexOf("linkedin.com/in/");
          if (idx !== -1) {
             // extract until whitespace
             const potential = text.substring(idx, text.indexOf(" ", idx));
             console.log("[AuditService] Manual index recovery:", potential);
             return "https://" + potential.trim();
          }

          return null;
      } catch (e) {
          console.error("[AuditService] Deterministic extraction failed:", e);
          return null;
      }
  }

  /**
   * Triggers Bright Data scraping and polls for results.
   */
  async scrapeLinkedInProfile(profileUrl: string): Promise<Record<string, unknown> | null> {
      const apiKey = Deno.env.get("BRIGHTDATA_API_KEY");
      if (!apiKey) return null;

      try {
          console.log("[AuditService] Triggering Bright Data for:", profileUrl);
          
          // 1. Trigger
          const triggerResp = await fetch(`https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lyy3tktm25m4avu764&include_errors=true`, {
              method: "POST",
              headers: { 
                  "Authorization": `Bearer ${apiKey}`,
                  "Content-Type": "application/json"
              },
              body: JSON.stringify([{ url: profileUrl }])
          });
          
          if (!triggerResp.ok) throw new Error("Failed to trigger scraping");
          const { snapshot_id } = await triggerResp.json();
          console.log("[AuditService] Snapshot ID:", snapshot_id);

          // 2. Poll
          let attempts = 0;
          const maxAttempts = 10; // 20-30 seconds max
          
          while (attempts < maxAttempts) {
              await new Promise(r => setTimeout(r, 2500)); // Wait 2.5s
              
              const statusResp = await fetch(`https://api.brightdata.com/datasets/v3/snapshot/${snapshot_id}?format=json`, {
                  headers: { "Authorization": `Bearer ${apiKey}` }
              });
              
              if (statusResp.ok) {
                  const data = await statusResp.json();
                  if (Array.isArray(data) && data.length > 0 && data[0].info) {
                      console.log("[AuditService] Scraping successful");
                      return data[0]; // Return the first record
                  }
                  // If "status" is running/ready but empty, continue? 
                  // BD usually returns the data immediately when ready or 202/Pending.
                  // If we got JSON array, it's likely done.
                  if (data && data.status === "running") {
                      console.log("[AuditService] Scraping still running...");
                      attempts++;
                      continue; 
                  }
                  // If we get an array but it's empty, maybe it failed or no data found?
              }
              attempts++;
          }
          console.warn("[AuditService] Scraping timed out");
          return null;
          
      } catch (e) {
          console.error("[AuditService] Scraping error:", e);
          return null;
      }
  }

  /**
   * Performs a comprehensive LinkedIn Profile Audit (Multimodal + Hybrid).
   */
  async analyzeLinkedInProfile(
    profileData: LinkedInProfileData,
    _language: string = "es",
    imageBase64?: string
  ): Promise<LinkedInAuditResult> {
    
    // NEW SOTA SYSTEM PROMPT (Strict Spanish)
    const systemPrompt = "Actúa como un Consultor Senior de Marca Personal y Estratega de LinkedIn (Top Voice). Tu misión es realizar una auditoría EXHAUSTIVA, IMPLACABLE pero CONSTRUCTIVA. No seas superficial. Analiza cada coma, cada brecha de autoridad y cada oportunidad perdida.";

    let prompt = `
      CONTEXT: Analyzing a LinkedIn Profile using specific Hybrid Data (PDF Extraction + Live Scraping).
      OUTPUT LANGUAGE: STRICTLY SPANISH (Español).
      
      DATA SOURCE:
      ${JSON.stringify(profileData)}

      CRITICAL ANALYSIS PILLARS:
      1. **Headline Strategy**: Does it clearly state the UVP (Unique Value Proposition)? Is it searchable? Is it memorable?
      2. **About Section Narrative**: Is it a generic bio or a compelling sales letter? Does it build trust?
      3. **Experience & Authority**: Do the descriptions prove competence with metrics (numbers, %, $) or just list duties?
      4. **Visual Psychology**: (If image provided) Does the photo/banner convey professionalism, approachability, and status?

      TASK:
      Generate a detailed, high-impact audit. The "summary" should be a substantial paragraph (4-5 sentences) diagnosing the profile's current market position.
      The "feedback" fields must be detailed critiques (Why is it good/bad?).
      The "suggested" fields must be "Copy-Paste" ready gold-standard examples.

      REQUIRED OUTPUT (JSON):
      {
        "overall_score": (number 0-100),
        "visual_score": (number 0-100),
        "authority_metrics": {
            "headline_impact": (number 0-100),
            "keyword_density": (number 0-100),
            "storytelling_power": (number 0-100),
            "recruiter_clarity": (number 0-100)
        },
        "summary": "Deep strategic diagnosis of the profile...",
        "results": {
            "headline": { "score": 0-100, "feedback": "Detailed critique...", "suggested": "Optimized Headline Example..." },
            "about": { "score": 0-100, "feedback": "Detailed critique...", "suggested": "Optimized About Section Hook (First 3-4 lines)..." },
            "experience": { "score": 0-100, "feedback": "Detailed critique...", "suggested": "Optimized Experience Bullet Points (Metric-driven)..." }
        }
      }
    `;

    if (imageBase64) {
        prompt += `\n\n[VISUAL ANALYSIS ENABLED] An image of the profile is provided. Use it to grade the 'visual_score' and check for alignment between the visual brand and the text claims.`;
    }

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({ 
          model: this.model, 
          systemInstruction: systemPrompt
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
          temperature: 0.3, // Slightly higher for more creative/longer feedback
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              overall_score: { type: SchemaType.NUMBER },
              visual_score: { type: SchemaType.NUMBER },
              authority_metrics: {
                  type: SchemaType.OBJECT,
                  properties: {
                      headline_impact: { type: SchemaType.NUMBER },
                      keyword_density: { type: SchemaType.NUMBER },
                      storytelling_power: { type: SchemaType.NUMBER },
                      recruiter_clarity: { type: SchemaType.NUMBER }
                  },
                  required: ["headline_impact", "keyword_density", "storytelling_power", "recruiter_clarity"]
              },
              summary: { type: SchemaType.STRING },
              results: {
                type: SchemaType.OBJECT,
                properties: {
                  headline: {
                    type: SchemaType.OBJECT,
                    properties: {
                      score: { type: SchemaType.NUMBER },
                      feedback: { type: SchemaType.STRING },
                      suggested: { type: SchemaType.STRING }
                    },
                    required: ["score", "feedback", "suggested"]
                  },
                  about: {
                    type: SchemaType.OBJECT,
                    properties: {
                      score: { type: SchemaType.NUMBER },
                      feedback: { type: SchemaType.STRING },
                      suggested: { type: SchemaType.STRING }
                    },
                    required: ["score", "feedback", "suggested"]
                  },
                  experience: {
                    type: SchemaType.OBJECT,
                    properties: {
                      score: { type: SchemaType.NUMBER },
                      feedback: { type: SchemaType.STRING },
                      suggested: { type: SchemaType.STRING }
                    },
                    required: ["score", "feedback", "suggested"]
                  }
                },
                required: ["headline", "about", "experience"]
              }
            },
            required: ["overall_score", "visual_score", "authority_metrics", "summary", "results"]
          } as Schema,
        },
      });
      return JSON.parse(response.response.text());
    });
  }

  /**
   * Analyzes content samples to extract a unique Brand Voice.
   */
  async analyzeVoice(contentSamples: string[], language: string = "es", imageBase64?: string) {
    const samples = contentSamples.join("\n---\n");
    // NEW SOTA PROMPT FOR VOICE
    let prompt = `
        Eres un Ingeniero de Análisis Lingüístico y Ghostwriter de Élite. Procesa los siguientes textos para extraer el ADN estilístico del autor:

        1. Estructura: Identifica el uso de oraciones cortas vs. explicaciones técnicas profundas.
        2. Patrones de Hook: Detecta si abre con preguntas, datos médicos/tech o historias personales.
        3. Vocabulario: Lista los términos de autoridad más frecuentes (ej: 'escalabilidad', 'preventiva').
        4. Formato: Analiza el uso de emojis, negritas y espacios.

        Samples to analyze:
        ${samples}
        
        Language: ${language}
    `;

    if (imageBase64) {
        prompt += `\n\n[VISUAL MIMICRY ENABLED]
        An image has been provided. Analyze the visual structure of the text in the image (line spacing, bold usage, list bullets style) and incorporate findings into 'formatting_rules'.`;
    }

    return await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model, // Uses gemini-2.0-flash-exp
        systemInstruction: "You are a specialized Ghostwriter AI.",
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
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING, description: "Style Name (e.g. 'Tech Visionary')" },
              description: { type: SchemaType.STRING, description: "Brief description of the voice" },
              keywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              stylisticDNA: {
                type: SchemaType.OBJECT,
                properties: {
                   tone: { type: SchemaType.STRING },
                   sentence_structure: { type: SchemaType.STRING },
                   hooks_dna: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                   technical_terms: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                   formatting_rules: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
                },
                required: ["tone", "sentence_structure", "hooks_dna", "technical_terms", "formatting_rules"]
              }
            },
            required: ["name", "description", "keywords", "stylisticDNA"],
          } as Schema,
        },
      });

      return JSON.parse(response.response.text());
    });
  }
}
