import { createClient } from "@supabase/supabase-js";
import { ContentService } from "../_shared/services/ContentService.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScheduleItem {
  pillar_name: string;
  idea_title: string;
  idea_summary: string;
  confidence: number;
}

interface ScheduleResponse {
  schedule: ScheduleItem[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Initialize Admin Client (Service Role) - Cron jobs run as admin
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 2. Determine Scope: Manual Trigger vs Cron Batch
    let userIds: string[] = [];

    try {
        const body = await req.json();
        if (body.user_id) {
            userIds = [body.user_id];
            console.log(`[AutoPilot] Manual trigger for user: ${body.user_id}`);
        }
    } catch (e) {
        // No body or invalid JSON, proceed to batch mode
    }

    if (userIds.length === 0) {
        console.log("[AutoPilot] Starting Cron Batch Mode...");
        // Fetch distinct users who have pillars defined
        const { data: usersWithPillars, error: pillarsError } = await supabaseAdmin
            .from("content_pillars")
            .select("user_id")
            .gt("weight_percentage", 0); // Only active pillars

        if (pillarsError) throw pillarsError;
        userIds = [...new Set(usersWithPillars.map(u => u.user_id))];
    }

    console.log(`[AutoPilot] Processing ${userIds.length} users.`);

    const contentService = new ContentService(Deno.env.get("GEMINI_API_KEY") ?? "");
    const results = [];

    // 3. Process each user (In a real scalable system, this would be queue-based or batched)
    for (const userId of userIds) {
        // A. Get User Context (Profile, Pillars, Active Voice)
        const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("*, brand_voices(*)") // Assume relation or fetch separately
            .eq("id", userId)
            .single();
        
        const { data: pillars } = await supabaseAdmin
            .from("content_pillars")
            .select("*")
            .eq("user_id", userId);

        const { data: activeVoice } = await supabaseAdmin
            .from("brand_voices")
            .select("description")
            .eq("id", profile.active_voice_id)
            .single();

        // B. Check if schedule is empty for next week (Avoid duplicates)
        // For MVP, we just generate if "pending_approval" count is low (< 3)
        const { count } = await supabaseAdmin
            .from("autopost_schedule")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("status", "pending_approval");

        if ((count || 0) >= 5) {
            console.log(`[AutoPilot] User ${userId} has enough pending posts. Skipping.`);
            continue;
        }

        // C. Generate Ideas via Gemini (SPANISH ENFORCED)
        const pillarsContext = pillars?.map(p => `${p.name} (${p.weight_percentage}%)`).join(", ");
        const voiceContext = activeVoice?.description || "Profesional y Autoridad";
        const dnaContext = profile.behavioral_dna ? JSON.stringify(profile.behavioral_dna) : "";

        const prompt = `
            ACTÚA COMO: Director de Estrategia de Contenidos para LinkedIn (Español Nativo).
            OBJETIVO: Generar 3 ideas de contenido estratégico para la próxima semana.
            
            CONTEXTO DEL USUARIO:
            - Pilares de Contenido: ${pillarsContext}
            - Voz de Marca: ${voiceContext}
            - ADN Conductual: ${dnaContext}
            
            INSTRUCCIONES:
            1. Genera 3 ideas únicas.
            2. Asigna una fecha sugerida (empezando mañana).
            3. Estrictamente en ESPAÑOL.
            
            FORMATO JSON DE SALIDA:
            {
                "schedule": [
                    {
                        "pillar_name": "Nombre Exacto del Pilar",
                        "idea_title": "Título catch",
                        "idea_summary": "Resumen de la idea (2-3 frases)",
                        "confidence": 85
                    }
                ]
            }
        `;

        const scheduleIdeas = await contentService.generateDirect(prompt, { 
             schedule: {
                 type: "ARRAY",
                 items: {
                     type: "OBJECT",
                     properties: {
                         pillar_name: { type: "STRING" },
                         idea_title: { type: "STRING" },
                         idea_summary: { type: "STRING" },
                         confidence: { type: "INTEGER" }
                     }
                 }
             }
        });

        // D. Insert into DB
        const ideasResponse = scheduleIdeas as unknown as ScheduleResponse;
        if (ideasResponse && ideasResponse.schedule) {
             const inserts = ideasResponse.schedule.map((item: ScheduleItem) => {
                 const matchedPillar = pillars?.find(p => p.name === item.pillar_name) || pillars?.[0];
                 // Calculate date: Tomorrow + index days
                 const date = new Date();
                 date.setDate(date.getDate() + 1 + ideasResponse.schedule.indexOf(item));

                 return {
                     user_id: userId,
                     pillar_id: matchedPillar?.id,
                     scheduled_date: date.toISOString(),
                     content_idea: `**${item.idea_title}**\n${item.idea_summary}`,
                     status: "pending_approval",
                     confidence_score: item.confidence
                 };
             });

             await supabaseAdmin.from("autopost_schedule").insert(inserts);
             results.push({ userId, generated: inserts.length });
        }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const err = error as Error;
    console.error(`[AutoPilot] Error:`, err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
