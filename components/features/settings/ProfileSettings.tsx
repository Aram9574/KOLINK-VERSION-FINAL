import React, { useState } from 'react';
import { UserProfile, AppLanguage } from '../../../types';
import { translations } from '../../../translations';
import { User, Building2, Briefcase, Camera } from 'lucide-react';
import Tooltip from '../../ui/Tooltip';
import { getAvatarUrl } from '../../../utils';
import { motion } from 'framer-motion';

interface ProfileSettingsProps {
    user: UserProfile;
    language: AppLanguage;
    setLanguage: (lang: AppLanguage) => void;
    onSave: (updates: Partial<UserProfile>) => void;
    onUpgrade: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, language, setLanguage, onSave, onUpgrade }) => {
    const [name, setName] = useState(user.name || '');
    const [headline, setHeadline] = useState(user.headline || '');
    const [companyName, setCompanyName] = useState(user.companyName || '');
    const [industry, setIndustry] = useState(user.industry || '');
    const t = translations[language].app.settings;

    return (
        <div className="space-y-10">
            {/* Profile Avatar Section */}
            <section className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
                <div className="relative group">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 p-1 shadow-md group-hover:shadow-lg transition-all">
                        <img 
                            src={getAvatarUrl(user)} 
                            alt={user.name} 
                            className="w-full h-full rounded-full object-cover bg-white" 
                        />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all text-slate-600">
                        <Camera size={16} strokeWidth={2} />
                    </button>
                </div>
                
                <div className="text-center md:text-left space-y-2">
                    <h3 className="text-base font-bold text-slate-900">{t.uploadPhoto}</h3>
                    <p className="text-sm text-slate-500 max-w-xs">{language === 'es' ? 'Una foto profesional ayuda a que tu contenido resuene más.' : 'A professional photo helps your content resonate more.'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider italic">Recomendado: 400x400 px • JPG/PNG/WebP</p>
                </div>
            </section>

            {/* General Information Form */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-brand-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{language === 'es' ? 'Información General' : 'General Information'}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">{t.fullName}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                onSave({ name: e.target.value });
                            }}
                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all hover:bg-white"
                            placeholder="John Doe"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">{t.jobTitle}</label>
                        <input
                            type="text"
                            value={headline}
                            onChange={(e) => {
                                setHeadline(e.target.value);
                                onSave({ headline: e.target.value });
                            }}
                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all hover:bg-white"
                            placeholder="CEO at Awesome Co."
                        />
                    </div>

                    <div className="space-y-2 text-balance">
                        <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                            {t.companyLabel}
                            <Tooltip>{t.companyTooltip}</Tooltip>
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => {
                                    setCompanyName(e.target.value);
                                    onSave({ companyName: e.target.value });
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all hover:bg-white"
                                placeholder="Kolink Inc."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                            {t.industryLabel}
                            <Tooltip>{t.industryTooltip}</Tooltip>
                        </label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                value={industry}
                                onChange={(e) => {
                                    setIndustry(e.target.value);
                                    onSave({ industry: e.target.value });
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all hover:bg-white"
                                placeholder="SaaS, FinTech..."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Preferences */}
            <section className="pt-8 border-t border-slate-100 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{t.generalPrefs}</h3>
                </div>

                <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors hover:bg-white">
                    <div className="space-y-1">
                        <p className="font-bold text-slate-900 flex items-center gap-2">
                            {t.languageLabel}
                            <Tooltip>{t.languageTooltip}</Tooltip>
                        </p>
                        <p className="text-xs text-slate-500">{t.languageDesc}</p>
                    </div>
                    
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner w-full md:w-auto">
                        <button
                            onClick={() => setLanguage('en')}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${language === 'en' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            🇺🇸 English
                        </button>
                        <button
                            onClick={() => setLanguage('es')}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${language === 'es' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            🇪🇸 Español
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProfileSettings;
