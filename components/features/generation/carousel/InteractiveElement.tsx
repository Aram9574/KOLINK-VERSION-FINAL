import React, { useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { cn } from '@/lib/utils';
import { Maximize, RotateCw, Trash2 } from 'lucide-react';

interface InteractiveElementProps {
  elementId: string; // 'title', 'body', etc. (not globally unique, just unique to slide)
  slideId: string;
  className?: string;
  children: React.ReactNode;
  isActiveSlide: boolean;
}

export const InteractiveElement: React.FC<InteractiveElementProps> = ({
  elementId,
  slideId,
  className,
  children,
  isActiveSlide
}) => {
  const activeElementId = useCarouselStore(state => state.editor.activeElementId);
  const setActiveElement = useCarouselStore(state => state.setActiveElement);
  const updateElementOverride = useCarouselStore(state => state.updateElementOverride);
  
  // Get overrides specifically for this element on this slide
  const override = useCarouselStore(state => {
    const slide = state.project.slides.find(s => s.id === slideId);
    return slide?.elementOverrides?.[elementId];
  });

  const isActive = isActiveSlide && activeElementId === elementId;
  const controls = useDragControls();

  // If not active slide, just render children statically with applied transforms
  // Actually, transforms should always apply visually.
  const x = override?.x || 0;
  const y = override?.y || 0;
  const rotate = override?.rotation || 0;
  const scale = override?.scale || 1;

  if (!isActiveSlide) {
      return (
          <div 
            className={cn("relative transition-transform will-change-transform", className)}
            style={{ 
                transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})` 
            }}
          >
              {children}
          </div>
      );
  }

  return (
    <motion.div
      drag={isActive} // Only draggable if selected? Or always? Canva allows drag immediately. Let's say drag enabled if it's the active slide.
      dragMomentum={false}
      onDragEnd={(_, info) => {
        updateElementOverride(slideId, elementId, {
            x: x + info.offset.x,
            y: y + info.offset.y
        });
      }}
      onClick={(e) => {
          e.stopPropagation();
          setActiveElement(elementId);
      }}
      className={cn(
          "relative group border-2 border-transparent hover:border-blue-300 transition-colors", 
          isActive ? "border-blue-500 z-50 cursor-move" : "cursor-pointer",
          className
      )}
      style={{
          x, // framer-motion handles transform
          y,
          rotate,
          scale,
      }}
    >
      {/* Handles (Only when active) */}
      {isActive && (
          <>
            {/* Rotate Handle - Top Center */}
            {/* Note: Implementing simpler rotation via property panel first as native drag-rotate is complex without lib. 
                But let's add a visual cue. */}
            
             {/* Delete Action (Optional) */}
             {/* 
            <button 
                 className="absolute -top-8 right-0 p-1 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 shadow-md"
                 onPointerDown={(e) => e.stopPropagation()}
                 onClick={(e) => {
                     e.stopPropagation();
                     // TODO: Hide/Reset element
                 }}
             >
                 <Trash2 size={12} />
             </button>
             */}
          </>
      )}
      
      {children}
    </motion.div>
  );
};
