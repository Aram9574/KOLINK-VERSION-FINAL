// @ts-ignore: Deno import map
import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TARGET_EMAIL = "aram721@outlook.com";

interface ErrorPayload {
  error_message: string;
  stack_trace?: string;
  component?: string;
  user_id?: string;
  metadata?: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const payload: ErrorPayload = await req.json();
    const { error_message, stack_trace, component, user_id, metadata } = payload;

    // 1. Log to Database
    const { error: dbError } = await supabaseClient
      .from("error_logs")
      .insert({
        user_id: user_id || null,
        error_message,
        stack_trace,
        component,
        metadata
      });

    if (dbError) {
      console.error("Failed to log to DB:", dbError);
    }

    // 2. Send Email Notification (if API Key exists)
    let emailStatus = "skipped";
    if (RESEND_API_KEY) {
      const emailHtml = `
        <h1>🚨 Error Reported in KOLINK</h1>
        <p><strong>Message:</strong> ${error_message}</p>
        <p><strong>Component:</strong> ${component || "Unknown"}</p>
        <p><strong>User ID:</strong> ${user_id || "Anonymous"}</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        
        <h3>Stack Trace:</h3>
        <pre style="background: #f4f4f5; padding: 12px; border-radius: 8px; overflow-x: auto;">
${stack_trace || "No stack trace available"}
        </pre>

        <h3>Metadata:</h3>
        <pre>${JSON.stringify(metadata, null, 2)}</pre>
      `;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Kolink Alert <onboarding@resend.dev>", // Default Resend testing sender, or use your verified domain
          to: [TARGET_EMAIL],
          subject: `[Error] ${component ? component + ": " : ""}${error_message.substring(0, 50)}...`,
          html: emailHtml,
        }),
      });

      if (res.ok) {
        emailStatus = "sent";
      } else {
        const text = await res.text();
        console.error("Resend Error:", text);
        emailStatus = `failed: ${text}`;
      }
    } else {
      console.log("No RESEND_API_KEY found, skipping email.");
    }

    return new Response(
      JSON.stringify({ success: true, db: !dbError, email: emailStatus }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Error in log-error function:", err);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
