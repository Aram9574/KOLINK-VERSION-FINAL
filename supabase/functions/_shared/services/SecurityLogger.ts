import { SupabaseClient } from "@supabase/supabase-js";

export type SecurityEventType = 
  | 'prompt_injection_attempt'
  | 'quota_exceeded'
  | 'cors_violation'
  | 'unauthorized_access'
  | 'rate_limit_exceeded';

export type SecuritySeverity = 'low' | 'medium' | 'critical';

export class SecurityLogger {
  private supabaseAdmin: SupabaseClient;

  constructor(supabaseAdmin: SupabaseClient) {
    this.supabaseAdmin = supabaseAdmin;
  }

  async logEvent(
    userId: string | undefined,
    eventType: SecurityEventType,
    severity: SecuritySeverity,
    details: Record<string, any>,
    requestPath?: string
  ): Promise<void> {
    try {
      console.warn(`[SECURITY] ${eventType} (${severity}) - User: ${userId}`);
      
      const { error } = await this.supabaseAdmin
        .from('security_logs')
        .insert({
          user_id: userId || null,
          event_type: eventType,
          severity,
          details,
          request_path: requestPath || 'unknown',
          ip_address: 'unknown' // Capturar desde headers si es posible en el controlador
        });

      if (error) {
        console.error('Failed to write security log:', error);
      }
    } catch (err) {
      console.error('Critical error in SecurityLogger:', err);
      // No lanzamos error para no interrumpir el flujo principal si el log falla, 
      // a menos que sea una operación crítica.
    }
  }
}
