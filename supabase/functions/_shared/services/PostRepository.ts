import { SupabaseClient } from "@supabase/supabase-js";

export interface GeneratedPost {
  post_content: string;
  auditor_report: {
    viral_score: number;
    hook_strength: string;
    hook_score: number;
    readability_score: number;
    value_score: number;
    pro_tip: string;
    retention_estimate: string;
    flags_triggered: string[];
    predicted_archetype_resonance?: string;
  };
  strategy_reasoning: string;
  meta: {
    suggested_hashtags: string[];
    character_count: number;
  };
}

export class PostRepository {
  constructor(private supabaseAdmin: SupabaseClient) {}

  async savePost(userId: string, content: GeneratedPost, params: unknown) {
    const { data: insertedPost, error } = await this.supabaseAdmin
      .from("posts")
      .insert({
        user_id: userId,
        content: content.post_content,
        params: params,
        viral_score: content.auditor_report.viral_score,
        viral_analysis: content.auditor_report,
        tags: content.meta.suggested_hashtags,
        is_auto_pilot: (params as { isAutoPilot?: boolean })?.isAutoPilot || false,
        created_at: new Date().toISOString(),
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Failed to save post:", error);
      // We don't throw here to avoid failing the whole request if just saving fails,
      // but in a strict system we might want to.
      // For now, we return null to indicate failure but allow the user to see the result.
      return null;
    }

    return insertedPost;
  }
}
