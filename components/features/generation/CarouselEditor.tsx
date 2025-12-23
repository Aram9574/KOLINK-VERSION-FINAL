import React, { useEffect, useState } from "react";
import {
    Bold as BoldIcon,
    Code,
    Download,
    Eraser,
    EyeOff,
    FileImage,
    Italic as ItalicIcon,
    Layout,
    Maximize2,
    Minus,
    Moon,
    MoreHorizontal,
    Music,
    Palette,
    Plus,
    Redo,
    RefreshCw,
    RotateCcw,
    Save,
    Send,
    Settings,
    Settings2,
    Smartphone,
    Sparkles,
    Strikethrough,
    Sun,
    Trash2,
    Type,
    Underline,
    Undo,
} from "lucide-react";
import {
    clearUnicodeFormatting,
    convertToUnicode,
} from "../../../utils/unicode";
import { toast } from "sonner";
import { supabase } from "../../../services/supabaseClient";
import { useUser } from "../../../context/UserContext";
import { exportCarouselToPDF } from "../../../utils/PDFExporter";
import { CAROUSEL_TEMPLATES } from "./templates";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas-pro";
import LoadingProgress from "../../ui/LoadingProgress";

interface Slide {
    number: number;
    title: string;
    content: string;
    image?: string;
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
    initialSettings?: any;
    onSave?: (data: CarouselData, settings: any) => void;
    onReset?: () => void;
}

// History State Interface
interface HistoryState {
    past: CarouselData[];
    present: CarouselData;
    future: CarouselData[];
}

