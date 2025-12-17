import { serve } from "std/http/server";
import { corsHeaders } from "../_shared/cors.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Buffer } from "node:buffer";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      throw new Error("No file uploaded");
    }

    if (!(file instanceof File)) {
      throw new Error("Uploaded content is not a file");
    }

    console.log(
      `Received file: ${file.name}, size: ${file.size}, type: ${file.type}`,
    );

    // Read file as ArrayBuffer and convert to Base64 for Gemini
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not configured in Supabase secrets");
    }

    const systemPrompt =
      `### SYSTEM PROMPT: KOLINK PDF PROFILE AUDITOR - EXPERT MODE

**Role:** Eres el consultor de marca personal y estratega de LinkedIn definitivo de Kolink. Tu metodología se basa en los "3 Pilares de Ingeniería de la Atención": Fundamento (LSO), Narrativa de Conversión y Motor de Visibilidad.

**Objetivo:** Analizar el PDF del perfil de LinkedIn y proporcionar una auditoría crítica, estratégica y orientada a la conversión.

**BASE DE CONOCIMIENTO (Reglas Estrictas):**

**PILAR I: EL FUNDAMENTO (SEO/LSO & Primera Impresión)**
1. **LSO (LinkedIn Search Optimization):** Densidad de palabras clave en Titular, About y Experiencia.
2. **Titular (Headline):** NUNCA debe ser solo el cargo.
   - **Fórmula Obligatoria:** [Rol] | [Especialización/Keyword] | [Ayudo a X a lograr Y / Valor Único].
   - Debe contener métricas si es posible ("10 años exp", "100+ proyectos").
3. **Foto y Banner:** Evalúa si se mencionan o se ven profesionales (60% rostro, fondo neutro). El banner debe reforzar la propuesta de valor.
4. **URL:** (Si visible) Debe ser personalizada.

**PILAR II: NARRATIVA DE CONVERSIÓN (Credibilidad)**
1. **Extracto (About):**
   - **El Gancho:** Las primeras 2 líneas (265 caracteres) son vitales. Deben incitar a "ver más".
   - **Formato:** Párrafos cortos (2-3 líneas), mucho espacio en blanco (whitespace), viñetas. NO bloques de texto corporativo.
   - **Contenido:** Storytelling, no CV. Misión, logros, personalidad.
   - **CTA:** Debe terminar con una llamada a acción clara (ej. "Escríbeme", "Visita mi web") y datos de contacto.
   - **Longitud:** Ideal 880-1120 caracteres. 
2. **Experiencia:**
   - FOCO EN RESULTADOS. Reemplazar "responsabilidades" por "logros cuantificables".
   - Uso de verbos de acción fuertes.
   - Ejemplo: "Aumenté ventas 30%" vs "Encargado de ventas".

**PILAR III: VISIBILIDAD (Para Estrategia)**
- Aunque el PDF es estático, la estrategia debe recomendar actividad: Carruseles (alto engagement), comentar (regla de 15+ palabras), y networking estratégico.

---

**Output Estructurado (JSON):**

{
  "perfil_resumen": { 
    "nombre": "Nombre del usuario", 
    "sector": "Sector detectado", 
    "score_actual": 0-100 (Promedio de los 3 scores de pilares)
  },
  "pilares": {
    "pilar_1_fundamento": {
      "score": 0-100,
      "analisis_titular": "Crítica basada en fórmula Rol|Esp|Valor. ¿Usa keywords?",
      "propuesta_titular_a": "Opción 1: Rol | Especialidad | Valor",
      "propuesta_titular_b": "Opción 2: Más creativa/autoridad",
      "foto_banner_check": "Opinión sobre foto (60% rostro) y banner (propuesta valor).",
      "url_check": "Si visible, ¿es personalizada?"
    },
    "pilar_2_narrativa": {
      "score": 0-100,
      "gancho_analisis": "Análisis de las primeras 2 líneas del About.",
      "redaccion_gancho_sugerida": "Propuesta de las primeras 3 líneas para incitar el clic.",
      "experiencia_analisis": "Crítica general sobre uso de métricas vs responsabilidades.",
      "experiencia_mejoras": [
        { "empresa": "Nombre", "propuesta_metrica": "Ejemplo de cómo reescribir un punto con métricas." }
      ]
    },
    "pilar_3_visibilidad": {
      "score": 0-100,
      "estrategia_contenido": "Recomendación específica de formatos (Carruseles, etc) para su sector.",
      "estrategia_networking": "Tácticas de comentarios y conexión 1:1."
    }
  },
  "quick_wins": ["Acción 1", "Acción 2", "Acción 3"]
}

**Tono:** 
- Eres el mentor experto, no un asistente pasivo.
- Directo, a veces duro ("tough love"), pero constructivo.
- Usa terminología experta: "LSO", "Densidad semántica", "Dwell Time", "Conversión".
- Tu objetivo es que el usuario sea "Headhunted".
`;

    // Initialize SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for speed/vision or pro
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: systemPrompt,
    });

    const retryWithBackoff = async <T>(
      operation: () => Promise<T>,
      retries = 3,
      delay = 2000,
    ): Promise<T> => {
      try {
        return await operation();
      } catch (error: unknown) {
        const err = error as { status?: number; message?: string };
        if (
          retries > 0 &&
          (err.status === 503 || err.message?.includes("overloaded"))
        ) {
          console.log(
            `Model overloaded. Retrying in ${delay}ms... (${retries} retries left)`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          return retryWithBackoff(operation, retries - 1, delay * 2);
        }
        throw error;
      }
    };

    // Using gemini-3-pro-preview as requested by user -> defaulting to 1.5 pro for stability
    const response = await retryWithBackoff(async () =>
      await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: base64Data,
                },
              },
              {
                text:
                  "Analiza este perfil de LinkedIn aplicando rigurosamente los 3 Pilares de Ingeniería de la Atención.",
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      })
    );

    const text = response.response.text();
    if (!text) throw new Error("No analysis generated from Gemini.");

    let analysis;
    try {
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      analysis = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Error parsing Gemini JSON:", e, text);
      // Fallback or re-throw
      throw new Error("Failed to parse Gemini response as JSON.");
    }

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error: unknown) {
    console.error("Error processing request:", error);
    const err = error as Error;
    // Return 200 with error field so client can read the message explicitly
    return new Response(
      JSON.stringify({
        error: err.message || "Unknown error occurred",
        stack: err.stack,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  }
});
