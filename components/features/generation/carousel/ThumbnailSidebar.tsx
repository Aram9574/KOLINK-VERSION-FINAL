import React from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { cn } from '@/lib/utils';
import { SlideRenderer } from './SlideRenderer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GripVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reorder, useDragControls } from 'framer-motion';
import { CarouselSlide } from '@/types/carousel'; // Ensure this type is available or use implicit

const ThumbnailItem = ({ 
  slide, 
  index, 
  isActive, 
  design, 
  author, 
  onClick 
}: { 
  slide: any, // Using any here to avoid stringent type checks if types/carousel is not perfectly aligned in imports, but preferably use CarouselSlide
  index: number, 
  isActive: boolean, 
  design: any, 
  author: any, 
  onClick: () => void 
}) => {
  const dragControls = useDragControls();

  // Calculate dimensions based on aspect ratio
  // Base width for calculation standard
  const baseWidth = 1080; 
  
  return (
    <Reorder.Item
      value={slide}
      id={slide.id}
      dragListener={false}
      dragControls={dragControls}
      className={cn(
        "group relative transition-all duration-200 rounded-lg p-2 border-2",
        isActive 
          ? "border-brand-500 bg-brand-50/30" 
          : "border-transparent hover:bg-slate-200/50 hover:border-slate-200"
      )}
      style={{
          // Fix for transform causing blurriness in some browsers
          transform: 'translateZ(0)', 
      }}
    >
        <div className="flex items-center gap-2 mb-1.5">
            {/* Drag Handle */}
            <div 
                onPointerDown={(e) => dragControls.start(e)}
                className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Drag to reorder"
            >
                <GripVertical className="w-3 h-3" />
            </div>

            <div 
                className="text-[10px] font-bold text-slate-400 w-4 cursor-pointer"
                onClick={onClick}
            >
                {index + 1}
            </div>
        </div>

        <div 
            className="relative rounded overflow-hidden bg-white shadow-sm cursor-pointer mx-auto border border-slate-100"
            style={{
                width: '100%',
                aspectRatio: design.aspectRatio.replace(':', '/'),
            }}
            onClick={onClick}
        >
             {/* Mini Renderer */}
             <div className="absolute inset-0 origin-top-left pointer-events-none">
                <SlideRenderer 
                    slide={slide}
                    design={design}
                    author={author}
                    scale={190 / baseWidth} 
                    isActive={false}
                />
             </div>
        </div>
    </Reorder.Item>
  );
};

export const ThumbnailSidebar = () => {
  const { slides, design, author } = useCarouselStore(state => state.project);
  const { activeSlideId } = useCarouselStore(state => state.editor);
  const setActiveSlide = useCarouselStore(state => state.setActiveSlide);
  const addSlide = useCarouselStore(state => state.addSlide);
  const setSlides = useCarouselStore(state => state.setSlides);

  return (
    <div className="w-56 h-full bg-slate-50 border-r border-slate-200 flex flex-col z-10 hidden md:flex">
      <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Slides</h3>
        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-mono">
            {slides.length}
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
            <Reorder.Group axis="y" values={slides} onReorder={setSlides} className="space-y-3">
                {slides.map((slide, index) => (
                    <ThumbnailItem 
                        key={slide.id}
                        slide={slide}
                        index={index}
                        isActive={activeSlideId === slide.id}
                        design={design}
                        author={author}
                        onClick={() => setActiveSlide(slide.id)}
                    />
                ))}
            </Reorder.Group>
            
            <div className="pt-3">
                <Button 
                    variant="outline" 
                    className="w-full border-dashed border-slate-300 text-slate-500 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 h-24 flex flex-col gap-2 transition-all"
                    onClick={() => addSlide()}
                >
                    <Plus className="w-5 h-5 opacity-50" />
                    <span className="text-xs">Add Slide</span>
                </Button>
            </div>
        </div>
      </ScrollArea>
    </div>
  );
};
