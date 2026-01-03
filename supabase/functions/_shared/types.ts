export interface LinkedInPDFData {
  full_name: string;
  profile_url?: string;
  headline?: string;
  summary?: string;
  occupation?: string;
  experiences?: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  skills?: string[];
  education?: string[];
  error?: string;
}

export interface LinkedInAuditResult {
  overall_score: number;
  visual_score: number;
  authority_metrics: {
    headline_impact: number;
    keyword_density: number;
    storytelling_power: number;
    recruiter_clarity: number;
  };
  summary: string;
  results: {
    headline: {
      score: number;
      feedback: string;
      suggested: string;
    };
    about: {
      score: number;
      feedback: string;
      suggested: string;
    };
    experience: {
      score: number;
      feedback: string;
      suggested: string;
    };
  };
}

export interface Profile {
  id: string;
  email?: string;
  plan_tier: string;
  credits: number;
  subscription_status?: string;
  subscription_end_date?: string;
  stripe_customer_id?: string;
  referred_by?: string;
  created_at: string;
  brand_voice?: string;
  company_name?: string;
  industry?: string;
  headline?: string;
  xp?: number;
  level?: number;
  current_streak?: number;
  last_post_date?: string;
}

export interface LinkedInProfileData {
  full_name?: string;
  name?: string;
  profile_url?: string | null;
  headline?: string;
  summary?: string;
  about?: string;
  occupation?: string;
  company?: string;
  location?: string;
  experiences?: { company: string; position: string; duration: string; description: string }[];
  skills?: string[];
  education?: string[];
  scraped_data?: Record<string, unknown>;
}
