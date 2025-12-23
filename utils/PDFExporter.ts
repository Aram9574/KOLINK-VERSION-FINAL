import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

export const exportCarouselToPDF = async (
    containerId: string,
    filename: string = "linkedin-carousel.pdf",
) => {
    const container = document.getElementById(containerId);
    if (!container) throw new Error("Carousel container not found");

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [1080, 1350], // Standard LinkedIn Carousel Aspect Ratio (4:5)
    });

    const slides = container.querySelectorAll(".slide-canvas");

    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i] as HTMLElement;

        const canvas = await html2canvas(slide, {
            scale: 2, // Higher resolution
            useCORS: true,
            backgroundColor: null,
        });

        const imgData = canvas.toDataURL("image/png");

        if (i > 0) pdf.addPage([1080, 1350], "portrait");

        pdf.addImage(imgData, "PNG", 0, 0, 1080, 1350);
    }

    pdf.save(filename);
};
