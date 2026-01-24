
// deno-lint-ignore-file no-explicit-any
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// --- 1. CONSTANTS & SCHEMAS ---

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GenerationParamsSchema = z.object({
  topic: z.string().min(1).max(5000),
  audience: z.string().max(200).optional().default("General Professional Audience"),
  tone: z.string().optional(),
  framework: z.string().optional(),
  emojiDensity: z.string().optional(),
  length: z.string().optional(),
  creativityLevel: z.number().min(0).max(100).optional(),
  hashtagCount: z.number().min(0).max(30).optional(),
  includeCTA: z.boolean().optional(),
  outputLanguage: z.enum(["en", "es"]).optional(),
  brandVoiceId: z.string().optional(),
  hookStyle: z.string().optional(),
  generateCarousel: z.boolean().optional(),
});

enum ErrorCode {
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

interface GeneratedPost {
  post_content: string;
  auditor_report: {
    viral_score: number;
    hook_strength: string;
    hook_score: number;
    readability_score: number;
    value_score: number;
    pro_tip: string;
    retention_estimate: string;
    flags_triggered: string[];
    predicted_archetype_resonance?: string;
  };
  strategy_reasoning: string;
  meta: {
    suggested_hashtags: string[];
    character_count: number;
  };
}

// --- 2. BASE AI SERVICE (INLINED) ---

class BaseAIService {
  protected readonly MODEL = "gemini-2.0-flash-001";
  protected get model() { return this.MODEL; }
  protected geminiApiKey: string;

  constructor(geminiApiKey: string) {
    if (!geminiApiKey) throw new Error("GEMINI_API_KEY is required");
    this.geminiApiKey = geminiApiKey.trim();
  }

