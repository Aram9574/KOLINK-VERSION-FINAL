export interface AuditSection {
  score: number;
  feedback: string;
  suggestion?: string;
  improvements_per_job?: string[];
  missing_critical_skills?: string[];
}

export interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  description: string;
  analysis?: string;
  suggestions?: string[];
}

export interface LinkedInAuditResult {
  authority_score: number;
  visual_score: number;
  seo_score: number;
  total_score: number;
  brutal_diagnosis: string;
  quick_wins: string[];
  strategic_roadmap: {
    headline: string;
    about: string;
    experience: string;
  };
  visual_critique: string;
  technical_seo_keywords: string[];
  gap_analysis?: {
    benchmark_comparison: string;
    percentile: string;
  };
  source_type?: "hybrid" | "pdf" | "visual";
  processed_data?: {
    name?: string;
    headline?: string;
    about?: string;
    company?: string;
    location?: string;
    skills?: string[];
    experiences?: ExperienceItem[];
    education?: string[];
  };
  // Add direct experience property if intended by AuditResults usage
  experience?: ExperienceItem[]; // AuditResults uses .experience directly on results
  headline?: { analysis: string; current: string; suggested: string };
  about?: { analysis: string; missingKeywords: string[]; suggested: string };
  skills?: { analysis: string; missing: string[]; current: string[] };
  summary?: string;
  score?: number; // AuditResults uses results.score directly
}

export type AuditResult = LinkedInAuditResult;

export interface LinkedInAudit {
  id: string;
  user_id: string;
  profile_url: string;
  results: LinkedInAuditResult;
  created_at: string;
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
