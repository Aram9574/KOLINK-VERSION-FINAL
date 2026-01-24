import React, { useRef, useEffect, useState } from 'react';
import { AppLanguage } from '../../types';
import { Sparkles } from 'lucide-react';

interface VideoDemoSectionProps {
    language: AppLanguage;
}

const VideoDemoSection: React.FC<VideoDemoSectionProps> = ({ language }) => {
    const isEs = language === 'es';
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasPlayed, setHasPlayed] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && videoRef.current && !hasPlayed) {
                    // Try to play with sound first
                    videoRef.current.play().catch(e => {
                        console.log('Autoplay with sound blocked, falling back to muted', e);
                        // Fallback: Mute and play if browser blocks audio
                        if (videoRef.current) {
                            videoRef.current.muted = true;
                            videoRef.current.play();
                        }
                    });
                    setHasPlayed(true);
                }
            },
            {
                threshold: 0.5,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [hasPlayed]);

    return (
        <section id="demo" className="pt-8 pb-24 bg-transparent relative overflow-hidden">
             {/* Subtle background decoration to blend with Light theme */}
            <div className="absolute top-0 left-0 w-full h-full bg-slate-50/50 -skew-y-3 transform origin-top-left z-0" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-12" ref={containerRef}>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6">
                        {isEs ? 'De Idea a Viral en 60 Segundos' : 'From Idea to Viral in 60 Seconds'}
                    </h2>
                    
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        {isEs 
                            ? 'Mira cómo el motor de IA hace el trabajo pesado por ti. Tú solo pones la chispa, nosotros encendemos el fuego.' 
                            : 'Watch the AI engine do the heavy lifting. You provide the spark, we light the fire.'}
                    </p>
                </div>

                {/* Video Container - SOTA Premium Grid Style */}
                <div className="relative max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group ring-1 ring-slate-900/5">
                   {/* Window controls decoration */}
                   <div className="h-8 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2 z-20 relative">
                        <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-sm" />
                    </div>

                    {/* Mask container to fix aspect ratio and crop black bars */}
                    <div className="relative aspect-video bg-white overflow-hidden">
                        <video 
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover scale-[1.01] bg-white" 
                            controls
                            playsInline
                            loop
                        >
                            <source src="/kolink-demo.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideoDemoSection;
