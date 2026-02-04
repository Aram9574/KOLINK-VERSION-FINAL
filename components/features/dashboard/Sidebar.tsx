import React from 'react';
import { useUser } from '../../../context/UserContext';
import { 
    Home, 
    PenTool, 
    History, 
    Settings, 
    Sparkles, 
    Layout, 
    Zap, 
    LogOut,
    Crown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { translations } from '../../../translations';
import { AppTab } from '../../../types';
import { supabase } from '../../../services/supabaseClient'; // Ensure this path is correct or import from context
import { toast } from 'sonner';
import { analytics } from '../../../services/analyticsService';

interface SidebarProps {
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
    onUpgrade: () => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    activeTab, 
    setActiveTab, 
    onUpgrade,
    isCollapsed 
}) => {
    const { user, isPro, language } = useUser();
    const t = translations[language];
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
        toast.success(t.dashboard.sidebar.logoutToast);
    };

    const navItems = [
        { id: 'dashboard', label: t.dashboard.sidebar.home, icon: <Home size={20} />, type: 'tab' },
        { id: 'create', label: t.dashboard.sidebar.create, icon: <PenTool size={20} />, type: 'tab' },
        { id: 'history', label: t.dashboard.sidebar.history, icon: <History size={20} />, type: 'tab' },
        { type: 'divider' },
        { id: 'carousel', label: t.dashboard.sidebar.carousel, icon: <Layout size={20} />, type: 'tab' },
        { id: 'tools', label: t.dashboard.sidebar.tools, icon: <Sparkles size={20} />, type: 'link', path: '/tools' },
        { type: 'divider' },
        { id: 'settings', label: t.dashboard.sidebar.settings, icon: <Settings size={20} />, type: 'tab' },
    ];

    return (
        <div className={`h-full glass-panel border-r-0 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-full'}`}>
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-brand-500/30">
                        K
                    </div>
                    {!isCollapsed && (
                        <span className="font-display font-bold text-xl tracking-tight text-slate-900">
                            Kolink<span className="text-brand-600">.</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 space-y-2 py-4 overflow-y-auto custom-scrollbar">
                {navItems.map((item, idx) => {
                    if (item.type === 'divider') {
                        return !isCollapsed && <div key={idx} className="h-px bg-slate-200/50 my-2 mx-2" />;
                    }

                    const isActive = activeTab === item.id;
                    const content = (
                        <>
                            <div className={`transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                {item.icon}
                            </div>
                            {!isCollapsed && (
                                <span className={`font-medium text-sm transition-colors ${isActive ? 'text-brand-900 font-bold' : 'text-slate-600'}`}>
                                    {item.label}
                                </span>
                             )}
                            {isActive && !isCollapsed && (
                                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand-500 shadow-sm" />
                            )}
                        </>
                    );

                    const containerClass = `
                        relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group
                        ${isActive 
                            ? 'bg-brand-50/50 shadow-sm ring-1 ring-brand-100' 
                            : 'hover:bg-white/60 hover:shadow-sm'
                        }
                    `;

                    if (item.type === 'link') {
                        return (
                            <Link to={item.path!} key={item.id} className={containerClass}>
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <button 
                            key={item.id} 
                            onClick={() => {
                                setActiveTab(item.id as AppTab);
                                analytics.track('feature_viewed', { feature: item.id });
                            }}
                            className={`${containerClass} w-full text-left`}
                        >
                            {content}
                        </button>
                    );
                })}
            </div>

            {/* Upgrade & Footer */}
            <div className="p-4 space-y-4">
                {!isPro && !isCollapsed && (
                    <div className="glass-premium p-4 rounded-2xl relative overflow-hidden group cursor-pointer" onClick={onUpgrade}>
                         <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-brand-400 to-indigo-500 opacity-10 rounded-full -mr-8 -mt-8 blur-2xl group-hover:opacity-20 transition-opacity" />
                         <div className="flex items-center gap-3 mb-2">
                             <div className="p-1.5 bg-brand-100 text-brand-600 rounded-lg">
                                 <Crown size={16} fill="currentColor" />
                             </div>
                              <h4 className="font-bold text-sm text-slate-900">{t.dashboard.sidebar.upgrade.title}</h4>
                         </div>
                         <p className="text-xs text-slate-500 mb-3 leading-snug">
                             {t.dashboard.sidebar.upgrade.desc}
                         </p>
                         <button className="w-full py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg shadow-lg shadow-brand-500/20 transition-all">
                             {t.dashboard.sidebar.upgrade.btn}
                         </button>
                    </div>
                )}

                <div className={`flex items-center gap-3 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-white shadow-sm flex-shrink-0">
                         {/* Avatar Placeholder */}
                         <img 
                            src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.email}&background=random`} 
                            alt="User" 
                            className="w-full h-full object-cover"
                         />
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">
                                {user?.name || t.dashboard.sidebar.userToken}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                    )}
                     {!isCollapsed && (
                        <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors" title="Cerrar Sesión">
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
