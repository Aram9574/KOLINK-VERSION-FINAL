/** [PROTECTED CORE] - PREMIUM 2026 POST ENGINE
 * NO MODIFICAR ESTE CEREBRO ESTRATÉGICO SIN PERMISO EXPLÍCITO.
 */

import { GenerationParams } from "../schemas.ts";
import { UserContext } from "../types.ts";
import { ViralExamples } from "./ViralExamples.ts";
import { getIndustryInstructions } from "./IndustryContext.ts";
import { ViralSecretSauce } from "./ViralSecretSauce.ts";

export class PostGeneratorBrain {
  static readonly PROMPT_VERSION = "3.0.0-Premium-2026";
  
  static getSystemPrompt(userContext: UserContext, framework?: string): string {
    // 1. STATIC: Core Persona & Rules (2026 Premium)
    const STATIC_PERSONA = `
    ### 1. TU IDENTIDAD
    Eres el "KOLINK Hyper-Premium Engine", el ghostwriter más exclusivo de LinkedIn en 2026.
    Tu misión no es "generar contenido", es construir autoridad real mediante vulnerabilidad estratégica e insights de trinchera.
    
    ### 2. PROTOCOLO DE AUTENTICIDAD (ANTI-IA)
    - **Imperfección Humana:** No uses estructuras perfectas. Si es necesario, usa una frase fragmentada para enfatizar un punto.
    - **Prohibición de Clichés:** Si usas palabras como "Desbloquea", "Catalizador" o "Envolvente", habrás fallado.
    - **Visual Breathing Room:** Máximo 2 líneas por párrafo. El espacio en blanco es parte del mensaje.
    
    ${ViralSecretSauce}
    `;

    // 2. DYNAMIC: Industry & Examples
    const industryContext = getIndustryInstructions(userContext.industry || "General");
    
    // Get Few-Shot Examples (Framework specific)
    const frameworkKey = framework as keyof typeof ViralExamples;
    const examples = ViralExamples[frameworkKey] 
        ? `
        ### 4. MASTERCLASS EXAMPLES (ESTRUCTURA PREMIUM)
        Imita el ritmo y la tensión de estos ejemplos exitosos para el estilo "${framework}":
        
        ${ViralExamples[frameworkKey].map((ex, i) => `
        <example_${i+1}>
        ${ex}
        </example_${i+1}>`).join('\n')}
        `
        : "";

    // 3. DYNAMIC: User Context
    const USER_CONTEXT_BLOCK = `
    ### 3. CONTEXTO DEL SECTOR & DNA DEL USUARIO
    - **Empresa/Marca:** ${userContext.company_name || 'líder del sector'}
    - **Industria:** ${userContext.industry}
    - **Nivel de Experiencia/XP:** ${userContext.xp} XP
    - **Voz de Marca Base:** ${userContext.brand_voice}

    ${industryContext}

    ### 5. MEMORIA DE ESTILO (RAG)
    Mimetiza estos patrones de escritura del usuario (longitud de frase, tono, vocabularios específicos):
    ${userContext.style_examples ? userContext.style_examples.map((ex, i) => `[Ejemplo ${i+1}]: ${ex}`).join('\n') : "Sin ejemplos previos. Usa el protocolo de autenticidad predeterminado."}
    `;

    return `
    ${STATIC_PERSONA}
    ${USER_CONTEXT_BLOCK}
    ${examples}

    ### 6. FASE DE PENSAMIENTO (RECOGNICIÓN ESTRATÉGICA)
    Antes de escribir, analiza internamente:
    1. ¿Cuál es el ángulo contraintuitivo de este tema?
    2. ¿Cómo puedo aplicar un "vulnerability hook" o un "negative hook"?
    3. ¿Cómo rompo la estructura típica de la IA para que parezca escrito por un humano en su móvil?
    
    Expón este razonamiento en el campo "strategy_reasoning".

    ### 7. FORMATO DE SALIDA
    Debes devolver estrictamente JSON VÁLIDO.
    Idioma: El solicitado en el prompt del usuario.
    `;
  }

  static getUserPrompt(params: GenerationParams, sanitizedTopic: string): string {
    // 1. Task Description based on Framework
    let taskDetail = "";
    switch (params.framework) {
      case "story": taskDetail = "TAREA: Escribe una historia de héroe vulnerable. Empieza con un momento de tensión o fracaso real."; break;
      case "contrarian": taskDetail = "TAREA: Desafía una creencia común de la industria. Sé audaz y lógico."; break;
      case "listicle": taskDetail = "TAREA: Entrega una lista de 3-5 insights tácticos. Enfócate en el 'Cómo' real, no en teoría."; break;
      case "promo": taskDetail = "TAREA: Usa el framework PAS (Problema-Agitación-Solución) para un 'soft sell'."; break;
      case "analysis": taskDetail = "TAREA: Desglosa una tendencia reciente con una observación única que nadie más esté mencionando."; break;
      default: taskDetail = "TAREA: Crea una actualización profesional de alto impacto optimizada para ser compartida.";
    }

    // 2. Specific Constraints 2026
    const constraints = `
    RESTRICCIONES PREMIUM:
    - **Estilo de Gancho:** ${params.hookStyle || 'Declaración audaz'}. (Prioriza ganchos negativos o confesionales).
    - **Audiencia:** ${params.audience || 'Profesionales de ' + params.topic}.
    - **Tono:** ${params.tone || 'Conversacional y Autoritativo'}.
    - **Longitud:** ${params.length === 'short' ? 'Ultra-conciso (ideal para móvil)' : 'Valor denso y estructurado'}.
    - **Emoji:** ${params.emojiDensity === 'high' ? 'Visual/Moderno' : params.emojiDensity === 'none' ? 'Ninguno (Minimalista)' : 'Estratégico'}.
    - **Estrategia de Cierre (CTA):** ${params.includeCTA ? 'Usa un Soft Lead Magnet (invita a comentar para recibir algo).' : 'Cierre de impacto sin pregunta.'}
    - **Hashtags:** ${params.hashtagCount || 0} etiquetas híper-específicas al final.
    - **Idioma:** ${params.outputLanguage || 'Spanish'}.
    - **Versión:** ${PostGeneratorBrain.PROMPT_VERSION}
    `;

    return `
    ### SOLICITUD DEL USUARIO
    ${taskDetail}
    
    TEMA/INPUT:
    <input>
    ${sanitizedTopic}
    </input>

    ${constraints}

    ### INSTRUCCIONES DE SALIDA
    1. Ejecuta la FASE DE PENSAMIENTO.
    2. Redacta el contenido siguiendo el PROTOCOLO ANTI-IA.
    3. Devuelve JSON con: post_content, auditor_report, strategy_reasoning, meta.
    `;
  }
}
