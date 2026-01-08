import React, { useState } from 'react';
import { SlideRenderer } from './SlideRenderer';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { Button } from '@/components/ui/button';
import { 
    ZoomIn, 
    ZoomOut, 
    Download, 
    Maximize,
    ChevronLeft,
    ChevronRight,
    Repeat,
    XCircle
} from 'lucide-react';
import { FullscreenPreview } from './FullscreenPreview';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToPDF } from '@/lib/utils/export';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter 
} from '@/components/ui/dialog';
import { ExportModal } from './ExportModal';

export const EditorCanvas = () => {
  const { slides, design, author } = useCarouselStore(state => state.project);
  const activeSlideId = useCarouselStore(state => state.editor.activeSlideId);
  const zoomLevel = useCarouselStore(state => state.editor.zoomLevel);
  const setZoom = useCarouselStore(state => state.setZoom);
  const setActiveSlide = useCarouselStore(state => state.setActiveSlide);
  const resetProject = useCarouselStore(state => state.resetProject);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleReset = () => {
      setShowResetDialog(true);
  };

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
        <div className="flex items-center gap-4">
             <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                className="h-8 text-xs font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-500"
             >
                <Repeat className="w-3.5 h-3.5 mr-2" />
                New Carousel
             </Button>
            <div className="text-sm font-medium text-slate-500 border-l border-slate-200 pl-4">
               {slides.length} Slides ({design.aspectRatio})
            </div>
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
           
           {/* Fullscreen Trigger */}
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => setIsFullscreen(true)}
             title="Fullscreen Preview"
           >
             <Maximize className="w-4 h-4 text-slate-600" />
           </Button>

           <div className="w-px h-4 bg-slate-300 mx-2" />
           
           <Button 
               className="bg-slate-900 text-white hover:bg-slate-800 h-8 text-xs gap-2"
               onClick={() => setIsExportModalOpen(true)}
            >
             <Download className="w-3 h-3" /> Export
           </Button>
        </div>
      </div>

      {/* Main Scrollable Canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-start p-20 custom-scrollbar">
         <div className="flex gap-12 px-20">
            <AnimatePresence mode="popLayout">
             {slides.map((slide, index) => (
                <motion.div 
                  key={slide.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative group cursor-pointer flex-shrink-0"
                  style={{ 
                     width: baseWidth * visualScale, 
                     height: baseHeight * visualScale,
                  }}
                  onClick={() => setActiveSlide(slide.id)}
                >
                  {/* Visual Wrapper for scaling */}
                  <div 
                     data-slide-id={slide.id}
                     className={cn(
                         "rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 bg-white", 
                         activeSlideId === slide.id ? "ring-[8px] ring-brand-500 ring-offset-8" : "ring-1 ring-slate-200"
                     )}
                     style={{ 
                         width: baseWidth,
                         height: baseHeight,
                         transform: `scale(${visualScale})`, 
                         transformOrigin: 'top left',
                         // Remove pointerEvents: 'none' for interactions if needed, kept for now to avoid dragging issues in canvas
                         pointerEvents: 'none'
                     }}
                  >
                     <SlideRenderer 
                         slide={slide} 
                         design={design} 
                         author={author}
                         isActive={activeSlideId === slide.id}
                     />
                  </div>
                 
                 {/* Quick Actions Overlay (Appears on Hover) */}
                 <div className="absolute -top-12 left-0 right-0 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="flex gap-1 pointer-events-auto">
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8 rounded-full shadow-md bg-white border-slate-200"
                            disabled={index === 0}
                            onClick={(e) => { e.stopPropagation(); useCarouselStore.getState().reorderSlides(index, index - 1); }}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8 rounded-full shadow-md bg-white border-slate-200"
                            disabled={index === slides.length - 1}
                            onClick={(e) => { e.stopPropagation(); useCarouselStore.getState().reorderSlides(index, index + 1); }}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex gap-1 pointer-events-auto">
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8 rounded-full shadow-md bg-white border-slate-200 hover:text-brand-500"
                            onClick={(e) => { e.stopPropagation(); useCarouselStore.getState().addSlide(slide.type, index + 1); }}
                        >
                            <Repeat className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8 rounded-full shadow-md bg-white border-slate-200 hover:text-red-500"
                            onClick={(e) => { e.stopPropagation(); useCarouselStore.getState().removeSlide(slide.id); }}
                        >
                            <XCircle className="w-4 h-4" />
                        </Button>
                    </div>
                 </div>

                 {/* Slide Index Badge */}
                 <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm text-[10px] font-black text-slate-400 border border-slate-200 uppercase tracking-widest">
                    Slide {index + 1}
                 </div>
               </motion.div>
            ))}
            </AnimatePresence>
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

      {/* Fullscreen Modal Overlay */}
      {isFullscreen && (
          <FullscreenPreview 
            slides={slides} 
            design={design} 
            author={author}
            initialSlideIndex={slides.findIndex(s => s.id === activeSlideId) !== -1 ? slides.findIndex(s => s.id === activeSlideId) : 0}
            onClose={() => setIsFullscreen(false)} 
          />
      )}

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />

      {/* Confirmation Dialog for New Project */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Carousel</DialogTitle>
            <DialogDescription>
              Are you sure you want to start over? This action cannot be undone and will discard your current slide deck.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>Cancel</Button>
            <Button 
                variant="destructive" 
                onClick={() => {
                    resetProject();
                    setShowResetDialog(false);
                }}
            >
                Confirm & Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Scroll Indicator Badge - Friction #6 Fix */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <div className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-lg border border-white/10 flex items-center gap-2">
             <span>Slide {slides.findIndex(s => s.id === activeSlideId) + 1} / {slides.length}</span>
             <div className="w-px h-3 bg-white/20" />
             <span className="text-white/60 text-[10px]">Use Arrow Keys</span>
          </div>
      </div>
    </div>
  );
};
