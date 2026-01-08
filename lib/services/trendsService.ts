import { Trend } from "../../../types";

const MOCK_TRENDS: Trend[] = [
    {
        id: 'trend-1',
        title: 'Rumores de GPT-5 e Impacto Empresarial',
        summary: 'Filtraciones sugieren que GPT-5 se centrará en "Flujos de Trabajo Agénticos" más que solo chat. Esto cambia el foco de chatbots a empleados automatizados fiables.',
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
];

export const getRecommendedTrends = async (userKeywords: string[]): Promise<Trend[]> => {
    // In a real app, we would filter or fetch based on keywords.
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_TRENDS;
};
