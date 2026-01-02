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
  score: number;
  summary: string;
  headline: {
    current: string;
    suggested: string;
    analysis: string;
  };
  about: {
    analysis: string;
    suggested: string;
    missingKeywords: string[];
  };
  experience: Array<{
    company: string;
    position: string;
    analysis: string;
    suggestions: string[];
  }>;
  skills: {
    current: string[];
    missing: string[];
    analysis: string;
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
