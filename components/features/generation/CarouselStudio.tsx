import React from "react";
import { CarouselStudio as NewCarouselStudio } from "./carousel/CarouselStudio";
import { Sparkles } from "lucide-react";
import { useUser } from "../../../context/UserContext";
import PremiumLockOverlay from "../../ui/PremiumLockOverlay";

interface CarouselStudioProps {
    initialContent?: string;
}

const CarouselStudio: React.FC<CarouselStudioProps> = () => {
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

    return (
        <div className="h-full w-full">
            <NewCarouselStudio />
        </div>
    );
};

export default CarouselStudio;
