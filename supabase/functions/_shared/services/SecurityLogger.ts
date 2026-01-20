import { SupabaseClient } from "@supabase/supabase-js";

export type SecurityLogType = "prompt_injection_attempt" | "unauthorized_access" | "quota_bypass_attempt" | "other";
export type SecuritySeverity = "low" | "medium" | "high" | "critical";

export class SecurityLogger {
  private supabaseAdmin: SupabaseClient;

  constructor(supabaseAdmin: SupabaseClient) {
    this.supabaseAdmin = supabaseAdmin;
  }

  /**
   * Logs a security event to the database.
   * @param userId - The ID of the user associated with the event.
   * @param type - The type of security event.
   * @param severity - The severity level of the event.
   * @param details - Additional details about the event.
   */
  async logEvent(
    userId: string,
    type: SecurityLogType,
    severity: SecuritySeverity,
    details: Record<string, any> = {}
  ): Promise<void> {
    const { error } = await this.supabaseAdmin
      .from("security_logs")
      .insert({
        user_id: userId,
        event_type: type,
        severity: severity,
        details: details,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error("[SecurityLogger] Error logging security event:", error.message);
      // We don't throw here to avoid breaking the main flow if logging fails,
      // but we log to console for visibility.
    }
  }
}
