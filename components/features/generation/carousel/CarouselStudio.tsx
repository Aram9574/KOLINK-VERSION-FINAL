import React from 'react';
import { EditorSidebar } from './EditorSidebar';
import { EditorCanvas } from './EditorCanvas';
import { ThumbnailSidebar } from './ThumbnailSidebar';
import { PropertiesPanel } from './PropertiesPanel';

export const CarouselStudio = () => {
  // Main layout shell
  // Flex container: [Sidebar Fixed] [Canvas Fluid] [Properties Fixed]
  
  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-100 font-sans">
      <EditorSidebar />
      <ThumbnailSidebar />
      <EditorCanvas />
      <PropertiesPanel />
    </div>
  );
};
