import React, { useEffect } from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { EditorSidebar } from './EditorSidebar';
import { EditorCanvas } from './EditorCanvas';
import { ThumbnailSidebar } from './ThumbnailSidebar';
import { PropertiesPanel } from './PropertiesPanel';
import { useSearchParams } from 'react-router-dom';
import { SHOWCASE_TEMPLATES } from '@/lib/data/showcase-templates';
import { toast } from 'sonner';

export const CarouselStudio = () => {
  const { isFocusMode } = useCarouselStore(state => state.editor);
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');

  useEffect(() => {
    // Handle Template Loading
    if (templateId && SHOWCASE_TEMPLATES[templateId as keyof typeof SHOWCASE_TEMPLATES]) {
        const template = SHOWCASE_TEMPLATES[templateId as keyof typeof SHOWCASE_TEMPLATES];
        setTimeout(() => {
             useCarouselStore.setState((state) => ({
                project: {
                    ...state.project,
                    slides: template.slides
                }
            }));
            toast.success("Template loaded successfully!");
        }, 500);
    }
    
    // Handle Hook Injection
    const hookTemplate = searchParams.get('hook');
    if (hookTemplate) {
        setTimeout(() => {
            useCarouselStore.setState((state) => {
                const newSlides = [...state.project.slides];
                if (newSlides.length > 0) {
                    // Assuming first slide is cover/intro
                    newSlides[0] = {
                        ...newSlides[0],
                        content: {
                            ...newSlides[0].content,
                            title: hookTemplate
                        }
                    };
                }
                return {
                    project: {
                        ...state.project,
                        slides: newSlides
                    }
                };
            });
            toast.success("Hook template applied!");
        }, 600); // Slightly after template if both present, though usually exclusive
    }
  }, [templateId, searchParams]);
  
  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-100 font-sans">
      {!isFocusMode && <EditorSidebar />}
      {!isFocusMode && <ThumbnailSidebar />}
      <EditorCanvas />
      {!isFocusMode && <PropertiesPanel />}
    </div>
  );
};
