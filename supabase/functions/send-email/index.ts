
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
  user_id: string;
  user_email: string;
  user_name: string;
  template_id: string; // 'welcome', 'feature', 'social', 'objection', 'close'
}

const TEMPLATES: Record<string, (name: string) => { subject: string; html: string }> = {
  welcome: (name) => ({
    subject: "Bienvenido a KOLINK (Tu primer post viral está listo) 🚀",
    html: `
      <h2>Hola ${name},</h2>
      <p>Bienvenido a la revolución de LinkedIn.</p>
      <p>Sabemos que escribir contenido de alta calidad consume horas. Con KOLINK, solo necesitas una idea vaga.</p>
      <h3>Tu misión para hoy:</h3>
      <ol>
        <li>Entra al <strong>Motor Viral</strong>.</li>
        <li>Escribe un tema simple (ej. "Liderazgo remoto").</li>
        <li>Pulsa "Generar".</li>
      </ol>
      <p>En 30 segundos, tendrás un post estructurado, optimizado para el algoritmo y listo para publicar.</p>
      <br/>
      <a href="https://kolink-app.com/dashboard?start=true" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Crear mi Primer Post →</a>
      <br/><br/>
      <p>No lo pienses. Solo pruébalo.</p>
      <p>— El equipo de KOLINK</p>
    `
  }),
  feature: (name) => ({
    subject: "¿Tu perfil está perdiendo dinero? 💸",
    html: `
      <h2>${name},</h2>
      <p>El 90% de los perfiles de LinkedIn son invisibles. No por falta de experiencia, sino por falta de estrategia.</p>
      <p>KOLINK no solo escribe por ti. También <strong>analiza tu perfil</strong> para encontrar fugas de autoridad.</p>
      <p>Nuestra IA de <strong>Auditoría de Perfil</strong> escanea tu foto, banner y titular para decirte exactamente qué mejorar.</p>
      <h3>Prueba esto ahora:</h3>
      <ol>
        <li>Ve a "Auditoría".</li>
        <li>Sube tu perfil en PDF.</li>
        <li>Obtén tu puntuación de autoridad.</li>
      </ol>
      <br/>
      <a href="https://kolink-app.com/dashboard/audit" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Auditar mi Perfil Ahora →</a>
      <br/><br/>
      <p>— Aram de KOLINK</p>
    `
  }),
  social: (name) => ({
    subject: "De 500 a 15,000 impresiones en una semana 📈",
    html: `
      <h2>Hola ${name},</h2>
      <p>"Pensé que era otra herramienta de IA más..."</p>
      <p>Eso nos dijo Carlos antes de probar el modo <strong>"Controvertido"</strong> de KOLINK.</p>
      <p>En lugar de escribir los típicos consejos aburridos, usó nuestra estructura "Polarizante" para desafiar una creencia común en su industria.</p>
      <h3>El resultado:</h3>
      <ul>
        <li>+15,000 impresiones orgánicas.</li>
        <li>45 comentarios de alto valor.</li>
        <li>3 leads cualificados en su DM.</li>
      </ul>
      <p>No necesitas ser un gurú. Necesitas las herramientas correctas.</p>
      <br/>
      <a href="https://kolink-app.com/dashboard/studio" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Probar el Modo Controvertido →</a>
      <br/><br/>
      <p>— El equipo de KOLINK</p>
    `
  }),
  objection: (name) => ({
    subject: "Tu ventaja injusta está por expirar ⏳",
    html: `
      <h2>${name},</h2>
      <p>Tu periodo de prueba está llegando a su fin.</p>
      <p>Quizás estás pensando: <em>"¿Realmente necesito esto?"</em> o <em>"Puedo escribir yo solo"</em>.</p>
      <p>Claro que puedes. Pero, ¿a qué costo?</p>
      <ul>
        <li>❌ 4 horas semanales pensando temas.</li>
        <li>❌ Bloqueo del escritor frente a la pantalla blanca.</li>
        <li>❌ Posts que nadie lee porque el gancho es débil.</li>
      </ul>
      <p>KOLINK te devuelve esas 4 horas por menos de lo que cuesta un café al día.</p>
      <br/>
      <a href="https://kolink-app.com/dashboard/settings" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Mantener mi Acceso PRO →</a>
      <br/><br/>
      <p>Asegura tu marca personal antes de que sea tarde.</p>
    `
  }),
  close: (name) => ({
    subject: "ÚLTIMO AVISO: Adiós al Piloto Automático 👋",
    html: `
      <h2>Es el momento decisivo, ${name}.</h2>
      <p>En 24 horas, tu cuenta volverá al plan básico.</p>
      <h3>Lo que perderás:</h3>
      <ul>
        <li>🚫 Generación ilimitada de posts.</li>
        <li>🚫 El análisis de tu propia voz de marca.</li>
        <li>🚫 Las sugerencias virales diarias.</li>
      </ul>
      <p>No dejes que tu LinkedIn vuelva a ser un desierto. Mantén el impulso que has ganado esta semana.</p>
      <br/>
      <a href="https://kolink-app.com/dashboard/settings" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Actualizar a PRO y Ahorrar →</a>
      <br/><br/>
      <p>Nos vemos dentro,</p>
      <p>Aram Zakzuk<br/>Fundador, KOLINK</p>
    `
  })
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user_id, user_email, user_name, template_id } = await req.json() as EmailRequest;

    if (!user_email || !template_id) {
      throw new Error("Missing email or template_id");
    }

    const templateGenerator = TEMPLATES[template_id];
    if (!templateGenerator) {
      throw new Error("Invalid template_id");
    }

    const { subject, html } = templateGenerator(user_name || "Usuario");

    // 1. Send Email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "KOLINK <onboarding@kolink-app.com>", // Update with verified domain
        to: [user_email],
        subject: subject,
        html: html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend Error:", data);
      throw new Error(`Resend API Error: ${JSON.stringify(data)}`);
    }

    // 2. Log to Database
    const { error: logError } = await supabase
      .from("email_logs")
      .insert({
        user_id,
        email_template_id: template_id,
        status: "sent",
        metadata: data
      });

    if (logError) {
      console.error("DB Log Error:", logError);
    }

    return new Response(JSON.stringify(data), {
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
