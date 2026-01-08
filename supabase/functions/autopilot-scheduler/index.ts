import { createClient } from "@supabase/supabase-js";
import { ContentService } from "../_shared/services/ContentService.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateDraftRequest {
    mode: "generate_draft";
    user_id: string;
    trend: {
        title: string;
        summary: string;
        source: string;
    };
    angle: "visionary" | "implementer" | "analyst";
    expertise_dna?: any;
}

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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body: any = await req.json();
    const contentService = new ContentService(Deno.env.get("GEMINI_API_KEY") ?? "");

    // --- MODE 1: GENERATE SINGLE DRAFT (Interactive) ---
    if (body.mode === "generate_draft") {
        const { user_id, trend, angle, expertise_dna } = body as GenerateDraftRequest;

        // 1. Fetch User Context if not provided
        let userContext = expertise_dna;
        if (!userContext) {
             const { data: profile } = await supabaseAdmin.from("profiles").select("behavioral_dna, industry").eq("id", user_id).single();
             userContext = { ...profile?.behavioral_dna, industry: profile?.industry || "Tech" };
        }

        // 2. Construct System Prompts (3-Layer System)
        const IDENTITY_PROMPT = `
        Actúa como un Ghostwriter experto en LinkedIn para perfiles de alto nivel. 
        Tu objetivo es transformar noticias y tendencias en contenido de autoridad. 
        Evita adjetivos vacíos como 'revolucionario', 'increíble' o 'el futuro está aquí'. 
        Usa frases cortas, lenguaje directo y un tono profesional pero humano. 
        Tu prioridad es el pensamiento crítico: no te limites a resumir la noticia, explica las implicaciones ocultas para el sector del usuario.
        `;

        const ANGLE_PROMPTS = {
            visionary: `
            ÁNGULO: EL VISIONARIO (Contrarian/Futurista).
            Analiza la noticia: "${trend.title} - ${trend.summary}".
            Busca un ángulo que contradiga la opinión popular o que proyecte una consecuencia a 5 años que nadie esté viendo. 
            Empieza con un 'gancho' (hook) que cuestione el status quo. 
            Ejemplo: 'La mayoría piensa que X es bueno, pero para el sector ${userContext.industry}, esto podría ser un caballo de Troya'.`,
            
            implementer: `
            ÁNGULO: EL IMPLEMENTADOR (Pragmático).
            Basándote en: "${trend.title}", extrae las 3 acciones concretas que un profesional en ${userContext.industry} debería tomar mañana mismo.
            Usa una lista de puntos (bullet points).
            El tono debe ser: 'Menos teoría, más ejecución'.
            Termina con una pregunta que invite a compartir experiencias prácticas.`,
            
            analyst: `
            ÁNGULO: EL ANALISTA DE DATOS (Estratégico).
            Interpreta los datos de: "${trend.title} - ${trend.summary}".
            Explica cómo afectarán al ROI o a la eficiencia operativa en ${userContext.industry}.
            No uses lenguaje técnico innecesario; traduce la complejidad a impacto de negocio.
            Usa una estructura de 'Problema > Dato > Solución'.`
        };

        const HUMANITY_FILTER = `
        PROHIBICIONES: No empieces con 'En el mundo actual...', 'Hoy en día...', o 'En un panorama en constante cambio...'. Empieza directamente con el impacto lección.
        RITMO: Varía la longitud de las oraciones. Una muy corta. Luego una mediana. Luego otra corta.
        SALIDA: Solo el texto del post. Sin introducciones tipo "Aquí tienes el post".
        `;

        const fullPrompt = `
        ${IDENTITY_PROMPT}

        CONTEXTO USUARIO:
        - Industria: ${userContext.industry}
        - Arquetipo: ${userContext.archetype || "Educator"}
        
        ${ANGLE_PROMPTS[angle]}

        ${HUMANITY_FILTER}
        `;

        const draft = await contentService.generateRawText(fullPrompt);

        return new Response(JSON.stringify({ draft }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }

    // --- MODE 2: BATCH SCHEDULER (Legacy / Background) ---
    // Kept for backward compatibility or future cron jobs
    
    // 2. Determine Scope: Manual Trigger vs Cron Batch
    let userIds: string[] = [];
    if (body.user_id) {
        userIds = [body.user_id];
        console.log(`[AutoPilot] Manual trigger for user: ${body.user_id}`);
    }

    if (userIds.length === 0) {
        console.log("[AutoPilot] Starting Cron Batch Mode...");
        const { data: usersWithPillars, error: pillarsError } = await supabaseAdmin
            .from("content_pillars")
            .select("user_id")
            .gt("weight_percentage", 0);

        if (pillarsError) throw pillarsError;
        userIds = [...new Set(usersWithPillars.map(u => u.user_id))];
    }

    console.log(`[AutoPilot] Processing ${userIds.length} users.`);
    const results = [];

    for (const userId of userIds) {
        const { data: profile } = await supabaseAdmin.from("profiles").select("*, brand_voices(*)").eq("id", userId).single();
        const { data: pillars } = await supabaseAdmin.from("content_pillars").select("*").eq("user_id", userId);
        const { data: activeVoice } = await supabaseAdmin.from("brand_voices").select("description").eq("id", profile.active_voice_id).single();

        const { count } = await supabaseAdmin.from("autopost_schedule").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "pending_approval");

        if ((count || 0) >= 5) {
            console.log(`[AutoPilot] User ${userId} has enough pending posts. Skipping.`);
            continue;
        }

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

        const ideasResponse = scheduleIdeas as unknown as ScheduleResponse;
        if (ideasResponse && ideasResponse.schedule) {
             const inserts = ideasResponse.schedule.map((item: ScheduleItem) => {
                 const matchedPillar = pillars?.find(p => p.name === item.pillar_name) || pillars?.[0];
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

    return new Response(JSON.stringify({ success: true, results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: unknown) {
    const err = error as Error;
    console.error(`[AutoPilot] Error:`, err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
