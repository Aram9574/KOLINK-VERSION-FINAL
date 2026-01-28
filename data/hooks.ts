export interface HookTemplate {
    id: string;
    category: 'Contrarian' | 'Data' | 'Story' | 'Listicle' | 'Question' | 'Direct';
    template: string;
    example: string;
    whyItWorks: string;
    // Spanish Translations
    templateEs?: string;
    exampleEs?: string;
    whyItWorksEs?: string;
    viralScore: number; // 0-100
}

export const HOOK_LIBRARY: HookTemplate[] = [
    {
        id: "contrarian-1",
        category: "Contrarian",
        template: "Stop doing [Common Practice]. Do [Counter-Intuitive Approach] instead.",
        example: "Stop sending cold DMs. Start commenting on their posts 15 mins before posting yours instead.",
        whyItWorks: "Challenges the status quo immediately, creating curiosity and debate.",
        templateEs: "Deja de hacer [Práctica Común]. Haz [Enfoque Contra-Intuitivo] en su lugar.",
        exampleEs: "Deja de enviar DMs fríos. Empieza a comentar en sus posts 15 min antes de publicar el tuyo.",
        whyItWorksEs: "Desafía el status quo inmediatamente, creando curiosidad y debate.",
        viralScore: 92
    },
    {
        id: "contrarian-2",
        category: "Contrarian",
        template: "Unpopular opinion: [Belief] is actually [Negative Outcome/False].",
        example: "Unpopular opinion: 'Work-life balance' is actually keeping you broke and unhappy.",
        whyItWorks: "Polarizing statements force the user to pick a side, driving comments.",
        templateEs: "Opinión impopular: [Creencia] es en realidad [Resultado Negativo/Falso].",
        exampleEs: "Opinión impopular: El 'equilibrio vida-trabajo' en realidad te mantiene pobre e infeliz.",
        whyItWorksEs: "Las declaraciones polarizantes obligan al usuario a elegir un bando, impulsando comentarios.",
        viralScore: 88
    },
    {
        id: "data-1",
        category: "Data",
        template: "I analyzed [Number] [Subject]. Here are the top [Number] findings:",
        example: "I analyzed 10,000 viral LinkedIn posts. Here are the top 5 patterns I found:",
        whyItWorks: "Implies high effort/value research that the user can consume quickly.",
        templateEs: "Analicé [Número] [Sujeto]. Aquí están los [Número] hallazgos principales:",
        exampleEs: "Analicé 10,000 posts virales de LinkedIn. Aquí están los 5 patrones principales que encontré:",
        whyItWorksEs: "Implica investigación de alto esfuerzo/valor que el usuario puede consumir rápidamente.",
        viralScore: 95
    },
    {
        id: "data-2",
        category: "Data",
        template: "[Number]% of [Audience] are doing it wrong. Here is how to fix it:",
        example: "99% of SaaS founders are doing pricing wrong. Here is how to fix it:",
        whyItWorks: "Fear of missing out (FOMO) and desire for improvement.",
        templateEs: "[Número]% de [Audiencia] lo están haciendo mal. Así es como se arregla:",
        exampleEs: "99% de los fundadores SaaS están fijando precios mal. Así es como se arregla:",
        whyItWorksEs: "Miedo a perderse algo (FOMO) y deseo de mejora.",
        viralScore: 85
    },
    {
        id: "story-1",
        category: "Story",
        template: "How I went from [Starting Point] to [End Point] in [Timeframe].",
        example: "How I went from 0 to 100k followers in 6 months without paid ads.",
        whyItWorks: "Classic hero's journey transformation. deeply relatable and aspirational.",
        templateEs: "Cómo pasé de [Punto Inicial] a [Punto Final] en [Tiempo].",
        exampleEs: "Cómo pasé de 0 a 100k seguidores en 6 meses sin anuncios pagados.",
        whyItWorksEs: "Transformación clásica del viaje del héroe. Profundamente relacionable y aspiracional.",
        viralScore: 94
    },
    {
        id: "story-2",
        category: "Story",
        template: "I rejected a $[Amount] offer to [Action]. Here is why:",
        example: "I rejected a $150k salary offer to start my own agency. Here is why:",
        whyItWorks: "High stakes decision creates immediate intrigue and emotional investment.",
        templateEs: "Rechacé una oferta de $[Monto] para [Acción]. Aquí el por qué:",
        exampleEs: "Rechacé una oferta de salario de $150k para iniciar mi propia agencia. Aquí el por qué:",
        whyItWorksEs: "Decisión de alto riesgo crea intriga inmediata e inversión emocional.",
        viralScore: 90
    },
    {
        id: "listicle-1",
        category: "Listicle",
        template: "[Number] tools to [Benefit] (available for free):",
        example: "7 AI tools to automate your entire sales process (available for free):",
        whyItWorks: "High utility promise. People save these posts for later reference.",
        templateEs: "[Número] herramientas para [Beneficio] (disponibles gratis):",
        exampleEs: "7 herramientas de IA para automatizar todo tu proceso de ventas (disponibles gratis):",
        whyItWorksEs: "Promesa de alta utilidad. La gente guarda estos posts para referencia futura.",
        viralScore: 96
    },
    {
        id: "listicle-2",
        category: "Listicle",
        template: "Steal my [System/Process] for [Result].",
        example: "Steal my exact cold email script for booking Fortune 500 CEOs.",
        whyItWorks: "Generosity hook. Offers a proprietary asset for free.",
        templateEs: "Roba mi [Sistema/Proceso] para [Resultado].",
        exampleEs: "Roba mi guion exacto de email frío para agendar con CEOs de Fortune 500.",
        whyItWorksEs: "Gancho de generosidad. Ofrece un activo propietario gratis.",
        viralScore: 93
    },
    {
        id: "question-1",
        category: "Question",
        template: "Are you [Pain Point] or [Desired State]?",
        example: "Are you actually productive or just busy?",
        whyItWorks: "Forces self-reflection and qualifies the reader immediately.",
        templateEs: "¿Estás [Punto de Dolor] o [Estado Deseado]?",
        exampleEs: "¿Eres realmente productivo o solo estás ocupado?",
        whyItWorksEs: "Fuerza la autorreflexión y califica al lector inmediatamente.",
        viralScore: 82
    },
    {
        id: "direct-1",
        category: "Direct",
        template: "If you want to [Result], read this:",
        example: "If you want to retire by 40, read this:",
        whyItWorks: "Filters for specific intent. High conversion for the right audience.",
        templateEs: "Si quieres [Resultado], lee esto:",
        exampleEs: "Si quieres retirarte a los 40, lee esto:",
        whyItWorksEs: "Filtra por intención específica. Alta conversión para la audiencia correcta.",
        viralScore: 89
    }
];
