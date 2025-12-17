import React, { useState } from 'react';
import { UserProfile, AppLanguage } from '../../../types';
import { ACHIEVEMENTS } from '../../../constants';
import { Trophy, Zap, Lock, Save, Check } from 'lucide-react';
import { translations } from '../../../translations';
import { toast } from 'sonner';
import ProfileSettings from './ProfileSettings';
import SecuritySettings from './SecuritySettings';
import BillingSettings from './BillingSettings';

interface SettingsViewProps {
    user: UserProfile;
    onUpgrade: () => void;
    onSave: (updates: Partial<UserProfile>) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpgrade, onSave }) => {
    const [language, setLanguage] = useState<AppLanguage>(user.language || 'en');
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    // State for Profile Settings (lifted up to handle "Save All" button)
    const [profileUpdates, setProfileUpdates] = useState<Partial<UserProfile>>({});

    const t = translations[language].app.settings;

    const handleSave = async () => {
        setIsSavingProfile(true);
        // Simulate a network delay for better UX perception
        await new Promise(resolve => setTimeout(resolve, 500));

        onSave({
            ...profileUpdates,
            language: language
        });

        setIsSavingProfile(false);
        setShowSaved(true);
        toast.success(language === 'es' ? 'Se han guardado los cambios con éxito.' : 'Changes saved successfully.');
        setTimeout(() => setShowSaved(false), 2000);
    };

    const handleProfileUpdate = (updates: Partial<UserProfile>) => {
        setProfileUpdates(prev => ({ ...prev, ...updates }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-display font-bold text-slate-900">{t.title}</h1>
                <p className="text-slate-500">{t.subtitle}</p>
            </div>

            {/* Trophy Room (Gamification) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-orange-50 rounded-lg">
                        <Trophy className="w-5 h-5 text-orange-600" />
                    </div>
                    {t.trophyRoom}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {ACHIEVEMENTS.map(ach => {
                        const isUnlocked = user.unlockedAchievements.includes(ach.id);
                        return (
                            <div key={ach.id} className={`relative p-4 rounded-xl border transition-all ${isUnlocked ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50 border-slate-100 grayscale opacity-70'}`}>
                                {!isUnlocked && (
                                    <div className="absolute top-3 right-3 text-slate-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                )}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-sm ${isUnlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                    <Trophy className="w-5 h-5 fill-current" />
                                </div>
                                <h4 className="font-bold text-sm text-slate-900 mb-1">{ach.title}</h4>
                                <p className="text-xs text-slate-500 mb-2 h-8 leading-snug">{ach.description}</p>
                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                                    <Zap className="w-3 h-3 fill-current" />
                                    +{ach.xpReward} XP
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <ProfileSettings
                user={user}
                language={language}
                setLanguage={setLanguage}
                onSave={handleProfileUpdate}
            />

            <SecuritySettings
                user={user}
                language={language}
                onSave={onSave} // Security settings save immediately
            />

            <BillingSettings
                user={user}
                language={language}
                onUpgrade={onUpgrade}
                onSave={onSave}
            />

            <div className="sticky bottom-6 z-40 flex justify-end pt-4 pb-2 mt-8 pointer-events-none">
                <div className="pointer-events-auto">
                <button
                    onClick={handleSave}
                    disabled={isSavingProfile}
                    className={`flex items-center gap-2 px-8 py-3 text-white font-bold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait disabled:hover:translate-y-0
                    ${showSaved ? 'bg-green-500 shadow-green-500/20' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20'}
                `}
                >
                    {isSavingProfile ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : showSaved ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {isSavingProfile ? t.saving : showSaved ? t.saved : t.saveChanges}
                </button>
                </div>
            </div>
        </div >
    );
};

export default SettingsView;
