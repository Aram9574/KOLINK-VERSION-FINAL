import { useState, useEffect, useMemo } from 'react';
import { 
    Calendar, 
    MessageSquare, 
    BrainCircuit, 
    Fingerprint, 
    History, 
    Settings as SettingsIcon,
    Home,
    Bell,
    HelpCircle,
    Shield,
    Mic,
    FileEdit,
    LayoutGrid,
    PenSquare
} from 'lucide-react';
import { UserProfile, AppTab } from '../types';
import { useUser } from '../context/UserContext';
import { usePosts } from '../context/PostContext';
import { translations } from '../translations';
import { TabItem } from '../components/ui/expandable-tabs';
import { ToolItem } from '../components/features/dashboard/launchpad/ToolsGrid';

interface UseLaunchpadProps {
    user: UserProfile;
    onSelectTool: (tab: AppTab) => void;
}

export const useLaunchpad = ({ user, onSelectTool }: UseLaunchpadProps) => {
    const { language, logout } = useUser();
    const { posts } = usePosts(); 
    const t = translations[language].dashboard.launchpad;
    
    const [showHelp, setShowHelp] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const shortcuts: TabItem[] = useMemo(() => [
        { title: t.shortcuts.home, icon: Home, onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { title: t.shortcuts.notifications, icon: Bell, onClick: () => onSelectTool('history') },
        { type: "separator" },
        { title: t.shortcuts.settings, icon: SettingsIcon, onClick: () => onSelectTool('settings') },
        { title: t.shortcuts.support, icon: HelpCircle, onClick: () => setShowHelp(true) },
        { title: t.shortcuts.security, icon: Shield, onClick: () => onSelectTool('audit') },
    ], [t, onSelectTool]);

    const stats = useMemo(() => {
        const weeklyGoal = 3;
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const postsThisWeek = posts.filter(p => new Date(p.createdAt || 0) >= startOfWeek).length;
        const nextMilestone = user.level < 5 ? `${t.stats.level} ${user.level + 1}` : t.stats.master;
        
        return {
            weeklyGoal,
            postsThisWeek,
            nextMilestone
        };
    }, [posts, user.level, t]);

    const tools: ToolItem[] = useMemo(() => [
        {
            id: 'create',
            name: t.tools.create.name,
            description: t.tools.create.desc,
            icon: PenSquare,
            color: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50/50',
            onClick: () => onSelectTool('create'),
            premium: false,
            badge: t.tools.create.badge,
            colSpan: 'lg:col-span-2'
        },
        {
            id: 'carousel',
            name: t.tools.carousel.name,
            description: t.tools.carousel.desc,
            icon: LayoutGrid,
            color: 'from-brand-500 to-brand-600',
            bg: 'bg-brand-50/50',
            onClick: () => onSelectTool('carousel'),
            premium: false,
            badge: t.tools.carousel.badge,
            colSpan: 'lg:col-span-1'
        },
        {
            id: 'chat',
            name: t.tools.chat.name,
            description: t.tools.chat.desc,
            icon: BrainCircuit,
            color: 'from-purple-500 to-purple-600',
            bg: 'bg-purple-50/50',
            onClick: () => onSelectTool('chat'),
            premium: true,
            badge: t.tools.chat.badge,
            colSpan: 'lg:col-span-1'
        },
        {
            id: 'autopost',
            name: t.tools.autopost.name,
            description: t.tools.autopost.desc,
            icon: Calendar,
            color: 'from-emerald-500 to-emerald-600',
            bg: 'bg-emerald-50/50',
            onClick: () => onSelectTool('autopilot'),
            premium: true,
            colSpan: 'lg:col-span-1'
        },
        {
            id: 'insight-responder',
            name: t.tools.responder.name,
            description: t.tools.responder.desc,
            icon: MessageSquare,
            color: 'from-amber-500 to-amber-600',
            bg: 'bg-amber-50/50',
            onClick: () => onSelectTool('insight-responder'),
            premium: true,
            colSpan: 'lg:col-span-1'
        },
        {
            id: 'audit',
            name: t.tools.audit.name,
            description: t.tools.audit.desc,
            icon: Fingerprint,
            color: 'from-rose-500 to-rose-600',
            bg: 'bg-rose-50/50',
            onClick: () => onSelectTool('audit'),
            premium: true,
            disabled: false,
            colSpan: 'lg:col-span-1'
        },
        {
            id: 'voice-lab',
            name: t.tools.voice.name,
            description: t.tools.voice.desc,
            icon: Mic,
            color: 'from-cyan-500 to-cyan-600',
            bg: 'bg-cyan-50/50',
            onClick: () => onSelectTool('voice-lab'),
            premium: true,
            colSpan: 'lg:col-span-1'
        },
        {
            id: 'editor',
            name: t.tools.editor.name,
            description: t.tools.editor.desc,
            icon: FileEdit,
            color: 'from-pink-500 to-pink-600',
            bg: 'bg-pink-50/50',
            onClick: () => onSelectTool('editor'),
            premium: false,
            colSpan: 'lg:col-span-1'
        },
        {
            id: 'history',
            name: t.tools.history.name,
            description: t.tools.history.desc,
            icon: History,
            color: 'from-slate-500 to-slate-600',
            bg: 'bg-slate-50/50',
            onClick: () => onSelectTool('history'),
            premium: false,
            colSpan: 'lg:col-span-1'
        },
        {
            id: 'settings',
            name: t.tools.settings.name,
            description: t.tools.settings.desc,
            icon: SettingsIcon,
            color: 'from-slate-400 to-slate-500',
            bg: 'bg-slate-50/50',
            onClick: () => onSelectTool('settings'),
            premium: false,
            colSpan: 'lg:col-span-1'
        }
    ], [t, onSelectTool]);

    return {
        language,
        logout,
        t,
        showHelp,
        setShowHelp,
        isFeedbackOpen,
        setIsFeedbackOpen,
        isLoading,
        shortcuts,
        stats,
        tools
    };
};
