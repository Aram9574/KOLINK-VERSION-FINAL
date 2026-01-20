import { createClient } from "@supabase/supabase-js";
import { AuditService } from "../_shared/services/AuditService.ts";
import { getCorsHeaders } from "../_shared/cors.ts"; // IMPORTACIÓN ACTUALIZADA
import { LinkedInProfileData } from "../_shared/types.ts";
import { BehaviorService } from "../_shared/services/BehaviorService.ts";

Deno.serve(async (req: Request) => {
  // 1. HEADERS DINÁMICOS
  const headers = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const { pdfBase64, imageBase64 } = await req.json();
    if (!pdfBase64 && !imageBase64) throw new Error("Missing content");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const authHeader = req.headers.get("Authorization")!;
    const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.replace("Bearer ", ""));
    const { data: profile } = await supabaseAdmin.from("profiles").select("language").eq("id", user?.id).single();
    
    const auditService = new AuditService(Deno.env.get("GEMINI_API_KEY")!);
    const behaviorService = new BehaviorService(
        Deno.env.get("GEMINI_API_KEY") ?? "",
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (user?.id) {
        behaviorService.trackEvent(user.id, "audit_started", { hasPdf: !!pdfBase64 }).catch(e => console.error(e));
    }
    
    let profileData: LinkedInProfileData = { full_name: "Unknown User", profile_url: null };

    if (pdfBase64) {
        const pdfData = await auditService.extractLinkedInPDF(pdfBase64);
        if (pdfData.error) throw new Error(`PDF Extraction failed: ${pdfData.error}`);
        profileData = { ...profileData, ...pdfData };

        if (!profileData.profile_url) {
            const deterministicUrl = await auditService.extractPdfUrlDeterministic(pdfBase64);
            if (deterministicUrl) profileData.profile_url = deterministicUrl;
        }

        if (profileData.profile_url) {
            log(`[analyze-profile] URL found (${profileData.profile_url}), attempting hybrid enrichment...`);
            const scrapedData = await auditService.scrapeLinkedInProfile(profileData.profile_url);
            
            if (scrapedData) {
                log("[analyze-profile] Enriched with scraped data!");
                profileData = { ...profileData, scraped_data: scrapedData };
            } else {
                log("[analyze-profile] Scraping skipped or failed (Result was null).");
            }
        } else {
            log("[analyze-profile] No URL available for scraping.");
        }
    }

    // 3. Fallback / Visual Context
    // If we only have an image, we treat it as a visual audit primarily
    if (!pdfBase64 && imageBase64) {
        profileData.full_name = "Visual Audit";
        profileData.summary = "Analyzed from provided screenshot";
    }

    // 4. Unified AI Analysis
    console.log("[analyze-profile] Performing final analysis...");
    
    // Determine Source Type
    let sourceType: "hybrid" | "pdf" | "visual" = "pdf";
    if (profileData.scraped_data) sourceType = "hybrid";
    else if (!pdfBase64 && imageBase64) sourceType = "visual";

    const aiResult = await auditService.analyzeLinkedInProfile(profileData, language, imageBase64);
    
    // Inject metadata & raw data for visualization
    // Inject metadata & raw data for visualization
    const aboutText = profileData.about || profileData.summary;
    const result = { 
        ...aiResult, 
        source_type: sourceType,
        debug_trace: debugLogs,
        processed_data: {
            name: profileData.full_name || profileData.name || "Usuario Anónimo",
            headline: profileData.headline || "Sin titular detectado",
            about: aboutText ? aboutText.substring(0, 150) + "..." : undefined,
            company: profileData.company || (profileData.experiences && profileData.experiences[0]?.company),
            location: profileData.location,
            skills: profileData.skills || [],
            experiences: profileData.experiences || [],
            education: profileData.education || []
        }
    };

    // 5. Persistence
    if (user?.id) {
         await supabaseAdmin.from("audits").insert({
            user_id: user.id,
            profile_url: profileData.profile_url || "Manual/Image Upload",
            results: result,
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[analyze-profile] Error:", err.message);
    return new Response(
      JSON.stringify({ error: err.message || "Internal error" }),
      {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
  }
});
