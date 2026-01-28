export interface ComparisonFeature {
    name: string;
    kolink: string | boolean;
    competitor: string | boolean;
    kolinkNote?: string;
    // Spanish
    nameEs?: string;
    kolinkEs?: string | boolean;
    competitorEs?: string | boolean;
}

export interface ComparisonData {
    slug: string;
    competitorName: string;
    title: string;
    description: string;
    heroImage?: string;
    features: ComparisonFeature[];
    pricing: {
        kolink: string;
        competitor: string;
        savings: string;
    };
    verdict: string;
    pros: string[];
    cons: string[]; // Competitor cons
    // Spanish Translations
    titleEs?: string;
    descriptionEs?: string;
    verdictEs?: string;
    prosEs?: string[];
    consEs?: string[];
}

export const COMPARISONS: ComparisonData[] = [
    {
        slug: "taplio",
        competitorName: "Taplio",
        title: "Kolink vs Taplio: The Best Alternative for Visual Creators",
        description: "Why pay $65/mo just for text generation? See why visual creators are switching to Kolink.",
        titleEs: "Kolink vs Taplio: La Mejor Alternativa para Creadores Visuales",
        descriptionEs: "¿Por qué pagar $65/mes solo por texto? Mira por qué los creadores visuales se cambian a Kolink.",
        features: [
            { name: "Post Generation", kolink: true, competitor: true, nameEs: "Generación de Post" },
            { name: "Carousel Editor", kolink: "Native Studio (Canva-like)", competitor: "Basic Image Slider", nameEs: "Editor de Carrusel", kolinkEs: "Studio Nativo (Tipo Canva)", competitorEs: "Slider Básico" },
            { name: "PDF Export", kolink: "HD Vector PDF", competitor: true, nameEs: "Exportar PDF", kolinkEs: "PDF Vectorial HD" },
            { name: "Brand Voice DNA", kolink: "Deep analysis (Tone + Style)", competitor: "Basic Tone", nameEs: "ADN de Voz de Marca", kolinkEs: "Análisis Profundo (Tono+Estilo)", competitorEs: "Tono Básico" },
            { name: "Profile Audits", kolink: "Full Psychological Audit", competitor: false, nameEs: "Auditoría de Perfil", kolinkEs: "Auditoría Psicológica Completa" },
            { name: "Visual Templates", kolink: "50+ Viral Structures", competitor: "Limited", nameEs: "Plantillas Visuales", kolinkEs: "+50 Estructuras Virales", competitorEs: "Limitado" },
            { name: "Pricing", kolink: "$29/mo", competitor: "$65/mo", nameEs: "Precio", kolinkEs: "$29/mes", competitorEs: "$65/mes" }
        ],
        pricing: {
            kolink: "$29",
            competitor: "$65",
            savings: "55%"
        },
        verdict: "Taplio is great for scheduling, but Kolink wins on creative capability and visual content generation at half the price.",
        verdictEs: "Taplio es genial para programar, pero Kolink gana en capacidad creativa y generación de contenido visual a mitad de precio.",
        pros: ["Superior Visual Editor", "Deeper Profile Analysis", "More Affordable"],
        prosEs: ["Editor Visual Superior", "Análisis de Perfil Profundo", "Más Económico"],
        cons: ["Expensive ($65/mo)", "Weak Visual Tools", "No advanced Profile Audit"],
        consEs: ["Caro ($65/mes)", "Herramientas Visuales Débiles", "Sin Auditoría de Perfil avanzada"]
    },
    {
        slug: "supergrow",
        competitorName: "Supergrow",
        title: "Kolink vs Supergrow: AI That Actually Understands Design",
        description: "Supergrow is great for text, but LinkedIn is becoming a visual platform. Choose the tool built for 2026.",
        titleEs: "Kolink vs Supergrow: IA que Realmente Entiende de Diseño",
        descriptionEs: "Supergrow es genial para texto, pero LinkedIn se está volviendo visual. Elige la herramienta hecha para 2026.",
        features: [
            { name: "Text Writing", kolink: true, competitor: true, nameEs: "Redacción de Texto" },
            { name: "Carousel Maker", kolink: "Advanced Studio", competitor: "Carousel Generator (Basic)", nameEs: "Creador de Carruseles", kolinkEs: "Studio Avanzado", competitorEs: "Generador Básico" },
            { name: "LinkedIn Preview", kolink: "Real-time Mobile/Desktop", competitor: true, nameEs: "Vista Previa LinkedIn", kolinkEs: "Tiempo Real Móvil/Escritorio" },
            { name: "Hook Library", kolink: "Dynamic + AI Generated", competitor: "Static Library", nameEs: "Librería de Ganchos", kolinkEs: "Dinámico + IA", competitorEs: "Librería Estática" },
            { name: "Gamification", kolink: "XP & Leaderboards", competitor: false, nameEs: "Gamificación", kolinkEs: "XP & Tablas", competitorEs: false },
            { name: "Multi-Language", kolink: "Native ES/EN Support", competitor: "English focused", nameEs: "Multi-Idioma", kolinkEs: "Soporte Nativo ES/EN", competitorEs: "Enfocado en Inglés" }
        ],
        pricing: {
            kolink: "$29",
            competitor: "$29",
            savings: "0% (But 2x Value)"
        },
        verdict: "For the same price, Kolink offers a complete design studio alongside text generation. Don't pay for two subscriptions (Writer + Canva).",
        verdictEs: "Por el mismo precio, Kolink ofrece un estudio de diseño completo junto con generación de texto. No pagues dos suscripciones (Escritor + Canva).",
        pros: ["All-in-one Design + Text", "Gamified Growth System", "Visual-First approach"],
        prosEs: ["Diseño + Texto Todo-en-uno", "Sistema de Crecimiento Gamificado", "Enfoque Visual-First"],
        cons: ["Limited Visual Customization", "English-centric interface", "No Gamification"],
        consEs: ["Personalización Visual Limitada", "Interfaz centrada en Inglés", "Sin Gamificación"]
    }
];
