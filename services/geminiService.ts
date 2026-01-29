
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
    details?: unknown;
  };
}

// generateViralPost has been migrated to PostService.ts
// Exporting types only if needed by legacy code, though typically used from types/index.ts
export type { GeneratedPostResult };


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

export interface InsightReplyResult {
    reply: string;
    analysis?: string;
}

export const generateInsightReply = async (payload: { imageBase64?: string, textContext?: string, userIntent?: string, tone?: string }): Promise<InsightReplyResult> => {
    const { data, error } = await supabase.functions.invoke<InsightReplyResult>('generate-insight-reply', {
        body: payload
    });

    if (error || !data) throw new Error(error?.message || "Insight reply failed");
    return data;
};

export interface CloneVoiceResult {
    voice_id: string;
    preview_url?: string;
}

export const cloneVoice = async (payload: { text_samples?: string[], url?: string, voice_name?: string }): Promise<CloneVoiceResult> => {
    const { data, error } = await supabase.functions.invoke<CloneVoiceResult>('clone-voice', {
        body: payload
    });

    if (error || !data) throw new Error(error?.message || "Voice cloning failed");
    return data;
};

export const streamMicroEdit = async (
  options: { topic: string; action: string; tone: string; stream: boolean },
  onChunk: (chunk: string) => void
): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Authentication required");

  // Invoke Supabase Function with responseType: 'blob' to handle streaming correctly
  const { data, error } = await supabase.functions.invoke('generate-viral-post', {
      body: { 
          params: { 
              ...options, 
              mode: 'micro_edit',
              stream: true 
          } 
      },
      options: {
        responseType: 'arraybuffer' // force binary/blob handling
      }
      // Note: invoke might ignore headers if responseType is set, or vice versa depending on version.
  });

  if (error) throw new Error(error.message || "Stream connection failed");
  
  // Handle parsing based on return type
  const decoder = new TextDecoder();
  let buffer = "";

  const processChunk = (text: string) => {
      // Simple stream (raw text) or SSE?
      // Logic for raw text:
      onChunk(text);
  };

  if (data) {
      // If arraybuffer
      const text = decoder.decode(data);
      processChunk(text);
      // NOTE: Supabase invoke waits for full response unless we use raw fetch or specific streaming support.
      // If we want REAL streaming, we must use fetch directly to the edge function URL.
  }
};

// HELPER: Real Streaming via Fetch (Bypassing supabase.functions.invoke buffering)
const streamFromEdgeFunction = async (
    functionName: string, 
    body: { params: Partial<GenerationParams> & { stream: boolean } }, 
    onChunk: (text: string) => void
): Promise<any> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No session");

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error(`Stream Error: ${response.statusText}`);
    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finalResult = null;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // Parse SSE
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || ""; // Keep incomplete block

        for (const block of blocks) {
            const lines = block.split("\n");
            let eventType = "message";
            let data = "";

            for (const line of lines) {
                if (line.startsWith("event: ")) {
                    eventType = line.slice(7).trim();
                } else if (line.startsWith("data: ")) {
                    data = line.slice(6);
                }
            }

            if (data) {
                try {
                    const payload = JSON.parse(data);
                    if (eventType === "result" || payload.post_content) {
                        finalResult = payload;
                    } else if (payload.chunk) {
                        onChunk(payload.chunk);
                    }
                } catch (e) {
                    console.warn("SSE Parse Error", e);
                }
            }
        }
    }
    return finalResult;
};

export const generatePostStream = async (
    params: GenerationParams, 
    onChunk: (chunk: string) => void
): Promise<GeneratedPostResult> => {
    const result = await streamFromEdgeFunction('generate-viral-post', { params: { ...params, stream: true } }, onChunk);
    
    if (!result) throw new Error("Stream finished without result");
    
    return {
        id: result.id || 'temp-id',
        content: result.post_content,
        viralScore: result.auditor_report?.viral_score || 0,
        viralAnalysis: result.auditor_report,
        gamification: result.gamification
    };
};
