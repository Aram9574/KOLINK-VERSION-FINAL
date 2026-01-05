import { createClient } from "jsr:@supabase/supabase-js@2";
import { BaseAIService } from "./BaseAIService.ts";
import { PersonaBrain } from "../prompts/PersonaBrain.ts";

export class BehaviorService extends BaseAIService {
  private supabase;

  constructor(geminiApiKey: string, supabaseUrl: string, supabaseServiceKey: string) {
    super(geminiApiKey);
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  /**
   * Logs a user event for future DNA analysis.
   */
  async trackEvent(userId: string, eventType: string, metadata: Record<string, unknown> = {}) {
    console.log(`[BehaviorService] Tracking event: ${eventType} for user: ${userId}`);
    const { error } = await this.supabase
      .from("user_events")
      .insert({
        user_id: userId,
        event_type: eventType,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          hour: new Date().getHours()
        }
      });

    if (error) {
       console.error(`[BehaviorService] Error tracking event: ${error.message}`);
    }
  }

  /**
   * Analyzes the last X events and updates the User's Behavioral DNA.
   */
  async syncUserDNA(userId: string) {
    console.log(`[BehaviorService] Syncing DNA for user: ${userId}`);
    
    // 1. Fetch last 50 events
    const { data: events, error: fetchError } = await this.supabase
      .from("user_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (fetchError || !events || events.length === 0) {
      console.log("[BehaviorService] Not enough data to sync DNA.");
      return null;
    }

    // 2. Prepare context for Gemini
    const context = events.map(e => ({
      type: e.event_type,
      meta: e.metadata,
      date: e.created_at
    }));

    const prompt = `Analiza los siguientes eventos de interacción del usuario y genera su ADN actualizado:
    ${JSON.stringify(context, null, 2)}`;

    // 3. Generate DNA using Gemini
    const dnaResult = await this.retryWithBackoff(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        systemInstruction: PersonaBrain.system_instruction,
      });

      const response = await model.generateContent(prompt);
      return this.extractJson(response.response.text());
    });

    // 4. Update Profile
    const { error: updateError } = await this.supabase
      .from("profiles")
      .update({
        behavioral_dna: {
          ...dnaResult,
          last_updated: new Date().toISOString()
        }
      })
      .eq("id", userId);

    if (updateError) {
      console.error(`[BehaviorService] Error updating DNA: ${updateError.message}`);
    }

    return dnaResult;
  }
}
