import { SupabaseClient } from "npm:@supabase/supabase-js@2";

export interface GeneratedPost {
  post_content: string;
  overall_viral_score: number;
  hook_score: number;
  readability_score: number;
  value_score: number;
  feedback: string;
}

export class PostRepository {
  constructor(private supabaseAdmin: SupabaseClient) {}

  async savePost(userId: string, content: GeneratedPost, params: unknown) {
    const { data: insertedPost, error } = await this.supabaseAdmin
      .from("posts")
      .insert({
        user_id: userId,
        content: content.post_content,
        viral_score: content.overall_viral_score,
        viral_analysis: {
          hookScore: content.hook_score,
          readabilityScore: content.readability_score,
          valueScore: content.value_score,
          feedback: content.feedback,
        },
        params: params,
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
