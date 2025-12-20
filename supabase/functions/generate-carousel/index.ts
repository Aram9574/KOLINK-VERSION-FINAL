import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { AIService } from "../_shared/AIService.ts";

import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
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

    const { data: { user }, error: authError } = await supabaseClient.auth
      .getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { source, sourceType, brandSettings } = await req.json();

    const aiService = new AIService(
      Deno.env.get("GEMINI_API_KEY") ?? "",
    );

    // 1. Ingest Content
    let sourceText = "";
    if (sourceType === "url") {
      sourceText = await scrapeUrl(source);
    } else if (sourceType === "youtube") {
      sourceText = await getYouTubeTranscript(source);
    } else if (sourceType === "text") {
      sourceText = source;
    } else {
      throw new Error("Unsupported source type");
    }

    // 2. RAG: Retrieve style fragments
    const queryEmbedding = await aiService.createEmbedding(
      sourceText.substring(0, 1000),
    );
    const { data: styleFragments } = await supabaseClient.rpc(
      "match_user_style",
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 5,
        p_user_id: user.id,
      },
    );

    const fragments = styleFragments?.map((f: any) => f.content) || [];

    // 3. Generate Carousel JSON
    const { data: profile } = await supabaseClient.from("profiles").select("*")
      .eq("id", user.id).single();
    const carouselJson = await aiService.generateCarousel(
      sourceText,
      fragments,
      profile,
    );

    return new Response(JSON.stringify(carouselJson), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("DEBUG: Full Error Object:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function scrapeUrl(url: string): Promise<string> {
  // Simple scraper using a proxy or direct fetch if allowed
  // For production, consider using a dedicated scraping service
  const res = await fetch(`https://r.jina.ai/${url}`); // Using Jina Reader for clean text
  if (!res.ok) throw new Error("Failed to scrape URL");
  return await res.text();
}

async function getYouTubeTranscript(videoId: string): Promise<string> {
  // Placeholder for transcript logic
  // Typically requires an external service or library that handles YouTube's specific format
  return "Youtube transcript placeholder for video " + videoId;
}
