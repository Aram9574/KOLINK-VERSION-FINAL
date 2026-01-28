
import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { Button } from '@/components/ui/button';
import { Loader2, Zap } from 'lucide-react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { useUser } from '@/context/UserContext';
import { translations } from '@/translations';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Helper function to calculate basic score
const calculateBasicScore = (text: string): { score: number; color: string; label: string } => {
    if (!text) return { score: 0, color: 'text-slate-400', label: 'Empty' };
    
    let score = 50; // Base
    const words = text.split(/\s+/).length;
    
    // Length heuristics
    if (words > 10 && words < 50) score += 10; // Goldilocks zone for slides
    if (words > 100) score -= 10; // Too long
    
    // Formatting
    if (text.includes('•') || text.includes('- ')) score += 5; // Lists are good
    if (text.match(/[0-9]%?/)) score += 5; // Numbers are good
    if (text.includes('?')) score += 5; // Questions engage
    
    // Cap
    score = Math.min(Math.max(score, 0), 100);
    
    let color = 'text-yellow-500';
    let label = 'Promedio';
    
    if (score >= 80) { color = 'text-green-500'; label = 'Viral'; }
    else if (score < 50) { color = 'text-red-400'; label = 'Débil'; }
    
    return { score, color, label };
};

export const ViralGauge: React.FC = () => {
    const { user } = useUser();
    const t = translations[user?.language || 'es'].carouselStudio;
    const activeSlideId = useCarouselStore(state => state.editor.activeSlideId);
    const slides = useCarouselStore(state => state.project.slides);
    const setSlideContent = useCarouselStore(state => state.updateSlide);
    
    const activeSlide = slides.find(s => s.id === activeSlideId);
    
    const [scoreData, setScoreData] = useState({ score: 0, color: 'text-slate-400', label: 'Start' });
    const [analyzing, setAnalyzing] = useState(false);

    // Live update on content change
    useEffect(() => {
        if (!activeSlide) return;
        const text = (activeSlide.content.title || '') + " " + (activeSlide.content.body || '');
        setScoreData(calculateBasicScore(text));
    }, [activeSlide?.content]);

    const handleDeepAnalysis = async () => {
        if (!activeSlide) return;
        setAnalyzing(true);
        try {
            const { data, error } = await supabase.functions.invoke('predict-performance', {
                body: { 
                    content: JSON.stringify(activeSlide.content),
                    language: user?.language || 'es'
                }
            });

            if (error) throw error;

            console.log("Prediction:", data);
            
            // If we got a better score from AI, use it. Logic could be more complex.
            // For now, let's just toast the AI feedback
            const aiScore = data.predicted_performance.total_score;
             setScoreData({
                  score: aiScore,
                  color: aiScore > 80 ? 'text-green-500' : aiScore > 50 ? 'text-yellow-500' : 'text-red-500',
                  label: 'AI Verified'
            });

            toast.success(`AI Score: ${aiScore}/100`, {
                description: data.micro_optimization_tips?.[0] || "Good content!"
            });

        } catch (error) {
            console.error(error);
            toast.error("Analysis failed");
        } finally {
            setAnalyzing(false);
        }
    };

    if (!activeSlide) return null;

    return (
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 h-9">
            <div className="flex flex-col items-end leading-none">
                <span className={cn("text-xs font-bold", scoreData.color)}>{scoreData.score}%</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">Viral Score</span>
            </div>
            
            <div className="h-full w-px bg-slate-200 mx-1" />
            
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-slate-400 hover:text-brand-500"
                onClick={handleDeepAnalysis}
                disabled={analyzing}
                title="Deep AI Analysis"
            >
                {analyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            </Button>
        </div>
    );
};
