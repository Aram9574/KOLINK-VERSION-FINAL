import { serve } from "std/http/server";
import { createClient } from "@supabase/supabase-js";
import { AIService } from "../_shared/AIService.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface KnowledgeMatch {
  content: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Setup & Auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const { data: { user }, error: authError } = await supabaseClient.auth
      .getUser();
    if (authError || !user) throw new Error("No estás autorizado.");

    const { query } = await req.json();
    if (!query) throw new Error("La consulta es requerida.");

    const aiService = new AIService(Deno.env.get("GEMINI_API_KEY") ?? "");
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // 2. RAG: Search Vector Knowledge Base
    console.log("[Expert Chat] Searching knowledge base for:", query);

    // a. Create embedding for the query
    const queryEmbedding = await aiService.createEmbedding(query);

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
      console.error("[Expert Chat] Error matching knowledge:", matchError);
    }

    const context = matches?.map((m: KnowledgeMatch) =>
      m.content
    ).join("\n\n") || "";

    // 3. User Language
    const { data: profile } = await supabaseAdmin.from("profiles").select(
      "language",
    ).eq("id", user.id).single();
    const language = profile?.language || "es";

    // 4. Generate Expert Response
    console.log(
      "[Expert Chat] Generating response with context length:",
      context.length,
    );
    const responseText = await aiService.generateExpertResponse(
      query,
      context,
      language,
    );

    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Error desconocido";
    console.error("[Expert Chat] Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
