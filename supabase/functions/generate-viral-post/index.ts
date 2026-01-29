
// deno-lint-ignore-file no-explicit-any
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { validateInput } from "../_shared/inputGuard.ts";
import { truncateToTokenLimit } from "../_shared/tokenUtils.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@^0.21.0";
import { PostGeneratorBrain } from "../_shared/prompts/PostGeneratorBrain.ts";

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
  stream: z.boolean().optional().default(false), // NEW: Stream flag
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
  instructions: z.string().optional(),
  target_audience: z.string().optional(),
  generation_type: z.enum(["carousel", "post", "thread"]).optional(),
  mode: z.enum(["generate", "micro_edit", "compare_hooks"]).optional().default("generate"),
  action: z.string().optional(),
  hook_a: z.string().optional(),
  hook_b: z.string().optional(),
});

// Output Validation Schema (Strict)
const GeneratedPostSchema = z.object({
  post_content: z.string(),
  auditor_report: z.object({
    viral_score: z.number(),
    hook_strength: z.string(),
    hook_score: z.number(),
    readability_score: z.number(),
    value_score: z.number(),
    pro_tip: z.string(),
    retention_estimate: z.string(),
    flags_triggered: z.array(z.string()),
    predicted_archetype_resonance: z.string().optional()
  }),
  strategy_reasoning: z.string(),
  meta: z.object({
    suggested_hashtags: z.array(z.string()),
    character_count: z.number()
  })
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

// --- 2. PROMPT BRAIN (IMPORTED) ---

// --- 3. AI SERVICE WITH SDK ---

class ContentService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("GEMINI_API_KEY is required");
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
  }

  private extractJson(text: string): any {
      let cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const start = cleanText.indexOf('{');
      const end = cleanText.lastIndexOf('}');
      if (start === -1 || end === -1) throw new Error("No JSON object found");
      return JSON.parse(cleanText.substring(start, end + 1));
  }

  // Retry logic wrapper
  private async retryWithBackoff<T>(operation: () => Promise<T>, retries = 5, initialDelay = 2000): Promise<T> {
      try {
          return await operation();
      } catch (error: any) {
          const msg = error.message || "";
          const isRetryable = 
              msg.includes("429") || 
              msg.includes("503") || 
              msg.includes("Quota exceeded") ||
              error.status === 429 || 
              error.status === 503;
          
          if (retries > 0 && isRetryable) {
              const jitter = Math.random() * 1000;
              const waitTime = initialDelay + jitter;
              console.warn(`[Gemini] ZooWeeMama! 429 Error. Retrying in ${Math.round(waitTime)}ms... (${retries} left)`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              return this.retryWithBackoff(operation, retries - 1, initialDelay * 2); // Exponential backoff
          }
          throw error;
      }
  }

  // Helper to handle streaming
  async *streamGenerator(prompt: string, config: any): AsyncGenerator<string> {
      const result = await this.retryWithBackoff(() => this.model.generateContentStream({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: config
      }));
      
      for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) yield chunkText;
      }
  }

  async generatePost(params: any, userContext: any): Promise<GeneratedPost | ReadableStream> {
    const systemInstruction = PostGeneratorBrain.getSystemPrompt({
        ...userContext,
        industry: userContext.industry || "General",
        xp: userContext.xp || 0,
        company_name: userContext.company_name || "an industry leader"
    });

    const isStreaming = params.stream === true;

    // --- STREAMING HANDLER (SSE) ---
    if (isStreaming) {
        // Prepare prompt designed for plain text streaming first
        const streamInstruction = `
        ROLE: World-Class Viral LinkedIn Ghostwriter.
        TASK: Write a high-performing LinkedIn post about: "${params.topic}".
        CONTEXT: Tone: ${params.tone}, Framework: ${params.framework}.
        OUTPUT: Plain text only. Do not output Markdown code blocks or JSON. Just the post.
        `;
        
        // 1. Start Stream
        const stream = await this.model.generateContentStream({
            contents: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "user", parts: [{ text: streamInstruction }] }
            ],
            generationConfig: { temperature: 0.7 }
        });

        const encoder = new TextEncoder();
        const self = this; // Capture context for saving later

        return new ReadableStream({
            async pull(controller) {
                let accumulatedText = "";
                
                try {
                    for await (const chunk of stream.stream) {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            accumulatedText += chunkText;
                            // Emit chunk event
                            const event = `data: ${JSON.stringify({ chunk: chunkText })}\n\n`;
                            controller.enqueue(encoder.encode(event));
                        }
                    }

                    // 2. Generation Complete -> Analyze & Save (Hidden Step)
                    // We need to construct the final object to save to DB
                    // For speed, we might mock analysis or do a quick pass. 
                    // Let's do a quick analysis pass to maintain data integrity.
                    
                    const analysisPrompt = `
                    ANALYZE this LinkedIn post and return JSON:
                    POST: "${accumulatedText}"
                    OUTPUT JSON SCHEMA: { "viral_score": number (0-100), "hook_strength": "Low"|"Medium"|"High", "readability_score": number, "pro_tip": "string" }
                    `;
                    const analysisResult = await self.model.generateContent({
                        contents: [{ role: "user", parts: [{ text: analysisPrompt }] }],
                         generationConfig: { responseMimeType: "application/json" }
                    });
                     
                    const analysisJson = self.extractJson(analysisResult.response.text());
                    
                    // Construct final object equivalent to GeneratedPost
                     const finalPost: GeneratedPost = {
                        post_content: accumulatedText,
                        auditor_report: {
                            viral_score: analysisJson.viral_score || 75,
                            hook_strength: analysisJson.hook_strength || "Medium",
                            hook_score: 80, 
                            readability_score: analysisJson.readability_score || 80,
                            value_score: 80,
                            pro_tip: analysisJson.pro_tip || "Add a question to engage comments.",
                            retention_estimate: "30s",
                            flags_triggered: []
                        },
                        strategy_reasoning: "Streamed Generation",
                        meta: { suggested_hashtags: [], character_count: accumulatedText.length }
                    };

                    // EMIT RESULT EVENT
                    // The main handler can't save because we returned the stream.
                    // So we must emit the full object for the frontend to save? 
                    // OR we save HERE if we can inject dependencies? 
                    // Constraint: We don't have repositories here.
                    // Solution: Emit the "complete" object. Let Frontend call a separate "save" endpoint 
                    // OR let Frontend assume it's unsaved draft? 
                    // Better: The MAIN Loop in index.ts handles saving? No, it returned.
                    
                    // We will emit the Final Object. The frontend will receive it. 
                    // Ideally, Supabase Edge Functions should allow async work after response, 
                    // but for now, let's entrust the frontend to receive the full object.
                    
                    const finalEvent = `event: result\ndata: ${JSON.stringify(finalPost)}\n\n`;
                    controller.enqueue(encoder.encode(finalEvent));
                    controller.close();

                } catch (e) {
                    const errorEvent = `event: error\ndata: ${JSON.stringify({ message: e.message })}\n\n`;
                    controller.enqueue(encoder.encode(errorEvent));
                    controller.close();
                }
            }
        });
    }

    // ... NON-STREAMING LEGACY/STRICT MODES (Keep existing code below)
    if (params.mode === 'compare_hooks') {
        const compareInstruction = `
        ROLE: Viral Content Analyst.
        TASK: Compare two LinkedIn headlines (hooks) and declare a winner.
        HOOK A: "${params.hook_a}"
        HOOK B: "${params.hook_b}"
        OUTPUT JSON: { "winner": "A"|"B", "scoreA": number, "scoreB": number, "reason": string }
        `;
        
        const result = await this.retryWithBackoff(() => this.model.generateContent({
             contents: [{ role: "user", parts: [{ text: compareInstruction }] }],
             generationConfig: { responseMimeType: "application/json" }
        }));
        const json = this.extractJson(result.response.text());
        return {
             post_content: "Comparison Complete", 
             auditor_report: { viral_score: 0, hook_strength: "N/A", hook_score: 0, readability_score: 0, value_score: 0, pro_tip: "", retention_estimate: "", flags_triggered: [] },
             strategy_reasoning: JSON.stringify(json),
             meta: { suggested_hashtags: [], character_count: 0 }
         };
    }

    // MICRO-EDIT (Stream handled above or legacy here)
    if (params.mode === 'micro_edit') {
         // ... (existing micro_edit logic, maybe redundant if we unified streaming, but keeping for safety)
         // Assuming stream=true is handled by the block above. If stream=false:
         const editInstruction = `
        ROLE: Expert Copy Editor.
        TASK: Perform action "${params.action || 'Improve'}" on: "${params.topic}".
        Tone: ${params.tone || 'Professional'}.
        OUTPUT JSON: { "post_content": "edited text" }
        `;
        const result = await this.retryWithBackoff(() => this.model.generateContent({
            contents: [{ role: "user", parts: [{ text: editInstruction }] }],
            generationConfig: { responseMimeType: "application/json" }
        }));
        const json = this.extractJson(result.response.text());
        return {
            post_content: json.post_content,
            auditor_report: { viral_score: 0, hook_strength: "N/A", hook_score: 0, readability_score: 0, value_score: 0, pro_tip: "", retention_estimate: "", flags_triggered: [] },
            strategy_reasoning: "Micro-edit",
            meta: { suggested_hashtags: [], character_count: String(json.post_content).length }
        };
    }
    
    // MAIN GENERATION (Strict w/ SDK - Non-Streaming fallback)
    const userPrompt = PostGeneratorBrain.getUserPrompt(params, params.topic);

    const result = await this.retryWithBackoff(() => this.model.generateContent({
        contents: [
          { role: "user", parts: [{ text: systemInstruction }] },
          { role: "user", parts: [{ text: userPrompt }] }
        ],
        generationConfig: { 
          responseMimeType: "application/json",
          // Use the schema from lines 45-63
          responseSchema: {
            type: "OBJECT",
            properties: {
              post_content: { type: "STRING" },
              auditor_report: {
                type: "OBJECT",
                properties: {
                  viral_score: { type: "NUMBER" },
                  hook_strength: { type: "STRING" },
                  hook_score: { type: "NUMBER" },
                  readability_score: { type: "NUMBER" },
                  value_score: { type: "NUMBER" },
                  pro_tip: { type: "STRING" },
                  retention_estimate: { type: "STRING" },
                  flags_triggered: { type: "ARRAY", items: { type: "STRING" } },
                  predicted_archetype_resonance: { type: "STRING" }
                },
                required: ["viral_score", "hook_strength", "hook_score", "readability_score", "value_score", "pro_tip", "retention_estimate", "flags_triggered"]
              },
              strategy_reasoning: { type: "STRING" },
              meta: {
                type: "OBJECT",
                properties: {
                  suggested_hashtags: { type: "ARRAY", items: { type: "STRING" } },
                  character_count: { type: "NUMBER" }
                },
                required: ["suggested_hashtags", "character_count"]
              }
            },
            required: ["post_content", "auditor_report", "strategy_reasoning", "meta"]
          }
        }
    }));
    
    // Strict Validation
    const json = this.extractJson(result.response.text());
    return GeneratedPostSchema.parse(json) as GeneratedPost;
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
  console.log("--- FUNCTION INVOKED: generate-viral-post ---");

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
      console.error("Config Error: Missing ENV vars");
      throw new Error("Server Configuration Error: Missing environment variables.");
    }


    // Standard Auth Pattern: Create client with user's token
    const supabaseClient = createClient(
        SUPABASE_URL,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } }
    );
    
    // This automatically validates the JWT
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
        console.error("Auth Error:", authError?.message || "Invalid User Token");
        return sendError(ErrorCode.AUTH_ERROR, "Invalid User Token", authError?.message);
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log(`Authenticated User: ${user.id} (${user.email})`);

    // Instantiate Services
    const postRepository = new PostRepository(supabaseAdmin);
    const creditService = new CreditService(supabaseAdmin);
    const gamificationService = new GamificationService(supabaseAdmin);
    const contentService = new ContentService(GEMINI_API_KEY);

    const body = await req.json();
    console.log("Body Key Count:", Object.keys(body).length);

    // Support both { params: { ... } } and flattened body
    const paramsToValidate = body.params || body;
    const parseResult = GenerationParamsSchema.safeParse(paramsToValidate);
    
    if (!parseResult.success) {
        console.error("Schema Validation Error:", JSON.stringify(parseResult.error.format()));
        return sendError(ErrorCode.VALIDATION_ERROR, "Invalid parameters", parseResult.error);
    }
    const validatedParams = parseResult.data;
    console.log(`Topic length: ${validatedParams.topic.length}`);

    // --- SECURITY & SANITIZATION ---
    const inputValidation = validateInput(validatedParams.topic);
    if (!inputValidation.isValid) {
        console.warn(`Blocked Input (${user.id}): ${inputValidation.error}`);
        return sendError(ErrorCode.VALIDATION_ERROR, inputValidation.error || "Input rejected for security reasons.");
    }
    validatedParams.topic = inputValidation.sanitizedInput!;
    validatedParams.topic = truncateToTokenLimit(inputValidation.sanitizedInput!, 3000);

    const { data: profile } = await supabaseAdmin.from("profiles").select("*").eq("id", user.id).single();
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
    
    // STREAM HANDLING
    if (result instanceof ReadableStream) {
        return new Response(result, {
            headers: {
                ...corsHeaders,
                "Content-Type": "text/event-stream; charset=utf-8",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            }
        });
    }

    // NON-STREAM HANDLING (JSON)
    const postResult = result as GeneratedPost;

    try { await creditService.deductCredit(user.id, 1); } catch (e) { console.error("Credit Error", e); }
    
    const savedPost = await postRepository.savePost(user.id, postResult, validatedParams);
    if (!savedPost) return sendError(ErrorCode.INTERNAL_ERROR, "Failed to save post");

    try { await gamificationService.processAction(user.id, "GENERATE_POST"); } catch(e) {}

    const responseData = {
        id: savedPost.id,
        content: postResult.post_content,
        viralScore: postResult.auditor_report.viral_score,
        viralAnalysis: postResult.auditor_report,
        gamification: null, 
        credits: (profile.credits || 0) - 1,
        // Special handling for compare_hooks
        ...(validatedParams.mode === 'compare_hooks' ? JSON.parse(postResult.strategy_reasoning) : {})
    };

    return new Response(JSON.stringify(responseData), { status: 200, headers });

  } catch (err: any) {
    console.error("Unhandled Server Error:", err);
    return sendError(ErrorCode.INTERNAL_ERROR, "Internal Server Error", err.message);
  }

  function sendError(code: ErrorCode | string, message: string, details?: any) {
      const response = { success: false, error: { code, message, details } };
      const status = (code === ErrorCode.AUTH_ERROR) ? 401 : (code === ErrorCode.VALIDATION_ERROR) ? 400 : 500;
      return new Response(JSON.stringify(response), { status, headers });
  }
});
