import React, { useEffect, useState } from "react";
import { CarouselEditor } from "./CarouselEditor";
import { supabase } from "../../../services/supabaseClient";
import { useLocation } from "react-router-dom";
import LoadingProgress from "../../ui/LoadingProgress";
import { Sparkles } from "lucide-react";
import { useUser } from "../../../context/UserContext";

type SourceType = "url" | "youtube" | "text";

interface CarouselStudioProps {
    initialContent?: string;
}

const CarouselStudio: React.FC<CarouselStudioProps> = ({ initialContent }) => {
    const location = useLocation();
    const { language } = useUser();

    // Initialize state from props (priority) or navigation state
    const [source, setSource] = useState(
        initialContent || location.state?.initialSource ||
            localStorage.getItem("kolink_carousel_source") || "",
    );
    const [sourceType, setSourceType] = useState<SourceType>("text");
    const [loading, setLoading] = useState(false);
    const [carouselData, setCarouselData] = useState<any>(() => {
        const saved = localStorage.getItem("kolink_carousel_data");
        try {
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        localStorage.setItem("kolink_carousel_source", source);
    }, [source]);

    useEffect(() => {
        localStorage.setItem("kolink_carousel_sourceType", sourceType);
    }, [sourceType]);

    useEffect(() => {
        if (carouselData) {
            localStorage.setItem(
                "kolink_carousel_data",
                JSON.stringify(carouselData),
            );
        } else {
            localStorage.removeItem("kolink_carousel_data");
        }
    }, [carouselData]);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke(
                "generate-carousel",
                {
                    body: { source, sourceType, language },
                },
            );

            if (error) throw error;
            setCarouselData(data);
        } catch (err: any) {
            console.error("Error generating carousel:", err);
            let errorMessage = "Hubo un error generando el carrusel.";

            if (err && typeof err === "object") {
                if ("message" in err) {
                    errorMessage = `Error: ${err.message}`;
                } else {
                    errorMessage = `Error: ${JSON.stringify(err)}`;
                }
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (carouselData) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <CarouselEditor
                    initialData={carouselData}
                    onSave={(updated) => console.log("Save as PDF", updated)}
                    onReset={() => setCarouselData(null)}
                />
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] relative overflow-hidden px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                        Crea{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Carruseles de Élite
                        </span>{" "}
                        en segundos
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Los carruseles son el formato con mayor{" "}
                        <strong>impacto y retención</strong>{" "}
                        en LinkedIn. Acompañar tus posts con contenido visual
                        deslizable multiplica el tiempo de lectura y dispara el
                        engagement. Convierte cualquier idea, enlace o video en
                        una narrativa visual irresistible en segundos.
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] p-6 border border-slate-200 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
                    {/* Source Type Selection Removed - Text Only Mode */}
                    <div className="hidden">
                        {(["text"] as SourceType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setSourceType(type)}
                                className="hidden"
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-400 ml-2 uppercase tracking-widest">
                            Tu Idea o Borrador
                        </label>
                        <div className="relative group">
                            <textarea
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                placeholder="Pega aquí el texto que quieres transformar en un carrusel viral..."
                                rows={8}
                                className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all group-hover:border-slate-300 resize-none text-base"
                            />
                        </div>
                    </div>

                    {loading && (
                        <div className="mt-8 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                            <LoadingProgress
                                steps={[
                                    "Gemini analizando fuente original...",
                                    "Google Search Grounding activa...",
                                    "Deconstrucción de contenido...",
                                    "Diseñando estructura de slides...",
                                    "Arquitectando Carrusel de Élite...",
                                    "Finalizando narrativa visual...",
                                ]}
                                duration={20000} // Increased duration for deeper analysis
                            />
                        </div>
                    )}

                    <div className="relative pt-2">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !source}
                            className={`w-full text-white rounded-2xl py-4 font-black text-lg transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-4 group mt-4
                                ${
                                loading
                                    ? "bg-slate-400 cursor-not-allowed"
                                    : "bg-slate-900 hover:bg-black hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
                            }`}
                        >
                            {loading
                                ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <Sparkles className="w-6 h-6 animate-pulse" />
                                        <span>Orquestando IA...</span>
                                    </div>
                                )
                                : (
                                    <>
                                        <span>
                                            Generar Carrusel de Alto Impacto
                                        </span>
                                        <svg
                                            className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                            />
                                        </svg>
                                    </>
                                )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarouselStudio;
