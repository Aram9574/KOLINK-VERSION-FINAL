// Email Worker v1.1 - Industrial Scale Queue Processor

import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    console.log("[Email-Worker] Wake up. Fetching pending emails...");

    // 1. Obtener correos pendientes
    const { data: queueItems, error: fetchError } = await supabase
      .from("email_queue")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(5); // Reducido para pruebas de estabilidad

    if (fetchError) throw fetchError;
    
    if (!queueItems || queueItems.length === 0) {
      console.log("[Email-Worker] Queue is empty. Sleeping.");
      return new Response(JSON.stringify({ message: "Queue empty" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[Email-Worker] Working on ${queueItems.length} items...`);

    const results = [];

    for (const item of queueItems) {
      const startTime = Date.now();
      console.log(`[Email-Worker] Item ${item.id} -> Processing...`);
      
      try {
        // Bloquear item inmediatamente
        const { error: lockError } = await supabase
          .from("email_queue")
          .update({ status: "processing", attempts: (item.attempts || 0) + 1 })
          .eq("id", item.id);
        
        if (lockError) {
          console.error(`[Email-Worker] Failed to lock item ${item.id}:`, lockError);
          continue;
        }

        const { to, subject, html, text, headers, template_id } = item.payload;

        // Enviar con timeout manual para evitar que la función se cuelgue
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout por envío

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "KOLINK <info@kolink.es>",
            to,
            subject,
            html,
            text,
            headers
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        const resRaw = await res.text();
        let resendData;
        try {
          resendData = JSON.parse(resRaw);
        } catch {
          resendData = { raw: resRaw };
        }

        if (res.ok) {
          console.log(`[Email-Worker] Item ${item.id} -> SUCCESS (${Date.now() - startTime}ms)`);
          
          // Actualizar cola
          await supabase.from("email_queue")
            .update({ status: "sent", last_attempt_at: new Date().toISOString() })
            .eq("id", item.id);
          
          // Registrar log
          await supabase.from("email_logs").insert({
            user_id: item.user_id,
            outreach_contact_id: item.outreach_contact_id,
            email_template_id: template_id,
            resend_id: resendData.id,
            status: "sent",
            sent_at: new Date().toISOString()
          });

          results.push({ id: item.id, status: "success" });
        } else {
          console.error(`[Email-Worker] Item ${item.id} -> API ERROR:`, resendData);
          const isRetryable = res.status >= 500 || res.status === 429;
          const newStatus = (item.attempts >= 3 && !isRetryable) ? "failed" : "pending";
          
          await supabase.from("email_queue").update({ 
            status: newStatus, 
            error_log: JSON.stringify(resendData),
            last_attempt_at: new Date().toISOString() 
          }).eq("id", item.id);

          results.push({ id: item.id, status: "error", code: res.status });
        }
      } catch (err) {
        console.error(`[Email-Worker] Item ${item.id} -> CRITICAL ERROR:`, err.message);
        await supabase.from("email_queue").update({ 
          status: "failed", 
          error_log: err.message,
          last_attempt_at: new Date().toISOString()
        }).eq("id", item.id);
        results.push({ id: item.id, status: "exception", error: err.message });
      }
    }

    console.log("[Email-Worker] Round finished successfully.");
    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[Email-Worker] FATAL:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
