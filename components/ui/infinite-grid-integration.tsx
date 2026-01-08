import React, { useState, useRef, useEffect } from 'react';
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";
import { MousePointerClick, Info, Sun, Moon, Settings2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard Shadcn utility for merging Tailwind classes safely.
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper component for the SVG grid pattern.
 */
const GridPattern = ({ offsetX, offsetY, size }: { offsetX: any; offsetY: any; size: number }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <circle
            cx="1"
            cy="1"
            r="1"
            fill="currentColor"
            className="text-slate-300" 
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};

/**
 * The Infinite Grid Component
 * Displays a scrolling background grid that reveals an active layer on mouse hover.
 */
/**
 * The Infinite Grid Component
 * Displays a scrolling background grid that reveals an active layer on mouse hover.
 * Now accepts children to wrap content.
 */
export const InfiniteGrid = ({ children, className, gridOpacity = 0.15 }: { children?: React.ReactNode; className?: string; gridOpacity?: number }) => {
  const [gridSize, setGridSize] = useState(40);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse position with Motion Values for performance (avoids React re-renders)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  // Grid offsets for infinite scroll animation
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5; 
  const speedY = 0.5;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    // Reset offset at pattern width to simulate infinity
    gridOffsetX.set((currentX + speedX) % gridSize);
    gridOffsetY.set((currentY + speedY) % gridSize);
  });

  // Create a dynamic radial mask for the "flashlight" effect
  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full min-h-screen flex flex-col overflow-hidden bg-transparent",
        className
      )}
    >
      {/* Layer 1: Subtle background grid (always visible) */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: gridOpacity }}>
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} />
      </div>

      {/* Layer 2: Highlighted grid (revealed by mouse mask) */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} />
      </motion.div>



      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync dark mode state with HTML class
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="w-full relative min-h-screen">
      {/* Sticky Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-background/50 backdrop-blur-sm border border-border shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        aria-label="Toggle Theme"
      >
        {isDark ? (
          <Sun strokeWidth={1.5} className="w-5 h-5 text-yellow-500 group-hover:rotate-45 transition-transform" />
        ) : (
          <Moon strokeWidth={1.5} className="w-5 h-5 text-indigo-500 group-hover:-rotate-12 transition-transform" />
        )}
      </button>

      {/* Main Content */}
      <main>
        <InfiniteGrid />
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-4 left-4 z-50 text-[10px] uppercase tracking-widest text-muted-foreground opacity-50 font-mono">
        Shadcn Infinite Grid v1.1
      </footer>
    </div>
  );
};

export default App;
