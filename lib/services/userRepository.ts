
import { supabase } from '../../services/supabaseClient';
import { ExpertiseProfile } from '../../types';

/**
 * Updates the User's Expertise DNA in the database.
 * Stored within the 'behavioral_dna' JSONB column in 'profiles'.
 */
export const updateUserDNA = async (userId: string, dna: ExpertiseProfile): Promise<void> => {
  // First, fetch current DNA to preserve other fields (like peak_hours from AI analysis)
  const { data: currentData } = await supabase
    .from('profiles')
    .select('behavioral_dna')
    .eq('id', userId)
    .single();

  const currentDNA = currentData?.behavioral_dna || {};

  // Merge new manual settings with existing AI data
  const newDNA = {
    ...currentDNA,
    archetype: dna.archetype,
    // We store explicit keywords under 'topics_of_interest' or just 'keywords'
    keywords: dna.keywords,
    negative_keywords: dna.negativeKeywords,
    manual_override: true, // Flag to tell AI to respect this
    last_updated: new Date().toISOString()
  };

  const { error } = await supabase
    .from('profiles')
    .update({
      behavioral_dna: newDNA
    })
    .eq('id', userId);

  if (error) {
    console.error("Error updating user DNA:", error);
    throw new Error("Failed to save expertise profile");
  }
};

/**
 * Fetches the User's Expertise DNA.
 */
export const getUserDNA = async (userId: string): Promise<ExpertiseProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('behavioral_dna')
    .eq('id', userId)
    .single();

  if (error) {
    console.error("Error fetching user DNA:", error);
    return null;
  }

  if (!data?.behavioral_dna) return null;

  const b = data.behavioral_dna;

  return {
    archetype: b.archetype || 'Educator',
    keywords: b.keywords || [],
    negativeKeywords: b.negative_keywords || [],
    bioSummary: b.bio_summary
  };
};
