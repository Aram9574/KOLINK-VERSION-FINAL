import React, { useEffect, useState } from 'react';
import { Grid, Zap, Sparkles, PenSquare } from 'lucide-react';
import { MagicButton } from '../../../ui/MagicButton';
import { UserProfile, AppTab } from '../../../../types';
import { getPersonalizedTrend } from '../../../../services/geminiService';
import Skeleton from '../../../ui/Skeleton';

interface LaunchpadHeaderProps {
    user: UserProfile;
    language: string;
    t: any; // Ideally strictly typed from translations
    onSelectTool: (tab: AppTab) => void;
}

export const LaunchpadHeader: React.FC<LaunchpadHeaderProps> = ({ 
    user, 
    language, 
    t, 
    onSelectTool 
}) => {
    const [trend, setTrend] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrend = async () => {
            if (!user.id) return;
            try {
                const personalizedTrend = await getPersonalizedTrend(user.id, language);
                setTrend(personalizedTrend);
            } catch (error) {
                console.error("Failed to load trend", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrend();
    }, [user.id, language]);

    return (
        <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div>
                    <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mb-2 tracking-tight">
                        Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">{user.name?.split(' ')[0] || 'Experto'}</span>.
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">
                        {user.headline ? (
                            language === 'es'
                                ? `Listo para liderar como ${user.headline}?`
                                : `Ready to lead as ${user.headline}?`
                        ) : t.stats.hero}
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
                    <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 ring-1 ring-blue-50 shrink-0">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-900">
                                {language === 'es' ? 'Oportunidad Detectada' : 'Opportunity Detected'}
                            </h4>
                            {loading ? (
                                <Skeleton className="h-4 w-3/4 mt-1" />
                            ) : (
                                <p className="text-sm text-slate-600">
                                    {trend}
                                </p>
                            )}
                        </div>
                    </div>
                    <MagicButton
                        onClick={() => onSelectTool('create')}
                        className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
                        icon={<PenSquare className="w-4 h-4" />}
                    >
                        {language === 'es' ? 'Aprovechar Tendencia' : 'Ride the Trend'}
                    </MagicButton>
                </div>
             </div>
        </div>
    );
};
