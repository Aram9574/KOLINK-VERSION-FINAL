export interface StylisticDNA {
    tone: string;
    sentence_structure: string;
    hooks_dna: string[];
    technical_terms: string[];
    formatting_rules: string[];
    rhythm?: string;
    vocabulary_profile?: string[];
    authority_level?: string;
    forbidden_patterns?: string[];
    punctuation_style?: string;
}

export interface BrandVoice {
  id: string;
  user_id: string;
  name: string;
  description: string;
  voice_name?: string;
  mimicry_instructions?: string;
  hookPatterns?: { category: string; pattern: string; example: string }[];
  stylisticDNA?: StylisticDNA;
  isActive?: boolean;
  created_at?: string;
}
