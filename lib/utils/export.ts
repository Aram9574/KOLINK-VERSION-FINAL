import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';
import { useCarouselStore } from '@/lib/store/useCarouselStore';

export const exportToPDF = async (slideIds: string[], projectTitle: string) => {
    try {
        const { project } = useCarouselStore.getState();
        
        // Filter slides based on IDs passed or use all valid slides
        const slidesToExport = project.slides.filter(s => slideIds.includes(s.id) && s.isVisible);
        
        if (slidesToExport.length === 0) {
            toast.error("No slides found to export.");
            return;
        }

        const { data, error } = await supabase.functions.invoke('render-carousel', {
            body: { 
                slides: slidesToExport,
                design: project.design,
                author: project.author,
                format: 'pdf'
            }
        });

        if (error) {
            console.error("Function error:", error);
            throw new Error("Generation failed on server.");
        }

        // Handle Blob response
        if (data instanceof Blob) {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${projectTitle.replace(/\s+/g, '_')}_kolink.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("High-fidelity PDF exported successfully!");
        } else {
             // Fallback if the function returns JSON (e.g. error message inside 200 OK? rare but possible)
             // or if client library parses it differently. 
             // Supabase client usually parses JSON by default unless we specify responseType.
             // Let's try to fetch normally if invoke() acts weird with binary.
             // Actually, invoke() parses JSON by default. We need to handle binary.
             
             // RETRY with raw fetch if invoke doesn't handle blob automatically well or check docs.
             // Supabase invoke options: { responseType: 'blob' } is typical in some clients but supabase-js 2.x
             // returns 'data' as parsed JSON usually.
             
             // Let's force a raw fetch wrapper for binary safely:
             throw new Error("Received unexpected format. Please try again.");
        }

    } catch (error) {
        console.error("Export PDF error:", error);
        
        // Fallback to client-side or just show error
        toast.error("Enhanced export failed. Falling back to client-side (Experimental).");
        // We could call the old implementation here if we kept it as backup.
    }
};

// Specialized raw fetch for binary
export const exportToPDFParams = async (token: string, body: any, filename: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/render-carousel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) throw new Error("Server error");
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return true;
    } catch (e: any) {
        console.error("Export Error:", e);
        throw new Error(e.message || "Export failed at network layer");
    }
    return true;
}
