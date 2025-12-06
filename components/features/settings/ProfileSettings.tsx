import React, { useState } from 'react';
import { UserProfile, AppLanguage } from '../../../types';
import { translations } from '../../../translations';
import { User, Building2, Briefcase, Mic } from 'lucide-react';
import Tooltip from '../../ui/Tooltip';

interface ProfileSettingsProps {
    user: UserProfile;
    language: AppLanguage;
    setLanguage: (lang: AppLanguage) => void;
    onSave: (updates: Partial<UserProfile>) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, language, setLanguage, onSave }) => {
    const [name, setName] = useState(user.name || '');
    const [headline, setHeadline] = useState(user.headline || '');
    const [companyName, setCompanyName] = useState(user.companyName || '');
    const [industry, setIndustry] = useState(user.industry || '');
    const [brandVoice, setBrandVoice] = useState(user.brandVoice || '');

    const t = translations[language].app.settings;
    const CHAR_LIMIT = 500;

    // We expose a ref or callback to parent if we want parent to trigger save,
    // but for now let's assume parent handles the "Save" button and we just sync state up?
    // Actually, the original design had one big "Save" button at the bottom.
    // To keep it simple, we can lift the state up OR just pass the state setters down?
    // Better: Let's make this component controlled or use a form context.
    // For this refactor, I will make it controlled by the parent to minimize logic changes,
    // OR I will pass the setters.
    //
    // Wait, the original `SettingsView` had local state for these fields.
    // To avoid prop drilling hell, I will keep the state here and expose a `getData` method?
    // No, that's anti-pattern in React.
    //
    // Best approach for this refactor:
    // Pass the state and setters from the parent `SettingsView` to this component.
    // This keeps `SettingsView` as the "Controller" and `ProfileSettings` as the "View".

    return (
        <div className="space-y-6">
            {/* General Preferences */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                    </div>
                    {t.generalPrefs}
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors bg-slate-50/30">
                        <div>
                            <p className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                {t.languageLabel}
                                <Tooltip>{t.languageTooltip}</Tooltip>
                            </p>
                            <p className="text-xs text-slate-500">{t.languageDesc}</p>
                        </div>
                        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${language === 'en' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                🇺🇸 English
                            </button>
                            <button
                                onClick={() => setLanguage('es')}
                                className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${language === 'es' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                🇪🇸 Español
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Brand Voice Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm ring-1 ring-slate-900/5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Mic className="w-5 h-5 text-purple-600" />
                        </div>
                        {t.brandVoiceTitle}
                        <Tooltip>{t.brandVoiceTooltip}</Tooltip>
                    </h2>
                    {user.planTier === 'free' && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded uppercase tracking-wide">
                            {t.premiumFeature}
                        </span>
                    )}
                </div>
                <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                        {t.brandVoiceDesc}
                    </p>
                    <div className="relative">
                        <textarea
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm font-medium h-32 resize-none placeholder-slate-400 text-slate-700"
                            placeholder={t.brandVoicePlaceholder}
                            value={brandVoice}
                            maxLength={CHAR_LIMIT}
                            onChange={(e) => {
                                setBrandVoice(e.target.value);
                                onSave({ brandVoice: e.target.value });
                            }}
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none bg-slate-50/80 pl-2 rounded-md backdrop-blur-sm">
                            <span className={`text-xs font-medium transition-colors ${brandVoice.length >= CHAR_LIMIT ? 'text-red-500' : 'text-slate-400'}`}>
                                {brandVoice.length}/{CHAR_LIMIT}
                            </span>
                            <Mic className="w-4 h-4 text-slate-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    {t.profileTitle}
                </h2>
                <div className="grid gap-6 max-w-2xl">
                    <div className="flex items-center gap-4">
                        <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-sm" />
                        <div className="space-y-2">
                            <button className="text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors">
                                {t.uploadPhoto}
                            </button>
                            <p className="text-xs text-slate-400">Recommended: 400x400 px</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">{t.fullName}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    onSave({ name: e.target.value });
                                }}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">{t.jobTitle}</label>
                            <input
                                type="text"
                                value={headline}
                                onChange={(e) => {
                                    setHeadline(e.target.value);
                                    onSave({ headline: e.target.value });
                                }}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Company Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5" />
                                {t.companyLabel}
                                <Tooltip>{t.companyTooltip}</Tooltip>
                            </label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => {
                                    setCompanyName(e.target.value);
                                    onSave({ companyName: e.target.value });
                                }}
                                placeholder="e.g. Kolink Inc."
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5" />
                                {t.industryLabel}
                                <Tooltip>{t.industryTooltip}</Tooltip>
                            </label>
                            <input
                                type="text"
                                value={industry}
                                onChange={(e) => {
                                    setIndustry(e.target.value);
                                    onSave({ industry: e.target.value });
                                }}
                                placeholder="e.g. SaaS, Fintech, Marketing"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
