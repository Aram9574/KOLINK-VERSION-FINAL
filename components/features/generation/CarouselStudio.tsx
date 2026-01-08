import React from "react";
import { CarouselStudio as NewCarouselStudio } from "./carousel/CarouselStudio";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import PremiumLockOverlay from "../../ui/PremiumLockOverlay";

interface CarouselStudioProps {
    initialContent?: string;
}

const CarouselStudio: React.FC<CarouselStudioProps> = ({ initialContent }) => {
    const { language, user } = useUser();
    const navigate = useNavigate();

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
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Minimalist Header for Standalone Route */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{language === 'es' ? 'Volver' : 'Back'}</span>
                    </button>
                    <div className="h-6 w-px bg-slate-200" />
                    <h1 className="font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-500" />
                        {language === 'es' ? 'Estudio de Carruseles' : 'Carousel Studio'}
                    </h1>
                </div>
                
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        Premium AI
                    </span>
                </div>
            </header>

            <div className="flex-1 min-h-0 overflow-hidden">
                <NewCarouselStudio />
            </div>
        </div>
    );
};

export default CarouselStudio;
