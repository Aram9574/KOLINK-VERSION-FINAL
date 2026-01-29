
import { useEffect } from 'react';
import { analytics } from '@/services/analyticsService';

export const ClickTracker = () => {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            // Basic throttling/filtering could happen here
            const x_pct = Math.round((e.clientX / window.innerWidth) * 100);
            const y_pct = Math.round((e.clientY / window.innerHeight) * 100);
            
            // Generate a simple CSS selector path (simplified)
            let elementPath = (e.target as HTMLElement).tagName.toLowerCase();
            if ((e.target as HTMLElement).id) elementPath += `#${(e.target as HTMLElement).id}`;
            
            analytics.track('heatmap_click' as any, { // Cast as any if type not yet added to union
                x_pct,
                y_pct,
                path: window.location.pathname,
                element: elementPath,
                viewport_w: window.innerWidth,
                viewport_h: window.innerHeight
            });
        };

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    return null; // Renderless component
};
