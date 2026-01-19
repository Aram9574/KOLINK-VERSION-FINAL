import { Trend } from "../../types";
import { supabase } from "../../services/supabaseClient";

const MOCK_TRENDS: Trend[] = [
    {
        id: 'trend-1',
        title: 'Rumores de GPT-7 e Impacto Empresarial',
        summary: 'Filtraciones sugieren que GPT-7 se centrará en "Flujos de Trabajo Agénticos" más que solo chat. Esto cambia el foco de chatbots a empleados automatizados fiables.',
        source: 'TechCrunch',
        category: 'news',
        matchScore: 98,
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
        url: 'https://example.com/gpt5',
    },
    {
        id: 'trend-2',
        title: 'Actualización del Algoritmo LinkedIn 2026',
        summary: 'LinkedIn está priorizando la profundidad sobre la frecuencia. Los carruseles están viendo un aumento del 140% en alcance si tienen más de 7 diapositivas.',
        source: 'SocialMediaToday',
        category: 'social',
        matchScore: 92,
        timestamp: Date.now() - 1000 * 60 * 60 * 5,
        url: 'https://example.com/linkedin-algo',
    },
    {
        id: 'trend-3',
        title: 'Nueva Ley de IA de la UE: Plazo de Cumplimiento',
        summary: 'Las empresas deben declarar el uso de IA en contenido de marketing para el próximo trimestre o enfrentar multas de hasta el 4% de la facturación.',
        source: 'Reuters',
        category: 'regulatory',
        matchScore: 85,
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
        url: 'https://example.com/eu-ai',
    },
    {
        id: 'trend-4',
        title: 'Estadísticas: Trabajo Remoto vs Vuelta a la Oficina',
        summary: 'El volumen de búsqueda de "Trabajos remotos" está en su punto más alto, contradiciendo el impulso corporativo para volver a la oficina (RTO).',
        source: 'Google Trends',
        category: 'search',
        matchScore: 78,
        timestamp: Date.now() - 1000 * 60 * 60 * 12,
        url: 'https://example.com/remote-work',
    },
    {
        id: 'trend-5',
        title: 'El auge del "Video-First" en B2B',
        summary: 'Plataformas como LinkedIn están probando feeds exclusivos de video. Las marcas que adoptan video corto ven un 3x en engagement.',
        source: 'MarketingDive',
        category: 'social',
        matchScore: 88,
        timestamp: Date.now() - 1000 * 60 * 60 * 48,
        url: 'https://example.com/video-b2b',
    },
    {
        id: 'trend-6',
        title: 'Sostenibilidad Digital: El nuevo KPI',
        summary: 'Consumidores exigen transparencia sobre la huella de carbono de los servicios digitales. Webs "Eco-friendly" ganan tracción.',
        source: 'Forbes',
        category: 'news',
        matchScore: 75,
        timestamp: Date.now() - 1000 * 60 * 60 * 3,
        url: 'https://example.com/eco-digital',
    },
    {
        id: 'trend-7',
        title: 'SEO Generativo (GEO) vs SEO Tradicional',
        summary: 'Cómo optimizar contenido para respuestas de IA (Perplexity, SearchGPT) requiere una estrategia semántica diferente a la de palabras clave.',
        source: 'SearchEngineLand',
        category: 'search',
        matchScore: 95,
        timestamp: Date.now() - 1000 * 60 * 60 * 1,
        url: 'https://example.com/geo-seo',
    },
    {
        id: 'trend-8',
        title: 'Protección de Datos en la Era Post-Cookies',
        summary: 'Estrategias de "Zero-Party Data" se vuelven críticas a medida que Chrome elimina soporte a cookies de terceros. La confianza es la nueva moneda.',
        source: 'Wired',
        category: 'regulatory',
        matchScore: 82,
        timestamp: Date.now() - 1000 * 60 * 60 * 36,
        url: 'https://example.com/privacy-first',
    },
    {
        id: 'trend-9',
        title: 'Automatización de Ventas con "Toque Humano"',
        summary: 'Herramientas de IA que personalizan el outreach a escala pero mantienen la autenticidad están dominando el stack de ventas tech.',
        source: 'SalesHacker',
        category: 'news',
        matchScore: 89,
        timestamp: Date.now() - 1000 * 60 * 60 * 6,
        url: 'https://example.com/sales-ai',
    },
    {
        id: 'trend-10',
        title: 'Micro-Influencers B2B: Nichos de Poder',
        summary: 'Las marcas prefieren colaborar con expertos de nicho (5k-10k seguidores) que tienen audiencias altamente comprometidas y decisoras.',
        source: 'InfluencerMarketingHub',
        category: 'social',
        matchScore: 84,
        timestamp: Date.now() - 1000 * 60 * 60 * 72,
        url: 'https://example.com/micro-b2b',
    },
    {
        id: 'trend-11',
        title: 'Búsquedas de "IA Ética" se disparan un 300%',
        summary: 'Google reporta un interés masivo en herramientas de IA que garantizan la no-discriminación y la explicabilidad de sus modelos.',
        source: 'Google Trends',
        category: 'search',
        matchScore: 91,
        timestamp: Date.now() - 1000 * 60 * 60 * 4,
        url: 'https://example.com/ethical-ai',
    },
    {
        id: 'trend-12',
        title: 'Regulación de Deepfakes en Publicidad',
        summary: 'Nuevas propuestas legislativas exigirán marcas de agua obligatorias en cualquier contenido publicitario generado sintéticamente.',
        source: 'Politico',
        category: 'regulatory',
        matchScore: 79,
        timestamp: Date.now() - 1000 * 60 * 60 * 18,
        url: 'https://example.com/deepfake-law',
    },
];

export const getRecommendedTrends = async (userKeywords: string[]): Promise<Trend[]> => {
    try {
        const { data, error } = await supabase.functions.invoke('discover-trends', {
            body: { keywords: userKeywords, industry: "Technology & Business", language: 'es' }
        });

        if (error || !data || !Array.isArray(data) || data.length === 0) {
            console.warn("Using Fallback Trends due to error or empty data:", error || "Empty response");
            // Simulate delay for fallback matching the "loading" feel
            if (!error) await new Promise(resolve => setTimeout(resolve, 800)); 
            return MOCK_TRENDS;
        }

        // Map remote data to ensure timestamp format if needed
        return data.map((t: any) => ({
            ...t,
            timestamp: t.timestamp || Date.now()
        }));

    } catch (e) {
        console.error("Failed to fetch AI trends", e);
        return MOCK_TRENDS;
    }
};
