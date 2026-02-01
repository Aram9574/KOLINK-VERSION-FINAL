
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const contactId = url.searchParams.get("id");

    if (!contactId) {
      return new Response("ID de contacto no encontrado", { status: 400 });
    }

    console.log(`[Unsubscribe] Processing: ${contactId}`);
    
    await supabase
      .from("outreach_contacts")
      .update({ status: "unsubscribed" })
      .eq("id", contactId);

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Baja Confirmada | KOLINK</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: white; padding: 2.5rem; border-radius: 1.5rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); text-align: center; max-width: 400px; border: 1px solid #e2e8f0; }
    .logo { font-weight: 900; color: #2563eb; font-size: 1.5rem; margin-bottom: 1.5rem; display: block; }
    h1 { color: #0f172a; font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #64748b; line-height: 1.5; }
    .check { color: #16a34a; font-size: 3rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="check">✓</div>
    <span class="logo">KOLINK.</span>
    <h1>Baja confirmada</h1>
    <p>Tu decisión ha sido registrada. Ya no recibirás más correos de esta secuencia estratégica.</p>
  </div>
</body>
</html>`;

    // Tras procesar la baja, redirigimos al usuario a la landing page
    const redirectUrl = "https://kolink.es/?unsubscribed=true";
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": redirectUrl,
      },
    });

  } catch (error) {
    console.error("[Unsubscribe] Error:", error.message);
    return new Response(error.message, { status: 500, headers: corsHeaders });
  }
});
