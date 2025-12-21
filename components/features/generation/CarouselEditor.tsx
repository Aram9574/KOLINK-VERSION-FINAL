import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { exportCarouselToPDF } from "../../../utils/PDFExporter";
import { CAROUSEL_TEMPLATES, CarouselTemplate } from "./templates";
import { TemplateSelector } from "./TemplateSelector";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

interface Slide {
    number: number;
    title: string;
    content: string;
}

interface CarouselConfig {
    slides_count: number;
    tone: string;
    analysis?: string;
}

interface CarouselData {
    carousel_config: CarouselConfig;
    slides: Slide[];
}

interface CarouselEditorProps {
    initialData: CarouselData;
    onSave?: (data: CarouselData) => void;
    onReset?: () => void;
}

export const CarouselEditor: React.FC<CarouselEditorProps> = (
    { initialData, onSave, onReset },
) => {
    const [data, setData] = useState<CarouselData>(initialData);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [brandSettings, setBrandSettings] = useState<any>(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
        "executive-minimal",
    );
    const [isHighRes, setIsHighRes] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const [aspectRatio, setAspectRatio] = useState<
        "4/5" | "1/1" | "16/9" | "9/16"
    >(
        "4/5",
    );

    useEffect(() => {
        fetchBrandSettings();
    }, []);

    const fetchBrandSettings = async () => {
        const { data: profile } = await supabase.from("profiles").select(
            "brand_settings",
        ).maybeSingle();
        if (profile?.brand_settings) {
            setBrandSettings(profile.brand_settings);
        }
    };

    const handleSlideChange = (field: keyof Slide, value: string) => {
        const newSlides = [...data.slides];
        newSlides[currentSlideIndex] = {
            ...newSlides[currentSlideIndex],
            [field]: value,
        };
        setData({ ...data, slides: newSlides });
    };

    const currentSlide = data.slides[currentSlideIndex];
    const template =
        CAROUSEL_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
        CAROUSEL_TEMPLATES[0];

    // Helper to render a slide with the current template
    const renderSlide = (slide: Slide, isPreview = false) => {
        if (!slide) return null;

        const scale = isPreview ? 1 : 2.5; // Scale for export vs preview container size approximation

        const aspectClasses = {
            "4/5": "aspect-[4/5]",
            "1/1": "aspect-square",
            "16/9": "aspect-video",
        };

        const containerDimensions: Record<
            string,
            string | { width: string; height: string }
        > = {
            "4/5": isPreview
                ? "w-full max-w-[540px]"
                : { width: "1080px", height: "1350px" },
            "1/1": isPreview
                ? "w-full max-w-[540px]"
                : { width: "1080px", height: "1080px" },
            "16/9": isPreview
                ? "w-full max-w-[540px]"
                : { width: "1920px", height: "1080px" },
            "9/16": isPreview
                ? "w-full max-w-[420px]"
                : { width: "1080px", height: "1920px" },
        };

        const currentDims = containerDimensions[aspectRatio];
        const isObjectDims = typeof currentDims === "object";

        return (
            <div
                className={`slide-canvas ${
                    aspectClasses[aspectRatio]
                } flex flex-col transition-all duration-500 overflow-hidden relative ${template.styles.container} ${
                    isPreview
                        ? `${currentDims} rounded-xl shadow-2xl p-12`
                        : `p-24`
                }`}
                style={{
                    width: isObjectDims ? currentDims.width : undefined,
                    height: isObjectDims ? currentDims.height : undefined,
                    aspectRatio: isPreview
                        ? aspectRatio.replace("/", " / ")
                        : undefined,
                }}
            >
                {template.elements?.showDecorativeShapes && (
                    <div className={template.elements.shapeStyle} />
                )}

                <div className={`relative z-10 flex flex-col h-full`}>
                    {/* Header / Logo Area */}
                    {(brandSettings?.logo_url ||
                        template.styles.logoContainer) && (
                        <div className={template.styles.logoContainer}>
                            {brandSettings?.logo_url
                                ? (
                                    <img
                                        src={brandSettings.logo_url}
                                        alt="Logo"
                                        className={`object-contain ${
                                            isPreview
                                                ? "w-12 h-12"
                                                : "w-32 h-32"
                                        }`}
                                    />
                                )
                                : <div className="opacity-0">Logo Space</div>}
                        </div>
                    )}

                    <h2 className={`shrink-0 ${template.styles.title}`}>
                        {slide.title}
                    </h2>

                    <div className="flex-1 min-h-0 flex flex-col justify-center gap-6 overflow-hidden">
                        <div className="overflow-y-auto custom-scrollbar pr-2">
                            <p className={template.styles.content}>
                                {slide.content}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`shrink-0 mt-8 flex justify-between items-center relative z-20 ${template.styles.footer}`}
                    >
                        <span className={template.styles.companyName}>
                            {brandSettings?.company_name || "Kolink"}
                        </span>

                        {template.elements?.showProgressBar && (
                            <div
                                className={`flex-1 mx-4 h-1 bg-current opacity-20 rounded-full ${
                                    isPreview ? "mx-2" : "mx-8"
                                }`}
                            >
                                <div
                                    className="h-full bg-current opacity-100 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${
                                            ((slide.number) /
                                                data.slides.length) * 100
                                        }%`,
                                    }}
                                />
                            </div>
                        )}

                        <span className={template.styles.slideNumber}>
                            {slide.number}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const handleExportZIP = async () => {
        setIsExporting(true);
        try {
            const zip = new JSZip();
            const container = document.getElementById("carousel-preview-area");

            if (!container) return;

            // Process each slide
            // We need to render them one by one or capture the hidden container elements
            const slideElements = container.children;

            for (let i = 0; i < slideElements.length; i++) {
                const element = slideElements[i] as HTMLElement;
                const scale = isHighRes ? 4 : 2; // Higher quality for images

                const canvas = await html2canvas(element, {
                    scale: scale,
                    useCORS: true,
                    backgroundColor: null, // Transparent if template allows, otherwise theme bg
                    logging: false,
                });

                const blob = await new Promise<Blob | null>((resolve) =>
                    canvas.toBlob(resolve, "image/png")
                );

                if (blob) {
                    zip.file(`slide-${i + 1}.png`, blob);
                }
            }

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `carousel-images-${Date.now()}.zip`);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to create ZIP. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleShareLinkedIn = () => {
        // Since direct upload requires API, we encourage downloading PDF first
        // But requested was "share directly", so we direct to feed
        // In a real app with API v2, this would register a share.
        // For now, open LinkedIn feed in new tab
        const width = 600;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        window.open(
            "https://www.linkedin.com/feed/?shareActive=true",
            "LinkedInShare",
            `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`,
        );
    };

    return (
        <div className="carousel-editor-container bg-slate-50 min-h-[500px] rounded-[2rem] overflow-hidden border border-slate-200/60 flex flex-col lg:flex-row shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)]">
            {/* Main Preview Area */}
            <div className="flex-1 p-4 lg:p-8 flex flex-col items-center justify-center relative bg-white">
                <div className="w-full max-w-2xl flex flex-col items-center gap-6">
                    {/* Template Quick Switcher (at top of preview for easy access) */}
                    <div className="w-full mb-2">
                        <TemplateSelector
                            selectedTemplateId={selectedTemplateId}
                            onSelect={setSelectedTemplateId}
                        />
                    </div>

                    <div className="relative group/preview transition-all duration-700 hover:scale-[1.01]">
                        <div className="absolute -inset-4 bg-blue-500/5 rounded-[2rem] blur-2xl opacity-0 group-hover/preview:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10 transition-shadow duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] rounded-xl">
                            {currentSlide
                                ? renderSlide(currentSlide, true)
                                : (
                                    <div className="flex items-center justify-center p-20 text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                        No slide selected
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Iconic Navigation */}
                    <div className="flex items-center gap-6 bg-white px-6 py-2 rounded-xl border border-slate-200 shadow-sm transition-all duration-300">
                        <button
                            onClick={() =>
                                setCurrentSlideIndex((prev) =>
                                    Math.max(0, prev - 1)
                                )}
                            disabled={currentSlideIndex === 0}
                            className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-20 transition-all group/btn"
                        >
                            <svg
                                className="w-6 h-6 text-slate-600 group-hover/btn:-translate-x-0.5 transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        <div className="flex flex-col items-center min-w-[80px]">
                            <span className="text-sm font-black text-slate-900">
                                Slide {currentSlideIndex + 1}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                de {data.slides.length}
                            </span>
                        </div>

                        <button
                            onClick={() =>
                                setCurrentSlideIndex((prev) =>
                                    Math.min(data.slides.length - 1, prev + 1)
                                )}
                            disabled={currentSlideIndex ===
                                data.slides.length - 1}
                            className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-20 transition-all group/btn"
                        >
                            <svg
                                className="w-6 h-6 text-slate-600 group-hover/btn:translate-x-0.5 transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Editing Sidebar */}
            <div className="w-full lg:w-[400px] bg-white border-l border-slate-200 flex flex-col p-6 lg:p-8 space-y-6 shadow-[-12px_0_24px_-12px_rgba(0,0,0,0.03)] relative z-20 overflow-y-auto">
                <div>
                    <h2 className="text-lg font-black text-slate-900 mb-1">
                        Configuración y Contenido
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        Optimiza el formato y contenido para LinkedIn.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Aspect Ratio Selector */}
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">
                            Proporciones (Aspect Ratio)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(["4/5", "9/16", "1/1", "16/9"] as const).map((
                                ratio,
                            ) => (
                                <button
                                    key={ratio}
                                    onClick={() => setAspectRatio(ratio)}
                                    className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                                        aspectRatio === ratio
                                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30"
                                            : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                                    }`}
                                >
                                    {ratio === "4/5" && "Portrait"}
                                    {ratio === "9/16" && "Tall"}
                                    {ratio === "1/1" && "Square"}
                                    {ratio === "16/9" && "Landsc."}
                                </button>
                            ))}
                        </div>
                    </div>

                    {currentSlide && (
                        <>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">
                                    Título de Slide
                                </label>
                                <input
                                    type="text"
                                    value={currentSlide.title}
                                    onChange={(e) =>
                                        handleSlideChange(
                                            "title",
                                            e.target.value,
                                        )}
                                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">
                                    Contenido Principal
                                </label>
                                <textarea
                                    rows={5}
                                    value={currentSlide.content}
                                    onChange={(e) =>
                                        handleSlideChange(
                                            "content",
                                            e.target.value,
                                        )}
                                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed text-sm"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-6">
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900">
                                Alta Resolución
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                4x Render Scale
                            </span>
                        </div>
                        <button
                            onClick={() => setIsHighRes(!isHighRes)}
                            className={`w-14 h-7 rounded-full transition-all duration-500 relative flex items-center px-1 ${
                                isHighRes ? "bg-blue-600" : "bg-slate-300"
                            }`}
                        >
                            <div
                                className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-500 ${
                                    isHighRes ? "ml-7" : "ml-0"
                                }`}
                            />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleExportZIP}
                            disabled={isExporting}
                            className="col-span-1 bg-white hover:bg-slate-50 text-slate-700 rounded-xl py-3 font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-slate-200 shadow-sm"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            PNG (ZIP)
                        </button>

                        <button
                            onClick={handleShareLinkedIn}
                            className="col-span-1 bg-[#0077b5] hover:bg-[#006399] text-white rounded-xl py-3 font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            Compartir
                        </button>

                        <button
                            onClick={async () => {
                                await exportCarouselToPDF(
                                    "carousel-preview-area",
                                    `carrusel-${Date.now()}.pdf`,
                                );
                                onSave?.(data);
                            }}
                            className="col-span-2 bg-slate-900 text-white rounded-xl py-4 font-black text-xs uppercase tracking-[0.15em] transition-all active:scale-[0.98] flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-blue-500/10"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                            Exportar PDF Premium
                        </button>

                        <button
                            onClick={onReset}
                            className="col-span-2 bg-white text-slate-500 hover:text-blue-600 rounded-xl py-3 font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-200 mt-2"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Crear otro carrusel
                        </button>
                    </div>
                </div>
            </div>

            {/* Hidden export container */}
            <div
                id="carousel-preview-area"
                className="fixed left-[-9999px] top-[-9999px]"
            >
                {data.slides.map((slide, idx) => (
                    <React.Fragment key={idx}>
                        {renderSlide(slide, false)}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CarouselEditor;
