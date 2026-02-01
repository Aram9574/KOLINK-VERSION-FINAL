
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    const payload = await req.json();
    const { type, data } = payload;
    const resend_id = data.email_id || data.id;

    console.log(`[Resend-Webhook] Received event: ${type} for ID: ${resend_id}`);

    if (!resend_id) {
      return new Response("No email ID found", { status: 400 });
    }

    // 1. Buscar el log correspondiente
    const { data: log, error: logError } = await supabase
      .from("email_logs")
      .select("*")
      .eq("resend_id", resend_id)
      .single();

    if (logError || !log) {
      console.warn(`[Resend-Webhook] Log not found for resend_id: ${resend_id}`);
      return new Response("Log not found", { status: 200 }); // Retornar 200 para que Resend deje de reintentar
    }

    const updateData: any = {
      provider_status: type,
      processed_at: new Date().toISOString()
    };

    if (type === "email.opened") {
      updateData.opened_at = new Date().toISOString();
    } else if (type === "email.clicked") {
      updateData.clicked_at = new Date().toISOString();
    }

    // 2. Actualizar el log
    await supabase.from("email_logs").update(updateData).eq("id", log.id);

    // 3. Acciones especiales basadas en el tipo
    if (type === "email.bounced" || type === "email.complained") {
      if (log.outreach_contact_id) {
        await supabase
          .from("outreach_contacts")
          .update({ status: "unsubscribed", metadata: { reason: type, event_data: data } })
          .eq("id", log.outreach_contact_id);
      }
    }

    return new Response("Webhook processed", { status: 200 });

  } catch (error) {
    console.error("[Resend-Webhook] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
