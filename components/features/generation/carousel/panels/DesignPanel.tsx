import React, { useState } from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wand2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';

export const DesignPanel = () => {
    const { updateDesign } = useCarouselStore();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    const handleGenerateBackground = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        toast.loading("Dreaming up your background...");

        try {
            // Using generate-image edge function
            const { data, error } = await supabase.functions.invoke('generate-image', {
                body: { 
                    prompt: `Professional LinkedIn background texture, abstract, aesthetic: ${prompt}`,
                    size: '1024x1024'
                }
            });

            if (error) throw error;
            
            if (data?.image_url) {
                updateDesign({
                    background: {
                        type: 'image',
                        value: data.image_url,
                        patternType: 'none'
                    }
                });
                toast.success("Background generated!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Generation failed");
            // Simulate for demo (mock)
            const mockUrl = `https://source.unsplash.com/random/1080x1350/?${encodeURIComponent(prompt)},background`;
            updateDesign({
                background: {
                    type: 'image',
                    value: mockUrl,
                    patternType: 'none'
                }
            });
            toast.success("Used stock image (Simulated AI)");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-brand-500" />
                    AI Background Studio
                </h3>
                <p className="text-xs text-slate-500">Describe a vibe, get a unique background.</p>
            </div>

            <div className="space-y-3">
                <div className="space-y-1">
                    <Label className="text-xs">Prompt</Label>
                    <Input 
                        placeholder="e.g. Minimalist geometric gradients blue" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="text-xs h-9"
                    />
                </div>
                <Button 
                    className="w-full h-8 text-xs bg-brand-600 hover:bg-brand-700" 
                    onClick={handleGenerateBackground}
                    disabled={isGenerating || !prompt}
                >
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <ImageIcon className="w-3 h-3 mr-2" />}
                    Generate Background
                </Button>
            </div>

            <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center">
                 <p className="text-[10px] text-slate-400">
                    Pro Tip: Use keywords like "texture", "gradient", "abstract" for best results on text overlays.
                 </p>
            </div>
        </div>
    );
};
