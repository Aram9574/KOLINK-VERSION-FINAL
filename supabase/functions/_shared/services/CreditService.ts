import { SupabaseClient } from "@supabase/supabase-js";

export class CreditService {
  private supabaseAdmin: SupabaseClient;
  private supabaseClient: SupabaseClient;

  // LÍMITES CONFIGURABLES (Hardcoded por seguridad)
  private LIMITS = {
    free: 3,      // Usuarios gratis: 3 posts al día
    pro: 50,      // Usuarios Pro: 50 posts al día
    viral: 100,   // Usuarios Viral: 100 posts al día
    admin: 9999   // Admin: Ilimitado
  };

  constructor(supabaseAdmin: SupabaseClient, supabaseClient: SupabaseClient) {
    this.supabaseAdmin = supabaseAdmin;
    this.supabaseClient = supabaseClient;
  }

  /**
   * Verifica y actualiza la cuota diaria del usuario.
   * Lanza error si se excede el límite.
   */
  async checkAndUpdateQuota(userId: string, planTier: string = 'free'): Promise<void> {
    // 1. Obtener estado actual del usuario
    const { data: profile, error } = await this.supabaseAdmin
      .from("profiles")
      .select("daily_generations_count, last_reset_at")
      .eq("id", userId)
      .single();

    if (error || !profile) throw new Error("Error verificando cuota de usuario");

    const now = new Date();
    const lastReset = new Date(profile.last_reset_at || 0);
    
    // Verificar si es un día diferente (comparando fecha local simple)
    const isNewDay = now.getDate() !== lastReset.getDate() || 
                     now.getMonth() !== lastReset.getMonth() || 
                     now.getFullYear() !== lastReset.getFullYear();

    let currentCount = profile.daily_generations_count;

    // 2. Reiniciar si es nuevo día
    if (isNewDay) {
      currentCount = 0;
      await this.supabaseAdmin
        .from("profiles")
        .update({ 
          daily_generations_count: 0, 
          last_reset_at: now.toISOString() 
        })
        .eq("id", userId);
    }

    // 3. Verificar límite según plan
    // Normalizamos el plan a minúsculas para evitar errores
    const plan = (planTier || 'free').toLowerCase();
    // @ts-ignore: Index access fix
    const limit = this.LIMITS[plan] || this.LIMITS.free;

    if (currentCount >= limit) {
      throw new Error(`Daily limit reached for ${plan} plan. Upgrade to increase limits.`);
    }

    // 4. Incrementar contador (Optimistic lock no necesario aquí por bajo volumen)
    // Nota: El decremento de créditos ($$) se maneja en deductCredit, aquí solo contamos uso de API
    await this.supabaseAdmin
      .from("profiles")
      .update({ daily_generations_count: currentCount + 1 })
      .eq("id", userId);
  }

  /**
   * Deduce créditos (Lógica financiera existente)
   * Ahora también debería llamarse DESPUÉS de checkAndUpdateQuota en el flujo principal
   */
  async deductCredit(userId: string, cost: number = 1): Promise<void> {
    // Usamos RPC segura si existe, o update directo como fallback administrativo
    const { error } = await this.supabaseAdmin.rpc("decrement_credit", { 
      target_user_id: userId 
    });

    if (error) {
        // Fallback si el RPC falla o no aplica (aunque el RPC es lo ideal)
        console.error("RPC Error:", error);
        throw new Error("Could not deduct credit");
    }
  }
}
