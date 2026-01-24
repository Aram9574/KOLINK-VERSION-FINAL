
import { Type } from "@google/genai";
/// <reference types="vite/client" />
import { GenerationParams, AppLanguage, UserProfile, CustomSource } from "../types";
import { supabase } from './supabaseClient';

export interface GeneratedPostResult {
  id?: string;
  content: string;
  viralScore: number;
  viralAnalysis: {
    hookScore: number;
    readabilityScore: number;
    valueScore: number;
    feedback: string;
  };
  gamification?: {
    newXP: number;
    newLevel: number;
    newStreak: number;
    newAchievements: string[];
    leveledUp: boolean;
  }
}

// --- Shared Contract Definition (Ideally imported from a shared package, but defined here for now) ---
export enum ErrorCode {
  INSUFFICIENT_CREDITS = 'INSUFFICIENT_CREDITS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode | string;
    message: string;
    details?: any;
  };
}

export const generateViralPost = async (params: GenerationParams, user: UserProfile): Promise<GeneratedPostResult> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error("User not authenticated. Please log in again.");
  }

  // Invoke with strict contract
  const { data, error } = await supabase.functions.invoke('generate-viral-post', {
    body: { params }
  });

  // Network/System Level Errors
  if (error) {
    console.error("[GEMINI SERVICE] Network Error:", error);
    throw new Error("Connection failed. Please check your internet.");
  }

  // Logical Contract
  const response = data as APIResponse<any>;

  if (!response.success) {
      console.error("[GEMINI SERVICE] Server Error:", response.error);
      
      const code = response.error?.code;
      const msg = response.error?.message || "Unknown error";

      if (code === ErrorCode.INSUFFICIENT_CREDITS) {
          throw new Error("Insufficient credits");
      }
      
      throw new Error(`Generation Failed: ${msg}`);
  }

  const resultData = response.data;
  return {
    id: resultData.id,
    content: resultData.postContent,
    viralScore: resultData.viralScore,
    viralAnalysis: resultData.viralAnalysis,
    gamification: resultData.gamification
  };
};

export interface IdeaResult {
  ideas: string[];
  sources: { title: string; uri: string }[];
}

export interface IdeaParams {
  niche: string;
  style: 'trending' | 'contrarian' | 'educational' | 'story' | 'predictions';
  source: 'news' | 'evergreen';
  count: number;
  customContext?: CustomSource[];
}

export const generatePostIdeas = async (user: UserProfile, language: AppLanguage = 'es', options?: IdeaParams): Promise<IdeaResult> => {
  try {
    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-ideas', {
      body: {
        user_id: user.id,
        language,
        params: options
      }
    });

    if (error) throw new Error(error.message);
    if (data.error) throw new Error(data.error);

    return {
      ideas: data.ideas || [],
      sources: data.sources || []
    };

  } catch (error) {
    console.error("Idea Generator Error:", error);
    // Fallback in case of error (e.g., allow user to see something if network fails, or just return empty)
    // Actually, distinct error handling is better, but let's keep the fallback for UI resilience if desired,
    // OR just rethrow. The original code had a fallback. Let's keep a simple fallback if cost fails? 
    // No, if credit check fails, we shouldn't give free ideas.
    // However, for safety against API errors, we can return the structure.

    // For now, let's allow the error to propagate so the UI knows it failed (e.g. "No credits").
    throw error;
  }
};

import { StylisticDNA } from '../types';

export interface BrandVoiceAnalysisResult {
  styleName: string;
  toneDescription: string;
  keywords?: string[];
  hookPatterns?: { category: string; pattern: string; example: string }[];
  stylisticDNA?: StylisticDNA;
}

export const analyzeBrandVoice = async (payload: { contentSamples: string[], language: string, imageBase64?: string }): Promise<BrandVoiceAnalysisResult> => {
  const { data, error } = await supabase.functions.invoke('analyze-brand-voice', {
    body: payload
  });

  if (error) {
    console.error("Analysis Error:", error);
    throw new Error(error.message);
  }

  if (data.error) throw new Error(data.error);

  // Map SOTA fields to internal interface if needed, or return as is if types are updated
  return {
    ...data,
    styleName: data.voice_name || data.styleName,
    toneDescription: data.mimicry_instructions || data.toneDescription,
    stylisticDNA: data.stylistic_dna || data.stylisticDNA
  };
};

export const generateHooks = async (idea: string, brandVoiceId: string, language: string = 'es'): Promise<string[]> => {
    const { data, error } = await supabase.functions.invoke('generate-hooks', {
        body: { idea, brandVoiceId, language }
    });

    if (error) throw new Error(error.message);
    return data.hooks;
};

export const generateInsightReply = async (payload: { imageBase64?: string, textContext?: string, userIntent?: string, tone?: string }): Promise<any[]> => {
    const { data, error } = await supabase.functions.invoke('generate-insight-reply', {
        body: payload
    });

    if (error) throw new Error(error.message);
    return data.replies;
};

export const cloneVoice = async (payload: { text_samples?: string[], url?: string, voice_name?: string }): Promise<any> => {
    const { data, error } = await supabase.functions.invoke('clone-voice', {
        body: payload
    });

    if (error) throw new Error(error.message);
    return data;
};
