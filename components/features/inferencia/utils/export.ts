import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportCarouselToPDF = async (elementIds: string[], fileName: string = "carousel") => {
    try {
        const pdf = new jsPDF("p", "mm", "a4");
        const slides = document.querySelectorAll(".carousel-slide-export"); // We will add this class to slides
        
        // Setup PDF dimensions based on first slide
        // Assuming all slides are same size for now (LinkedIn Portrait 4:5)
        // A4 is 210mm x 297mm.
        // LinkedIn typical is 1080x1350.
        
        let xOffset = 0;
        
        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i] as HTMLElement;
            
            // Generate canvas
            const canvas = await html2canvas(slide, {
                scale: 2, // High res
                useCORS: true, // For images
                backgroundColor: null
            });
            
            const imgData = canvas.toDataURL("image/png");
            const slideWidth = 210; // Full width A4
            const slideHeight = (canvas.height * slideWidth) / canvas.width;
            
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, 0, slideWidth, slideHeight);
        }

        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error("Export failed:", error);
        alert("Failed to export PDF. Please try again.");
    }
};
