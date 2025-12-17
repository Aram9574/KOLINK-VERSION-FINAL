import { serve } from "std/http/server";
import { createClient } from "@supabase/supabase-js";
import { AIService } from "../_shared/AIService.ts"; // Shared
import { PostRepository } from "../_shared/PostRepository.ts"; // Shared
import { GenerationParams } from "../_shared/AIService.ts"; // Imported from AIService since not exported from schemas directly in this file's context usually, or verify schemas.ts

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Admin Client (Bypasses RLS to query all profiles)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Initialize Services
    const aiService = new AIService(Deno.env.get("GEMINI_API_KEY") ?? "");
    const postRepository = new PostRepository(supabaseAdmin);

    // 1. Find users due for AutoPilot
    const now = Date.now();
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("auto_pilot->>enabled", "true") // Filter by JSONB
      .lt("auto_pilot->>nextRun", now) // Filter by timestamp
      .limit(10); // Batch size for safety

    if (profileError) throw profileError;

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No users due for AutoPilot" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const results = [];

    // 2. Process each user
    for (const profile of profiles) {
      try {
        const config = profile.auto_pilot;

        // Construct Params from Config
        // Basic rotation logic for topics could go here, or just pick random for now if config has list
        const topic = config.topics && config.topics.length > 0
          ? config.topics[Math.floor(Math.random() * config.topics.length)]
          : "LinkedIn Growth";

        const params: GenerationParams = {
          topic: topic,
          audience: config.targetAudience || "Professionals",
          tone: config.tone || "Professional",
          framework: "Standard", // Default or random
          emojiDensity: "Moderate",
          length: "Medium",
          creativityLevel: 80,
          includeCTA: true,
          hashtagCount: 3,
        } as GenerationParams; // Explicit cast if strict structure needed

        const userContext = {
          brand_voice: profile.brand_voice || "",
          company_name: profile.company_name || "",
          industry: profile.industry || "",
          headline: profile.headline || "",
          xp: profile.xp || 0,
          language: profile.language || "es",
        };

        // Generate
        const generatedContent = await aiService.generatePost(
          params,
          userContext,
        );

        // Save
        const savedPost = await postRepository.savePost(
          profile.id,
          generatedContent,
          params,
        );

        // Update Next Run Time
        // Default to daily (24h) if not specified
        const intervalMs = config.frequency === "weekly"
          ? 7 * 24 * 60 * 60 * 1000
          : 24 * 60 * 60 * 1000;
        const nextRun = now + intervalMs;

        // Update Profile
        await supabaseAdmin.from("profiles").update({
          auto_pilot: { ...config, nextRun: nextRun },
        }).eq("id", profile.id);

        results.push({
          userId: profile.id,
          status: "success",
          postId: savedPost?.id,
        });
      } catch (err: unknown) {
        console.error(`Error processing user ${profile.id}:`, err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        results.push({
          userId: profile.id,
          status: "error",
          error: errorMessage,
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} users`,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    const err = error as Error;
    return new Response(
      JSON.stringify({ error: err.message || String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
