import { serve } from "std/http/server";
import { createClient } from "@supabase/supabase-js";
import { NexusService } from "../_shared/services/NexusService.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface KnowledgeMatch {
  content: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) throw new Error("UNAUTHORIZED");

    const { query } = await req.json();
    if (!query) throw new Error("QUERY_REQUIRED");

    const nexusService = new NexusService(Deno.env.get("GEMINI_API_KEY") ?? "");
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // 2. RAG: Search Vector Knowledge Base
    console.log("[Nexus] Searching knowledge base for:", query);

    // a. Create embedding for the query using the specialized service
    const queryEmbedding = await nexusService.createEmbedding(query);

    // b. Match in Supabase
    const { data: matches, error: matchError } = await supabaseAdmin.rpc(
      "match_linkedin_knowledge",
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 3,
      },
    );

    if (matchError) {
      console.error("[Nexus] Error matching knowledge:", matchError);
    }

    const context = matches?.map((m: KnowledgeMatch) => m.content).join("\n\n") || "";

    // 3. User Language
    const { data: profile } = await supabaseAdmin.from("profiles").select("language").eq("id", user.id).single();
    const language = profile?.language || "es";

    // 4. Generate Expert Response using the specialized service
    const responseText = await nexusService.generateExpertResponse(query, context, language);

    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    console.error("[Nexus] Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
