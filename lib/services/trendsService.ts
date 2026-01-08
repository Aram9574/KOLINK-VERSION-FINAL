import { Trend } from "../../../types";

const MOCK_TRENDS: Trend[] = [
    {
        id: 'trend-1',
        title: 'GPT-5 Rumors & Enterprise Impact',
        summary: 'Leaks suggest GPT-5 will focus on "Agentic Workflows" rather than just chat. This shifts the focus from chatbots to reliable automated employees.',
        source: 'TechCrunch',
        category: 'news',
        matchScore: 98,
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
        url: 'https://example.com/gpt5',
    },
    {
        id: 'trend-2',
        title: 'LinkedIn Algorithm Update 2026',
        summary: 'LinkedIn is prioritizing depth over frequency. Carousel posts are seeing a 140% boost if they have more than 7 slides.',
        source: 'SocialMediaToday',
        category: 'social',
        matchScore: 92,
        timestamp: Date.now() - 1000 * 60 * 60 * 5,
        url: 'https://example.com/linkedin-algo',
    },
    {
        id: 'trend-3',
        title: 'New EU AI Act Compliance Deadline',
        summary: 'Companies must declare AI usage in marketing content by next quarter or face fines of up to 4% turnover.',
        source: 'Reuters',
        category: 'regulatory',
        matchScore: 85,
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
        url: 'https://example.com/eu-ai',
    },
    {
        id: 'trend-4',
        title: 'Remote Work vs Return to Office Stats',
        summary: 'Search volume for "Remote jobs" is at an all-time high, contradicting corporate push for RTO.',
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
