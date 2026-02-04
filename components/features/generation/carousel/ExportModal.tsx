import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';
import { 
    Lock, 
    FileText, 
    FileImage, 
    Loader2, 
    Download,
    Hash,
    Copy,
    Check
} from 'lucide-react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SlideRenderer } from './SlideRenderer';
import { supabase } from '@/services/supabaseClient';
import { analytics } from '@/services/analyticsService';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
    const { slides, design, author, title } = useCarouselStore(state => state.project);
    const { user } = useUser();
    const t = translations[user?.language || 'es'];
    const isFree = user?.planTier === 'free';

    const [format, setFormat] = React.useState<'pdf' | 'png' | 'zip'>('pdf');
    const [quality, setQuality] = React.useState<'standard' | 'high'>('high');
    const [isExporting, setIsExporting] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const stagingRef = React.useRef<HTMLDivElement>(null);
    
    // Hashtag State
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [loadingTags, setLoadingTags] = useState(false);
    const [copiedTags, setCopiedTags] = useState(false);

    const handleGenerateHashtags = async () => {
        setLoadingTags(true);
        try {
            // Collect text from first few slides to generate context
            const context = slides.slice(0, 3).map(s => s.content.title + " " + s.content.body).join(" ");
            
            const { data, error } = await supabase.functions.invoke('generate-viral-post', {
                body: {
                    params: {
                        mode: 'micro_edit', // Using micro_edit for simple text generation
                        action: 'Generate 10 viral hashtags for this LinkedIn/Instagram carousel topic. Return ONLY the hashtags separated by spaces.',
                        topic: context, // Passing context as topic
                    }
                }
            });

            if (error) throw error;
            
            // Extract hashtags from response
            const tagString = data?.post_content || "";
            const tags = tagString.match(/#[\w\u0590-\u05ff]+/g) || [];
            
            if (tags.length > 0) {
                setHashtags(tags);
                toast.success("Hashtags generated!");
            } else {
                 setHashtags(["#Growth", "#LinkedIn", "#Carousel", "#Marketing", "#Viral"]);
                 toast.warning("AI didn't return tags, using defaults.");
            }

        } catch (err) {
            console.error(err);
            toast.error("Failed to generate hashtags");
            // Fallback
            setHashtags(["#Growth", "#LinkedIn", "#Carousel", "#Marketing", "#Viral"]);
        } finally {
            setLoadingTags(false);
        }
    };

    const copyHashtags = () => {
        navigator.clipboard.writeText(hashtags.join(' '));
        setCopiedTags(true);
        toast.success("Hashtags copied!");
        setTimeout(() => setCopiedTags(false), 2000);
    };

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

            // ... (inside the component)

            setProgress(100);
            
            // Analytics Tracking
            analytics.track('carousel_exported', {
                format,
                quality,
                slide_count: slides.length,
                is_free: isFree,
                has_watermark: isFree,
                aspect_ratio: design.aspectRatio
            });

            toast.success("¡Exportación exitosa!");
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
            <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Exportar Carrusel</DialogTitle>
                    <DialogDescription>
                        Elige formato y calidad de descarga.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Format Selection */}
                    <div className="space-y-2">
                        <Label>Formato</Label>
                        <div className="grid grid-cols-2 gap-2">
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
                                Imágenes (ZIP)
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Calidad</Label>
                        <Select value={quality} onValueChange={(v: any) => setQuality(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="standard">Estándar (Rápido)</SelectItem>
                                <SelectItem value="high">Alta Definición (Print ready)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {/* Smart Hashtags (New) */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                                <Hash className="w-3.5 h-3.5 text-slate-500" />
                                Hashtags Inteligentes (IA)
                            </Label>
                            {!hashtags.length && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 text-[10px]"
                                    onClick={handleGenerateHashtags}
                                    disabled={loadingTags}
                                >
                                    {loadingTags ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Hash className="w-3 h-3 mr-1" />}
                                    Generar
                                </Button>
                            )}
                        </div>
                        
                        {hashtags.length > 0 && (
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 relative group">
                                <p className="text-xs text-slate-600 leading-relaxed pr-8 font-mono">
                                    {hashtags.join(' ')}
                                </p>
                                <button 
                                    onClick={copyHashtags}
                                    className="absolute top-2 right-2 p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {copiedTags ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        )}
                    </div>

                    {isFree && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-amber-600" />
                                <span className="text-xs text-amber-800 font-medium">{t.carouselStudio.properties?.export?.watermarkNotice || "Free Plan: Watermark added"}</span>
                            </div>
                            <Button size="sm" variant="ghost" className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 h-8 text-xs" onClick={() => window.open('/#pricing', '_blank')}>
                                {t.carouselStudio.properties?.export?.removeWatermark || "Upgrade"}
                            </Button>
                        </div>
                    )}

                    {isExporting && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Generando archivos...</span>
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
                    <Button variant="outline" onClick={onClose} disabled={isExporting}>Cancelar</Button>
                    <Button onClick={handleExport} disabled={isExporting} className="gap-2">
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isExporting ? 'Exportando...' : 'Descargar Ahora'}
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
                            position: 'relative', // IMPORTANT for absolute watermark
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
                        
                        {isFree && (
                            <div style={{
                                position: 'absolute',
                                bottom: '40px',
                                right: '40px',
                                background: 'rgba(255, 255, 255, 0.85)',
                                backdropFilter: 'blur(8px)',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                fontSize: '24px', // Large for 1080p canvas
                                fontWeight: '600',
                                color: '#0f172a',
                                zIndex: 100,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.5)'
                            }}>
                                <span style={{ opacity: 0.7 }}>⚡️</span>
                                {t.carouselStudio.properties?.export?.createdWith || "Created with Kolink.ai"}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
        </>
    );
};