  protected async retryWithBackoff<T>(operation: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (retries > 0 && (error.status === 503 || error.status === 429)) {
        await new Promise((r) => setTimeout(r, delay));
        return this.retryWithBackoff(operation, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  protected extractJson(text: string): Record<string, unknown> {
    try {
      let cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const start = cleanText.indexOf('{');
      const end = cleanText.lastIndexOf('}');
      if (start === -1 || end === -1) throw new Error("No JSON object found");
      return JSON.parse(cleanText.substring(start, end + 1));
    } catch (error) {
      console.error("[BaseAIService] JSON Parse Error:", error);
      throw new Error("AI returned invalid JSON.");
    }
  }

  protected async generateViaFetch(model: string, payload: Record<string, unknown>): Promise<unknown> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiApiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status} - ${await response.text()}`);
    }
    return await response.json();
  }
}

// --- 3. PROMPT BRAIN (INLINED) ---

class PostGeneratorBrain {
  static getSystemPrompt(userContext: any): string {
    return `
    ROLE: You are an elite LinkedIn Ghostwriter acting as "${userContext.company_name || 'an industry leader'}".
    Your goal is to write viral, high-impact content that builds authority.
    
    CORE SKILL: CONTENT CREATOR V1.0
    You MUST follow this proven viral framework:
    
    1. 🎯 THE HOOK (Pattern Interrupt): Start with a bold statement, question, or counter-intuitive fact. NO greetings.
    2. 📝 THE CONTEXT: 1-2 short sentences explaining why this matters now.
    3. 💡 THE INSIGHT (Bullets): Use 3-5 bullet points to break down the value.
    4. 🚀 THE TAKEAWAY: A punchy conclusion or lesson.
    5. 🗣️ THE QUESTION: A specific question to drive comments.

    STYLE RULES:
    - Write for skimmers: Short paragraphs (1-2 lines max).
    - No fluff words ("In today's fast-paced world", "delve into").
    - Use active voice.
    - Match Voice: ${userContext.brand_voice || "Professional yet accessible"}
    
    AUTHOR CONTEXT:
    - Industry: ${userContext.industry}
    - Expertise: ${userContext.xp} XP
    `;
  }
}

// --- 4. CONTENT SERVICE (INLINED & SIMPLIFIED) ---

class ContentService extends BaseAIService {
  
  async generatePost(params: any, userContext: any): Promise<GeneratedPost> {
    const systemInstruction = PostGeneratorBrain.getSystemPrompt({
        ...userContext,
        industry: userContext.industry || "General",
        xp: userContext.xp || 0,
        company_name: userContext.company_name || "an industry leader"
    });
    
    const strictSchemaInstruction = `
    IMPORTANT: You MUST return a valid JSON object.
    Structure:
    {
      "post_content": "The actual post text...",
      "auditor_report": { "viral_score": 85, "hook_strength": "High", "hook_score": 90, "readability_score": 88, "value_score": 85, "pro_tip": "Advice...", "retention_estimate": "30s", "flags_triggered": [] },
      "strategy_reasoning": "Reason...",
      "meta": { "suggested_hashtags": ["#tag"], "character_count": 150 }
    }
    `;

    return await this.retryWithBackoff(async () => {
      const payload = {
        contents: [
          { role: "user", parts: [{ text: `SYSTEM INSTRUCTIONS:\n${systemInstruction}` }] },
          { role: "model", parts: [{ text: "Understood. I will output strictly valid JSON." }] },
          { role: "user", parts: [{ text: `Generate a post about: ${params.topic}. \nParams: ${JSON.stringify(params)}\n\n${strictSchemaInstruction}` }] }
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              post_content: { type: "STRING" },
              auditor_report: {
                type: "OBJECT",
                properties: {
                  viral_score: { type: "INTEGER" },
                  hook_strength: { type: "STRING" },
                  hook_score: { type: "INTEGER" },
                  readability_score: { type: "INTEGER" },
                  value_score: { type: "INTEGER" },
                  pro_tip: { type: "STRING" },
                  retention_estimate: { type: "STRING" },
                  flags_triggered: { type: "ARRAY", items: { type: "STRING" } }
                },
                required: ["viral_score", "hook_strength", "hook_score", "readability_score", "value_score", "pro_tip", "retention_estimate", "flags_triggered"]
              },
              strategy_reasoning: { type: "STRING" },
              meta: {
                type: "OBJECT",
                properties: {
                  suggested_hashtags: { type: "ARRAY", items: { type: "STRING" } },
                  character_count: { type: "INTEGER" }
                },
                required: ["suggested_hashtags", "character_count"]
              }
            },
            required: ["post_content", "auditor_report", "strategy_reasoning", "meta"]
          },
        },
      };

      const data: any = await this.generateViaFetch(this.model, payload);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No text returned from AI");

      const json = this.extractJson(text);
      return json as unknown as GeneratedPost;
    });
  }
}

// --- 5. SUPPORT SERVICES (INLINED) ---

class PostRepository {
  constructor(private supabaseAdmin: SupabaseClient) {}
  async savePost(userId: string, content: GeneratedPost, params: unknown) {
    const { data: insertedPost, error } = await this.supabaseAdmin
      .from("posts")
      .insert({
        user_id: userId,
        content: content.post_content,
        params: params,
        viral_score: content.auditor_report.viral_score,
        viral_analysis: content.auditor_report,
        tags: content.meta.suggested_hashtags,
        is_auto_pilot: (params as any).isAutoPilot || false,
        created_at: new Date().toISOString(),
      })
      .select("id, created_at")
      .single();
    if (error) { console.error("Failed to save post:", error); return null; }
    return insertedPost;
  }
}

class CreditService {
  constructor(private supabaseAdmin: SupabaseClient) {}
  async deductCredit(userId: string, cost: number = 1): Promise<void> {
    const { data: profile, error } = await this.supabaseAdmin.from("profiles").select("credits").eq("id", userId).single();
    if (error || !profile) throw new Error("Profile not found");
    if (profile.credits < cost) throw new Error("Insufficient credits");
    await this.supabaseAdmin.from("profiles").update({ credits: profile.credits - cost }).eq("id", userId);
  }
}

class GamificationService {
  constructor(private supabaseAdmin: SupabaseClient) {}
  async processAction(userId: string, action: string): Promise<any> {
      const { data: profile } = await this.supabaseAdmin.from("profiles").select("*").eq("id", userId).single();
      if (!profile) return null;
      let newXP = (profile.xp || 0) + 50;
      await this.supabaseAdmin.from("profiles").update({ xp: newXP }).eq("id", userId);
      return { newXP };
  }
}

// --- 6. MAIN SERVER ---

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
      throw new Error("Server Configuration Error");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Instantiate INLINED Services
    const postRepository = new PostRepository(supabase);
    const creditService = new CreditService(supabase);
    const gamificationService = new GamificationService(supabase);
    // REAL AI SERVICE
    const contentService = new ContentService(GEMINI_API_KEY);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return sendError(ErrorCode.AUTH_ERROR, "Missing Authorization Header");
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) return sendError(ErrorCode.AUTH_ERROR, "Invalid User Token");

    const body = await req.json();
    const parseResult = GenerationParamsSchema.safeParse(body.params);
    if (!parseResult.success) return sendError(ErrorCode.VALIDATION_ERROR, "Invalid parameters", parseResult.error);
    const validatedParams = parseResult.data;

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (!profile) return sendError(ErrorCode.AUTH_ERROR, "User profile not found");
    // if ((profile.credits || 0) <= 0) return sendError(ErrorCode.INSUFFICIENT_CREDITS, "Zero credits.");

    // Generate (REAL AI)
    // Pass minimal context to avoid undefined errors
    const userContext = {
        brand_voice: profile.brand_voice, 
        company_name: profile.company_name, 
        industry: profile.industry, 
        xp: profile.xp
    };
    const result = await contentService.generatePost(validatedParams, userContext);

    try { await creditService.deductCredit(user.id, 1); } catch (e) { console.error("Credit Error", e); }
    
    const savedPost = await postRepository.savePost(user.id, result, validatedParams);
    if (!savedPost) return sendError(ErrorCode.INTERNAL_ERROR, "Failed to save post");

    try { await gamificationService.processAction(user.id, "GENERATE_POST"); } catch(e) {}

    const responseData: APIResponse<any> = {
        success: true,
        data: {
            id: savedPost.id,
            postContent: result.post_content,
            viralScore: result.auditor_report.viral_score,
            viralAnalysis: result.auditor_report,
            gamification: null, 
            credits: (profile.credits || 0) - 1
        }
    };

    return new Response(JSON.stringify(responseData), { status: 200, headers });

  } catch (err: any) {
    console.error("Unhandled Server Error:", err);
    return sendError(ErrorCode.INTERNAL_ERROR, "Internal Server Error", err.message);
  }

  function sendError(code: ErrorCode | string, message: string, details?: any) {
      const response: APIResponse<null> = { success: false, error: { code, message, details } };
      return new Response(JSON.stringify(response), { status: 200, headers });
  }
});
