import { BaseAIService } from "./BaseAIService.ts";
import { LinkedInAuditResult, LinkedInPDFData, LinkedInProfileData } from "../types.ts";
import { AuditBrain } from "../prompts/AuditBrain.ts";
import { VoiceBrain } from "../prompts/VoiceBrain.ts";
import pdf from "npm:pdf-parse@^1.1.1";
import { Buffer } from "node:buffer";

export class AuditService extends BaseAIService {
  /**
   * Extracts structured data from a LinkedIn profile PDF.
   */
  async extractLinkedInPDF(pdfBase64: string): Promise<LinkedInPDFData> {
    const prompt = `
      Extract professional info from this LinkedIn PDF into JSON.
      
      CRITICAL IDENTITY RULES:
      1. **Primary Profile Only**: Extract the info of the person whose profile this is (usually the name in the header). IGNORE people mentioned in recommendations or shares.
      2. **LinkedIn URL**: You MUST find the LinkedIn Profile URL (e.g. linkedin.com/in/username). It is usually in the 'Contact' section, header, or footer. 
      3. **URL Construction**: If you find a public profile slug (e.g. 'aram-zakzuk'), absolute construction is REQUIRED: "https://www.linkedin.com/in/aram-zakzuk".
      4. **Verification**: Cross-reference the name with the URL slug to ensure they match.
      
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
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inline_data: { mime_type: "application/pdf", data: pdfBase64 } },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          response_mime_type: "application/json",
        },
      };

      const data = await this.generateViaFetch(this.MODEL, payload);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No text returned from Gemini");
      return JSON.parse(text);
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
                  if (data && data.status === "running") {
                      console.log("[AuditService] Scraping still running...");
                      attempts++;
                      continue; 
                  }
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
    const systemPrompt = AuditBrain.system_instruction;

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
    `;

    if (imageBase64) {
        prompt += `\n\n[VISUAL ANALYSIS ENABLED] An image of the profile is provided. Use it to grade the 'visual_score' and check for alignment between the visual brand and the text claims.`;
    }

    return await this.retryWithBackoff(async () => {
      const parts: any[] = [{ text: prompt }];

      if (imageBase64) {
          const mimeType = imageBase64.match(/data:(.*?);base64/)?.[1] || "image/png";
          const cleanData = imageBase64.split(',')[1] || imageBase64;
          parts.push({
              inline_data: {
                  mime_type: mimeType,
                  data: cleanData
              }
          });
      }

      const payload = {
        contents: [{ role: "user", parts: parts }],
        system_instruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.3,
          response_mime_type: "application/json",
          response_schema: {
            type: "OBJECT",
            properties: {
              authority_score: { type: "NUMBER" },
              brutal_diagnosis: { type: "STRING" },
              quick_wins: { 
                type: "ARRAY", 
                items: { type: "STRING" } 
              },
              strategic_roadmap: {
                type: "OBJECT",
                properties: {
                  headline: { type: "STRING" },
                  about: { type: "STRING" },
                  experience: { type: "STRING" }
                },
                required: ["headline", "about", "experience"]
              },
              visual_critique: { type: "STRING" },
              technical_seo_keywords: { 
                type: "ARRAY", 
                items: { type: "STRING" } 
              }
            },
            required: ["authority_score", "brutal_diagnosis", "quick_wins", "strategic_roadmap", "visual_critique", "technical_seo_keywords"]
          },
        },
      };

      const data = await this.generateViaFetch(this.MODEL, payload);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No text returned from Gemini");
      return JSON.parse(text);
    });
  }

  /**
   * Analyzes content samples to extract a unique Brand Voice.
   */
  async analyzeVoice(contentSamples: string[], language: string = "es", imageBase64?: string) {
    const samples = contentSamples.join("\n---\n");
    let prompt = `
        Samples to analyze:
        ${samples}
        
        Language: ${language}
    `;

    if (imageBase64) {
        prompt += `\n\n[VISUAL MIMICRY ENABLED]
        An image has been provided. Analyze the visual structure of the text in the image (line spacing, bold usage, list bullets style) and incorporate findings into 'formatting_rules'.`;
    }

    return await this.retryWithBackoff(async () => {
      const parts: any[] = [{ text: prompt }];
      
      if (imageBase64) {
          const mimeType = imageBase64.match(/data:(.*?);base64/)?.[1] || "image/png";
          const cleanData = imageBase64.split(',')[1] || imageBase64;
          parts.push({
              inline_data: {
                  mime_type: mimeType, 
                  data: cleanData
              }
          });
      }

      const payload = {
        contents: [{ role: "user", parts: parts }],
        system_instruction: { parts: [{ text: VoiceBrain.system_instruction }] },
        generationConfig: {
          temperature: 0.2, 
          response_mime_type: "application/json",
          response_schema: {
            type: "OBJECT",
            properties: {
              voice_name: { type: "STRING" },
              stylistic_dna: {
                type: "OBJECT",
                properties: {
                  rhythm_score: { type: "STRING" },
                  vocabulary_profile: { type: "ARRAY", items: { type: "STRING" } },
                  forbidden_patterns: { type: "ARRAY", items: { type: "STRING" } },
                  punctuation_logic: { type: "STRING" },
                  emotional_anchors: { type: "ARRAY", items: { type: "STRING" } },
                  formatting_rules: { type: "STRING" }
                },
                required: ["rhythm_score", "vocabulary_profile", "forbidden_patterns", "punctuation_logic", "emotional_anchors", "formatting_rules"]
              },
              strategic_intent_discovery: {
                type: "OBJECT",
                properties: {
                  primary_goal: { type: "STRING" },
                  trigger_used: { type: "STRING" },
                  content_pillar: { type: "STRING" }
                },
                required: ["primary_goal", "trigger_used", "content_pillar"]
              },
              mimicry_instructions: { type: "STRING" },
              cloned_sample: { type: "STRING" }
            },
            required: ["voice_name", "stylistic_dna", "strategic_intent_discovery", "mimicry_instructions", "cloned_sample"]
          },
        },
      };

      const data = await this.generateViaFetch(this.MODEL, payload);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No text returned from Gemini");
      return this.extractJson(text);
    });
  }
}
