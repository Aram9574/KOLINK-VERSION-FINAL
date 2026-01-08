import { createClient } from '@supabase/supabase-js'


// Hardcoding credentials to guarantee connection to NEW project (gwfjojgqzfjakahsopzm)
// STUBBORN FIX: Ignoring process.env entirely because Vercel is retaining old values.
const supabaseUrl = "https://gwfjojgqzfjakahsopzm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3ZmpvamdxemZqYWthaHNvcHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNzQ4NDAsImV4cCI6MjA4Mjk1MDg0MH0.lAKo2huYaRuiRUV0m4lFshp25jiKklLG9jmi4EjYNJM";

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Missing Supabase Environment Variables!", { supabaseUrl, supabaseAnonKey });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
