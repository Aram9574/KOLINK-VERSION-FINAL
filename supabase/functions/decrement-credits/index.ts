import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { user_id } = await req.json()

    if (!user_id) {
      throw new Error('User ID is required')
    }

    // 1. Fetch current credits
    const { data: profile, error: fetchError } = await supabaseClient
      .from('profiles')
      .select('credits')
      .eq('id', user_id)
      .single()

    if (fetchError || !profile) {
      throw new Error('Profile not found')
    }

    if (profile.credits <= 0) {
      return new Response(
        JSON.stringify({ error: 'Insufficient credits', credits: profile.credits }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 402 }
      )
    }

    // 2. Perform Atomic Decrement using Optimistic Locking
    // We ensure we are updating the exact version of the row we just read.
    const { data: updatedProfile, error: updateError } = await supabaseClient
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', user_id)
      .eq('credits', profile.credits) // Ensure nobody else changed it in the millisecond between read and write
      .select()
      .single()

    if (updateError || !updatedProfile) {
      throw new Error('Transaction failed - please try again')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        newCredits: updatedProfile.credits,
        message: 'Credit deducted successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})