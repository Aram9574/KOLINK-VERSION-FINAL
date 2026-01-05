import { createClient } from "@supabase/supabase-js";
import { NexusService } from "../_shared/services/NexusService.ts";
import { BehaviorService } from "../_shared/services/BehaviorService.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface KnowledgeMatch {
  content: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    console.log("[Nexus] Authorization header present:", !!authHeader);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {},
        },
      },
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
        console.error("[Nexus] Auth Error:", authError?.message || "User not found");
        return new Response(
            JSON.stringify({ error: "UNAUTHORIZED", details: authError?.message }),
            { 
                status: 401, 
                headers: { ...corsHeaders, "Content-Type": "application/json" } 
            }
        );
    }

    const { query, imageBase64, mode } = await req.json();
    if (!query && !imageBase64) throw new Error("QUERY_REQUIRED");

    const nexusService = new NexusService(Deno.env.get("GEMINI_API_KEY") ?? "");
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const behaviorService = new BehaviorService(
        Deno.env.get("GEMINI_API_KEY") ?? "",
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1.5 Track Chat Event (Fire and forget, don't block chat)
    behaviorService.trackEvent(user.id, "chat_message", { query, mode }).catch(e => console.error("Event loop error:", e));

    // 2. RAG: Search Vector Knowledge Base (only if text query exists)
    let context = "";
    if (query) {
        console.log("[Nexus] Searching knowledge base for user:", user.id);
        const queryEmbedding = await nexusService.createEmbedding(query);
        const { data: matches, error: matchError } = await supabaseAdmin.rpc(
        "match_linkedin_knowledge",
        {
            query_embedding: queryEmbedding,
            match_threshold: 0.5,
            match_count: 5, // Increased context window
            p_user_id: user.id
        },
        );

        if (matchError) console.error("[Nexus] Error matching knowledge:", matchError);
        context = matches?.map((m: KnowledgeMatch) => m.content).join("\n\n") || "";
    }

    // 3. User Identity & DNA
    const { data: profile } = await supabaseAdmin.from("profiles").select("language, behavioral_dna").eq("id", user.id).single();
    const language = profile?.language || "es";
    const personalContext = profile?.behavioral_dna ? JSON.stringify(profile.behavioral_dna) : "";

    // 4. Generate Expert Response
    const result = await nexusService.generateExpertResponse(
        query || "Analyzing image...", 
        context, 
        language, 
        imageBase64,
        mode || "advisor",
        personalContext
    );

    // 5. Build and return result
    if (!result || typeof result.response !== 'string') {
        throw new Error("INVALID_AI_RESPONSE");
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("[Nexus] CRITICAL_ERROR:", errorMessage, errorStack);
    
    return new Response(
      JSON.stringify({ 
        response: `⚠️ ERROR EXTREMO: ${errorMessage}\n\nFase: runtime_execution\nStack: ${errorStack.substring(0, 200)}...`,
        strategic_insight: "Error en la ejecución de la IA.",
        suggested_actions: ["Revisar Conocimiento Base", "Verificar Model ID"]
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
