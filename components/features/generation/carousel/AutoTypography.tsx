import React, { useEffect, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(baseSize);

  // Heuristic-based calculation to avoid heavy DOM layout thrashing
  // We estimate based on character count and typical word lengths.
  useEffect(() => {
    if (!content) return;
    
    const charCount = content.length;
    
    // Simple decay function: simpler and faster than binary search loop
    let calculatedSize = baseSize;

    if (charCount < 10) calculatedSize = maxSize;
    else if (charCount < 20) calculatedSize = baseSize * 1.5; // Scale up for short catchy phrases
    else if (charCount < 40) calculatedSize = baseSize;
    else if (charCount < 80) calculatedSize = baseSize * 0.8;
    else if (charCount < 150) calculatedSize = baseSize * 0.6;
    else calculatedSize = baseSize * 0.5;

    // Clamp values
    calculatedSize = Math.max(minSize, Math.min(calculatedSize, maxSize));
    
    if (calculatedSize !== fontSize) {
        setFontSize(calculatedSize);
    }

  }, [content, baseSize, minSize, maxSize]);

  // Helper to parse bold markdown **text**
  const parseMarkdown = (text: string) => {
    // Sanitize input: prevent "undefined" string literal or null/undefined values
    if (!text || text === 'undefined') return "";

    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} className="text-brand-500 opacity-90" style={{ color: 'inherit', opacity: 0.8 }}>
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Component
      ref={containerRef}
      className={cn("whitespace-pre-wrap transition-all duration-300", className)}
      style={{
        fontFamily,
        fontSize: `${overrideFontSize || fontSize}px`,
        lineHeight: lineHeight,
        color: color,
        fontWeight: weight === 'black' ? 900 : weight === 'bold' ? 700 : weight === 'medium' ? 500 : 400,
      }}
    >
      {parseMarkdown(content)}
    </Component>
  );
};
