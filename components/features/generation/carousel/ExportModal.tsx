import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, FileImage, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { supabase } from '@/services/supabaseClient';
import { SlideRenderer } from './SlideRenderer';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
    const { slides, design, author, title } = useCarouselStore(state => state.project);
    const [format, setFormat] = React.useState<'pdf' | 'png' | 'zip'>('pdf');
    const [quality, setQuality] = React.useState<'standard' | 'high'>('high');
    const [isExporting, setIsExporting] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const stagingRef = React.useRef<HTMLDivElement>(null);

    const handleExport = async () => {
        setIsExporting(true);
        setProgress(5);
        
        // Give React a moment to ensure hidden nodes are rendered
        await new Promise(resolve => setTimeout(resolve, 500)); 

        try {
            const scale = quality === 'high' ? 2 : 1.5; // High Res (2160px width) or Standard (1620px) - better than 1x
            
            // Get all slide nodes
            const slideNodes = stagingRef.current?.querySelectorAll('.export-slide-node');
            if (!slideNodes || slideNodes.length === 0) throw new Error("Could not find slides to export.");

            const images: string[] = [];
            const totalSlides = slideNodes.length;

            // Generate Images
            for (let i = 0; i < totalSlides; i++) {
                const node = slideNodes[i] as HTMLElement;
                const canvas = await html2canvas(node, {
                    scale: scale,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: null, // Transparent bg if set in slide
                    logging: false,
                    windowWidth: 1080, // Force context width
                });
                
                images.push(canvas.toDataURL('image/png', 1.0));
                setProgress(10 + Math.round(((i + 1) / totalSlides) * 60)); // Up to 70%
            }

            // Generate Output
            if (format === 'pdf') {
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [1080, 1080 * (design.aspectRatio === '4:5' ? 1.25 : design.aspectRatio === '9:16' ? 1.77 : 1)],
                    hotfixes: ['px_scaling'] 
                });

                // Aspect Ratio calc
                const width = 1080;
                const height = design.aspectRatio === '4:5' ? 1350 : design.aspectRatio === '9:16' ? 1920 : 1080;

                images.forEach((imgData, index) => {
                    if (index > 0) pdf.addPage([width, height]);
                    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
                });

                pdf.save(`${title.replace(/\s+/g, '_')}_kolink.pdf`);
            } else if (format === 'zip') {
                const zip = new JSZip();
                images.forEach((imgData, index) => {
                    const base64Data = imgData.replace(/^data:image\/png;base64,/, "");
                    const name = `slide_${index + 1}.png`;
                    zip.file(name, base64Data, { base64: true });
                });
                
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, `${title.replace(/\s+/g, '_')}_kolink.zip`);
            }

            setProgress(100);
            toast.success("Export successful!");
            setTimeout(() => {
                onClose();
                setIsExporting(false);
                setProgress(0);
            }, 1000);

        } catch (error: any) {
            console.error("Export Error:", error);
            toast.error("Client-side export failed: " + error.message);
            setIsExporting(false);
        }
    };

    return (
        <>
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Export Carousel</DialogTitle>
                    <DialogDescription>
                        Choose format and quality for your download.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label>Export Format</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setFormat('pdf')}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-medium transition-all ${format === 'pdf' ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                                <FileText className="w-6 h-6 mb-2 opacity-80" />
                                PDF (LinkedIn)
                            </button>
                            <button
                                onClick={() => setFormat('zip')}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-medium transition-all ${format === 'zip' ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                                <FileImage className="w-6 h-6 mb-2 opacity-80" />
                                Images (ZIP)
                            </button>
                             <button // Placeholder for future
                                disabled
                                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                            >
                                <FileImage className="w-6 h-6 mb-2 opacity-50" />
                                PNG (Single)
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Quality</Label>
                        <Select value={quality} onValueChange={(v: any) => setQuality(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="standard">Standard (Faster)</SelectItem>
                                <SelectItem value="high">High Definition (Print ready)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {isExporting && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Generating files...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-brand-500 transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isExporting}>Cancel</Button>
                    <Button onClick={handleExport} disabled={isExporting} className="gap-2">
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isExporting ? 'Exporting...' : 'Download Now'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        {/* Hidden Staging Area for High-Fidelity Capture */}
        {isOpen && (
            <div 
                ref={stagingRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: '-10000px', // Far off-screen
                    zIndex: -1000,
                    width: '1080px', // Exact base width
                    height: 'auto',
                    pointerEvents: 'none'
                }}
            >
                {slides.map((slide, i) => (
                    <div 
                        key={slide.id} 
                        className="export-slide-node"
                        style={{
                            width: 1080,
                            height: design.aspectRatio === '4:5' ? 1350 : design.aspectRatio === '9:16' ? 1920 : 1080,
                            marginBottom: 20
                        }}
                    >
                        <SlideRenderer 
                            slide={slide}
                            design={design}
                            author={author}
                            scale={1} // Helper scales 1:1 to container
                            isActive={false} // Clean mode
                        />
                        {/* Add Slide Number Overlay if needed, but usually baking it in logic is better */}
                    </div>
                ))}
            </div>
        )}
        </>
    );
};
