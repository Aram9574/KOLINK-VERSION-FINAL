import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TourTooltip } from './TourTooltip';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';
import { updateUserProfile } from '../../../services/userRepository';

interface Step {
    id: string;
    targetId: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    title: string;
    content: string;
}

export const OnboardingTour: React.FC = () => {
    const { user, setUser, language } = useUser();
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    
    const t = translations[language]?.dashboard?.tour;

    const steps: Step[] = useMemo(() => {
        if (!t || !t.steps) return [];
        return [
            {
                id: 'welcome',
                targetId: '', // Center of screen
                position: 'center',
                title: t.steps.welcome.title,
                content: t.steps.welcome.content
            },
            {
                id: 'create',
                targetId: 'tool-create',
                position: 'bottom',
                title: t.steps.create.title,
                content: t.steps.create.content
            },
            {
                id: 'carousel',
                targetId: 'tool-carousel',
                position: 'bottom',
                title: t.steps.carousel.title,
                content: t.steps.carousel.content
            },
            {
                id: 'analytics',
                targetId: 'insight-widget',
                position: 'top',
                title: t.steps.analytics.title,
                content: t.steps.analytics.content
            }
        ];
    }, [t]);

    // Update spotlight position when step changes
    useEffect(() => {
        if (!user.id || user.hasCompletedTour || steps.length === 0) return;

        // Show tour if not completed
        setIsVisible(true);

        const targetId = steps[currentStep].targetId;
        if (!targetId) {
            setTargetRect(null);
            return;
        }

        const updatePosition = () => {
            const element = document.getElementById(targetId);
            if (element) {
                setTargetRect(element.getBoundingClientRect());
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [currentStep, user, steps]);

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            await handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        setIsVisible(false);
        if (user.id) {
            try {
                await updateUserProfile(user.id, { hasCompletedTour: true });
                setUser(prev => ({ ...prev, hasCompletedTour: true }));
            } catch (error) {
                console.error("Failed to update tour status:", error);
            }
        }
    };

    if (!isVisible || user.hasCompletedTour) return null;

    return (
        <div className="fixed inset-0 z-[1000] overflow-hidden pointer-events-none">
            {/* SVG Mask for Spotlight */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <mask id="spotlight-mask">
                        <rect width="100%" height="100%" fill="white" />
                        {targetRect && (
                            <motion.rect
                                initial={false}
                                animate={{
                                    x: targetRect.left - 10,
                                    y: targetRect.top - 10,
                                    width: targetRect.width + 20,
                                    height: targetRect.height + 20,
                                    rx: 16
                                }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect 
                    width="100%" 
                    height="100%" 
                    fill="rgba(15, 23, 42, 0.7)" 
                    mask="url(#spotlight-mask)"
                    className="backdrop-blur-[2px]"
                />
            </svg>

            {/* Content Layer (Tooltips) */}
            <div className="absolute inset-0 pointer-events-auto">
                <AnimatePresence mode="wait">
                    <TourTooltip
                        key={steps[currentStep].id}
                        title={steps[currentStep].title}
                        content={steps[currentStep].content}
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        onSkip={handleComplete}
                        position={steps[currentStep].position}
                        targetRect={targetRect}
                    />
                </AnimatePresence>
            </div>
        </div>
    );
};
