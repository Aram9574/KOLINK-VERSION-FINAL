import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { referralCode, newUserId } = await req.json();

    if (!referralCode || !newUserId) {
        throw new Error("Faltan datos: referralCode y newUserId son requeridos.");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Find Referrer
    // We assume referral_code is stored in profiles or we match logic.
    // For MVP, if we don't have a unique column, we might use user ID or a new column 'my_referral_code' in profiles.
    // Optimization: Let's assume referral_code IS the user ID of the referrer for MVP simplicity, 
    // OR we query user where 'id' matches (if uuid). 
    // Or better, let's search in referrals table if we pre-generated codes? 
    // Plan B: Search profiles where their 'id' matches the code (Simple) or if we add a 'referral_code' column later.
    // Let's assume referrer_user_id IS the code for now to match the "Copiar Enlace" typical flow (link?ref=USER_ID).

    const referrerId = referralCode; 

    // Validate Referrer Exists
    const { data: referrer, error: refError } = await supabaseAdmin
        .from("profiles")
        .select("id, credits, email")
        .eq("id", referrerId)
        .single();
    
    if (refError || !referrer) {
        return new Response(JSON.stringify({ error: "Referrer not found" }), {
            status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }

    if (referrer.id === newUserId) {
        return new Response(JSON.stringify({ error: "No te puedes referir a ti mismo." }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }

    // 2. Record Referral
    const { error: insertError } = await supabaseAdmin
        .from("referrals")
        .insert({
            referrer_user_id: referrer.id,
            referral_code: referralCode,
            status: "converted", // They just signed up
            reward_claimed: false,
            // We could store newUserId in 'referred_email' temporarily or add a column 'referred_user_id' 
            // The table defined earlier has 'referred_email', let's use that for metadata or update schema later if needed.
            // For now, let's just log it.
        });

    if (insertError) throw insertError;

    // 3. Award Credits (e.g., +10 Credits)
    const REWARD_AMOUNT = 10;
    
    await supabaseAdmin.from("profiles").update({
        credits: (referrer.credits || 0) + REWARD_AMOUNT,
        // Maybe send notification here (if notification system exists)
    }).eq("id", referrer.id);

    // Update new user too? Maybe give them a bonus.
    await supabaseAdmin.from("profiles").update({
        credits: 20 // Bonus 10 + Standard 10
    }).eq("id", newUserId);

    // 4. Update Referrer Stats (Gamification)
    // Optional: Add XP, unlock achievement 'Influencer'

    return new Response(
      JSON.stringify({ 
          success: true, 
          message: `Referido procesado. ${REWARD_AMOUNT} créditos otorgados.`,
          referrer_balance: (referrer.credits || 0) + REWARD_AMOUNT
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const err = error as Error;
    console.error(`[Referral] Error:`, err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
