import React from 'react';
import { Card } from '@/components/ui/card';
import { Medal, Flame, Zap, Award, Star } from 'lucide-react';
import { useUser } from '@/context/UserContext';

export const BadgeGrid = () => {
    const { user } = useUser();
    
    // Mock data for now, ideally fetching from profile.achievements jsonb column
    // The user context might not have full profile data loaded, but let's assume basics or mock
    const achievements = [
        { id: 'first_post', name: 'First Publish', icon: Star, color: 'text-yellow-500', unlocked: true },
        { id: 'streak_3', name: '3 Day Streak', icon: Flame, color: 'text-orange-500', unlocked: false },
        { id: 'viral_hit', name: 'Viral (>80)', icon: Zap, color: 'text-blue-500', unlocked: false },
        { id: 'pro_user', name: 'Pro Creator', icon: Medal, color: 'text-purple-500', unlocked: true }, // Assume active if pro
    ];

    return (
        <Card className="p-4 border-slate-200 bg-slate-50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Achievements</h3>
            <div className="grid grid-cols-4 gap-2">
                {achievements.map((badge) => (
                    <div 
                        key={badge.id}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                            badge.unlocked 
                                ? 'bg-white border-slate-200 shadow-sm opacity-100' 
                                : 'bg-slate-100 border-transparent opacity-40 grayscale'
                        }`}
                        title={badge.name}
                    >
                        <badge.icon className={`w-5 h-5 mb-1 ${badge.color}`} />
                        <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">{badge.name}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};
