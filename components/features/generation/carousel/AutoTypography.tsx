import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';

interface AutoTypographyProps {
  content: string;
  fontFamily: string;
  baseSize?: number; // Starting font size (e.g., 64 for titles)
  minSize?: number;
  maxSize?: number;
  lineHeight?: number;
  className?: string;
  color?: string;
  weight?: 'normal' | 'medium' | 'bold' | 'black';
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  overrideFontSize?: number;
}

export const AutoTypography: React.FC<AutoTypographyProps> = ({
  content,
  fontFamily,
  baseSize = 48,
  minSize = 16,
  maxSize = 120,
  lineHeight = 1.2,
  className,
  color,
  weight = 'bold',
  as: Component = 'div',
  overrideFontSize,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [fontSize, setFontSize] = useState(overrideFontSize || baseSize);

  // If overrideFontSize changes, update state
  useEffect(() => {
    if (overrideFontSize) setFontSize(overrideFontSize);
  }, [overrideFontSize]);

  // Text Fitting Logic
  React.useLayoutEffect(() => {
    // If user manually overrode size, skip auto-fit
    if (overrideFontSize) return;
    if (!containerRef.current) return;

    const el = containerRef.current;
    
    // Reset to base size (or calculated heuristic max) to start measurement
    // We start large and shrink.
    // However, to avoid flash, we can start at current state or baseSize.
    
    // Heuristic start to save cycles
    const charCount = content.length;
    let startSize = baseSize;
    if (charCount < 10) startSize = maxSize;
    else if (charCount > 150) startSize = baseSize * 0.6;
    
    // Apply start size to measure
    el.style.fontSize = `${startSize}px`;

    // Binary search / Iterative reduction
    // We only shrink if it overflows.
    // Detection: scrollHeight > clientHeight (vertical overflow) 
    // OR scrollWidth > clientWidth (horizontal overflow - though we usually wrap)
    
    // We assume wrapping text (vertical growth).
    
    if (el.scrollHeight <= el.clientHeight) {
        // It fits! Can we grow it? 
        // Optional: logic to grow text to fill space is risky for layout. 
        // We focus on "Shrink to Fit" which is safer.
        setFontSize(Math.max(minSize, startSize));
        return;
    }

    // It overflows, shrink it.
    let min = minSize;
    let max = startSize;
    let bestFit = minSize;

    while (min <= max) {
        const mid = Math.floor((min + max) / 2);
        el.style.fontSize = `${mid}px`;

        if (el.scrollHeight <= el.clientHeight) {
            bestFit = mid;
            min = mid + 1; // Try larger
        } else {
            max = mid - 1; // Too big
        }
    }

    if (bestFit !== fontSize) {
        setFontSize(bestFit);
    }
    el.style.fontSize = `${bestFit}px`;

  }, [content, baseSize, minSize, maxSize, fontFamily, lineHeight, overrideFontSize]); // Removed containerRef.current?.clientHeight to prevent loop

  // Helper to parse bold markdown **text**
  const parseMarkdown = (text: string) => {
    if (!text || text === 'undefined') return "";
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} className="opacity-90" style={{ fontWeight: 900 }}>
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Component
      ref={containerRef as any}
      className={cn("whitespace-pre-wrap w-full", className)}
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        color: color,
        fontWeight: weight === 'black' ? 900 : weight === 'bold' ? 700 : weight === 'medium' ? 500 : 400,
        // Ensure container can report overflow
        overflow: 'hidden', 
        display: 'block', // or matching component
        wordBreak: 'break-word'
      }}
    >
      {parseMarkdown(content)}
    </Component>
  );
};
