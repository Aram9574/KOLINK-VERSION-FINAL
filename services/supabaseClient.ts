import { createClient } from '@supabase/supabase-js'


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Missing Supabase Environment Variables!", { supabaseUrl, supabaseAnonKey });
    // This will help the user see immediately if the .env is not loaded
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
