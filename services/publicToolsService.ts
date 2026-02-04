import { supabase } from './supabaseClient';
import { getOrCreateFingerprint } from '../utils/browserFingerprint';

interface HeadlineParams {
  currentHeadline?: string;
  role?: string;
  industry?: string;
}

interface BioParams {
  currentBio?: string;
  role?: string;
  expertise?: string;
}

interface ScorecardParams {
  profileUrl: string;
}

interface NicheParams {
  topic: string;
  nicheTitle: string;
  roleContext: string;
  painPoint: string;
}

interface UsageInfo {
  currentCount: number;
  limit: number;
  resetAt: string;
}

interface HeadlineResponse {
  headlines: string[];
  usageInfo: UsageInfo;
}

interface BioResponse {
  bios: string[];
  usageInfo: UsageInfo;
}

interface ScorecardResponse {
  scorecard: {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    immediateAction: string;
  };
  usageInfo: UsageInfo;
}

interface NicheResponse {
  postContent: string;
  strategy: string;
  usageInfo: UsageInfo;
}

/**
 * Service for calling public tool Edge Functions
 * Handles fingerprinting and error responses
 */
export const publicToolsService = {
  /**
   * Generate LinkedIn headlines
   */
  generateHeadline: async (params: HeadlineParams): Promise<HeadlineResponse> => {
    const fingerprint = await getOrCreateFingerprint();

    const { data, error } = await supabase.functions.invoke('generate-headline-public', {
      body: {
        fingerprint,
        ...params
      }
    });

    if (error) {
      // Check if it's a rate limit error
      if (error.message?.includes('RATE_LIMIT_EXCEEDED') || error.context?.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      throw new Error(error.message || 'Failed to generate headlines');
    }

    return data;
  },

  /**
   * Generate LinkedIn bio
   */
  generateBio: async (params: BioParams): Promise<BioResponse> => {
    const fingerprint = await getOrCreateFingerprint();

    const { data, error } = await supabase.functions.invoke('generate-bio-public', {
      body: {
        fingerprint,
        ...params
      }
    });

    if (error) {
      if (error.message?.includes('RATE_LIMIT_EXCEEDED') || error.context?.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      throw new Error(error.message || 'Failed to generate bio');
    }

    return data;
  },

  /**
   * Analyze LinkedIn profile
   */
  analyzeProfile: async (params: ScorecardParams): Promise<ScorecardResponse> => {
    const fingerprint = await getOrCreateFingerprint();

    const { data, error } = await supabase.functions.invoke('analyze-profile-public', {
      body: {
        fingerprint,
        ...params
      }
    });

    if (error) {
      if (error.message?.includes('RATE_LIMIT_EXCEEDED') || error.context?.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      throw new Error(error.message || 'Failed to analyze profile');
    }

    return data;
  },

  /**
   * Generate LinkedIn niche-specific content
   */
  generateNicheContent: async (params: NicheParams): Promise<NicheResponse> => {
    const fingerprint = await getOrCreateFingerprint();

    const { data, error } = await supabase.functions.invoke('generate-niche-content-public', {
      body: {
        fingerprint,
        ...params
      }
    });

    if (error) {
      if (error.message?.includes('RATE_LIMIT_EXCEEDED') || error.context?.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      throw new Error(error.message || 'Failed to generate content');
    }

    return data;
  }
};
