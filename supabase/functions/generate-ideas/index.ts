import { createClient } from "@supabase/supabase-js";
import { getCorsHeaders } from "../_shared/cors.ts";
import { ContentService } from "../_shared/services/ContentService.ts";

Deno.serve(async (req: Request) => {
  const headers = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
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
    if (authError || !user) throw new Error("Unauthorized");

    const { topic } = await req.json();
    if (!topic) throw new Error("Topic is required");

    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("language")
      .eq("id", user.id)
      .single();
    
    const language = profile?.language || "es";

    const contentService = new ContentService(Deno.env.get("GEMINI_API_KEY") || "");
    const result = await contentService.generateIdeas(topic, language);

    return new Response(JSON.stringify({ 
      ideas: result.ideas,
      count: result.ideas.length 
    }), {
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return new Response(
      JSON.stringify({ error: err.message || "Internal error" }),
      {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
  }
});
