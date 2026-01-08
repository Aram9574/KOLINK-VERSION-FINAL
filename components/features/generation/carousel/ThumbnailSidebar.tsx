import React from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { cn } from '@/lib/utils';
import { SlideRenderer } from './SlideRenderer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GripVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ThumbnailSidebar = () => {
  const { slides, design, author } = useCarouselStore(state => state.project);
  const { activeSlideId } = useCarouselStore(state => state.editor);
  const setActiveSlide = useCarouselStore(state => state.setActiveSlide);
  const addSlide = useCarouselStore(state => state.addSlide);
  const reorderSlides = useCarouselStore(state => state.reorderSlides); // Assuming store has this

  // Fixed scale for thumbnails to ensure they fit nicely
  const THUMBNAIL_SCALE = 0.15;
  const baseWidth = 1080;
  const baseHeight = design.aspectRatio === '4:5' ? 1350 : design.aspectRatio === '9:16' ? 1920 : 1080;

  return (
    <div className="w-56 h-full bg-slate-50 border-r border-slate-200 flex flex-col z-10 hidden md:flex">
      <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Slides</h3>
        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-mono">
            {slides.length}
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
            {slides.map((slide, index) => (
                <div 
                    key={slide.id}
                    className={cn(
                        "group relative transition-all duration-200 cursor-pointer rounded-lg p-2 border-2",
                        activeSlideId === slide.id 
                            ? "border-brand-500 bg-brand-50/30" 
                            : "border-transparent hover:bg-slate-200/50 hover:border-slate-200"
                    )}
                    onClick={() => setActiveSlide(slide.id)}
                >
                    <div className="flex items-center gap-2 mb-1.5">
                        <div className="text-[10px] font-bold text-slate-400 w-4">{index + 1}</div>
                        {/* Drag Handle Placeholder (functionality to be added if needed, or simple buttons) */}
                       
                    </div>

                    <div 
                        className="relative rounded overflow-hidden bg-white shadow-sm pointer-events-none mx-auto border border-slate-100"
                        style={{
                            width: '100%',
                            aspectRatio: design.aspectRatio.replace(':', '/'),
                        }}
                    >
                         {/* Mini Renderer */}
                         <div className="absolute inset-0 origin-top-left">
                            <SlideRenderer 
                                slide={slide}
                                design={design}
                                author={author}
                                scale={190 / baseWidth} 
                                isActive={false}
                            />
                         </div>
                    </div>
                </div>
            ))}
            
            <Button 
                variant="outline" 
                className="w-full border-dashed border-slate-300 text-slate-500 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 h-24 flex flex-col gap-2"
                onClick={() => addSlide()}
            >
                <Plus className="w-5 h-5 opacity-50" />
                <span className="text-xs">Add Slide</span>
            </Button>
        </div>
      </ScrollArea>
    </div>
  );
};
