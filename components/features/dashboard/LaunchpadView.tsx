import React from 'react';
import { 
    Sparkles, 
    Calendar, 
    MessageSquare, 
    BrainCircuit, 
    Fingerprint, 
    History, 
    ChevronRight,
    ArrowRight,
    Crown,
    Settings as SettingsIcon,
    Clock,
    Zap,
    Play,
    LogOut,
    LayoutGrid,
    PenSquare,
    Layers,
    Bell,
    Home,
    HelpCircle,
    Shield,
    Grid,
    Mic,
    FileEdit,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserProfile, AppTab } from '../../../types';
import { getAvatarUrl } from '../../../utils';
import { useUser } from '../../../context/UserContext';
import { usePosts } from '../../../context/PostContext';
import { translations } from '../../../translations';
import { ExpandableTabs } from '../../ui/expandable-tabs';
import HelpModal from '../../modals/HelpModal';
import { FeedbackModal } from '../../modals/FeedbackModal';
import Skeleton from '../../ui/Skeleton';
import { OnboardingChecklist } from '../onboarding/OnboardingChecklist';
import Tooltip from '../../ui/Tooltip';

interface LaunchpadProps {
    user: UserProfile;
    onSelectTool: (tab: AppTab) => void;
}

const LaunchpadView: React.FC<LaunchpadProps> = ({ 
    user,
    onSelectTool 
}) => {
    const { language, logout } = useUser();
    const { posts } = usePosts(); 
    const t = translations[language].dashboard.launchpad;
    const commonT = translations[language];
    const [showHelp, setShowHelp] = React.useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    // Simulate initial load for premium feel
    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Dynamic Calculations
    
    // Define shortcuts ONLY ONCE
    const shortcuts = [
        { title: t.shortcuts.home, icon: Home, onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { title: t.shortcuts.notifications, icon: Bell, onClick: () => onSelectTool('history') },
        { type: "separator" as const },
        { title: t.shortcuts.settings, icon: SettingsIcon, onClick: () => onSelectTool('settings') },
        { title: t.shortcuts.support, icon: HelpCircle, onClick: () => setShowHelp(true) },
        { title: t.shortcuts.security, icon: Shield, onClick: () => onSelectTool('audit') },
    ];
    
    const weeklyGoal = 3;
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const postsThisWeek = posts.filter(p => new Date(p.createdAt || 0) >= startOfWeek).length;
    
    const nextMilestone = user.level < 5 ? `${t.stats.level} ${user.level + 1}` : t.stats.master;
    const xpToNext = (user.level + 1) ** 2 * 100 - user.xp;
    
    const nextLevelXP = Math.pow(user.level + 1, 2) * 100;
    const progressToNextLevel = Math.min(100, (user.xp / nextLevelXP) * 100);

    const tools = [
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
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen flex flex-col p-6 lg:p-12">
            {/* Hero Section */}
            
            {/* Personal Mission Control Header */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                    <div>
                        <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mb-2 tracking-tight">
                            Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">{user.name?.split(' ')[0] || 'Experto'}</span>.
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            {t.stats.hero}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                         <div className="px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                             <Grid size={14} />
                             {t.stats.week} 4
                         </div>
                         <div className="px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                             <Zap size={14} fill="currentColor" />
                             {user.currentStreak || 0} {t.stats.streak}
                         </div>
                    </div>
                </div>

                 <div className="glass-premium w-full rounded-2xl p-1 flex">
                    <div className="w-full rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 ring-1 ring-blue-50">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">
                                    {language === 'es' ? 'Oportunidad Detectada' : 'Opportunity Detected'}
                                </h4>
                                <p className="text-sm text-slate-600">
                                    {language === 'es' 
                                        ? 'El tema "IA en Real Estate" es tendencia. Crea un post ahora.' 
                                        : 'Topic "AI in Real Estate" is trending. Draft a post now.'}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => onSelectTool('create')}
                            className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <PenSquare className="w-4 h-4" />
                            {language === 'es' ? 'Aprovechar Tendencia' : 'Ride the Trend'}
                        </button>
                    </div>
                 </div>
            </div>

            {/* Activation Checklist */}
            <div className="mb-10">
                <OnboardingChecklist 
                    user={user} 
                    onSelectTool={onSelectTool} 
                />
            </div>

            {/* Launch Grid */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                         <span className="w-2 h-6 bg-brand-500 rounded-full" />
                         Centro de Comando
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                             <span>C: Crear</span>
                             <span className="text-slate-300">|</span>
                             <span>H: Inicio</span>
                             <span className="text-slate-300">|</span>
                             <span>S: Ajustes</span>
                        </div>
                        <ExpandableTabs 
                            tabs={shortcuts as any} 
                            activeColor="text-brand-600"
                            className="border-slate-200/60 bg-white/50 backdrop-blur-sm"
                        />
                    </div>
                </div>

                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {isLoading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="p-8 rounded-[2rem] bg-white border border-slate-100 flex flex-col gap-6">
                                <Skeleton className="w-16 h-16 rounded-2xl" />
                                <div className="space-y-3">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            </div>
                        ))
                    ) : (
                        tools.map((tool) => (
                            <motion.button
                                key={tool.id}
                                variants={item}
                                onClick={tool.disabled ? undefined : tool.onClick}
                                disabled={tool.disabled}
                                whileHover={tool.disabled ? {} : { y: -5, scale: 1.01 }}
                                whileTap={tool.disabled ? {} : { scale: 0.98 }}
                                className={`group relative text-left p-8 rounded-3xl glass-premium hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)] transition-all duration-500 overflow-hidden z-0 cursor-pointer ${tool.colSpan || 'col-span-1'} ${tool.disabled ? 'opacity-75 cursor-not-allowed grayscale-[0.5]' : ''}`}
                            >
                                {/* Shine Effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none" />

                                
                                {/* Gradient Background Wash */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${tool.bg} opacity-0 ${!tool.disabled && 'group-hover:opacity-100'} transition-opacity duration-500`} />
                                
                                {/* Accent Orb */}
                                <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${tool.color} opacity-[0.03] ${!tool.disabled && 'group-hover:opacity-1'} blur-3xl transition-all duration-500 rounded-full`} />
    
                                <div className="relative z-10 flex flex-col h-full gap-6">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg text-white relative transform ${!tool.disabled && 'group-hover:scale-105 group-hover:rotate-1'} transition-transform duration-500`}>
                                            <tool.icon className="w-8 h-8" />
                                            {tool.premium && !user.isPremium && !tool.disabled && (
                                                <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                                                    <Crown className="w-4 h-4 text-amber-500 fill-current" />
                                                </div>
                                            )}
                                            {/* Disabled / Coming Soon Badge */}
                                            {tool.disabled && (
                                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                                                    <Tooltip>
                                                        <div className="space-y-1.5">
                                                            <p className="font-bold flex items-center gap-1.5 text-brand-400">
                                                                <Grid className="w-3 h-3" />
                                                                {language === 'es' ? 'Próximamente' : 'Coming Soon'}
                                                            </p>
                                                            <p className="opacity-80">
                                                                {language === 'es' 
                                                                    ? 'Estamos entrenando a la IA para analizar perfiles en profundidad. Disponible Q1 2026.' 
                                                                    : 'We are training the AI to analyze profiles in depth. Available Q1 2026.'}
                                                            </p>
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col items-end gap-2">
                                             {tool.badge && !tool.disabled && (
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm ${
                                                    tool.badge === 'NUEVO' ? 'bg-brand-100 text-brand-600' : 
                                                    tool.badge === 'POPULAR' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {tool.badge}
                                                </span>
                                            )}
                                            {!tool.disabled && (
                                                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                     <ArrowRight className="w-4 h-4 text-slate-900" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col flex-1">
                                        <h3 className={`text-xl font-bold text-slate-900 mb-2 ${!tool.disabled && 'group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700'} transition-colors`}>
                                            {tool.name}
                                        </h3>
                                        <p className={`text-slate-500 font-medium text-sm leading-relaxed ${!tool.disabled && 'group-hover:text-slate-600'} transition-colors`}>
                                            {tool.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.button>
                        ))
                    )}

                    {/* Quick Action Card (Static) */}
                    <motion.div 
                        variants={item}
                        onClick={() => setIsFeedbackOpen(true)}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-8 rounded-3xl bg-slate-50/50 border-2 border-dashed border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 flex flex-col items-center justify-center text-center gap-4 transition-all cursor-pointer group h-full min-h-[240px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">
                            <Sparkles className="w-6 h-6 text-slate-300 group-hover:text-brand-500 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 mb-1">¿Falta algo?</p>
                            <p className="text-sm font-medium text-slate-500 group-hover:text-brand-600 transition-colors">Sugerir un nuevo módulo IA / Reportar Error</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Section: Recent Work & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                

                {/* Recent Activities */}
                {/* Recent Activities */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 glass-premium rounded-3xl p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                <Clock className="w-5 h-5" />
                            </div>
                            Registro de Misión
                        </h3>
                        <button onClick={() => onSelectTool('history')} className="px-4 py-2 rounded-full bg-slate-50 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors uppercase tracking-wider">Ver Historial</button>
                    </div>

                    <div className="relative pl-4 space-y-8 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-slate-200 before:content-['']">
                        {/* Timeline Item 1: Current Focus */}
                        <div className="relative">
                            <span className="absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full bg-brand-500 ring-4 ring-white" />
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">En Progreso</span>
                                <h4 className="text-sm font-bold text-slate-900">Configuración de Marca Personal</h4>
                                <p className="text-sm text-slate-500">Completa tu biografía para desbloquear el modo Experto.</p>
                            </div>
                        </div>
                        
                        {/* Timeline Item 2: Completed */}
                        <div className="relative opacity-60">
                             <span className="absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full bg-slate-300 ring-4 ring-white" />
                             <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completado ayer</span>
                                <h4 className="text-sm font-bold text-slate-900">Registro en Plataforma</h4>
                                <p className="text-sm text-slate-500">Bienvenido al ecosistema Kolink.</p>
                             </div>
                        </div>

                         {/* Call to Action Wrapper */}
                        <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4">
                            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-brand-500">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Siguiente Paso: Crea tu primer Post</p>
                                <p className="text-xs text-slate-500">Gana +50 XP</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Engagement / Insight Widget */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="card-nexus p-8 overflow-hidden relative group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <Sparkles className="w-48 h-48 text-brand-500" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                            <Zap className="w-5 h-5 fill-current" />
                        </div>
                        Insights de Crecimiento IA
                    </h3>

                        <div className="flex flex-col gap-6 relative z-10">
                            {isLoading ? (
                                <div className="space-y-4 w-full">
                                    <Skeleton className="h-20 w-full rounded-2xl" />
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 flex-1" />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group-hover:border-brand-100 group-hover:bg-brand-50/30 transition-colors">
                                        <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-3 bg-brand-100/50 w-fit px-2 py-1 rounded">Próximo Hito</p>
                                        <p className="text-sm text-slate-700 font-bold leading-relaxed">
                                            {language === 'es' 
                                                ? `¡Estás cerca del ${nextMilestone}! Gana más XP publicando.` 
                                                : `You're close to ${nextMilestone}! Earn XP by posting.`}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-5 p-2">
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-2">
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{language === 'es' ? 'Meta Semanal' : 'Weekly Goal'}</p>
                                                <span className="text-xs font-bold text-slate-900">{postsThisWeek}/{weeklyGoal}</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                 <div 
                                                    className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-1000" 
                                                    style={{ width: `${Math.min(100, (postsThisWeek / weeklyGoal) * 100)}%` }}
                                                 />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                    <Tooltip>
                        <p>Abre el chat con el Estratega IA para analizar tus métricas.</p>
                    </Tooltip>
                    <button 
                        onClick={() => onSelectTool('chat')}
                        className="w-full mt-2 btn-nexus-primary flex items-center justify-center gap-2"
                    >
                         <Sparkles className="w-4 h-4" /> Optimizar Estrategia
                    </button>
                </motion.div>

                {/* Session Logout Action */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="card-nexus p-8 flex flex-col justify-between h-auto gap-6"
                >
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                <Fingerprint className="w-5 h-5" />
                            </div>
                            Cuenta
                        </h3>
                        <div className="pl-[52px]">
                             <p className="text-sm font-bold text-slate-900">{user?.email}</p>
                             <p className="text-xs text-slate-400 font-medium">Plan {user?.isPremium ? 'Premium' : 'Gratuito'}</p>
                        </div>
                    </div>

                    <button 
                        onClick={logout}
                        className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
                    >
                        Cerrar Sesión 
                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
            {/* Modals */}
            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
        </div>
    );
};

export default LaunchpadView;
