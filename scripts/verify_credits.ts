
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

// Load env vars
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY (check .env)");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runStressTest() {
    console.log("🧪 Starting Credit System Stress Test...");



    const TEST_EMAIL = "aram721@outlook.com";
    const TEST_PASSWORD = "Aram9574"; // From user prompt rules

    console.log(`Logging in as ${TEST_EMAIL}...`);
    // @ts-ignore
    const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
    });

    if (loginError || !session) {
        console.error("❌ Login failed:", loginError?.message);
        return;
    }

    const TEST_USER_ID = session.user.id;
    console.log(`✅ Logged in! User ID: ${TEST_USER_ID}`);
    
    // 2. Initial Balance
    const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', TEST_USER_ID)
        .single();
    
    console.log(`💰 Initial Balance: ${profile?.credits}`);
    
    // 3. Simulate Concurrent Requests

    // 3. Simulate Concurrent Requests
    const REQUESTS = 5;
    console.log(`🚀 Launching ${REQUESTS} concurrent requests...`);

    const promises = Array.from({ length: REQUESTS }).map(async (_, i) => {
        // We simulate a deduction by calling an edge function or directly updating if we had service role.
        // Since we verify FRONTEND logic mostly, we can just check if the DB enforces checks.
        // But RLS prevents direct updates usually.
        // Let's assume we call a mock function or just verify read consistency.
        
        // For this "Stress Test" in the user's context, it essentially means:
        // "Can I spam the generate button and go negative?"
        // This script will try to call 'expert-chat' multiple times.
        
        try {
            // Explicitly pass headers to ensure auth token is used
            const { data, error } = await supabase.functions.invoke('expert-chat', {
                body: { query: `Stress Test Message ${i}`, mode: 'advisor' },
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });

            if (error) {
                console.error(`❌ Request ${i} Failed:`, error);
                return { status: 'failed', error };
            }
            
            return { status: 'success', data };
        } catch (e: any) {
            console.error(`❌ Request ${i} Exception:`, e.message);
            return { status: 'error', error: e };
        }
    });

    const results = await Promise.all(promises);
    
    // 4. Final Balance
    const { data: finalProfile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', TEST_USER_ID)
        .single();

    console.log(`💰 Final Balance: ${finalProfile?.credits}`);
    console.log(`📉 Expected Drop: ~${REQUESTS} credits (if all succeeded)`);
    
    const successCount = results.filter(r => r.status === 'success').length;
    console.log(`✅ Successful Requests: ${successCount}`);
    
    if (finalProfile?.credits && finalProfile.credits < 0) {
        console.error("❌ CRITICAL FAIL: Credits went negative!");
    } else {
        console.log("✅ PASS: Credits remained non-negative or handled correctly.");
    }
}

runStressTest();
