import { getCorsHeaders } from "../_shared/cors.ts";
import { ContentService, EngagementPrediction } from "../_shared/services/ContentService.ts";
import { CreditService } from "../_shared/services/CreditService.ts";
import { createClient } from "@supabase/supabase-js";

Deno.serve(async (req) => {
  const headers = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const { content, language = "es" } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY")!;

    if (!content || !apiKey) throw new Error("Missing content or API key");

    // 1. Auth & User Context
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    
    if (authHeader) {
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? "",
          { global: { headers: { Authorization: authHeader } } }
        );
        
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        if (user) {
             userId = user.id;
             const supabaseAdmin = createClient(
                Deno.env.get("SUPABASE_URL") ?? "",
                Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
             );

             // CHECK CREDITS (Optional: different cost? for now 1 credit)
             const creditService = new CreditService(supabaseAdmin, supabaseClient);
             const hasCredits = await creditService.hasCredits(user.id);
             if (!hasCredits) {
                 throw new Error("INSUFFICIENT_CREDITS");
             }
        }
    }

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // 2. Predict Performance
    const contentService = new ContentService(apiKey);
    const prediction: EngagementPrediction = await contentService.predictPerformance(content, language);

    // 3. Deduct Credit
    if (userId) {
        try {
             const supabaseAdmin = createClient(
                Deno.env.get("SUPABASE_URL") ?? "",
                Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
             );
             const creditService = new CreditService(supabaseAdmin, createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? ""));
             await creditService.deductCredit(userId);
             console.log(`[PredictPerf] Credit deducted for user ${userId}`);
        } catch (e) {
            console.error("[PredictPerf] Failed to deduct credit:", e);
        }
    }

    return new Response(
      JSON.stringify(prediction),
      {
        headers: { ...headers, "Content-Type": "application/json" },
      }
    );
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[PredictPerf] Error:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
});
