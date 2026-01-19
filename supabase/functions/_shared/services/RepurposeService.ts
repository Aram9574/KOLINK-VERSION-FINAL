import { BaseAIService, GeminiResponse } from "./BaseAIService.ts";

export class RepurposeService extends BaseAIService {
  
  constructor(geminiApiKey: string) {
    super(geminiApiKey);
  }

  /**
   * Fetches the transcript from a YouTube video ID.
   * Leverages the internal API found in the video page source.
   */
  async fetchYoutubeTranscript(videoId: string): Promise<string> {
    try {
      const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      const videoPageHtml = await videoPageResponse.text();

      // Extract the captions JSON
      const splitHtml = videoPageHtml.split('"captions":');
      if (splitHtml.length <= 1) {
        throw new Error("No captions found for this video. Please ensure the video has closed captions enabled.");
      }

      const captionJson = JSON.parse(splitHtml[1].split(',"videoDetails')[0].replace('\n', ''));
      const captionTracks = captionJson.playerCaptionsTracklistRenderer.captionTracks;

      if (!captionTracks || captionTracks.length === 0) {
        throw new Error("No caption tracks available.");
      }

      // Prefer English or auto-generated English, or just take the first one
      // @ts-ignore: Deno type mismatch for YouTube API response
      const track = captionTracks.find((t: Record<string, unknown>) => t.languageCode === 'en') || captionTracks[0];
      
      const transcriptResponse = await fetch(track.baseUrl);
      const transcriptXml = await transcriptResponse.text();

      // Simple XML parsing to extracting text
      // <text start="0.04" dur="1.2">Hello world</text>
      const transcriptText = transcriptXml
        .replace(/<text[^>]*>/g, ' ')
        .replace(/<\/text>/g, ' ')
        .replace(/&amp;#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/<[^>]*>/g, '') // strip any other tags
        .replace(/\s+/g, ' ')
        .trim();

      return transcriptText.substring(0, 15000); // Limit length to avoid token limits

    } catch (error) {
      console.error("YouTube Fetch Error:", error);
      throw new Error(`Failed to fetch YouTube transcript: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Scrapes the main text content from a generic URL.
   * This is a basic implementation; for robust scraping, a dedicated service is recommended.
   */
  async scrapeUrl(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }

      const html = await response.text();

      // Very basic text extraction: Get all <p> tags
      // In a real production env, use a library like 'cheerio' or a scraping API
      const pTags = html.match(/<p[^>]*>(.*?)<\/p>/gs);
      
      if (!pTags || pTags.length === 0) {
         // Fallback: try capturing body text broadly if no p tags
         const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/gs);
         if (bodyMatch) {
            return bodyMatch[0].replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
                               .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
                               .replace(/<[^>]*>/g, " ")
                               .replace(/\s+/g, " ")
                               .trim()
                               .substring(0, 10000);
         }
         throw new Error("Could not extract readable text from the page.");
      }

      const text = pTags
        .map(p => p.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(t => t.length > 20) // Filter out short snippets
        .join('\n\n');

      return text.substring(0, 15000);

    } catch (error) {
      console.error("URL Scrape Error:", error);
      throw new Error(`Failed to scrape URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extracts raw text from a PDF file (Base64) using Gemini Multimodal.
   */
  async extractPdfText(pdfBase64: string): Promise<string> {
    const prompt = `
      Extract all readable text from this PDF. 
      Focus on structured information, headers, and body content.
      Ignore metadata or technical artifacts.
      Return strictly the extracted text.
    `;

    return await this.retryWithBackoff(async () => {
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inline_data: { data: pdfBase64, mime_type: "application/pdf" } },
            ],
          },
        ],
        generationConfig: {
            temperature: 0.2
        }
      };

      const data = await this.generateViaFetch(this.model, payload) as GeminiResponse;
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("No text extracted from PDF");

      return text.trim();
    });
  }
}
