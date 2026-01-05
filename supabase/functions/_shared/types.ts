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
