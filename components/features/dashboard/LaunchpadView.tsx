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
    Grid
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserProfile, AppTab } from '../../../types';
import { getAvatarUrl } from '../../../utils';
import { useUser } from '../../../context/UserContext';
import { usePosts } from '../../../context/PostContext';
import { translations } from '../../../translations';
import { ExpandableTabs } from '../../ui/expandable-tabs';
import HelpModal from '../../modals/HelpModal';
import Skeleton from '../../ui/Skeleton';
import { OnboardingChecklist } from '../onboarding/OnboardingChecklist';
import Tooltip from '../../ui/Tooltip';

interface LaunchpadProps {
    user: UserProfile;
    onSelectTool: (tab: AppTab) => void;
    onCarouselStudioClick: () => void;
}

const LaunchpadView: React.FC<LaunchpadProps> = ({ 
    user,
    onCarouselStudioClick,
    onSelectTool 
}) => {
    const { language, logout } = useUser();
    const { posts } = usePosts(); 
    // Cast to any to bypass strict type checking if 'dashboard' is missing in type definition but present in runtime
    const t = (translations[language] as any).dashboard || {}; 
    const [showHelp, setShowHelp] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    // Simulate initial load for premium feel
    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Dynamic Calculations
    
    // Define shortcuts ONLY ONCE
    const shortcuts = [
        { title: "Dashboard", icon: Home, onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { title: "Notificaciones", icon: Bell, onClick: () => onSelectTool('history') },
        { type: "separator" as const },
        { title: "Ajustes", icon: SettingsIcon, onClick: () => onSelectTool('settings') },
        { title: "Soporte", icon: HelpCircle, onClick: () => setShowHelp(true) },
        { title: "Seguridad", icon: Shield, onClick: () => onSelectTool('audit') },
    ];
    
    const weeklyGoal = 3;
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const postsThisWeek = posts.filter(p => new Date(p.createdAt || 0) >= startOfWeek).length;
    
    const nextMilestone = user.level < 5 ? `Nivel ${user.level + 1}` : "Maestro del Contenido";
    const xpToNext = (user.level + 1) ** 2 * 100 - user.xp;
    
    const nextLevelXP = Math.pow(user.level + 1, 2) * 100;
    const progressToNextLevel = Math.min(100, (user.xp / nextLevelXP) * 100);

    const tools = [
        // ... tools definitions
        {
            id: 'carousel',
            name: 'Estudio de Carruseles',
            description: 'Diseña carruseles virales con IA en segundos.',
            icon: Sparkles,
            color: 'from-brand-500 to-brand-600',
            bg: 'bg-brand-50/50',
            onClick: onCarouselStudioClick,
            premium: false,
            badge: 'NUEVO'
        },
        {
            id: 'create',
            name: 'Redactor de Posts',
            description: 'Escribe contenido de alto impacto optimizado para LinkedIn.',
            icon: PenSquare,
            color: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50/50',
            onClick: () => onSelectTool('create'),
            premium: false,
            badge: 'POPULAR'
        },
        {
            id: 'autopost',
            name: 'Programador Inteligente',
            description: 'Automatiza tu calendario de publicaciones y maximiza tu alcance.',
            icon: Calendar,
            color: 'from-emerald-500 to-emerald-600',
            bg: 'bg-emerald-50/50',
            onClick: () => onSelectTool('autopilot'),
            premium: true
        },
        {
            id: 'insight-responder',
            name: 'Asistente de Engagement',
            description: 'Responde comentarios y mensajes con la voz de tu marca.',
            icon: MessageSquare,
            color: 'from-amber-500 to-amber-600',
            bg: 'bg-amber-50/50',
            onClick: () => onSelectTool('insight-responder'),
            premium: true
        },
        {
            id: 'chat',
            name: 'Estratega Personal IA',
            description: 'Tu consultor experto 24/7 para estrategia y crecimiento.',
            icon: BrainCircuit,
            color: 'from-purple-500 to-purple-600',
            bg: 'bg-purple-50/50',
            onClick: () => onSelectTool('chat'),
            premium: true,
            badge: 'RECOMENDADO'
        },
        {
            id: 'audit',
            name: 'Auditor de Perfil',
            description: 'Próximamente: Análisis profundo con IA. Disponible Q1 2026.',
            icon: Fingerprint,
            color: 'from-rose-500 to-rose-600',
            bg: 'bg-rose-50/50',
            onClick: () => {}, // Disabled for now
            premium: true,
            disabled: true
        },
        {
            id: 'history',
            name: 'Biblioteca de Contenido',
            description: 'Accede y gestiona todas tus creaciones anteriores.',
            icon: History,
            color: 'from-slate-500 to-slate-600',
            bg: 'bg-slate-50/50',
            onClick: () => onSelectTool('history'),
            premium: false
        },
        {
            id: 'settings',
            name: 'Configuración',
            description: 'Personaliza tu experiencia y preferencias de marca.',
            icon: SettingsIcon,
            color: 'from-slate-400 to-slate-500',
            bg: 'bg-slate-50/50',
            onClick: () => onSelectTool('settings'),
            premium: false
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
            {/* Launch Grid */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                         <span className="w-2 h-6 bg-brand-500 rounded-full" />
                         Command Center
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                             <span>C: Create</span>
                             <span className="text-slate-300">|</span>
                             <span>H: Home</span>
                             <span className="text-slate-300">|</span>
                             <span>S: Settings</span>
                        </div>
                        <ExpandableTabs 
                            tabs={shortcuts} 
                            activeColor="text-brand-600"
                            className="border-slate-200/60 bg-white/50 backdrop-blur-sm"
                        />
                    </div>
                </div>

                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                                whileHover={tool.disabled ? {} : { y: -8, scale: 1.02 }}
                                whileTap={tool.disabled ? {} : { scale: 0.98 }}
                                className={`group relative text-left p-8 rounded-[2rem] bg-white border border-slate-100 transition-all shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden z-0 ${tool.disabled ? 'opacity-75 cursor-not-allowed grayscale-[0.5]' : 'hover:border-transparent hover:shadow-2xl'}`}
                                style={{ 
                                    // Dynamic colored shadow on hover
                                    '--shadow-color': tool.color.includes('brand') ? 'rgba(37,99,235,0.25)' : 
                                                      tool.color.includes('purple') ? 'rgba(147,51,234,0.25)' :
                                                      tool.color.includes('emerald') ? 'rgba(16,185,129,0.25)' :
                                                      tool.color.includes('amber') ? 'rgba(245,158,11,0.25)' :
                                                      tool.color.includes('rose') ? 'rgba(244,63,94,0.25)' :
                                                      tool.color.includes('blue') ? 'rgba(59,130,246,0.25)' : 'rgba(100,116,139,0.25)' 
                                } as React.CSSProperties}
                            >
                                {/* Hover Styles Injection only if not disabled */}
                                {!tool.disabled && (
                                    <style>{`
                                        .group:hover {
                                            box-shadow: 0 20px 40px -10px var(--shadow-color);
                                        }
                                    `}</style>
                                )}
                                
                                {/* Gradient Background Wash */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${tool.bg} opacity-0 ${!tool.disabled && 'group-hover:opacity-100'} transition-opacity duration-500`} />
                                
                                {/* Accent Orb */}
                                <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${tool.color} opacity-[0.03] ${!tool.disabled && 'group-hover:opacity-1'} blur-3xl transition-all duration-500 rounded-full`} />
    
                                <div className="relative z-10 flex flex-col h-full gap-6">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg text-white relative transform ${!tool.disabled && 'group-hover:scale-110 group-hover:rotate-3'} transition-transform duration-500`}>
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
                        className="p-8 rounded-[2rem] bg-slate-50/50 border-2 border-dashed border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 flex flex-col items-center justify-center text-center gap-4 transition-all cursor-pointer group h-full min-h-[240px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">
                            <Sparkles className="w-6 h-6 text-slate-300 group-hover:text-brand-500 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 mb-1">¿Falta algo?</p>
                            <p className="text-sm font-medium text-slate-500 group-hover:text-brand-600 transition-colors">Sugerir un nuevo módulo IA</p>
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
                    className="lg:col-span-2 card-nexus p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                <Clock className="w-5 h-5" />
                            </div>
                            Proyectos Recientes
                        </h3>
                        <button onClick={() => onSelectTool('history')} className="px-4 py-2 rounded-full bg-slate-50 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors uppercase tracking-wider">Ver Todos</button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Empty State Placeholder - In real app we'd map history */}
                        {/* Start Journey Onboarding */}
                        <OnboardingChecklist 
                            user={user} 
                            onSelectTool={onSelectTool} 
                            onCarouselStudioClick={onCarouselStudioClick} 
                        />
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
                        AI Growth Insights
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

                    <button className="w-full mt-8 btn-nexus-primary flex items-center justify-center gap-2">
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
            {/* Help Modal */}
            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
        </div>
    );
};

export default LaunchpadView;
