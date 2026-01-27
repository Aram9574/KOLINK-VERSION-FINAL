import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { SlideRenderer } from '../SlideRenderer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export interface ExportHandle {
    exportToPdf: () => Promise<void>;
}

export const HiddenPdfRenderer = forwardRef<ExportHandle>((_, ref) => {
    const { project } = useCarouselStore();
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
        exportToPdf: async () => {
            if (!containerRef.current) return;
            
            const toastId = toast.loading("Generating High-Res PDF...");
            
            try {
                const slides = project.slides.filter(s => s.isVisible);
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [1080, 1350] // Default to 4:5 vertical max
                    // We will adjust page size per slide if needed, but usually carousels are uniform
                });

                // Calculate dimensions based on aspect ratio
                const width = 1080;
                let height = 1080;
                if (project.design.aspectRatio === '4:5') height = 1350;
                if (project.design.aspectRatio === '9:16') height = 1920;

                for (let i = 0; i < slides.length; i++) {
                    const slide = slides[i];
                    const element = document.getElementById(`export-slide-${slide.id}`);
                    
                    if (!element) continue;

                    if (i > 0) pdf.addPage([width, height]);
                    
                    // Set PDF page size for this page
                    pdf.setPage(i + 1);
                    // jsPDF internal resize if needed, but usually we just init correctly.
                    
                    const canvas = await html2canvas(element, {
                        scale: 2, // 2x scale for Retina-like quality
                        useCORS: true,
                        logging: false,
                        backgroundColor: null // Transparent? No, header uses white/bg.
                    });

                    const imgData = canvas.toDataURL('image/jpeg', 0.95); // JPEG 0.95 quality is good balance
                    pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
                    
                    // Progress toast?
                }

                pdf.save(`${project.title.replace(/\s+/g, '_') || 'carousel'}.pdf`);
                toast.success("PDF Downloaded successfully!", { id: toastId });

            } catch (err) {
                console.error("Export failed:", err);
                toast.error("Failed to generate PDF", { id: toastId });
            }
        }
    }));

    // Width is always 1080px for export standard
    const width = 1080;
    // Calculate Height
    let height = 1080;
    if (project.design.aspectRatio === '4:5') height = 1350;
    if (project.design.aspectRatio === '9:16') height = 1920;

    return (
        <div 
            style={{ 
                position: 'fixed', 
                left: '-9999px', 
                top: 0, 
                width: `${width}px` 
                // We don't set height on container, let items flow
            }} 
            ref={containerRef}
        >
            {project.slides.map((slide, index) => (
                <div 
                    key={slide.id} 
                    id={`export-slide-${slide.id}`}
                    style={{ 
                        width: `${width}px`, 
                        height: `${height}px`,
                        marginBottom: '20px' // Spacing just in case
                    }}
                >
                    {/* Reuse SlideRenderer but force active state visuals if needed? 
                        Actually SlideRenderer uses 'isActive' for some interactive borders. 
                        We want clean export. isActive=false usually.
                    */}
                    <SlideRenderer 
                        slide={slide} 
                        design={project.design} 
                        isActive={false} // Clean render
                        isExportMode={true} // Add this prop to disable interactive elements/borders
                    />
                </div>
            ))}
        </div>
    );
});

HiddenPdfRenderer.displayName = 'HiddenPdfRenderer';
