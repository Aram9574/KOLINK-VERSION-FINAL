import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testGenerate() {
    // 1. Login
    const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'test_stripe@kolink.com',
        password: 'Password123!',
    });

    if (loginError) {
        console.error('Login failed:', loginError);
        return;
    }

    console.log('Logged in as:', session.user.email);

    // 2. Call generate-viral-post
    const { data, error } = await supabase.functions.invoke('generate-viral-post', {
        body: {
            params: {
                topic: 'Test Topic',
                audience: 'Developers',
                tone: 'Professional',
                framework: 'PAS',
                length: 'SHORT',
                creativityLevel: 50,
                emojiDensity: 'MODERATE',
                includeCTA: true
            }
        },
        headers: {
            Authorization: `Bearer ${session.access_token}`
        }
    });

    if (error) {
        console.error('Function error:', error);
        // Try to read the body if possible, though invoke might hide it if it throws
        // Actually invoke returns error as { message: ... } usually
    } else {
        console.log('Function success:', data);
    }
}

testGenerate();
