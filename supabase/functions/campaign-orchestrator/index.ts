import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * CAMPAIGN ORCHESTRATOR
 * This function logic:
 * 1. Find new users (24h) with 0 posts -> Welcome Email (if not sent).
 * 2. Find users with exactly 3 posts -> Milestone 3 Email (if not sent).
 * 3. Find active users (>5 posts) without subscription -> Sales Propósito 2026.
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const results = [];

    // --- 1. BIENVENIDA (24h sin post) ---
    const { data: welcomeCandidates } = await supabase.rpc('get_onboarding_candidates', {
      min_hours: 24,
      max_hours: 48,
      template_id: 'welcome'
    });

    if (welcomeCandidates) {
      for (const user of welcomeCandidates) {
        await invokeSendEmail({ userId: user.id, email: user.email, name: user.name, templateId: 'welcome' });
        results.push({ user: user.email, template: 'welcome' });
      }
    }

    // --- 2. HITO 3 GENERACIONES ---
    const { data: milestoneCandidates } = await supabase
      .from('profiles')
      .select('id, email, name')
      .eq('total_generations', 3)
      .eq('marketing_opt_in', true)
      .not('id', 'in', (
        supabase.from('email_logs').select('user_id').eq('email_template_id', 'milestone_3')
      ));
      // Note: Idealmente esto se hace con un RPC similar al de arriba para eficiencia

    if (milestoneCandidates) {
      for (const user of milestoneCandidates) {
        await invokeSendEmail({ userId: user.id, email: user.email, name: user.name, templateId: 'milestone_3' });
        results.push({ user: user.email, template: 'milestone_3' });
      }
    }

    // --- 3. SALES TRIGGER (Propósito 2026) ---
    // Usuarios con > 5 generaciones sin plan_tier 'pro' o 'viral'
    const { data: salesCandidates } = await supabase
      .from('profiles')
      .select('id, email, name')
      .gt('total_generations', 5)
      .eq('plan_tier', 'free') 
      .eq('marketing_opt_in', true);

    if (salesCandidates) {
      for (const user of salesCandidates) {
        // Verificar si ya se envió el email de ventas recientemente (evitar spam)
        const { data: alreadySent } = await supabase
          .from('email_logs')
          .select('id')
          .eq('user_id', user.id)
          .eq('email_template_id', 'sales_propósito_2026')
          .single();

        if (!alreadySent) {
          await invokeSendEmail({ userId: user.id, email: user.email, name: user.name, templateId: 'sales_propósito_2026' });
          results.push({ user: user.email, template: 'sales_propósito_2026' });
        }
      }
    }

    // --- 4. COLD OUTREACH (Sequence Logic) ---
    // RESTRICCIÓN HORARIA: Solo enviar Lunes a Viernes, 08:00 - 17:00 (Hora Madrid/Europa UTC+1)
    const now = new Date();
    const madridTime = new Date(now.getTime() + (1 * 60 * 60 * 1000)); // Ajuste UTC+1
    const day = madridTime.getUTCDay(); // 0: Dom, 1: Lun, ..., 6: Sab
    const hour = madridTime.getUTCHours();

    const isWeekend = day === 0 || day === 6;
    const isWorkingHours = hour >= 8 && hour < 17;

    if (isWeekend || !isWorkingHours) {
      console.log(`[Orchestrator] Fuera de horario laboral. Saltando Outreach.`);
      return new Response(JSON.stringify({ 
        status: "skipped", 
        reason: "Outside working hours", 
        current_madrid_time: madridTime.toISOString() 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // SEGURIDAD & CALENTAMIENTO: Máximo 100 correos de outreach al día
    const DAILY_LIMIT = 100;
    
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const { count: sentToday, error: countError } = await supabase
      .from('email_logs')
      .select('*', { count: 'exact', head: true })
      .ilike('email_template_id', 'cold_outreach_%')
      .gte('sent_at', todayStart.toISOString());

    if (countError) {
      console.error("[Orchestrator] Error counting today's outreach:", countError);
    }

    const remainingQuota = Math.max(0, DAILY_LIMIT - (sentToday || 0));
    console.log(`[Orchestrator] Outreach today/limit: ${sentToday}/${DAILY_LIMIT}. Remaining: ${remainingQuota}`);

    if (remainingQuota <= 0) {
      console.log("[Orchestrator] Daily outreach limit reached. Skipping outreach phase.");
    } else {
      let query = supabase
        .from('outreach_contacts')
        .select(`
          id, 
          "Email", 
          "Name", 
          "Title", 
          "City", 
          "Headline", 
          "Organization.Name", 
          "Organization.Industries",
          current_sequence_step, 
          next_send_at
        `)
        .eq('status', 'pending')
        .lte('next_send_at', new Date().toISOString());

      const { data: outreachContacts, error: outreachError } = await query
        .limit(Math.min(remainingQuota, 10));

      if (outreachError) {
        console.error("[Orchestrator] Error fetching outreach contacts:", outreachError);
      }

      if (outreachContacts && outreachContacts.length > 0) {
        for (const contact of outreachContacts) {
          const step = contact.current_sequence_step || 1;
          const templateId = `cold_outreach_v${step}`;
          
          console.log(`[Orchestrator] Processing personalized sequence step ${step} for ${contact["Email"]}`);

          await invokeSendEmail({
            outreach_contact_id: contact.id,
            email: contact["Email"],
            name: contact["Name"] || 'Prospecto',
            templateId: templateId,
            // Datos de personalización
            title: contact["Title"],
            city: contact["City"],
            headline: contact["Headline"],
            organization: contact["Organization.Name"],
            industry: contact["Organization.Industries"]
          });

        // Calcular siguiente paso
        let nextStep = step + 1;
        let nextSendAt = null;
        let newStatus = 'pending';

        if (nextStep <= 4) {
          // Definir retrasos según el paso
          const delays = { 2: 3, 3: 4, 4: 7 }; // Días entre pasos
          const daysToAdd = delays[nextStep as keyof typeof delays] || 3;
          
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + daysToAdd);
          nextSendAt = nextDate.toISOString();
        } else {
          newStatus = 'completed';
          nextStep = step; // Mantener último paso
        }

        // Actualizar contacto
        await supabase
          .from('outreach_contacts')
          .update({ 
            current_sequence_step: nextStep,
            next_send_at: nextSendAt,
            status: newStatus,
            last_contacted_at: new Date().toISOString() 
          })
          .eq('id', contact.id);

        results.push({ 
          user: contact["Email"], 
          template: templateId, 
          step: step,
          next_step: nextStep,
          status: newStatus 
        });
      }
    }
  }

    return new Response(JSON.stringify({ status: "success", processed: results.length, details: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function invokeSendEmail({ 
  userId, 
  outreach_contact_id, 
  email, 
  name, 
  templateId,
  title,
  organization,
  city,
  headline,
  industry
}: { 
  userId?: string, 
  outreach_contact_id?: string, 
  email: string, 
  name: string, 
  templateId: string,
  title?: string,
  organization?: string,
  city?: string,
  headline?: string,
  industry?: string
}) {
  console.log(`[Orchestrator] Triggering personalized email for ${email} (${title || 'Líder'})`);
  
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: {
      user_id: userId,
      outreach_contact_id: outreach_contact_id,
      user_email: email,
      user_name: name,
      template_id: templateId,
      title,
      organization,
      city,
      headline,
      industry
    }
  });

  if (error) {
    console.error(`[Orchestrator] Error invoking send-email for ${email}:`, error);
    throw error;
  }

  console.log(`[Orchestrator] Successfully triggered send-email for ${email}. Response:`, data);
}
