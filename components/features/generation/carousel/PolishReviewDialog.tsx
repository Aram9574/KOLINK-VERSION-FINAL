import React, { useState } from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SlideContent } from '@/types/carousel';
import { ArrowRight, Check, X, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface PolishReviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    originalContent: SlideContent;
    polishedContent: Partial<SlideContent>;
    onConfirm: () => void;
}

export const PolishReviewDialog: React.FC<PolishReviewDialogProps> = ({
    isOpen,
    onClose,
    originalContent,
    polishedContent,
    onConfirm
}) => {
    const [viewMode, setViewMode] = useState<'split' | 'tabbed'>('split');

    const ComparisonRow = ({ label, original, polished }: { label: string, original: string, polished?: string }) => {
        if (!polished || original === polished) return null;
        
        return (
            <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">{label}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-red-50/50 border border-red-100 rounded-lg text-sm text-slate-600 relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Undo2 className="w-3 h-3 text-red-300" />
                        </div>
                        {original}
                    </div>
                    <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-sm text-slate-800 font-medium relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Check className="w-3 h-3 text-emerald-500" />
                        </div>
                        {polished}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <span className="text-xl">✨</span> 
                        Review AI Polish
                    </DialogTitle>
                    <DialogDescription>
                        Review the changes suggested by the AI before applying them to your slide.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 px-1">
                    <div className="flex items-center justify-center mb-6 text-xs font-medium text-slate-500 gap-8">
                       <span className="flex items-center gap-2 text-red-400"><X className="w-3 h-3" /> Original</span>
                       <ArrowRight className="w-4 h-4 text-slate-300" />
                       <span className="flex items-center gap-2 text-emerald-600"><Check className="w-3 h-3" /> Polished</span>
                    </div>

                    <div className="space-y-6">
                        <ComparisonRow 
                            label="Title" 
                            original={originalContent.title} 
                            polished={polishedContent.title} 
                        />
                        <ComparisonRow 
                            label="Body" 
                            original={originalContent.body} 
                            polished={polishedContent.body} 
                        />
                        {originalContent.subtitle && polishedContent.subtitle && (
                            <ComparisonRow 
                                label="Subtitle" 
                                original={originalContent.subtitle} 
                                polished={polishedContent.subtitle} 
                            />
                        )}
                    </div>

                    {(!polishedContent.title && !polishedContent.body && !polishedContent.subtitle) && (
                         <div className="text-center py-12 text-slate-400 italic">
                            No significant changes detected.
                         </div>
                    )}
                </div>

                <DialogFooter className="shrink-0 gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} className="h-10">
                        Discard Changes
                    </Button>
                    <Button 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }} 
                        className="bg-brand-600 hover:bg-brand-700 text-white h-10 gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Apply Polish
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
