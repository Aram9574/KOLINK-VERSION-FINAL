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
