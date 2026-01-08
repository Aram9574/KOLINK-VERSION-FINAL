import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, FileImage, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { supabase } from '@/services/supabaseClient';
import { exportToPDFParams } from '@/lib/utils/export';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
    const { slides, design, author, title } = useCarouselStore(state => state.project);
    const [format, setFormat] = React.useState<'pdf' | 'png' | 'zip'>('pdf');
    const [quality, setQuality] = React.useState<'standard' | 'high'>('high');
    const [isExporting, setIsExporting] = React.useState(false);
    const [progress, setProgress] = React.useState(0); // Fake progress for UX

    const handleExport = async () => {
        setIsExporting(true);
        setProgress(10);
        
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) throw new Error("Not authenticated");

            // Fake progress animation
            const interval = setInterval(() => {
                setProgress(p => Math.min(p + 10, 90));
            }, 500);

            if (format === 'pdf') {
                 await exportToPDFParams(token, {
                    slides,
                    design,
                    author,
                    format: 'pdf',
                    quality // future proofing
                }, `kolink_${title.replace(/\s+/g, '_')}.pdf`);
            } else {
                 // Fallback or implementation for other formats if backend supports them
                 // For now, let's just do PDF as it's the main requested one, 
                 // effectively forcing PDF if other selected or showing a 'coming soon' toast
                     toast.info("PNG/ZIP export coming soon. Exporting as PDF for now.");
                     await exportToPDFParams(token, {
                        slides,
                        design,
                        author,
                        format: 'pdf',
                    }, `kolink_${title.replace(/\s+/g, '_')}.pdf`);
            }
            
            clearInterval(interval);
            setProgress(100);
            toast.success("Export successful!");
            setTimeout(() => {
                onClose();
                setIsExporting(false);
                setProgress(0);
            }, 1000);

        } catch (error: any) {
            console.error(error);
            toast.error("Export failed: " + error.message);
            setIsExporting(false);
        }
    };

    return (
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
    );
};
