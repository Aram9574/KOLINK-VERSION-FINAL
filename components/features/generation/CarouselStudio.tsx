import React, { useEffect, useState } from "react";
import { CarouselEditor } from "./CarouselEditor";
import { supabase } from "../../../services/supabaseClient";
import { useLocation } from "react-router-dom";
import { CarouselRepository } from "../../../services/carouselRepository";
import LoadingProgress from "../../ui/LoadingProgress";
import { Sparkles } from "lucide-react";
import { useUser } from "../../../context/UserContext";
import { toast } from "sonner";
import PremiumLockOverlay from "../../ui/PremiumLockOverlay";

type SourceType = "url" | "youtube" | "text";

interface CarouselStudioProps {
    initialContent?: string;
}

const DEFAULT_CAROUSEL = {
    carousel_config: {
        tone: "Professional",
        slides_count: 1,
        analysis: "Borrador inicial",
    },
    slides: [
        {
            title: "Nuevo Carrusel",
            content: "Edita el contenido en la pestaña Fuente...",
            image_prompt: "",
        },
    ],
};

const CarouselStudio: React.FC<CarouselStudioProps> = ({ initialContent }) => {
    const location = useLocation();
    const { language, user } = useUser();

    if (!user.isPremium) {
        return (
            <PremiumLockOverlay 
                title={language === 'es' ? 'Generador de Carruseles' : 'Carousel Generator'}
                description={language === 'es' 
                    ? 'Crea carruseles virales de alta conversión a partir de cualquier contenido. Convierte artículos, videos de YouTube o texto en piezas visuales irresistibles.' 
                    : 'Create high-converting viral carousels from any content. Turn articles, YouTube videos, or text into irresistible visual pieces.'}
                icon={<Sparkles className="w-8 h-8" />}
            />
        );
    }

    // Initialize state from props (priority) or navigation state or default
    const [source, setSource] = useState(
        initialContent || location.state?.initialSource ||
            localStorage.getItem("kolink_carousel_source") || "",
    );
    const [sourceType, setSourceType] = useState<SourceType>("text");
    const [loading, setLoading] = useState(false);
    const [carouselId, setCarouselId] = useState<string | null>(null);
    const [carouselData, setCarouselData] = useState<any>(DEFAULT_CAROUSEL);
    const [carouselSettings, setCarouselSettings] = useState<any>({});

    /*
    // Disabled auto-load to prioritize local storage persistence per user request
    useEffect(() => {
        const loadInitialDraft = async () => {
            if (!user.id) return;
            setLoading(true);
            try {
                const carousels = await CarouselRepository.fetchUserCarousels(
                    user.id,
                );
                if (carousels && carousels.length > 0) {
                    const latest = carousels[0];
                    setCarouselId(latest.id || null);
                    setCarouselData(latest.data);
                    setCarouselSettings(latest.settings);
                }
            } catch (error) {
                console.error("Error loading drafts:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user.id && !user.id.startsWith("mock-")) {
            loadInitialDraft();
        }
    }, [user.id]);
    */

    useEffect(() => {
        localStorage.setItem("kolink_carousel_source", source);
    }, [source]);

    useEffect(() => {
        localStorage.setItem("kolink_carousel_sourceType", sourceType);
    }, [sourceType]);

    const handleGenerate = async () => {
        // ... (Logic kept for reference or future migration, but UI hidden)
        // For now, I'll keep the function but it won't be called from this component's UI
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
            alert("Error generando el carrusel.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (updated: any, settings: any) => {
        if (!user?.id || user.id.startsWith("mock-")) {
            toast.error("Debes iniciar sesión para guardar");
            return;
        }

        const payload = {
            user_id: user.id,
            data: updated,
            settings: settings,
            status: "draft" as const,
        };

        try {
            if (carouselId) {
                await CarouselRepository.updateCarousel(carouselId, payload);
            } else {
                const created = await CarouselRepository.createCarousel(
                    payload,
                );
                if (created?.id) setCarouselId(created.id);
            }
            toast.success("Borrador guardado");
        } catch (error) {
            console.error("Error saving carousel:", error);
            toast.error("Error al guardar");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <LoadingProgress
                    steps={["Preparando borrador...", "Finalizando diseño"]}
                />
                <p className="text-slate-500 font-medium">
                    Cargando carrusel...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
            <CarouselEditor
                initialData={carouselData || DEFAULT_CAROUSEL}
                initialSettings={carouselSettings}
                onSave={handleSave}
                onReset={() => {
                    setCarouselId(null);
                    setCarouselData(DEFAULT_CAROUSEL);
                    setCarouselSettings({});
                }}
            />
        </div>
    );
};

export default CarouselStudio;
