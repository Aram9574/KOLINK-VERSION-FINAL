import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://enqcokspbxiopijjzfes.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucWNva3NwYnhpb3Bpamp6ZmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzODQ2MjMsImV4cCI6MjA3OTk2MDYyM30.XJ3e3twD9kup4yv7KxWn1L038wid2W3qFXClo9LcAis";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndResetUser() {
  const email = "aram721@outlook.com";
  console.log(`Checking user: ${email}...`);

  // 1. Get User ID from Profiles (since we can't access auth.users directly easily with anon key, but profiles is public read)
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return;
  }

  console.log("Current Profile:", profile);

  if (profile.plan_tier !== "free" || profile.credits > 50) {
    console.log("User is PRO or has high credits. Downgrading for testing...");
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        plan_tier: "free",
        credits: 10,
        subscription_status: "inactive",
      })
      .eq("id", profile.id);

    if (updateError) console.error("Error updating profile:", updateError);
    else console.log("User downgraded to FREE with 10 credits.");
  } else {
    console.log("User is already FREE. Ready for lock testing.");
  }
}

checkAndResetUser();
