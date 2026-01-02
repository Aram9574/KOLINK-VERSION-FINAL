import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { AuditService } from "../_shared/services/AuditService.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { pdfText } = await req.json();
    if (!pdfText) throw new Error("Missing PDF content");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const authHeader = req.headers.get("Authorization")!;
    const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.replace("Bearer ", ""));
    const { data: profile } = await supabaseAdmin.from("profiles").select("language").eq("id", user?.id).single();
    const language = profile?.language || "es";

    // Use the specialized AuditService microservice
    const auditService = new AuditService(Deno.env.get("GEMINI_API_KEY")!);
    
    // Convert text back to a simple data structure for the audit service
    // In the future, we might want to use multimodal extractLinkedInPDF directly here
    const result = await auditService.analyzeLinkedInProfile({ 
      full_name: "User", 
      summary: pdfText 
    } as any, language);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[ProfileAuditFunc] Error:", err.message);
    return new Response(
      JSON.stringify({ error: err.message || "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
