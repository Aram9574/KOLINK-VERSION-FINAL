import React, { useState } from "react";
import { CarouselEditor } from "./CarouselEditor";
import { supabase } from "../../../services/supabaseClient";
import { useLocation } from "react-router-dom";

type SourceType = "url" | "youtube" | "text";

interface CarouselStudioProps {
    initialContent?: string;
}

const CarouselStudio: React.FC<CarouselStudioProps> = ({ initialContent }) => {
    const location = useLocation();

    // Initialize state from props (priority) or navigation state
    const [source, setSource] = useState(
        initialContent || location.state?.initialSource || "",
    );
    const [sourceType, setSourceType] = useState<SourceType>(
        (initialContent ? "text" : location.state?.initialType) || "url",
    );
    const [loading, setLoading] = useState(false);
    const [carouselData, setCarouselData] = useState<any>(null);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke(
                "generate-carousel",
                {
                    body: { source, sourceType },
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
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                        Editor de Carrusel
                    </h1>
                    <button
                        onClick={() => setCarouselData(null)}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-all"
                    >
                        <span>← Volver al Inicio</span>
                    </button>
                </div>
                <CarouselEditor
                    initialData={carouselData}
                    onSave={(updated) => console.log("Save as PDF", updated)}
                />
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] relative overflow-hidden px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-16 relative z-10">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold tracking-wide uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75">
                            </span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500">
                            </span>
                        </span>
                        Inteligencia Artificial Avanzada
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                        Crea{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Carruseles de Élite
                        </span>{" "}
                        en segundos
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Nuestra IA analiza tu estilo, clona tu voz y estructura
                        ganchos virales utilizando arquitectura RAG y
                        razonamiento CoT para dominar el feed de LinkedIn.
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 space-y-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-300">
                    <div className="flex justify-center">
                        <div className="inline-flex p-1.5 bg-white rounded-2xl border border-slate-200 relative">
                            {(["url", "youtube", "text"] as SourceType[]).map((
                                type,
                            ) => {
                                const isActive = sourceType === type;
                                return (
                                    <button
                                        key={type}
                                        onClick={() => setSourceType(type)}
                                        className={`relative z-10 px-8 py-3 rounded-xl font-bold transition-all duration-500 whitespace-nowrap ${
                                            isActive
                                                ? "text-blue-600 bg-white shadow-sm"
                                                : "text-slate-400 hover:text-slate-900"
                                        }`}
                                    >
                                        <span className="relative">
                                            {type === "url"
                                                ? "🔗 URL"
                                                : type === "youtube"
                                                ? "🎬 YouTube"
                                                : "✍️ Texto"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-400 ml-2 uppercase tracking-widest">
                            {sourceType === "url"
                                ? "Fuente del Contenido"
                                : sourceType === "youtube"
                                ? "Identificación del Video"
                                : "Contenido Original"}
                        </label>
                        <div className="relative group">
                            {sourceType === "text"
                                ? (
                                    <textarea
                                        value={source}
                                        onChange={(e) =>
                                            setSource(e.target.value)}
                                        placeholder="Pega aquí el texto que quieres transformar en un carrusel viral..."
                                        rows={8}
                                        className="w-full bg-white border border-slate-200 rounded-3xl px-8 py-6 text-slate-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all group-hover:border-slate-300 resize-none text-lg"
                                    />
                                )
                                : (
                                    <input
                                        type="text"
                                        value={source}
                                        onChange={(e) =>
                                            setSource(e.target.value)}
                                        placeholder={sourceType === "url"
                                            ? "https://tuweb.com/articulo-interesante"
                                            : "https://youtube.com/watch?v=..."}
                                        className="w-full bg-white border border-slate-200 rounded-3xl px-8 py-6 text-slate-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all group-hover:border-slate-300 text-lg"
                                    />
                                )}
                        </div>
                    </div>

                    <div className="relative pt-2">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !source}
                            className="w-full bg-slate-900 text-white rounded-[2rem] py-6 font-black text-xl hover:bg-black hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-4 group"
                        >
                            {loading
                                ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
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
                        <p className="text-center text-slate-400 text-sm mt-4 font-medium">
                            Consumo: 1 Crédito Premium por generación completa.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarouselStudio;
