export const IndustryContext = {
    "SaaS": {
        focus: "Growth, Metrics, Product-Led Growth, Efficiency",
        keywords: ["ARR", "Churn", "Scale", "Productivity", "Automation", "Workflow"],
        avoid: ["Fluff", "Generic inspiration", "Abstract concepts"],
        advice: "Be extremely tactical. Use numbers. Focus on solving specific pain points for founders and operators."
    },
    "Marketing": {
        focus: "Psychology, Conversions, Brand, Storytelling",
        keywords: ["ROI", "CTR", "Audience", "Funnel", "Copy", "Hook"],
        avoid: ["Jargon without explanation", "Boring corporate speak"],
        advice: "Practice what you preach. The post itself must be a masterclass in copywriting. Use strong hooks and emotional triggers."
    },
    "Real Estate": {
        focus: "Community, Investment, Market Trends, Trust",
        keywords: ["Cap Rate", "Location", "Equity", "Home", "Neighborhood", "Inventory"],
        avoid: ["Salesy pitches", "Desperation"],
        advice: "Position yourself as a local advisor, not a salesperson. Tell stories about clients you've helped (anonymized)."
    },
    "Health & Wellness": {
        focus: "Empathy, Science, Lifestyle, Balance",
        keywords: ["Mindset", "Health", "Routine", "Energy", "Nutrition", "Sleep"],
        avoid: ["Shaming", "Impossible standards", "Pseudo-science"],
        advice: "Be compassionate but authoritative. Focus on small, actionable changes rather than massive overhauls."
    },
    "Tech & Dev": {
        focus: "Innovation, Code Quality, Career Growth, Tools",
        keywords: ["Stack", "Deploy", "Architecture", "Junior vs Senior", "AI", "Cloud"],
        avoid: ["Surface-level tech news", "Buzzwords without depth"],
        advice: "Respect the engineering mindset. Logic and efficiency rule. Don't be afraid to be technical, but explain the 'why'."
    },
    "Finance": {
        focus: "Wealth, Strategy, Risk Management, Independence",
        keywords: ["Compound Interest", "Portfolio", "Asset", "Liability", "Tax", "Freedom"],
        avoid: ["Get rich quick schemes", "Guaranteeing returns"],
        advice: "Build trust through prudence. Focus on long-term thinking and financial literacy."
    },
    "Leadership": {
        focus: "Culture, Empathy, Management, Vision",
        keywords: ["Team", "Culture", "Feedback", "Hiring", "Burnout", "Ego"],
        avoid: ["toxic productivity", "bossing"],
        advice: "Lead by example. Share personal failures and lessons. Vulnerability is strength."
    },
    "General": {
        focus: "Professional Growth, Networking, Career",
        keywords: ["Career", "Network", "Skill", "Learning", "Mindset"],
        avoid: ["Platitudes"],
        advice: "Focus on universal professional truths. Be actionable and relatable."
    }
};

export function getIndustryInstructions(industry: string): string {
    const context = IndustryContext[industry as keyof typeof IndustryContext] || IndustryContext["General"];
    return `
    INDUSTRY CONTEXT (${industry}):
    - **Core Focus:** ${context.focus}
    - **Keywords to Weave:** ${context.keywords.join(", ")}
    - **Strictly Avoid:** ${context.avoid.join(", ")}
    - **Strategic Advice:** ${context.advice}
    `;
}
