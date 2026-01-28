import { useEffect, useState } from 'react';

export const useExitIntent = (enabled: boolean = true) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        if (!enabled || hasTriggered) return;

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                // User moved mouse to top of screen (intent to close tab/switch)
                // Check if we already showed it this session
                const storageKey = 'kolink_exit_intent_shown';
                const alreadyShown = sessionStorage.getItem(storageKey);

                if (!alreadyShown) {
                    setIsVisible(true);
                    setHasTriggered(true);
                    sessionStorage.setItem(storageKey, 'true');
                }
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [enabled, hasTriggered]);

    return { isVisible, setIsVisible };
};
