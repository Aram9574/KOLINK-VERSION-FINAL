import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { NexusService } from "../_shared/services/NexusService.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const { items } = await req.json();

        if (!Array.isArray(items)) {
            throw new Error("Invalid request: 'items' must be an array of objects { content: string, metadata?: any }");
        }

        console.log(`Processing ${items.length} knowledge snippets...`);

        const results = [];
        const nexusService = new NexusService(Deno.env.get("GEMINI_API_KEY") ?? "");

        for (const item of items) {
            const { content, metadata = {} } = item;
            
            console.log(`Creating embedding for: ${content.substring(0, 50)}...`);
            const embedding = await nexusService.createEmbedding(content);

            const { data, error } = await supabase
                .from("linkedin_knowledge_base")
                .insert({
                    content,
                    embedding,
                    metadata,
                })
                .select()
                .single();

            if (error) {
                console.error(`Error inserting snippet: ${error.message}`);
                results.push({ content: content.substring(0, 30), status: "error", error: error.message });
            } else {
                results.push({ content: content.substring(0, 30), status: "success", id: data.id });
            }
        }

        return new Response(
            JSON.stringify({ message: "Seeding completed", results }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