export const CarouselEditor: React.FC<CarouselEditorProps> = (
    { initialData, initialSettings, onSave, onReset },
) => {
    const { language } = useUser();
    const [data, setData] = useState<CarouselData>(initialData);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [brandSettings, setBrandSettings] = useState<any>(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState(
        "executive-minimal",
    );
    const [activeTab, setActiveTab] = useState<
        "content" | "settings" | "theme" | "source"
    >(() => {
        const isDefault = initialData.slides.length === 1 &&
            initialData.slides[0].title === "Nuevo Carrusel";
        return isDefault ? "source" : "content";
    });
    const [isHighRes, setIsHighRes] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const [aspectRatio, setAspectRatio] = useState<
        "4/5" | "1/1" | "16/9" | "9/16"
    >("4/5");

    // New Settings State
    const [settings, setSettings] = useState(() => {
        const defaults = {
            titleFont: "Inter",
            titleWeight: "Bold",
            titleFontSize: 80,
            bodyFont: "Inter",
            bodyWeight: "Regular",
            bodyFontSize: 40,
            showHeadshot: true,
            showName: true,
            authorName: "",
            showHandle: true,
            linkedinHandle: "",
            showSlideNumber: true,
        };
        return { ...defaults, ...initialSettings };
    });
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [generationConfig, setGenerationConfig] = useState({
        sourceText: "",
        tone: initialData.carousel_config.tone || "Professional",
        audience: "",
    });

    // History Management
    const [history, setHistory] = useState<HistoryState>({
        past: [],
        present: initialData,
        future: [],
    });

    // Function to update data with history tracking
    const updateDataWithHistory = (newData: CarouselData) => {
        setHistory((curr) => {
            const newPast = [...curr.past, curr.present];
            // Limit history to 20 steps to prevent memory issues
            if (newPast.length > 20) newPast.shift();

            return {
                past: newPast,
                present: newData,
                future: [],
            };
        });
        setData(newData);
    };

    const handleUndo = () => {
        setHistory((curr) => {
            if (curr.past.length === 0) return curr;

            const previous = curr.past[curr.past.length - 1];
            const newPast = curr.past.slice(0, curr.past.length - 1);

            setData(previous); // Sync local state

            return {
                past: newPast,
                present: previous,
                future: [curr.present, ...curr.future],
            };
        });
    };

    const handleRedo = () => {
        setHistory((curr) => {
            if (curr.future.length === 0) return curr;

            const next = curr.future[0];
            const newFuture = curr.future.slice(1);

            setData(next); // Sync local state

            return {
                past: [...curr.past, curr.present],
                present: next,
                future: newFuture,
            };
        });
    };

    // Keyboard Shortcuts for Undo/Redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "z") {
                if (e.shiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Inject Google Fonts
    useEffect(() => {
        const link = document.createElement("link");
        link.href =
            "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;800&family=Lato:wght@300;400;700&family=Lora:wght@400;500;600;700&family=Merriweather:wght@300;400;700&family=Montserrat:wght@300;400;500;600;700&family=Nunito:wght@300;400;600;700&family=Open+Sans:wght@300;400;600;700&family=Oswald:wght@300;400;500;700&family=Playfair+Display:wght@400;500;700&family=Poppins:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, []);

    useEffect(() => {
        fetchBrandSettings();
    }, []);

    const [isInitialized, setIsInitialized] = useState(false);

    // Persistence: Save state to localStorage
    useEffect(() => {
        if (!isInitialized) return;

        if (data) {
            localStorage.setItem("kolink_v2_editor_data", JSON.stringify(data));
        }
        if (generationConfig) {
            localStorage.setItem(
                "kolink_v2_editor_config",
                JSON.stringify(generationConfig),
            );
        }
        if (settings) {
            localStorage.setItem(
                "kolink_v2_editor_settings",
                JSON.stringify(settings),
            );
        }
        if (selectedTemplateId) {
            localStorage.setItem(
                "kolink_v2_editor_template",
                selectedTemplateId,
            );
        }
        if (activeTab) {
            localStorage.setItem("kolink_v2_editor_tab", activeTab);
        }
    }, [
        data,
        generationConfig,
        settings,
        selectedTemplateId,
        activeTab,
        isInitialized,
    ]);

    // Hydration: Load from localStorage or use initialData
    useEffect(() => {
        const autosaveData = localStorage.getItem("kolink_v2_editor_data");
        const autosaveConfig = localStorage.getItem("kolink_v2_editor_config");
        const autosaveSettings = localStorage.getItem(
            "kolink_v2_editor_settings",
        );
        const autosaveTemplate = localStorage.getItem(
            "kolink_v2_editor_template",
        );
        const autosaveTab = localStorage.getItem("kolink_v2_editor_tab");

        const isDefault = initialData.slides.length === 0 ||
            (initialData.slides.length === 1 &&
                initialData.slides[0].title === "Nuevo Carrusel");

        if (isDefault) {
            // Priority 1: Restore from Auto-Save if available
            if (autosaveData) {
                try {
                    setData(JSON.parse(autosaveData));
                    if (autosaveConfig) {
                        setGenerationConfig(JSON.parse(autosaveConfig));
                    }
                    if (autosaveSettings) {
                        setSettings(JSON.parse(autosaveSettings));
                    }
                    if (autosaveTemplate) {
                        setSelectedTemplateId(autosaveTemplate);
                    }
                    if (autosaveTab) {
                        setActiveTab(autosaveTab as any);
                    }
                    // Silently restored - no toast per user request
                } catch (e) {
                    console.error("Error restoring draft:", e);
                    setData(initialData);
                }
            } else {
                // Priority 2: Use Default Initial Data
                setData(initialData);
                setActiveTab("source");
                setGenerationConfig({
                    sourceText: "",
                    tone: "Professional",
                    audience: "",
                });
                setSettings({
                    titleFont: "Inter",
                    titleWeight: "Bold",
                    titleFontSize: 80,
                    bodyFont: "Inter",
                    bodyWeight: "Regular",
                    bodyFontSize: 40,
                    showHeadshot: true,
                    showName: true,
                    authorName: brandSettings?.company_name || "",
                    showHandle: true,
                    linkedinHandle: brandSettings?.linkedin_handle || "",
                    showSlideNumber: true,
                });
            }
        } else {
            // Priority 3: Use Incoming non-default ID (e.g. from DB)
            // This overwrites local autosave if the user explicitly opened a saved draft
            setData(initialData);
        }
        setIsInitialized(true);
    }, [initialData, brandSettings]);

    useEffect(() => {
        if (initialSettings && Object.keys(initialSettings).length > 0) {
            setSettings((prev) => ({ ...prev, ...initialSettings }));
        }
    }, [initialSettings]);

    const [lastFocusedField, setLastFocusedField] = useState<
        {
            index: number;
            field: "title" | "content";
            selectionStart: number;
            selectionEnd: number;
        } | null
    >(null);

    const updateSlide = (
        index: number,
        field: "title" | "content",
        value: string,
    ) => {
        const newSlides = [...data.slides];
        newSlides[index] = {
            ...newSlides[index],
            [field]: value,
        };
        const newData = { ...data, slides: newSlides };
        // We use typical debounce or check if it's a "significant" change?
        // For now, simpler: Use direct setData for typing, but `onBlur` or checking logic for history?
        // Actually, for simplicity and ensuring Undo works for content edits:
        // Let's rely on standard setData for typing to avoid lag,
        // BUT we need a way to capture "snapshots".
        // A common pattern is to save to history ONLY IF enough time passed or on specific actions.
        // For buttons (formatting), we ALWAYS save.
        // For typing, we'll implement a debounced saver later if requested.
        // For now, let's keep `updateSlide` using `setData` directly for performance,
        // BUT we need `handleFormat` to use `updateDataWithHistory`.
        setData(newData);

        // Update history 'present' without pushing to past (to keep it in sync for next undo)
        // This is tricky. If we don't push to past, we can't undo typos.
        // Let's push to history for now and optimize if laggy.
        // updateDataWithHistory(newData);
        // NO, typing every char into history is bad.
        // Let's stick `setData` here, and sync `present` in history silently?
    };

    // Sync `history.present` when `data` changes normally?
    // No, that would break the undo chain.
    // Solution: `handleFormat` calls `updateDataWithHistory`.
    // `updateSlide` (typing) calls `setData`.
    // We need `onBlur` on textareas to save state to history!

    const handleBlurSave = () => {
        updateDataWithHistory(data);
    };

    const handleFormat = (
        type: "bold" | "italic" | "strike" | "underline" | "code",
    ) => {
        if (!lastFocusedField) {
            toast.error(
                language === "es"
                    ? "Haz clic en un texto primero"
                    : "Click on a text first",
            );
            return;
        }

        const { index, field, selectionStart, selectionEnd } = lastFocusedField;
        const currentText = data.slides[index][field];
        const selectedText = currentText.substring(
            selectionStart,
            selectionEnd,
        );

        if (!selectedText) {
            toast.error(
                language === "es"
                    ? "Selecciona texto primero"
                    : "Select text first",
            );
            return;
        }

        const formattedText = convertToUnicode(selectedText, type);
        const newText = currentText.substring(0, selectionStart) +
            formattedText +
            currentText.substring(selectionEnd);

        const newSlides = [...data.slides];
        newSlides[index] = {
            ...newSlides[index],
            [field]: newText,
        };
        const newData = { ...data, slides: newSlides };

        updateDataWithHistory(newData);
    };

    const handleClearFormatting = () => {
        if (!lastFocusedField) return;
        const { index, field } = lastFocusedField;
        const currentText = data.slides[index][field];
        updateSlide(index, field, clearUnicodeFormatting(currentText));
    };

    const FormatToolbar = () => (
        <div className="flex items-center gap-1 mb-2 p-1 bg-slate-50 rounded-lg border border-slate-100">
            <button
                onClick={() => handleFormat("bold")}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all"
                title="Negrita"
            >
                <BoldIcon className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => handleFormat("italic")}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all"
                title="Cursiva"
            >
                <ItalicIcon className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => handleFormat("strike")}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all"
                title="Tachado"
            >
                <Strikethrough className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => handleFormat("underline")}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all"
                title="Subrayado"
            >
                <Underline className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => handleFormat("code")}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all"
                title="Monoespaciado"
            >
                <Code className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button
                onClick={handleClearFormatting}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-400 transition-all"
                title="Limpiar formato"
            >
                <Type className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button
                onClick={handleUndo}
                className={`p-1.5 hover:bg-white hover:shadow-sm rounded transition-all ${
                    history.past.length === 0
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-600"
                }`}
                title="Deshacer (Ctrl+Z)"
                disabled={history.past.length === 0}
            >
                <Undo className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={handleRedo}
                className={`p-1.5 hover:bg-white hover:shadow-sm rounded transition-all ${
                    history.future.length === 0
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-600"
                }`}
                title="Rehacer (Ctrl+Shift+Z)"
                disabled={history.future.length === 0}
            >
                <Redo className="w-3.5 h-3.5" />
            </button>
        </div>
    );

    const handleGenerate = async () => {
        if (!generationConfig.sourceText) return;
        setIsGenerating(true);
        try {
            // Get language from context

            const { data: newData, error } = await supabase.functions.invoke(
                "generate-carousel",
                {
                    body: {
                        source: generationConfig.sourceText,
                        sourceType: "text", // Forced for now
                        language,
                        tone: generationConfig.tone,
                        audience: generationConfig.audience,
                    },
                },
            );

            if (error) throw error;

            // Post-processing: remove all ** used for bolding
            const cleanSlides = newData.slides.map((slide: any) => ({
                ...slide,
                title: slide.title?.replace(/\*\*/g, "") || "",
                content: slide.content?.replace(/\*\*/g, "") || "",
            }));
            const cleanData = { ...newData, slides: cleanSlides };

            setData(cleanData);
            setActiveTab("content");
        } catch (err: any) {
            console.error("Error generating carousel:", err);
            alert(
                "Error generando el carrusel: " +
                    (err.message || "Desconocido"),
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const fetchBrandSettings = async () => {
        const { data: profile } = await supabase.from("profiles").select(
            "brand_settings, avatar_url",
        ).maybeSingle();

        if (profile) {
            if (profile.brand_settings) {
                setBrandSettings(profile.brand_settings);
            }
            if (profile.avatar_url) {
                setAvatarUrl(profile.avatar_url);
            }

            // Initialize settings with brand data
            setSettings((prev) => ({
                ...prev,
                authorName: profile.brand_settings?.company_name || "",
                linkedinHandle: profile.brand_settings?.linkedin_handle || "",
                showHeadshot:
                    !!(profile.avatar_url || profile.brand_settings?.logo_url),
            }));
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

    const renderSlide = (slide: Slide, isPreview = false) => {
        if (!slide) return null;

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
                ? "h-full w-auto"
                : { width: "1080px", height: "1350px" },
            "1/1": isPreview
                ? "h-full w-auto"
                : { width: "1080px", height: "1080px" },
            "16/9": isPreview
                ? "h-full w-auto"
                : { width: "1920px", height: "1080px" },
            "9/16": isPreview
                ? "h-full w-auto"
                : { width: "1080px", height: "1920px" },
        };

        const currentDims = containerDimensions[aspectRatio];
        const isObjectDims = typeof currentDims === "object";

        // Font Map for weight numeric conversion if needed, but standard names often work with CSS if valid
        const getFontWeight = (weight: string) => {
            switch (weight) {
                case "Light":
                    return 300;
                case "Regular":
                    return 400;
                case "Medium":
                    return 500;
                case "Bold":
                    return 700;
                case "Extra Bold":
                    return 800;
                default:
                    return 400;
            }
        };

        const getFontSizeScale = (size: string) => {
            if (isPreview) {
                switch (size) {
                    case "Small":
                        return 0.8;
                    case "Medium":
                        return 1;
                    case "Large":
                        return 1.2;
                    default:
                        return 1;
                }
            }
            switch (size) {
                case "Small":
                    return "0.875rem";
                case "Medium":
                    return "1rem";
                case "Large":
                    return "1.25rem";
                default:
                    return "1rem";
            }
        };

        const fontScale = isPreview ? 0.45 : 1;

        const headshotSrc = settings.showHeadshot
            ? (avatarUrl || brandSettings?.logo_url)
            : null;

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
                    fontFamily: settings.bodyFont,
                }}
            >
                {template.elements?.showDecorativeShapes && (
                    <div className={template.elements.shapeStyle} />
                )}

                <div className={`relative z-10 flex flex-col h-full`}>
                    {(headshotSrc || template.styles.logoContainer) && (
                        <div className={template.styles.logoContainer}>
                            {headshotSrc
                                ? (
                                    <img
                                        src={headshotSrc}
                                        alt="Headshot"
                                        className={`object-cover rounded-full ${
                                            isPreview
                                                ? "w-12 h-12"
                                                : "w-32 h-32"
                                        }`}
                                    />
                                )
                                : <div className="opacity-0">Logo</div>}
                        </div>
                    )}

                    <h2
                        className={`shrink-0 ${template.styles.title}`}
                        style={{
                            fontFamily: settings.titleFont,
                            fontWeight: getFontWeight(settings.titleWeight),
                            fontSize: `${settings.titleFontSize * fontScale}px`,
                            lineHeight: 1.2,
                        }}
                    >
                        {slide.title}
                    </h2>

                    <div className="flex-1 min-h-0 flex flex-col justify-center gap-6 overflow-hidden">
                        <div className="overflow-y-auto custom-scrollbar pr-2">
                            <p
                                className={template.styles.content}
                                style={{
                                    fontFamily: settings.bodyFont,
                                    fontWeight: getFontWeight(
                                        settings.bodyWeight,
                                    ),
                                    fontSize: `${
                                        settings.bodyFontSize * fontScale
                                    }px`,
                                    lineHeight: 1.5,
                                }}
                            >
                                {slide.content}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`shrink-0 mt-8 flex justify-between items-center relative z-20 ${template.styles.footer}`}
                    >
                        <div className="flex flex-col">
                            {settings.showName && (
                                <span
                                    className={`${template.styles.companyName} font-bold`}
                                >
                                    {settings.authorName}
                                </span>
                            )}
                            {settings.showHandle && (
                                <span
                                    className={`${template.styles.companyName} text-xs opacity-75`}
                                >
                                    {settings.linkedinHandle}
                                </span>
                            )}
                        </div>

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

                        {settings.showSlideNumber && (
                            <span className={template.styles.slideNumber}>
                                {slide.number}
                            </span>
                        )}
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

            const slideElements = container.children;
            for (let i = 0; i < slideElements.length; i++) {
                const element = slideElements[i] as HTMLElement;
                const scale = isHighRes ? 4 : 2;
                const canvas = await html2canvas(element, {
                    scale: scale,
                    useCORS: true,
                    backgroundColor: null,
                    logging: false,
                });
                const blob = await new Promise<Blob | null>((resolve) =>
                    canvas.toBlob(resolve, "image/png")
                );
                if (blob) zip.file(`slide-${i + 1}.png`, blob);
            }
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `carousel-images-${Date.now()}.zip`);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to create ZIP.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="bg-slate-50 flex flex-col font-sans text-slate-900 h-[calc(100vh-100px)] lg:h-[calc(100vh-64px)]">
            {/* Header / Navigation */}
            <header className="flex items-center justify-between px-8 py-3 bg-white border-b border-slate-200 shrink-0">
                <nav className="flex space-x-8 mx-auto">
                    <TabItem
                        icon={<Sparkles size={18} />}
                        label="Fuente"
                        active={activeTab === "source"}
                        onClick={() => setActiveTab("source")}
                    />
                    <TabItem
                        icon={<Type size={18} />}
                        label="Contenido"
                        active={activeTab === "content"}
                        onClick={() => setActiveTab("content")}
                    />
                    <TabItem
                        icon={<Settings2 size={18} />}
                        label="Ajustes"
                        active={activeTab === "settings"}
                        onClick={() => setActiveTab("settings")}
                    />
                    <TabItem
                        icon={<Palette size={18} />}
                        label="Tema"
                        active={activeTab === "theme"}
                        onClick={() => setActiveTab("theme")}
                    />

                    <TabItem
                        icon={<RotateCcw size={18} />}
                        label="Reiniciar"
                        onClick={() => {
                            localStorage.removeItem("kolink_v2_editor_data");
                            localStorage.removeItem("kolink_v2_editor_config");
                            localStorage.removeItem(
                                "kolink_v2_editor_settings",
                            );
                            localStorage.removeItem(
                                "kolink_v2_editor_template",
                            );
                            localStorage.removeItem("kolink_v2_editor_tab");

                            // Reset local state immediately
                            setSelectedTemplateId(CAROUSEL_TEMPLATES[0].id);

                            // Default Settings Reset
                            setSettings({
                                titleFont: "Inter",
                                titleWeight: "Bold",
                                titleFontSize: 80,
                                bodyFont: "Inter",
                                bodyWeight: "Regular",
                                bodyFontSize: 40,
                                showHeadshot: true,
                                showName: true,
                                authorName: brandSettings?.company_name || "",
                                showHandle: true,
                                linkedinHandle:
                                    brandSettings?.linkedin_handle || "",
                                showSlideNumber: true,
                            });

                            onReset?.();
                        }}
                    />
                </nav>
            </header>

            <main className="flex-1 flex p-6 gap-6 overflow-hidden">
                {/* Left Section: Live Preview Slide */}
                <section className="h-full flex flex-col items-start justify-start relative">
                    {/* Background Decorations per user request */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-bl-[100px] opacity-10 -z-10" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600 rounded-tr-[100px] opacity-10 -z-10" />

                    {/* Dynamic Render of Current Slide using Rescued Templates */}
                    <div className="h-full shadow-2xl rounded-xl overflow-hidden origin-top-left">
                        {renderSlide(currentSlide, true)}
                    </div>
                </section>

                {/* Right Section: Content Edit Form */}
                <section className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-10 overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl font-bold mb-8 border-b-2 border-slate-900 w-fit pb-1 capitalize">
                        {activeTab === "content"
                            ? "Editar contenido"
                            : activeTab === "settings"
                            ? "Ajustes"
                            : activeTab === "theme"
                            ? "Tema"
                            : activeTab === "source"
                            ? "Configuración de Origen"
                            : "Ajustes"}
                    </h2>

                    {activeTab === "source" && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="font-semibold text-slate-700 block">
                                        Fuente de información
                                    </label>
                                    <textarea
                                        className="w-full p-4 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 min-h-[200px] resize-y"
                                        placeholder="Ingresa el texto, tema o idea para tu carrusel..."
                                        value={generationConfig.sourceText}
                                        onChange={(e) =>
                                            setGenerationConfig({
                                                ...generationConfig,
                                                sourceText: e.target.value,
                                            })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="font-semibold text-slate-700 block">
                                            Tono
                                        </label>
                                        <select
                                            className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                            value={generationConfig.tone}
                                            onChange={(e) =>
                                                setGenerationConfig({
                                                    ...generationConfig,
                                                    tone: e.target.value,
                                                })}
                                        >
                                            <option value="Professional">
                                                Profesional
                                            </option>
                                            <option value="Viral">Viral</option>
                                            <option value="Educational">
                                                Educativo
                                            </option>
                                            <option value="Empathetic">
                                                Empático
                                            </option>
                                            <option value="Persuasive">
                                                Persuasivo
                                            </option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-semibold text-slate-700 block">
                                            Audiencia Objetivo
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Ej: CEOs, Estudiantes..."
                                            value={generationConfig.audience}
                                            onChange={(e) =>
                                                setGenerationConfig({
                                                    ...generationConfig,
                                                    audience: e.target.value,
                                                })}
                                        />
                                    </div>
                                </div>

                                {isGenerating
                                    ? (
                                        <div className="w-full">
                                            <LoadingProgress
                                                steps={[
                                                    "Analizando fuente y tono...",
                                                    "Estructurando narrativa...",
                                                    "Redactando slides...",
                                                    "Aplicando diseño...",
                                                ]}
                                                duration={8000}
                                            />
                                        </div>
                                    )
                                    : (
                                        <button
                                            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={handleGenerate}
                                            disabled={!generationConfig
                                                .sourceText || isGenerating}
                                        >
                                            <Sparkles size={18} />
                                            Generar Contenido con IA
                                        </button>
                                    )}
                            </div>
                        </div>
                    )}

                    {activeTab === "content" && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Título
                                    </label>
                                    {lastFocusedField?.index ===
                                            currentSlideIndex &&
                                        lastFocusedField
                                                ?.field ===
                                            "title" &&
                                        <FormatToolbar />}
                                </div>
                                <textarea
                                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-lg leading-tight resize-none min-h-[100px]"
                                    value={currentSlide?.title || ""}
                                    onChange={(e) =>
                                        updateSlide(
                                            currentSlideIndex,
                                            "title",
                                            e.target.value,
                                        )}
                                    onFocus={(e) =>
                                        setLastFocusedField({
                                            index: currentSlideIndex,
                                            field: "title",
                                            selectionStart: e.target
                                                .selectionStart,
                                            selectionEnd: e.target
                                                .selectionEnd,
                                        })}
                                    onSelect={(e) =>
                                        setLastFocusedField({
                                            index: currentSlideIndex,
                                            field: "title",
                                            selectionStart: (e.target as any)
                                                .selectionStart,
                                            selectionEnd: (e.target as any)
                                                .selectionEnd,
                                        })}
                                    onBlur={handleBlurSave}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Contenido
                                    </label>
                                    {lastFocusedField?.index ===
                                            currentSlideIndex &&
                                        lastFocusedField
                                                ?.field ===
                                            "content" &&
                                        <FormatToolbar />}
                                </div>
                                <textarea
                                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 leading-relaxed resize-none min-h-[120px]"
                                    value={currentSlide?.content || ""}
                                    onChange={(e) =>
                                        updateSlide(
                                            currentSlideIndex,
                                            "content",
                                            e.target.value,
                                        )}
                                    onFocus={(e) =>
                                        setLastFocusedField({
                                            index: currentSlideIndex,
                                            field: "content",
                                            selectionStart: e.target
                                                .selectionStart,
                                            selectionEnd: e.target
                                                .selectionEnd,
                                        })}
                                    onSelect={(e) =>
                                        setLastFocusedField({
                                            index: currentSlideIndex,
                                            field: "content",
                                            selectionStart: (e.target as any)
                                                .selectionStart,
                                            selectionEnd: (e.target as any)
                                                .selectionEnd,
                                        })}
                                    onBlur={handleBlurSave}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="space-y-6">
                            {/* Font Settings */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Fuente del Título
                                    </label>
                                    <select
                                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={settings.titleFont}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                titleFont: e.target.value,
                                            })}
                                    >
                                        {[
                                            "Inter",
                                            "Lora",
                                            "Nunito",
                                            "Roboto",
                                            "Open Sans",
                                            "Montserrat",
                                            "Lato",
                                            "Poppins",
                                            "Merriweather",
                                            "Playfair Display",
                                            "Raleway",
                                            "Oswald",
                                        ].map((font) => (
                                            <option key={font} value={font}>
                                                {font}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Peso
                                    </label>
                                    <select
                                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={settings.titleWeight}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                titleWeight: e.target.value,
                                            })}
                                    >
                                        <option value="Regular">Regular</option>
                                        <option value="Medium">Medio</option>
                                        <option value="Bold">Negrita</option>
                                        <option value="Extra Bold">
                                            Extra Negrita
                                        </option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Tamaño (px)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={settings.titleFontSize}
                                        onChange={(e) => {
                                            const val = parseInt(
                                                e.target.value,
                                                10,
                                            );
                                            setSettings({
                                                ...settings,
                                                titleFontSize: isNaN(val)
                                                    ? 0
                                                    : val,
                                            });
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Fuente del Texto
                                    </label>
                                    <select
                                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={settings.bodyFont}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                bodyFont: e.target.value,
                                            })}
                                    >
                                        {[
                                            "Inter",
                                            "Lora",
                                            "Nunito",
                                            "Roboto",
                                            "Open Sans",
                                            "Montserrat",
                                            "Lato",
                                            "Poppins",
                                            "Merriweather",
                                            "Playfair Display",
                                            "Raleway",
                                            "Oswald",
                                        ].map((font) => (
                                            <option key={font} value={font}>
                                                {font}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Peso
                                    </label>
                                    <select
                                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={settings.bodyWeight}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                bodyWeight: e.target.value,
                                            })}
                                    >
                                        <option value="Light">Ligera</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Medium">Media</option>
                                        <option value="Bold">Negrita</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Tamaño (px)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={settings.bodyFontSize}
                                        onChange={(e) => {
                                            const val = parseInt(
                                                e.target.value,
                                                10,
                                            );
                                            setSettings({
                                                ...settings,
                                                bodyFontSize: isNaN(val)
                                                    ? 0
                                                    : val,
                                            });
                                        }}
                                    />
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Toggles */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="font-semibold text-slate-700">
                                        Foto de Perfil
                                    </label>
                                    <button
                                        onClick={() =>
                                            setSettings({
                                                ...settings,
                                                showHeadshot: !settings
                                                    .showHeadshot,
                                            })}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${
                                            settings.showHeadshot
                                                ? "bg-indigo-600"
                                                : "bg-slate-200"
                                        }`}
                                    >
                                        <div
                                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                                                settings.showHeadshot
                                                    ? "left-7"
                                                    : "left-1"
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="font-semibold text-slate-700">
                                            Nombre
                                        </label>
                                        <button
                                            onClick={() =>
                                                setSettings({
                                                    ...settings,
                                                    showName: !settings
                                                        .showName,
                                                })}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${
                                                settings.showName
                                                    ? "bg-indigo-600"
                                                    : "bg-slate-200"
                                            }`}
                                        >
                                            <div
                                                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                                                    settings.showName
                                                        ? "left-7"
                                                        : "left-1"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                    {settings.showName && (
                                        <input
                                            type="text"
                                            value={settings.authorName}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    authorName: e.target.value,
                                                })}
                                            className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Tu nombre"
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="font-semibold text-slate-700">
                                            Usuario de LinkedIn
                                        </label>
                                        <button
                                            onClick={() =>
                                                setSettings({
                                                    ...settings,
                                                    showHandle: !settings
                                                        .showHandle,
                                                })}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${
                                                settings.showHandle
                                                    ? "bg-indigo-600"
                                                    : "bg-slate-200"
                                            }`}
                                        >
                                            <div
                                                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                                                    settings.showHandle
                                                        ? "left-7"
                                                        : "left-1"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                    {settings.showHandle && (
                                        <input
                                            type="text"
                                            value={settings.linkedinHandle}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    linkedinHandle:
                                                        e.target.value,
                                                })}
                                            className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="@tu-usuario"
                                        />
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="font-semibold text-slate-700">
                                        Mostrar Número
                                    </label>
                                    <button
                                        onClick={() =>
                                            setSettings({
                                                ...settings,
                                                showSlideNumber: !settings
                                                    .showSlideNumber,
                                            })}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${
                                            settings.showSlideNumber
                                                ? "bg-indigo-600"
                                                : "bg-slate-200"
                                        }`}
                                    >
                                        <div
                                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                                                settings.showSlideNumber
                                                    ? "left-7"
                                                    : "left-1"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "theme" && (
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 pb-20">
                            {CAROUSEL_TEMPLATES.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTemplateId(t.id)}
                                    className={`text-left group relative flex flex-col rounded-xl border-2 transition-all hover:shadow-md ${
                                        selectedTemplateId === t.id
                                            ? "border-indigo-600 ring-2 ring-indigo-100/50"
                                            : "border-slate-200 hover:border-indigo-300"
                                    }`}
                                >
                                    <div
                                        className="h-24 w-full rounded-t-lg flex items-center justify-center relative overflow-hidden"
                                        style={{ background: t.previewColor }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-black/10" />
                                        <span
                                            className={`text-3xl font-bold ${
                                                t.category === "Dark" ||
                                                    t.category === "Premium"
                                                    ? "text-white"
                                                    : "text-slate-900"
                                            } opacity-50`}
                                        >
                                            Aa
                                        </span>
                                    </div>

                                    <div className="p-4 bg-white rounded-b-lg flex-1 flex flex-col">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className="font-bold text-slate-800 text-sm leading-tight">
                                                {t.name}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                                            {t.description}
                                        </p>
                                        <span className="mt-auto inline-block text-[10px] font-bold tracking-wider text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded self-start">
                                            {t.category}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Footer: Slide Thumbnails & Actions */}
            <footer className="h-40 bg-white border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
                <div className="flex gap-4 overflow-x-auto pb-2 h-full items-center custom-scrollbar px-2 flex-1">
                    {data.slides.map((slide, idx) => {
                        const baseWidth = aspectRatio === "16/9" ? 1920 : 1080;
                        const scale = 96 / baseWidth; // 96px is w-24

                        return (
                            <SlideThumbnail
                                key={idx}
                                slide={slide}
                                index={idx}
                                active={currentSlideIndex === idx}
                                onClick={() => setCurrentSlideIndex(idx)}
                                onDelete={(e: any) => {
                                    e.stopPropagation();
                                    const newSlides = data.slides.filter((
                                        _,
                                        i,
                                    ) => i !== idx);
                                    if (newSlides.length > 0) {
                                        setData({ ...data, slides: newSlides });
                                        if (
                                            currentSlideIndex >=
                                                newSlides.length
                                        ) {
                                            setCurrentSlideIndex(
                                                Math.max(
                                                    0,
                                                    newSlides.length - 1,
                                                ),
                                            );
                                        }
                                    }
                                }}
                            >
                                <div
                                    style={{
                                        transform: `scale(${scale})`,
                                        transformOrigin: "top left",
                                        width: aspectRatio === "16/9"
                                            ? "1920px"
                                            : "1080px",
                                        height: aspectRatio === "9/16"
                                            ? "1920px"
                                            : (aspectRatio === "1/1"
                                                ? "1080px"
                                                : "1350px"),
                                    }}
                                >
                                    {renderSlide(slide, false)}
                                </div>
                            </SlideThumbnail>
                        );
                    })}

                    <button
                        onClick={() => {
                            const newSlide = {
                                number: data.slides.length + 1,
                                title: "Nueva",
                                content: "Contenido...",
                            };
                            setData({
                                ...data,
                                slides: [...data.slides, newSlide],
                            });
                            setCurrentSlideIndex(data.slides.length);
                        }}
                        className="w-24 h-full border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300 hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex-shrink-0"
                    >
                        <Plus size={24} />
                    </button>
                    {/* Placeholder for 'Outro Slide' etc if needed */}
                </div>

                <div className="flex items-center gap-4 ml-8">
                    <button
                        onClick={() => onSave?.(data, settings)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        <Save size={18} /> Guardar borrador
                    </button>

                    <div className="relative">
                        <button
                            onClick={() =>
                                setShowDownloadMenu(!showDownloadMenu)}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-6 py-2 bg-white text-slate-700 font-bold rounded-lg border border-slate-200 hover:bg-slate-50 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                        >
                            <Download size={18} /> Descargar
                        </button>

                        {showDownloadMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-[60]"
                                    onClick={() => setShowDownloadMenu(false)}
                                />
                                <div className="absolute bottom-full mb-3 right-0 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-[70] animate-in fade-in slide-in-from-bottom-4 duration-200">
                                    <div className="p-2 space-y-1">
                                        <button
                                            onClick={async () => {
                                                setShowDownloadMenu(false);
                                                setIsExporting(true);
                                                try {
                                                    await exportCarouselToPDF(
                                                        "carousel-preview-area",
                                                        `carrusel-${Date.now()}.pdf`,
                                                    );
                                                } finally {
                                                    setIsExporting(false);
                                                }
                                            }}
                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-indigo-50 text-slate-700 rounded-lg transition-colors text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
                                                    <Download size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">
                                                        PDF (LinkedIn)
                                                    </p>
                                                    <p className="text-[10px] text-slate-500">
                                                        Documento profesional
                                                    </p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={async () => {
                                                setShowDownloadMenu(false);
                                                await handleExportZIP();
                                            }}
                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-indigo-50 text-slate-700 rounded-lg transition-colors text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                    <Download size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">
                                                        Todas en PNG
                                                    </p>
                                                    <p className="text-[10px] text-slate-500">
                                                        Todas las diapositivas
                                                    </p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={async () => {
                                                setShowDownloadMenu(false);
                                                setIsExporting(true);
                                                try {
                                                    const container = document
                                                        .getElementById(
                                                            "carousel-preview-area",
                                                        );
                                                    if (!container) return;
                                                    const slideElement =
                                                        container
                                                            .children[
                                                                currentSlideIndex
                                                            ] as HTMLElement;
                                                    const canvas =
                                                        await html2canvas(
                                                            slideElement,
                                                            {
                                                                scale: isHighRes
                                                                    ? 4
                                                                    : 2,
                                                                useCORS: true,
                                                                backgroundColor:
                                                                    null,
                                                            },
                                                        );
                                                    const blob =
                                                        await new Promise<
                                                            Blob | null
                                                        >((resolve) =>
                                                            canvas.toBlob(
                                                                resolve,
                                                                "image/png",
                                                            )
                                                        );
                                                    if (blob) {
                                                        saveAs(
                                                            blob,
                                                            `slide-${
                                                                currentSlideIndex +
                                                                1
                                                            }-${Date.now()}.png`,
                                                        );
                                                    }
                                                } catch (err) {
                                                    console.error(
                                                        "Export PNG failed:",
                                                        err,
                                                    );
                                                } finally {
                                                    setIsExporting(false);
                                                }
                                            }}
                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-indigo-50 text-slate-700 rounded-lg transition-colors text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                                                    <Download size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">
                                                        Diapositiva Actual
                                                    </p>
                                                    <p className="text-[10px] text-slate-500">
                                                        Imagen PNG individual
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </footer>

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

// Componentes Auxiliares
const TabItem = ({ icon, label, active = false, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
            active
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-500 hover:bg-slate-50"
        }`}
    >
        {icon} {label}
    </button>
);

const SlideThumbnail = (
    {
        slide,
        index,
        active = false,
        isHidden = false,
        onClick,
        onDelete,
        children,
    }: any,
) => (
    <div
        onClick={onClick}
        className={`relative w-24 h-full rounded-lg border-2 flex-shrink-0 flex flex-col justify-center overflow-hidden transition-all cursor-pointer group ${
            active
                ? "border-indigo-600 ring-2 ring-indigo-100"
                : "border-slate-100"
        }`}
    >
        {isHidden && (
            <EyeOff
                size={10}
                className="absolute top-1 right-1 text-slate-400 z-50 bg-white/80 rounded-full p-0.5"
            />
        )}

        <button
            onClick={onDelete}
            className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-50 hover:bg-red-50"
        >
            <Trash2 size={12} />
        </button>

        {children
            ? (
                <div className="w-full h-full relative overflow-hidden bg-white">
                    {children}
                </div>
            )
            : (
                <div className="p-2 flex flex-col h-full">
                    <span className="font-bold text-indigo-900 truncate mb-auto mt-2">
                        {slide.title || "Sin título"}
                    </span>
                    <div className="mt-1 h-1 w-full bg-slate-100 rounded" />
                    <div className="mt-0.5 h-1 w-2/3 bg-slate-100 rounded mb-2" />
                </div>
            )}

        <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-1 text-[8px] font-bold text-center text-indigo-900 truncate border-t border-slate-100 z-20">
            {index + 1}
        </div>
    </div>
);
