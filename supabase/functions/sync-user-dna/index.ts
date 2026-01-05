import { BehaviorService } from "../_shared/services/BehaviorService.ts";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { userId } = await req.json();
        if (!userId) throw new Error("userId is required");

        console.log(`[sync-dna] Starting DNA evolution for user: ${userId}`);

        const behaviorService = new BehaviorService(
            Deno.env.get("GEMINI_API_KEY") ?? "",
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const newDNA = await behaviorService.syncUserDNA(userId);

        return new Response(
            JSON.stringify({ 
                message: "DNA successfully evolved", 
                dna: newDNA 
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error(`[sync-dna] Error: ${(error as Error).message}`);
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
