import { SlideRenderer } from './SlideRenderer';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';

export const EditorCanvas = () => {
  const { slides, design } = useCarouselStore(state => state.project);
  const { activeSlideId, zoomLevel } = useCarouselStore(state => state.editor);
  const { setZoom, setActiveSlide } = useCarouselStore(state => state);

  // Calculate base width/height for the slide container based on zoom
  const baseWidth = design.aspectRatio === '4:5' ? 1080 : design.aspectRatio === '9:16' ? 1080 : 1080;
  const baseHeight = design.aspectRatio === '4:5' ? 1350 : design.aspectRatio === '9:16' ? 1920 : 1080;
  
  // We scale the container itself, but SlideRenderer accepts an internal scale too.
  // Strategy: Render SlideRenderer at scale=1 but transform the container.
  // Actually, SlideRenderer implementation uses `scale` prop on the style. 
  // Let's use a standard visual scale factor (e.g. 0.25) so it fits on screen, then apply user zoom.
  const visualScale = 0.3 * zoomLevel;

  return (
    <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="h-14 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 z-10">
        <div className="text-sm font-medium text-slate-500">
          {slides.length} Slides ({design.aspectRatio})
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(0.2, zoomLevel - 0.1))}>
             <ZoomOut className="w-4 h-4" />
           </Button>
           <span className="text-xs font-mono w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
           <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(3, zoomLevel + 0.1))}>
             <ZoomIn className="w-4 h-4" />
           </Button>
           <div className="w-px h-4 bg-slate-300 mx-2" />
           <Button className="bg-slate-900 text-white hover:bg-slate-800 h-8 text-xs gap-2">
             <Download className="w-3 h-3" /> Export
           </Button>
        </div>
      </div>

      {/* Main Scrollable Canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-start p-20 custom-scrollbar">
         <div className="flex gap-12 px-20">
            {slides.map((slide, index) => (
               <div 
                 key={slide.id} 
                 className="relative group transition-transform duration-300"
                 style={{ 
                    width: baseWidth * visualScale, 
                    height: baseHeight * visualScale,
                 }}
                 onClick={() => setActiveSlide(slide.id)}
               >
                 {/* Visual Wrapper for scaling */}
                 <div style={{ transform: `scale(${visualScale})`, transformOrigin: 'top left' }}>
                    <SlideRenderer 
                        slide={slide} 
                        design={design} 
                        isActive={activeSlideId === slide.id}
                    />
                 </div>
                 
                 {/* Slide Index Badge */}
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm text-xs font-bold text-slate-400 border border-slate-200">
                    {index + 1}
                 </div>
               </div>
            ))}
            
            {/* Add Slide Button Placeholder */}
            <div 
                className="w-24 flex items-center justify-center opacity-50 hover:opacity-100 cursor-pointer transition-opacity"
                style={{ height: baseHeight * visualScale }}
                onClick={() => useCarouselStore.getState().addSlide()}
            >
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-colors">
                    +
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
