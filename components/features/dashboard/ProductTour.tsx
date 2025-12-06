
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position?: 'left' | 'right' | 'top' | 'bottom'; // Deprecated but kept for compatibility
}

interface ProductTourProps {
  steps: TourStep[];
  onComplete: () => void;
  labels: {
    skip: string;
    back: string;
    next: string;
    start: string;
  };
}

const ProductTour: React.FC<ProductTourProps> = ({ steps, onComplete, labels }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [position, setPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  useEffect(() => {
    const updatePosition = () => {
      const element = document.getElementById(currentStep.targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });

        // Scroll element into view smoothly
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Fallback if element not found (center screen roughly)
        setPosition(null);
      }
    };

    // Small delay to ensure DOM is ready and animations finished
    const timer = setTimeout(updatePosition, 300);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(timer);
    };
  }, [currentStepIndex, currentStep.targetId]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>

      {/* 1. Spotlight / Backdrop Layer */}
      {/* This creates the dark overlay with a "hole" for the target element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base darkening */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] transition-colors duration-500"></div>

        {/* The Spotlight Highlight */}
        {position && (
          <div
            className="absolute rounded-xl shadow-[0_0_0_9999px_rgba(15,23,42,0.6)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] border-2 border-brand-400/50 box-content"
            style={{
              top: position.top - 4,
              left: position.left - 4,
              width: position.width + 8,
              height: position.height + 8,
              boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.75)' // Stronger overlay around the hole
            }}
          />
        )}
      </div>

      {/* 2. Central Modal Card */}
      <div className="relative z-50 w-full max-w-md mx-4 perspective-1000">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 transform transition-all duration-500 animate-in zoom-in-95 slide-in-from-bottom-8">

          {/* Header: Progress & Skip */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStepIndex ? 'w-6 bg-brand-600' : 'w-1.5 bg-slate-200'
                    }`}
                />
              ))}
            </div>
            <button
              onClick={handleComplete}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider transition-colors px-2 py-1"
            >
              {labels.skip}
            </button>
          </div>

          {/* Content */}
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mb-4 shadow-sm">
              {/* Dynamic Icon based on step index could go here, using simplified logic for now */}
              <span className="font-display font-bold text-xl">{currentStepIndex + 1}</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
              {currentStep.title}
            </h3>
            <p className="text-slate-500 leading-relaxed text-lg">
              {currentStep.description}
            </p>
          </div>

          {/* Footer: Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors
                        ${currentStepIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
            >
              <ArrowLeft className="w-4 h-4" />
              {labels.back}
            </button>

            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg shadow-brand-500/20 hover:-translate-y-0.5 transition-all
                        ${isLastStep ? 'bg-slate-900 hover:bg-slate-800' : 'bg-brand-600 hover:bg-brand-700'}
                    `}
            >
              {isLastStep ? labels.start : labels.next}
              {isLastStep ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProductTour;
