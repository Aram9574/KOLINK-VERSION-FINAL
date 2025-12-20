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
}

export const CarouselEditor: React.FC<CarouselEditorProps> = (
    { initialData, onSave },
) => {
    const [data, setData] = useState<CarouselData>(initialData);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [brandSettings, setBrandSettings] = useState<any>(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
        "executive-minimal",
    );
    const [isHighRes, setIsHighRes] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        fetchBrandSettings();
    }, []);

    const fetchBrandSettings = async () => {
        const { data: profile } = await supabase.from("profiles").select(
            "brand_settings",
        ).single();
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
        const scale = isPreview ? 1 : 2.5; // Scale for export vs preview container size approximation

        return (
            <div
                className={`slide-canvas aspect-[4/5] flex flex-col transition-all duration-500 overflow-hidden relative ${template.styles.container} ${
                    isPreview
                        ? "w-full max-w-md rounded-xl shadow-2xl p-12"
                        : "w-[1080px] h-[1350px] p-24"
                }`}
                style={{
                    // Allow override if brand settings dictate, but for templates usually we strictly follow the theme
                    // We can hybridize: use template Structure but Brand Colors if "Custom" mode.
                    // For now, template styles rule, but we might inject brand logo.
                    // Note: Some templates might ignore inline styles if using complex Tailwind classes.
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

    return (
        <div className="carousel-editor-container bg-slate-50 min-h-[85vh] rounded-[2.5rem] overflow-hidden border border-slate-200/60 flex flex-col lg:flex-row shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)]">
            {/* Main Preview Area */}
            <div className="flex-1 p-8 lg:p-12 flex flex-col items-center justify-center relative bg-white">
                <div className="w-full max-w-2xl flex flex-col items-center gap-10">
                    {/* Template Quick Switcher (at top of preview for easy access) */}
                    <div className="w-full mb-4">
                        <TemplateSelector
                            selectedTemplateId={selectedTemplateId}
                            onSelect={setSelectedTemplateId}
                        />
                    </div>

                    <div className="relative group/preview transition-all duration-700 hover:scale-[1.01]">
                        <div className="absolute -inset-4 bg-blue-500/5 rounded-[2rem] blur-2xl opacity-0 group-hover/preview:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10 transition-shadow duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] rounded-xl">
                            {renderSlide(currentSlide, true)}
                        </div>
                    </div>

                    {/* Iconic Navigation */}
                    <div className="flex items-center gap-8 bg-white px-8 py-4 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300">
                        <button
                            onClick={() =>
                                setCurrentSlideIndex((prev) =>
                                    Math.max(0, prev - 1)
                                )}
                            disabled={currentSlideIndex === 0}
                            className="p-3 rounded-xl hover:bg-slate-100 disabled:opacity-20 transition-all group/btn"
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
                            className="p-3 rounded-xl hover:bg-slate-100 disabled:opacity-20 transition-all group/btn"
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
            <div className="w-full lg:w-[420px] bg-white border-l border-slate-200 flex flex-col p-8 lg:p-10 space-y-10 shadow-[-12px_0_24px_-12px_rgba(0,0,0,0.03)] relative z-20 overflow-y-auto">
                <div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">
                        Contenido de Slide
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                        Refina el texto para maximizar el engagement viral.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">
                            Título de Slide
                        </label>
                        <input
                            type="text"
                            value={currentSlide.title}
                            onChange={(e) =>
                                handleSlideChange("title", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">
                            Contenido Principal
                        </label>
                        <textarea
                            rows={8}
                            value={currentSlide.content}
                            onChange={(e) =>
                                handleSlideChange("content", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-6 py-5 text-slate-900 font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed"
                        />
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 space-y-8">
                    <div className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100">
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

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={handleExportZIP}
                            disabled={isExporting}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl py-4.5 font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 border border-slate-200"
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
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            {isExporting
                                ? "Procesando..."
                                : "Descargar PNGs (ZIP)"}
                        </button>

                        <button
                            onClick={async () => {
                                await exportCarouselToPDF(
                                    "carousel-preview-area",
                                    `carrusel-${Date.now()}.pdf`,
                                );
                                onSave?.(data);
                            }}
                            className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black text-sm uppercase tracking-[0.15em] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
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
                    </div>
                </div>
            </div>

            {/* Hidden export container */}
            <div
                id="carousel-preview-area"
                className="fixed left-[-9999px] top-[-9999px]"
            >
                {data.slides.map((slide, idx) => (
                    <div key={idx}>{renderSlide(slide, false)}</div>
                ))}
            </div>
        </div>
    );
};

export default CarouselEditor;
