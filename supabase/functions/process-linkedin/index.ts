import { createClient } from "@supabase/supabase-js";
import { AIService } from "../_shared/AIService.ts";
import { LinkedInPDFData } from "../_shared/types.ts";
import { getCorsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight
  const headers = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const { pdf_base64 } = await req.json();
    if (!pdf_base64) throw new Error("LinkedIn Profile PDF (Base64) is required");

    // Initialize Supabase Admin for DB operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) throw new Error("Unauthorized");

    console.log(`[process-linkedin] Starting hybrid audit for user ${user.id}`);
    const aiService = new AIService(Deno.env.get("GEMINI_API_KEY")!);

    // Phase 1: Extract Text and Identity from PDF
    console.log("[process-linkedin] Extracting data from PDF via Gemini Multimodal...");
    const pdfData: LinkedInPDFData = await aiService.extractLinkedInPDF(pdf_base64);
    
    if (pdfData.error) {
        throw new Error(`PDF Extraction failed: ${pdfData.error}`);
    }

    const profile_url = pdfData.profile_url;
    console.log(`[process-linkedin] Extracted identity: ${pdfData.full_name}, URL: ${profile_url}`);

    // Phase 2: Enrichment Layer (Bright Data Scrape for Visuals)
    const brightDataKey = Deno.env.get("BRIGHTDATA_API_KEY");
    // let _scrapeData = null; // Removed as it was unused and reassignment not needed yet

    if (brightDataKey && profile_url) {
      console.log("[process-linkedin] Enquiring Bright Data for visual enrichment...");
      try {
        // We use the Dataset Trigger API as a placeholder. 
        // Note: Real-time scraping with Bright Data might require specific IDE endpoints.
        // For now, we attempt to get profile metadata.
        const response = await fetch(`https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lyy3tktm25m4avu764`, {
          method: "POST",
          headers: { 
              "Authorization": `Bearer ${brightDataKey}`,
              "Content-Type": "application/json"
          },
          body: JSON.stringify([{ url: profile_url }])
        });

        if (response.ok) {
           const triggerResult = await response.json();
           console.log("[process-linkedin] Bright Data trigger successful:", triggerResult.snapshot_id);
           // In a real scenario, we might poll for a few seconds if it's high priority,
           // but here we prioritize the PDF data and use the scrape as "bonus" if available.
        }
      } catch (err) {
        console.error("[process-linkedin] Bright Data integration error:", err);
      }
    }

    // Merge strategy: PDF is the source of truth for text, Scrape (if we had it) would be for image_url
    const consolidatedProfile = {
        ...pdfData,
        // Fallback or placeholder for visual data since Scrape is async
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(pdfData.full_name)}&background=random`,
        banner_url: null,
    };

    // Phase 3: AI Analysis Layer (Gemini via AIService)
    console.log("[process-linkedin] Calling AIService for deep audit...");
    
    // Get user language preference
    let language = "es";
    try {
        const { data: profile } = await supabaseAdmin.from("profiles").select("language").eq("id", user.id).maybeSingle();
        if (profile?.language) language = profile.language;
    } catch (_e) {
        console.warn("[process-linkedin] Language fetch failed");
    }

    const analysis = await aiService.analyzeLinkedInProfile(consolidatedProfile, language, undefined, supabaseAdmin);
    console.log("[process-linkedin] AI Analysis successful");

    // Phase 4: Persistence Layer
    console.log("[process-linkedin] Saving audit to database...");
    const { data: audit, error: dbError } = await supabaseAdmin
      .from("audits")
      .insert({
        user_id: user.id,
        profile_url: profile_url || "PDF Upload",
        results: analysis,
      })
      .select()
      .single();

    if (dbError) {
        console.error("[process-linkedin] Database insert error:", dbError);
        throw dbError;
    }

    return new Response(JSON.stringify(audit), {
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal error";
    console.error("[process-linkedin] CRITICAL ERROR:", errorMessage);
    return new Response(JSON.stringify({ 
        error: errorMessage,
        details: "Consult function logs for more information."
    }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
});
