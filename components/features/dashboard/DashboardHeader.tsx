import React, { useState, useEffect } from 'react';
import { Zap, Clock, AlertTriangle, TrendingUp, Smartphone, Monitor, Lightbulb } from 'lucide-react';
import { UserProfile, AppLanguage } from '../../../types';
import { ALGORITHM_TIPS_CONTENT } from '../../../constants';

interface DashboardHeaderProps {
    user: UserProfile;
    language: AppLanguage;
    setLanguage: (lang: AppLanguage) => void;
    activeTab: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, language, setLanguage, activeTab }) => {
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTipIndex(prev => (prev + 1) % 10);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const TIP_ICONS = [
        <Clock className="w-4 h-4" />,
        <Clock className="w-4 h-4" />,
        <AlertTriangle className="w-4 h-4" />,
        <TrendingUp className="w-4 h-4" />,
        <Smartphone className="w-4 h-4" />,
        <Zap className="w-4 h-4" />,
        <Monitor className="w-4 h-4" />,
        <TrendingUp className="w-4 h-4" />,
        <AlertTriangle className="w-4 h-4" />,
        <Lightbulb className="w-4 h-4" />
    ];

    const TIP_COLORS = [
        'text-blue-600',
        'text-green-600',
        'text-purple-600',
        'text-orange-600',
        'text-pink-600',
        'text-indigo-600',
        'text-teal-600',
        'text-cyan-600',
        'text-rose-600',
        'text-amber-600'
    ];

    const currentTipsContent = language === 'es' ? ALGORITHM_TIPS_CONTENT.es : ALGORITHM_TIPS_CONTENT.en;
    const activeTipContent = currentTipsContent[currentTipIndex];
    const activeTipIcon = TIP_ICONS[currentTipIndex % TIP_ICONS.length];
    const activeTipColor = TIP_COLORS[currentTipIndex % TIP_COLORS.length];

    return (
        <header className="hidden lg:flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200 shadow-sm z-10">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-display font-bold text-slate-900">
                    {activeTab === 'create' && (language === 'es' ? 'Estudio Viral' : 'Viral Studio')}
                    {activeTab === 'history' && (language === 'es' ? 'Historial' : 'History')}
                    {activeTab === 'settings' && (language === 'es' ? 'Ajustes' : 'Settings')}
                    {activeTab === 'ideas' && (language === 'es' ? 'Generador de Ideas' : 'Idea Generator')}
                    {activeTab === 'autopilot' && 'AutoPilot'}
                </h1>
                {activeTab === 'create' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold border border-brand-100 animate-in fade-in slide-in-from-left-4 duration-500">
                        <Zap className="w-3 h-3 fill-current" />
                        {language === 'es' ? 'Modo Turbo Activo' : 'Turbo Mode Active'}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6">
                {/* Algorithm Tip Ticker */}
                <div className="hidden xl:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 max-w-md overflow-hidden group hover:border-brand-200 transition-colors cursor-help" title="LinkedIn Algorithm Tip">
                    <div className={`p-1.5 rounded-full ${activeTipColor} bg-white shadow-sm flex-shrink-0`}>
                        {activeTipIcon}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                            {language === 'es' ? 'Tip del Algoritmo' : 'Algorithm Tip'}
                        </span>
                        <p className="text-xs font-medium text-slate-700 truncate group-hover:text-brand-700 transition-colors">
                            {activeTipContent.desc}
                        </p>
                    </div>
                </div>

                <div className="h-8 w-px bg-slate-200"></div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                        className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-sm shadow-sm"
                        title="Switch Language"
                    >
                        {language === 'en' ? '🇺🇸' : '🇪🇸'}
                    </button>
                    <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                        <div className="text-right hidden md:block">
                            <div className="text-sm font-bold text-slate-900">{user.name || 'User'}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 p-0.5 shadow-md">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-brand-600 text-lg">{user.name?.charAt(0) || 'U'}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
