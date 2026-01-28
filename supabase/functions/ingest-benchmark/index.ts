import { createClient } from "@supabase/supabase-js";
import { BaseAIService } from "../_shared/services/BaseAIService.ts";

const BENCHMARKS = [
    {
        category: "SaaS Founder",
        text_content: "Headline: Founder @ TechFlow | Escalo productos B2B de $0 a $10M ARR | Ayudo a empresas a automatizar flujos de trabajo con IA.\n\nAbout: Llevo 10 años construyendo software que resuelve problemas reales. En 2020 fundé TechFlow con la misión de democratizar la automatización. Hemos ayudado a más de 500 empresas a ahorrar 100k horas de trabajo manual. Si buscas escalar tus operaciones sin aumentar tu headcount, hablemos."
    },
    {
        category: "Senior Developer",
        text_content: "Headline: Senior Frontend Engineer | Especialista en React & Performance | Ex-Google | Construyendo experiencias web ultrarrápidas.\n\nAbout: La ingeniería no va solo de código, va de resolver problemas de usuario. Como Senior Engineer, me obsesiona la performance web y la accesibilidad. He liderado migraciones de arquitecturas monolíticas a micro-frontends reduciendo el TTI en un 40%. Escribo sobre React y optimización en mi blog."
    },
    {
        category: "Marketing Executive",
        text_content: "Headline: CMO @ GrowthCorp | Estrategias de Growth Marketing Data-Driven | +$50M gestionados en Ad Spend.\n\nAbout: El marketing moderno es una intersección entre creatividad y datos. Lidero equipos de alto rendimiento para ejecutar campañas omnicanal que no solo generan leads, sino ingresos reales. En mi última etapa, aumenté el ROAS un 200% mediante experimentación A/B rigurosa y personalización a escala."
    }
];

Deno.serve(async (_req) => {
    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );
        
        // Initialized but not used directly in loop (using manual fetch for embedding)
        const _aiService = new BaseAIService(Deno.env.get("GEMINI_API_KEY")!);
        const results = [];

        console.log("Starting benchmark ingestion...");

        // clean table for demo/idempotency (optional, maybe unsafe for prod but good for init)
        // await supabase.from("benchmarks").delete().neq("id", "00000000-0000-0000-0000-000000000000");

        for (const benchmark of BENCHMARKS) {
            console.log(`Processing: ${benchmark.category}`);
            
            // 1. Generate Embedding
            const payload = {
                model: "models/text-embedding-004",
                content: { parts: [{ text: benchmark.text_content }] }
            };
            
            // Re-using embedding logic from BaseService would be ideal if exposed, 
            // but BaseService usually does generateContent. 
            // We'll reproduce the fetch here quickly or assume BaseAIService has it? 
            // AuditService has `embedText`, BaseAIService does NOT.
            // Let's manually fetch the embedding here to keep generic service clean or copy logic.
            // Copying logic for standalone script safety.
            
            const apiKey = Deno.env.get("GEMINI_API_KEY");
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                console.error(`Failed to embed ${benchmark.category}: ${response.statusText}`);
                continue;
            }
            
            const data = await response.json();
            const embedding = data.embedding.values;

            // 2. Insert into Supabase
            const { error } = await supabase.from("benchmarks").insert({
                category: benchmark.category,
                text_content: benchmark.text_content,
                embedding: embedding,
                metadata: { source: "seed_script" }
            });

            if (error) {
                console.error(`Error inserting ${benchmark.category}:`, error);
                results.push({ category: benchmark.category, status: "error", error });
            } else {
                results.push({ category: benchmark.category, status: "success" });
            }
        }

        return new Response(JSON.stringify({ success: true, results }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return new Response(JSON.stringify({ error: msg }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
});
