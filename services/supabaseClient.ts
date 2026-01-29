import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

// Use environment variables for configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Missing Supabase Environment Variables!", { 
        url: !!supabaseUrl, 
        key: !!supabaseAnonKey 
    });
    console.warn("Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file or Vercel project settings.");
}

export const supabase = createClient<Database>(
    supabaseUrl || '', 
    supabaseAnonKey || ''
);
