import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.12.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { user_id, params, language } = await req.json();

        if (!user_id) throw new Error('Missing user_id');

        // 1. Check & Deduct Credits (Cost = 1)
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user_id)
            .single();

        if (profileError || !profile) throw new Error('User profile not found');
        if (profile.credits < 1) throw new Error('Insufficient credits');

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits: profile.credits - 1 })
            .eq('id', user_id);

        if (updateError) throw new Error('Failed to deduct credits');

        // 2. Generate Ideas with Gemini
        const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') ?? '');
        const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

        const niche = params.niche || "Business";
        const style = params.style || "trending";
        const source = params.source || "news";
        const count = params.count || 3;
        const context = params.customContext || [];

        let prompt = `
      Act as an expert viral content strategist for LinkedIn.
      
      **Role:** Generate strictly ${count} viral post ideas for the niche "${niche}".
      **Style:** ${style} (e.g. if trending, focus on news; if contrarian, challenge norms).
      **Language:** ${language === 'es' ? 'Spanish' : 'English'}.
      
      **Constraint:**
      - Each idea must be a SHORT, PUNCHY summary (max 3 lines).
      - It should feel like a "Hook" + "Brief Angle".
      - DO NOT use hashtags.
      - DO NOT use "Here are X ideas". Just the list.
    `;

        if (source === 'news') {
            // Note: For real web search, we'd need a tool. Since 1.5 Flash doesn't have built-in browsing without tools config,
            // we will prompt it to use its internal knowledge or simulate "recent trends" if known.
            // Ideally, we'd use a Search Tool here if available in the environment.
            // For now, we rely on the model's training cut-off or "hallucinated" trends which acts as a placeholder 
            // until we add a real search API (like Tavily) or use the Gemini Search Tool if configured in Google Cloud.
            // *Correction*: 1.5 Pro/Flash supports google_search_retrieval in Vertex AI or Studio, 
            // but here we are using the simple API key.
            // We will simulate "trending" by asking for general perennial trends or widely known recent topics.
            prompt += `\nFocus on what is currently relevant or timelessly viral in this sector used as "news" or "trends".`;
        }

        if (context.length > 0) {
            prompt += `\n\n**User Context to Integrate:**\n`;
            context.forEach((c: any) => {
                if (c.type === 'text' || c.type === 'link') prompt += `- ${c.content}\n`;
            });
        }

        const retryWithBackoff = async <T>(operation: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
            try {
                return await operation();
            } catch (error: any) {
                if (retries > 0 && (error.status === 503 || error.message?.includes('overloaded'))) {
                    console.log(`Model overloaded. Retrying in ${delay}ms... (${retries} retries left)`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return retryWithBackoff(operation, retries - 1, delay * 2);
                }
                throw error;
            }
        };

        const result = await retryWithBackoff(async () => await model.generateContent(prompt));
        const responseText = result.response.text();

        // Parse the list
        const ideas = responseText
            .split(/\d+\.\s+/)
            .map((i: string) => i.trim())
            .filter((i: string) => i.length > 5)
            .slice(0, count);

        return new Response(
            JSON.stringify({ ideas: ideas, sources: [] }), // Sources empty for now as we don't have real search metadata access here easily without tools
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error: any) {
        console.error("Generate Ideas Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;

        return new Response(
            JSON.stringify({
                error: errorMessage,
                details: errorStack
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});
