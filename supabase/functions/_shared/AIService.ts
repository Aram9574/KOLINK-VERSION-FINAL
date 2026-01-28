import { BaseAIService } from "./services/BaseAIService.ts";
import { SupabaseClient } from "@supabase/supabase-js";
import { ContentService, GenerationParams, UserProfileContext } from "./services/ContentService.ts";
import { AuditService } from "./services/AuditService.ts";
import { NexusService } from "./services/NexusService.ts";
import { LinkedInAuditResult, LinkedInPDFData } from "./types.ts";

/**
 * @deprecated Use specialized services in './services/' instead.
 * This class remains as a compatibility layer for existing functions.
 */
export class AIService extends BaseAIService {
  private content: ContentService;
  private audit: AuditService;
  private nexus: NexusService;

  constructor(geminiApiKey: string) {
    super(geminiApiKey);
    this.content = new ContentService(geminiApiKey);
    this.audit = new AuditService(geminiApiKey);
    this.nexus = new NexusService(geminiApiKey);
  }

  async generatePost(params: GenerationParams, profile: UserProfileContext) {
    return await this.content.generatePost(params, profile);
  }

  async generateCarousel(source: string, sourceType: string, styleFragments: string[], _profile: UserProfileContext, language: string = "es") {
    return await this.content.generateCarousel(source, sourceType, styleFragments, language);
  }

  async createEmbedding(text: string) {
    return await this.nexus.createEmbedding(text);
  }

  async generateExpertResponse(query: string, context: string, language: string = "es") {
    return await this.nexus.generateExpertResponse(query, context, language);
  }

  async extractLinkedInPDF(pdfBase64: string): Promise<LinkedInPDFData> {
    return await this.audit.extractLinkedInPDF(pdfBase64);
  }

  async analyzeLinkedInProfile(
    profileData: LinkedInPDFData & { avatar_url?: string; banner_url?: string | null }, 
    language: string = "es",
    imageBase64?: string,
    supabaseClient?: SupabaseClient
  ): Promise<LinkedInAuditResult> {
    return await this.audit.analyzeLinkedInProfile(profileData, language, imageBase64, supabaseClient);
  }
}
