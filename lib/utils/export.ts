import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

export const exportToPDF = async (slideIds: string[], projectTitle: string) => {
    try {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [1080, 1350] // Default 4:5 aspect ratio, will adjust dynamically
        });

        const slides = document.querySelectorAll('[data-slide-id]');
        if (slides.length === 0) {
            toast.error("No slides found to export.");
            return;
        }

        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i] as HTMLElement;
            // Capture at high resolution
            const canvas = await html2canvas(slide, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null
            });

            const imgData = canvas.toDataURL('image/png');
            
            if (i > 0) {
                pdf.addPage([1080, 1350]);
            }
            
            // Assuming 4:5 for now, logic can be expanded for other ratios
            pdf.addImage(imgData, 'PNG', 0, 0, 1080, 1350);
        }

        pdf.save(`${projectTitle.replace(/\s+/g, '_')}.pdf`);
        toast.success("PDF exported successfully!");
    } catch (error) {
        console.error("Export PDF error:", error);
        toast.error("Failed to export PDF.");
    }
};

export const exportToPNG = async (slideIds: string[]) => {
    try {
        const slides = document.querySelectorAll('[data-slide-id]');
        if (slides.length === 0) return;

        const zip = new JSZip();
        
        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i] as HTMLElement;
            const canvas = await html2canvas(slide, {
                scale: 2,
                useCORS: true,
                allowTaint: true
            });

            const imgData = canvas.toDataURL('image/png').split(',')[1];
            zip.file(`slide-${i + 1}.png`, imgData, { base64: true });
        }

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'carousel-slides.zip');
        toast.success("Slides exported as PNGs!");
    } catch (error) {
        console.error("Export PNG error:", error);
        toast.error("Failed to export PNGs.");
    }
};
