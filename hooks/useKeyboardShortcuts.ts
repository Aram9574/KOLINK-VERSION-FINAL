import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppTab } from '../types';

interface KeyboardShortcutsProps {
    onNavigate: (tab: AppTab) => void;
}

export const useKeyboardShortcuts = ({ onNavigate }: KeyboardShortcutsProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if input/textarea is focused
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                return;
            }

            // Shortcuts
            switch (e.key.toLowerCase()) {
                case 'c':
                    onNavigate('create');
                    break;
                case 's':
                    onNavigate('settings');
                    break;
                case 'h':
                    onNavigate('home');
                    break;
                case 'a':
                    onNavigate('autopost' as any);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNavigate]);
};
