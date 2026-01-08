import React from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';

export const DesignPanel = () => {
    // This panel is currently redundant as all design controls are in the "Global Design" tab 
    // of the Properties Panel on the right. 
    // We can either deprecate this panel or use it for something else.
    // For now, let's show a helpful message pointing to the right panel.

    return (
        <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m9 18 6-6-6-6"/></svg>
            </div>
            <h3 className="text-sm font-bold text-slate-800">Design Settings</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
                Use the <strong>Global Design</strong> tab in the right sidebar to customize colors, fonts, and patterns for your carousel.
            </p>
        </div>
    );
};
