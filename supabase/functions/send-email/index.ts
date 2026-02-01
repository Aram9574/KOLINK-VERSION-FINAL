
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface EmailRequest {
  user_id?: string;
  outreach_contact_id?: string;
  user_email: string;
  user_name: string;
  template_id: string; // 'welcome', 'feature', 'social', 'objection', 'close'
}

const LAYOUT = (content: string, contactId?: string) => {
  const unsubscribeUrl = contactId 
    ? `https://kolink.es/unsubscribe?id=${contactId}`
    : "https://kolink.es/unsubscribe";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { width: 100%; max-width: 600px; margin: 0 auto; }
    .card { background: #ffffff; border-radius: 24px; padding: 48px 40px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); margin: 40px 20px; position: relative; overflow: hidden; }
    .card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #2563eb, #3b82f6); }
    .header { margin-bottom: 40px; }
    .logo-text { font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.04em; display: flex; align-items: center; }
    .logo-dot { width: 6px; height: 6px; background: #2563eb; border-radius: 50%; margin-left: 4px; }
    .content { font-size: 16px; color: #334155; line-height: 1.7; }
    .footer { margin-top: 50px; padding-top: 30px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
    .btn { display: inline-block; padding: 18px 36px; background: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; margin: 25px 0; text-align: center; }
    .offer-badge { display: inline-block; padding: 5px 14px; background: #eff6ff; color: #2563eb; border-radius: 100px; font-size: 11px; font-weight: 700; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.05em; }
    .coupon-card { background: #f8fafc; border-radius: 20px; padding: 30px; margin: 30px 0; border: 2px dashed #cbd5e1; text-align: center; }
    .coupon-code { font-family: 'Monaco', 'Consolas', monospace; font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: 3px; margin: 10px 0; }
    h1 { color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 20px; letter-spacing: -0.03em; line-height: 1.2; }
    .highlight { color: #2563eb; font-weight: 700; }
    .signature { margin-top: 40px; border-left: 3px solid #e2e8f0; padding-left: 20px; margin-bottom: 40px; }
    .signature-name { font-weight: 800; color: #0f172a; font-size: 16px; }
    .signature-title { font-size: 13px; color: #64748b; }
    
    @media (max-width: 480px) {
      .card { padding: 32px 20px; margin: 15px 10px; border-radius: 16px; }
      h1 { font-size: 22px; }
      .coupon-code { font-size: 22px; }
      .btn { padding: 16px 28px; width: 100%; box-sizing: border-box; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <a href="https://kolink.es" style="text-decoration: none;">
          <div class="logo-text">KOLINK<div class="logo-dot"></div></div>
        </a>
      </div>
      <div class="content">
        ${content}
        
        <div class="signature">
          <div class="signature-name">Alejandro Zakzuk</div>
          <div class="signature-title">CEO & Founder, KOLINK</div>
        </div>
      </div>
      <div class="footer">
        <strong>KOLINK • Arquitectos de Autoridad</strong><br>
        Excelencia digital desde Madrid, España 🇪🇸<br><br>
        Este correo es privado y exclusivo para perfiles de alto impacto.<br>
        <a href="${unsubscribeUrl}" style="color: #64748b; text-decoration: underline;">Gestionar suscripción</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
};


interface PersonalizationData {
  name: string;
  title?: string;
  organization?: string;
  city?: string;
  headline?: string;
  industry?: string;
}

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

const TEMPLATES: Record<string, (data: PersonalizationData & { contactId?: string }) => EmailTemplate> = {
  welcome: ({ name, headline, contactId }) => ({
    subject: pick(["Bienvenido a la Élite de LinkedIn 🚀", "Acceso concedido a KOLINK", "Tu motor viral está listo"]),
    text: `Hola ${name}, bienvenido a KOLINK. Tu acceso ha sido activado.`,
    html: LAYOUT(`
        <div class="offer-badge">Acceso de Élite Activado</div>
        <h1>Es hora de dominar el algoritmo, ${name.split(' ')[0]}.</h1>
        <p>${headline ? `He visto tu perfil como <em>"${headline}"</em> y me ha impresionado.` : ''} Has entrado en el sistema que está cambiando las reglas del juego. No más bloqueos de escritor, no más contenido genérico.</p>
        <p>Nuestra IA aprende tu estilo real y lo escala. Estás a 30 segundos de tu primer post viral.</p>
        <a href="https://kolink.es/dashboard?start=true" class="btn">Generar mi primer post ahora →</a>
    `, contactId)
  }),
  
  cold_outreach_v1: ({ name, title, organization, city, industry, contactId }) => {
    const hook = pick([
      `¿Vienes notando una caída de alcance en el sector de ${industry || 'LinkedIn'} en ${city || 'España'}?`,
      `He estado siguiendo tu trayectoria como ${title || 'líder'} en ${organization || 'tu sector'}.`,
      `Como referentes en ${organization || 'tu empresa'}, sé que la presencia en ${city || 'LinkedIn'} es vital para vuestra expansión.`
    ]);
    
    return {
      subject: `Propuesta estratégica para ${organization || name.split(' ')[0]} (Optimización de Autoridad)`,
      text: `Hola ${name}, ${hook}. Tienes la autoridad, pero te falta el tiempo.`,
      html: LAYOUT(`
        <div class="offer-badge">Invitación de Fundador</div>
        <h1>${hook}</h1>
        <p>Como ${title || 'referente'} en ${industry || 'tu sector'}, sabes que tienes el conocimiento y la experiencia. Pero si eres como la mayoría de los líderes en ${city || 'tu ubicación'}, <span class="highlight">te falta el tiempo</span> para ser constante.</p>
        <p>¿Qué pasaría si pudieras publicar contenido de nivel experto en solo 30 segundos, manteniendo tu voz exacta y clonando tu marca personal?</p>
        
        <div class="coupon-card">
          <p style="margin: 0; font-size: 13px; color: #64748b;">REGALO DE BIENVENIDA PARA LÍDERES DE ${city || 'LinkedIn'}:</p>
          <div class="coupon-code">PROPOSITO26</div>
          <p style="margin: 0; font-weight: 700; color: #2563eb;">50% OFF (PRIMEROS 3 MESES)</p>
        </div>

        <p>He activado este cupón personalmente para tu perfil en ${organization || 'LinkedIn'}. No es marketing masivo, es una invitación para que lideres ${industry || 'tu sector'} este 2026.</p>
        
        <a href="https://kolink.es" class="btn">Activar mi 50% y Probar Gratis →</a>
      `, contactId)
    };
  },

  cold_outreach_v2: ({ name, organization, title, industry, city, contactId }) => {
    const dataPoint = pick(["un 300% más de visibilidad", "recuperar 10 horas semanales", "duplicar sus leads orgánicos"]);
    return {
      subject: `Optimización de autoridad en sector ${industry || 'AI'}: Recurso para líderes en ${city || 'España'}`,
      text: `Hola ${name}, el juego ha cambiado para los ${title || 'profesionales'} en ${industry || 'tu sector'}.`,
      html: LAYOUT(`
        <h1>LinkedIn ya no premia lo "bonito", premia la constancia.</h1>
        <p>Hace unos días te escribí sobre cómo escalar la marca de <strong>${organization || 'tu empresa'}</strong>. La realidad es que en el sector de ${industry || 'tu sector'} el mercado se está dividiendo en dos: los que se pasan horas escribiendo y los que usan <strong>Arquitectura Viral</strong>.</p>
        <p>Usando KOLINK, otros ${title || 'profesionales'} en ${city || 'tu zona'} están logrando <span class="highlight">${dataPoint}</span> sin sacrificar su agenda. Nuestra IA no "escribe por ti", <strong>aprende de ti</strong> para multiplicar tu voz.</p>
        <p>¿Vas a seguir haciendo el trabajo manual mientras tu competencia en ${organization || 'tu sector'} automatiza su autoridad?</p>
        <a href="https://kolink.es/dashboard" class="btn">Ver cómo funciona KOLINK →</a>
      `, contactId)
    };
  },

  cold_outreach_v3: ({ name, organization, industry, city, contactId }) => ({
    subject: `Confirmación de acceso: Oportunidad de implementación en ${organization || 'LinkedIn'}`,
    text: `Hola ${name}, tu cupón PROPOSITO26 para dominar ${industry || 'tu sector'} está a punto de caducar.`,
    html: LAYOUT(`
      <div class="offer-badge" style="background: #fef2f2; color: #ef4444;">Acción Requerida</div>
      <h1>Tu marca merece ser el referente de ${industry || 'tu sector'} en ${city || 'España'}, ${name.split(' ')[0]}.</h1>
      <p>Más de 1,000 líderes en ${organization || 'LinkedIn'} ya usan KOLINK. Han pasado de la invisibilidad a ser la primera opción de sus clientes en ${city || 'su ciudad'}.</p>
      <p>No quiero que pierdas la oportunidad de asegurar tu <strong>50% de descuento durante 3 meses</strong> para tu estrategia en ${industry || 'tu industria'}. Una vez expire el contador, no podremos reactivarlo para tu perfil vinculado a ${organization || 'LinkedIn'}.</p>
      
      <div class="coupon-card" style="border-color: #ef4444; background: #fffafb;">
        <div class="coupon-code" style="color: #ef4444;">PROPOSITO26</div>
        <p style="margin: 0; font-weight: 700; color: #b91c1c;">CADUCA EN MENOS DE 24H</p>
      </div>
      
      <p>¿Vas a dejar que este sea el año en que tu marca en ${city || 'LinkedIn'} despegue, o vas a seguir postergándolo?</p>
      <a href="https://kolink.es/dashboard/settings" class="btn">Aprovechar el 50% OFF Ahora →</a>
    `, contactId)
  }),

  cold_outreach_v4: ({ name, title, industry, city, contactId }) => ({
    subject: `Cierre de propuesta y próximos pasos para ${name.split(' ')[0]}`,
    text: `Hola ${name}, este es mi último mensaje para ${title || 'líderes'} en ${industry || 'tu sector'}.`,
    html: LAYOUT(`
      <h1>A veces, el "timing" lo es todo.</h1>
      <p>Te he escrito un par de veces porque realmente creo que KOLINK puede ahorrarte cientos de horas este año como ${title || 'líder'} en ${industry || 'tu sector'}.</p>
      <p>He visto lo que otros profesionales en ${city || 'tu ubicación'} están logrando y no quería que te quedaras atrás.</p>
      <p>Este es mi último correo. Si decides que es momento de escalar a otro nivel, sabes dónde encontrarnos. Borraré tu invitación personalizada en 24 horas.</p>
      <a href="https://kolink.es" class="btn">Hacer una prueba gratuita (Última vez)</a>
    `, contactId)
  }),
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const { 
      user_email, 
      user_name, 
      template_id, 
      user_id, 
      outreach_contact_id, 
      direct = false,
      title,
      organization,
      city,
      headline,
      industry
    } = body;

    if (!user_email || !template_id) {
      throw new Error("Missing user_email or template_id");
    }

    // Renderizar template con datos extendidos
    const renderer = TEMPLATES[template_id];
    if (!renderer) throw new Error("Invalid template_id");

    const personalization: PersonalizationData & { contactId?: string } = {
      name: user_name || 'Líder',
      title,
      organization,
      city,
      headline,
      industry,
      contactId: outreach_contact_id
    };

    const { subject, html, text } = renderer(personalization);
    const emailHeaders = {
      "List-Unsubscribe": "<https://kolink.es/unsubscribe>",
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
    };

    if (direct) {
      // MODO DIRECTO: Envío inmediato (útil para pruebas o alertas críticas)
      if (!RESEND_API_KEY) {
        console.error("[Send-Email] ERROR: RESEND_API_KEY is not set in environment variables");
        return new Response(JSON.stringify({ error: "RESEND_API_KEY is not set" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      console.log(`[Send-Email] Sending DIRECT email to ${user_email}...`);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "KOLINK <info@kolink.es>",
          to: [user_email],
          subject,
          html,
          text,
          headers: emailHeaders
        }),
      });

      let resendData;
      const resendRaw = await res.text();
      try {
        resendData = JSON.parse(resendRaw);
      } catch (e) {
        console.error(`[Send-Email] Resend returned non-JSON: ${res.status} - ${resendRaw}`);
        return new Response(JSON.stringify({ error: "Resend returned invalid response", details: resendRaw }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 502,
        });
      }

      if (!res.ok) {
        console.error(`[Send-Email] Resend API Error (${res.status}):`, resendData);
        return new Response(JSON.stringify({ error: "Resend API Error", details: resendData }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: res.status,
        });
      }

      console.log(`[Send-Email] Success! Resend ID: ${resendData.id}`);

      // Log directo
      const { error: logError } = await supabase.from("email_logs").insert({
        user_id: user_id || null,
        outreach_contact_id: outreach_contact_id || null,
        email_template_id: template_id,
        resend_id: resendData.id,
        status: "sent",
        sent_at: new Date().toISOString(),
        metadata: resendData
      });

      if (logError) {
        console.error("[Send-Email] DB Log Error (direct send):", logError);
      }

      return new Response(JSON.stringify({ success: true, resend_id: resendData.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      // MODO COLA (DEFAULT): Inserción en cola para procesamiento asíncrono (Escala Industrial)
      console.log(`[Send-Email] Queuing email for ${user_email}...`);
      const { error: queueError } = await supabase
        .from("email_queue")
        .insert({
          user_id: user_id || null,
          outreach_contact_id: outreach_contact_id || null,
          payload: {
            from: "KOLINK <info@kolink.es>",
            to: [user_email],
            subject,
            html,
            text,
            headers: emailHeaders,
            template_id
          },
          status: "pending"
        });

      if (queueError) {
        console.error("[Send-Email] DB Queue Error:", queueError);
        throw new Error(`Failed to queue email: ${queueError.message}`);
      }

      return new Response(JSON.stringify({ success: true, queued: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    console.error("[Send-Email] CRITICAL ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
