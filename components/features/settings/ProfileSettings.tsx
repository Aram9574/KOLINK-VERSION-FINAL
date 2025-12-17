import React, { useState } from 'react';
import { UserProfile, AppLanguage } from '../../../types';
import { translations } from '../../../translations';
import { User, Building2, Briefcase } from 'lucide-react';
import Tooltip from '../../ui/Tooltip';
import BrandVoiceManager from './BrandVoiceManager';
import { getAvatarUrl } from '../../../utils';

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
    const t = translations[language].app.settings;

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

            {/* Brand Voice Manager */}
            <div className="bg-white border boundary-slate-200 rounded-2xl p-6 shadow-sm ring-1 ring-slate-900/5">
                <BrandVoiceManager userId={user.id} language={language} />
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
                        <img src={getAvatarUrl(user)} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-sm" />
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
                                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm hover:border-indigo-400"
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
                                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm hover:border-indigo-400"
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
                                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm hover:border-indigo-400"
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
                                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm hover:border-indigo-400"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
