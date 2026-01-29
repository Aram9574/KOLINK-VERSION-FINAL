import { supabase } from "./supabaseClient";
import { UserFeedback, AIFeedback } from "../types";

export const feedbackRepository = {
  /**
   * Submits a new feedback entry.
   * @param content The feedback message.
   * @param rating The emoji rating (0: Love, 1: Okay, 2: Not great, 3: Hate).
   * @param userId Optional user ID.
   */
  async submitFeedback(content: string, rating: number | null, userId?: string | null): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from("feedback")
        .insert([
          {
            user_id: userId || null,
            content,
            rating,
            status: "new"
          }
        ]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error submitting feedback:", error);
      return { success: false, error };
    }
  },

  /**
   * Fetches all feedback entries (Admins only via RLS/Service Role).
   */
  async getAllFeedback(): Promise<UserFeedback[]> {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching feedback:", error);
      return [];
    }
    return data as UserFeedback[];
  },

  /**
   * Submits feedback for AI generated content.
   */
  async submitAIFeedback(feedback: Omit<AIFeedback, 'id' | 'created_at'>): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from("ai_feedback")
        .insert([feedback]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error submitting AI feedback:", error);
      return { success: false, error };
    }
  }
};
