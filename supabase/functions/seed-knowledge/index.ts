import { serve } from "std/http/server";
import { createClient } from "@supabase/supabase-js";
import { AIService } from "../_shared/AIService.ts";

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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const aiService = new AIService(Deno.env.get("GEMINI_API_KEY") ?? "");

    // 1. Fetch rows without embeddings
    const { data: rows, error: fetchError } = await supabaseAdmin
      .from("linkedin_knowledge_base")
      .select("id, content")
      .is("embedding", null);

    if (fetchError) throw fetchError;

    console.log(`[Seed] Found ${rows?.length} rows to embed.`);

    let updatedCount = 0;
    for (const row of rows || []) {
      try {
        const embedding = await aiService.createEmbedding(row.content);

        const { error: updateError } = await supabaseAdmin
          .from("linkedin_knowledge_base")
          .update({ embedding })
          .eq("id", row.id);

        if (updateError) throw updateError;
        updatedCount++;
        console.log(`[Seed] Updated row ${row.id}`);
      } catch (err) {
        console.error(`[Seed] Failed row ${row.id}:`, err);
      }
    }

    return new Response(
      JSON.stringify({
        message: "Seed completed",
        processed: rows?.length,
        updated: updatedCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Error desconocido";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
