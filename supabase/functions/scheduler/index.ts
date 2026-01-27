
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Use Service Role to bypass RLS and access 'auth.users' via RPC
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const STEPS = [
  { template_id: "welcome", min_hours: 0, max_hours: 1 },         // Immediate (within last hour)
  { template_id: "feature", min_hours: 24, max_hours: 25 },       // Day 1
  { template_id: "social", min_hours: 72, max_hours: 73 },        // Day 3
  { template_id: "objection", min_hours: 120, max_hours: 121 },   // Day 5
  { template_id: "close", min_hours: 144, max_hours: 145 },       // Day 6
];

serve(async (req) => {
  try {
    const results = [];

    for (const step of STEPS) {
      console.log(`Checking step: ${step.template_id} (${step.min_hours}-${step.max_hours}h)`);

      // 1. Get Candidates via RPC
      const { data: candidates, error } = await supabase.rpc("get_onboarding_candidates", {
        min_hours: step.min_hours,
        max_hours: step.max_hours,
        template_id: step.template_id
      });

      if (error) {
        console.error(`Error fetching candidates for ${step.template_id}:`, error);
        continue;
      }

      if (!candidates || candidates.length === 0) {
        console.log(`No candidates for ${step.template_id}`);
        continue;
      }

      console.log(`Found ${candidates.length} candidates for ${step.template_id}`);

      // 2. Dispatch Emails
      const promises = candidates.map(async (user: any) => {
        try {
          const { data, error: sendError } = await supabase.functions.invoke("send-email", {
            body: {
              user_id: user.id,
              user_email: user.email,
              user_name: user.name,
              template_id: step.template_id
            }
          });

          if (sendError) throw sendError;
          return { user: user.email, status: "success" };
        } catch (err) {
          console.error(`Failed to send to ${user.email}:`, err);
          return { user: user.email, status: "failed", error: err };
        }
      });

      const stepResults = await Promise.all(promises);
      results.push({ step: step.template_id, results: stepResults });
    }

    return new Response(JSON.stringify({ success: true, detailed_results: results }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Scheduler Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
