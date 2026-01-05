import { useEffect, useRef, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { useToasts } from '../components/ui/toast';

// 30 minutes in milliseconds
const TIMEOUT_DURATION = 30 * 60 * 1000;
// Warning before timeout (optional, e.g. 1 minute before)
// const WARNING_DURATION = 1 * 60 * 1000; 

export const useSessionTimeout = () => {
    const { user, logout } = useUser();
    const toasts = useToasts();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityRef = useRef<number>(Date.now());

    const handleLogout = useCallback(async () => {
        if (!user.id) return;
        
        // Show toast explanation
        // Show toast explanation
        toasts.message({ text: "Session expired due to inactivity. You have been logged out for security.", action: "Close" });
        
        await logout();
    }, [user.id, logout]);

    const resetTimer = useCallback(() => {
        if (!user.id || user.id.startsWith('mock-')) return;

        lastActivityRef.current = Date.now();
        
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(handleLogout, TIMEOUT_DURATION);
    }, [user.id, handleLogout]);

    useEffect(() => {
        if (!user.id || user.id.startsWith('mock-')) return;

        // Events to track activity
        const events = [
            'mousedown', 
            'mousemove', 
            'keydown', 
            'scroll', 
            'touchstart',
            'click'
        ];

        // Throttle the reset to avoid performance hit on every mouse move
        let throttleTimer: NodeJS.Timeout | null = null;
        
        const handleActivity = () => {
             if (!throttleTimer) {
                 resetTimer();
                 throttleTimer = setTimeout(() => {
                     throttleTimer = null;
                 }, 1000); // Throttle to once per second
             }
        };

        // Initialize timer
        resetTimer();

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Cleanup
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (throttleTimer) clearTimeout(throttleTimer);
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [user.id, resetTimer]);

    return;
};
