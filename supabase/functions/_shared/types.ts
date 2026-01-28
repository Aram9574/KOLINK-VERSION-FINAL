export interface UserContext {
    industry?: string;
    xp?: number | string;
    brand_voice?: string;
    company_name?: string;
}

export interface CarouselSlideData {
    title: string;
    subtitle?: string;
    body: string;
    cta_text?: string;
    image_prompt?: string;
    layout?: "classic" | "image-focused" | "minimal" | "split" | "quote" | "big-number" | "checklist" | "code" | "comparison" | "intro" | "outro";
    design_overrides?: {
        swipe_indicator?: boolean;
        highlight_color?: string;
    };
}

export interface CarouselGenerationResult {
    topic_slug: string;
    carousel_data: CarouselSlideData[];
    carousel_metadata: {
        title: string;
        hook: string;
        tone: string;
    };
}
export interface LinkedInExperience {
    company: string;
    position: string;
    duration: string;
    description: string;
}

export interface LinkedInPDFData {
    full_name: string;
    profile_url: string | null;
    headline: string;
    summary: string;
    about?: string;
    error?: string;
    occupation: string;
    experiences: LinkedInExperience[];
    skills: string[];
    education: string[];
}

export interface LinkedInProfileData {
    full_name: string;
    headline: string;
    summary?: string;
    about?: string;
    experience?: string | LinkedInExperience[];
    experiences?: LinkedInExperience[];
    skills?: string | string[];
}

export interface LinkedInAuditResult {
    authority_score: number;
    brutal_diagnosis: string;
    quick_wins: string[];
    strategic_roadmap: {
        headline: string;
        about: string;
        experience: string;
    };
    visual_critique: string;
    technical_seo_keywords: string[];
    gap_analysis: {
        benchmark_comparison: string;
        percentile: string;
    };
}
