import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { CarouselSlide, CarouselDesign } from '@/types/carousel';
import { SlideRenderer } from './SlideRenderer';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface FullscreenPreviewProps {
  slides: CarouselSlide[];
  design: CarouselDesign;
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
  };
  initialSlideIndex?: number;
  onClose: () => void;
}

export const FullscreenPreview: React.FC<FullscreenPreviewProps> = ({ 
  slides, 
  design, 
  author,
  initialSlideIndex = 0, 
  onClose 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Calculate dimensions based on aspect ratio to fit screen
  // We want to fit within say 80vh and 80vw
  const getSlideStyle = () => {
     const isPortrait = design.aspectRatio === '4:5' || design.aspectRatio === '9:16';
     const baseHeight = isPortrait ? 800 : 600;
     const baseWidth = design.aspectRatio === '4:5' ? 640 : design.aspectRatio === '9:16' ? 450 : 800; // 1:1 or landscape logic if needed
     
     // 1080px base logic from Canvas:
     // 4:5 = 1080x1350
     // 1:1 = 1080x1080
     // 9:16 = 1080x1920
     
     // We will use a fixed generic display size for the preview container
     // and use transform scale to fit the 1080px SlideRenderer content into it.
     
     // However, SlideRenderer expects the full 1080px width context if it uses pixel units.
     // So we render at full size and scale down.
     return {
         width: 1080,
         height: design.aspectRatio === '4:5' ? 1350 : design.aspectRatio === '9:16' ? 1920 : 1080
     };
  };

  const fullDimensions = getSlideStyle();
  const screenScale = Math.min(
      (window.innerHeight * 0.85) / fullDimensions.height,
      (window.innerWidth * 0.85) / fullDimensions.width
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center">
      {/* Header */}
      <div className="absolute top-4 right-4 flex gap-2">
         <Button variant="ghost" className="text-white hover:bg-white/10" onClick={onClose}>
             <X className="w-6 h-6" />
         </Button>
      </div>

      <div className="absolute top-4 left-4 text-white/50 font-mono text-sm">
          {currentIndex + 1} / {slides.length}
      </div>

      {/* Main Content */}
      <div className="relative flex items-center justify-center w-full h-full p-8">
         
         {/* Navigation Buttons */}
         <button 
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-4 md:left-10 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-0 transition-all z-50"
         >
             <ChevronLeft className="w-8 h-8" />
         </button>

         <button 
            onClick={nextSlide}
            disabled={currentIndex === slides.length - 1}
            className="absolute right-4 md:right-10 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-0 transition-all z-50"
         >
             <ChevronRight className="w-8 h-8" />
         </button>

         {/* Slide Container */}
         <div 
            style={{ 
                width: fullDimensions.width * screenScale, 
                height: fullDimensions.height * screenScale 
            }}
            className="relative shadow-2xl shadow-black/50"
         >
             <div 
                style={{ 
                    transform: `scale(${screenScale})`, 
                    transformOrigin: 'top left',
                    width: fullDimensions.width,
                    height: fullDimensions.height
                }}
             >
                 <SlideRenderer 
                    slide={slides[currentIndex]}
                    design={design}
                    author={author}
                    isActive={true}
                 />
             </div>
         </div>

      </div>

      {/* Thumbs / Timeline could go here */}
    </div>
  );
};
