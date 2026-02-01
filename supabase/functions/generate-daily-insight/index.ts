/** [PROTECTED CORE] - PREMIUM 2026 TREND ENGINE **/

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { BaseAIService } from "../_shared/services/BaseAIService.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { user_id, language = 'es' } = await req.json();

    if (!user_id) throw new Error("User ID is required");

    // 1. Get User Profile Context
    const { data: user, error: userError } = await supabaseAdmin
      .from("profiles")
      .select("industry, headline, company_name, bio, target_audience")
      .eq("id", user_id)
      .single();

    if (userError || !user) throw new Error("User profile not found");

    // 2. Setup AI Service
    const aiService = new BaseAIService(GEMINI_API_KEY!);

    const systemPrompt = `
      Eres un estratega de contenido premium para LinkedIn experto en el sector "${user.industry || 'Tecnología'}".
      Tu objetivo es identificar una "Oportunidad Detectada" híper-específica para el usuario basándote en su perfil.
      
      CONTEXTO DEL USUARIO:
      - Titular: ${user.headline}
      - Empresa: ${user.company_name}
      - Bio: ${user.bio}
      - Audiencia: ${user.target_audience}
      
      INSTRUCCIONES:
      - Crea una frase corta (máximo 12 palabras) que indique un tema en tendencia real o lógico para este perfil.
      - El tono debe ser profesional, intrigante y motivador.
      - No uses generalidades. Sé específico al nicho.
      - Devuelve SOLO el texto de la oportunidad, p. ej: "El auge de la tokenización en Real Estate es tu ángulo hoy."
      
      IDIOMA: ${language === 'es' ? 'Español' : 'Inglés'}
    `;

    const trendText = await aiService.generateRawText(
      `Genera una oportunidad de contenido estratégica para un profesional de ${user.industry}.`,
      systemPrompt
    );

    return new Response(
      JSON.stringify({ trend: trendText.trim().replace(/^"|"$/g, '') }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Trend Generation Error:", error);
    return new Response(
      JSON.stringify({ error: error.message, trend: "La IA en LinkedIn está cambiando el juego. ¡Publica ahora!" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
