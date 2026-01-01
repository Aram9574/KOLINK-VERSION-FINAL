import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import { translations } from "../../../translations";
import { LinkedInAudit } from "../../../types";
import AuditEmptyState from "./AuditEmptyState.tsx";
import AuditStatusTracker from "./AuditStatusTracker.tsx";
import AuditResults from "./AuditResults.tsx";
import { toast } from "sonner";
import { supabase } from "../../../services/supabaseClient";

const LinkedInAuditView: React.FC = () => {
    const { user, language } = useUser();
    const t = translations[language].app.audit;
    
    const [status, setStatus] = useState<"idle" | "processing" | "results">("idle");
    const [auditData, setAuditData] = useState<LinkedInAudit | null>(null);
    const [profileUrl, setProfileUrl] = useState("");
    const [hasLatestAudit, setHasLatestAudit] = useState(false);

    // Load existing audit on mount
    useEffect(() => {
        const fetchLatestAudit = async () => {
            if (!user.id) return;
            
            // If the user hasn't explicitly reset in this session, show the latest result
            const hasReset = sessionStorage.getItem("kolink_audit_reset") === "true";
            
            const { data, error } = await supabase
                .from("audits")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (data) {
                setHasLatestAudit(true);
                if (!hasReset) {
                    setAuditData(data);
                    setStatus("results");
                }
            }
        };
        fetchLatestAudit();
    }, [user.id]);

    const handleStartAudit = async (file: File) => {
        setStatus("processing");
        
        try {
            // Convert file to base64
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve, reject) => {
                reader.onload = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
            });
            reader.readAsDataURL(file);
            const pdfBase64 = await base64Promise;

            const { data, error } = await supabase.functions.invoke("process-linkedin", {
                body: { pdf_base64: pdfBase64 },
            });

            if (error) throw error;
            
            setAuditData(data);
            setStatus("results");
            setHasLatestAudit(true);
            sessionStorage.removeItem("kolink_audit_reset");
            toast.success(language === "es" ? "¡Auditoría completada!" : "Audit completed!");
        } catch (error: any) {
            console.error("Audit failed:", error);
            setStatus("idle");
            toast.error(language === "es" ? "Error al procesar la auditoría" : "Error processing audit");
        }
    };

    const handleReset = () => {
        setAuditData(null);
        setStatus("idle");
        setProfileUrl("");
        sessionStorage.setItem("kolink_audit_reset", "true");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewLatest = async () => {
        if (!user.id) return;
        const { data } = await supabase
            .from("audits")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (data) {
            setAuditData(data);
            setStatus("results");
            sessionStorage.removeItem("kolink_audit_reset");
        }
    };

    const handleRegenerate = async (section: "headline" | "about") => {
        if (!auditData) return;

        try {
            const { data, error } = await supabase.functions.invoke("regenerate-audit-suggestion", {
                body: { 
                    auditResult: auditData.results,
                    section,
                    language
                }
            });

            if (error) throw error;

            if (data?.suggestion) {
                // Determine if suggestion is wrapped in quotes and strip them if needed
                let cleanSuggestion = data.suggestion.trim();
                if (cleanSuggestion.startsWith('"') && cleanSuggestion.endsWith('"')) {
                    cleanSuggestion = cleanSuggestion.slice(1, -1);
                }

                // Update local state deeply
                const newAuditData = { ...auditData };
                if (section === "headline") {
                    newAuditData.results.headline.suggested = cleanSuggestion;
                } else {
                    newAuditData.results.about.suggested = cleanSuggestion;
                }
                setAuditData(newAuditData);
                toast.success(language === "es" ? "Nueva variante generada" : "New variant generated");
            }
        } catch (err) {
            console.error("Regeneration failed", err);
            toast.error(language === "es" ? "Error al generar variante" : "Failed to generate variant");
        }
    };

    return (
        <div className="h-full w-full bg-[#F9FAFB] dark:bg-[#0F172A] p-4 lg:p-8 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {t.title}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                        {t.subtitle}
                    </p>
                </div>

                {/* Main Content with key to force fresh mount on status change */}
                <div className="w-full" key={status}>
                    {status === "idle" && (
                        <AuditEmptyState 
                            onStart={handleStartAudit} 
                            hasLatestAudit={hasLatestAudit}
                            onViewLatest={handleViewLatest}
                        />
                    )}
                    
                    {status === "processing" && (
                        <AuditStatusTracker />
                    )}
                    
                    {status === "results" && auditData && (
                        <AuditResults 
                            audit={auditData} 
                            onNewAudit={handleReset}
                            onRegenerate={handleRegenerate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LinkedInAuditView;
