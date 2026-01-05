
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

export const generateViralPost = async (params: GenerationParams, user: UserProfile): Promise<GeneratedPostResult> => {
  // Llamada segura al backend (Supabase Edge Function)
  const session = await supabase.auth.getSession();
  console.log("[DEBUG CLIENT] Target Function URL:", `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-viral-post`);
  console.log("[DEBUG CLIENT] Token being sent:", session.data.session?.access_token?.substring(0, 15) + "...");
  
  const { data, error } = await supabase.functions.invoke('generate-viral-post', {
    body: { params }
  });

  if (error) {
    if (error.status === 406) {
      console.error("Server API returned 406 Not Acceptable. This usually means the function crashed or returned invalid content types.");
      throw new Error("Server configuration error (406). Please try again or contact support.");
    }
    throw new Error(error.message);
  }
  if (data.error) throw new Error(`Backend Error: ${data.error}`);

  return {
    id: data.id,
    content: data.postContent,
    viralScore: data.viralScore,
    viralAnalysis: data.viralAnalysis,
    gamification: data.gamification
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
