
import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
      }
    );

    // 1. Get User Context
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // 2. Parse Body (Pillars, Images, etc.)
    const { images, manuallyTriggered: _manuallyTriggered } = await req.json().catch(() => ({}));
    
    // 3. Get Profile & Active Voice
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("active_voice_id, company_name, industry")
      .eq("id", user.id)
      .single();

    let brandVoice = "Professional and engaging";
    
    if (profile?.active_voice_id) {
        const { data: voiceData } = await supabaseClient
            .from("brand_voices")
            .select("description")
            .eq("id", profile.active_voice_id)
            .single();
            
        if (voiceData?.description) {
            brandVoice = voiceData.description;
        }
    }

    // Default pillars if no config (since autopost_config is deprecated)
    const pillars = [
      { topic: "Industry Insights", weight: 40 },
      { topic: "Personal Story", weight: 30 },
      { topic: "Tips & Tricks", weight: 30 },
    ];

    // 4. Initialize Gemini 3 Flash
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    // Using gemini-3-flash-preview for SOTA speed/multimodal
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 5. Construct Prompt
    const prompt = `
      Actúa como el Director de Estrategia de Contenidos de Kolink. Genera contenido de alto valor basado en:
      
      CONTEXT:
      - Brand Voice: "${brandVoice}"
      - Content Pillars (Weights): ${JSON.stringify(pillars)}
      
      TASK:
      Genera 3 borradores de posts de LinkedIn distintos para la próxima semana.
      
      ${
        images && images.length > 0
          ? "RADAR DETECTADO: Se han proporcionado capturas de noticias/tendencias. Crea al menos un post de opinión experta analizando estas imágenes."
          : "Foco: Respeta la distribución de temas (Pillars)."
      }
      
      REQUIREMENTS:
      - Viral-Ready: Usa ganchos fuertes.
      - Authority: Aplica el tono del usuario.
      - Return STRICT JSON format.
      
      OUTPUT SCHEMA:
      Array of objects:
      [
        {
          "content": "Texto del post con emojis y formato...",
          "pillar": "Nombre del pilar seleccionado",
          "authority_score": 85 (0-100 predicción de impacto),
          "reasoning": "Razonamiento técnico de por qué es relevante hoy..."
        }
      ]
    `;

    // 6. Generate Content
    // Define parts with proper structure for Gemini
    const parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = [{ text: prompt }];

    if (images && images.length > 0) {
        for (const imgStr of images) {
             const match = imgStr.match(/^data:(.+);base64,(.+)$/);
             // Verify valid base64 image data
             if (match) { 
                 parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
             } else if (imgStr.startsWith("data:image")) {
                  // Fallback for simple split if regex fails but prefix exists
                  const [meta, data] = imgStr.split(",");
                  const mime = meta.split(":")[1].split(";")[0];
                  parts.push({ inlineData: { mimeType: mime, data } });
             }
        }
    }

    const result = await model.generateContent({
        // @ts-ignore: Google Generative AI types might be strict, casting parts to any for flex
        // deno-lint-ignore no-explicit-any
        contents: [{ role: "user", parts: parts as any }],
        generationConfig: { responseMimeType: "application/json" }
    });
    
    const responseText = result.response.text();

    console.log("Raw AI Response:", responseText);

    const generatedPosts = JSON.parse(responseText);

    // 7. Insert into Queue
    interface GeneratedPost {
        content: string;
        pillar: string;
        authority_score?: number;
    }

    const inserts = generatedPosts.map((post: GeneratedPost) => ({
      user_id: user.id,
      content: post.content,
      pillar: post.pillar,
      authority_score: post.authority_score || 75,
      status: "pending_approval",
      scheduled_at: new Date(Date.now() + 86400000).toISOString(), // Dummy +24h
    }));

    const { error: insertError } = await supabaseClient
      .from("autopost_queue")
      .insert(inserts);

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true, posts: generatedPosts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  // deno-lint-ignore no-explicit-any
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
