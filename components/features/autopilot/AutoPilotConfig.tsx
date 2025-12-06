import React, { useState } from 'react';
import { Target, Clock, Layers, Plus, X, Loader2 } from 'lucide-react';
import { AppLanguage, ViralTone } from '../../../types';
import { translations } from '../../../translations';
import { TONES } from '../../../constants';
import Tooltip from '../../ui/Tooltip';

interface AutoPilotConfigProps {
    language: AppLanguage;
    frequency: string;
    setFrequency: (freq: string) => void;
    tone: ViralTone;
    setTone: (tone: ViralTone) => void;
    postCount: number;
    setPostCount: (count: number) => void;
    audience: string;
    setAudience: (audience: string) => void;
    topics: string[];
    setTopics: (topics: string[]) => void;
    onSave: () => void;
    isSaving: boolean;
}

const AutoPilotConfig: React.FC<AutoPilotConfigProps> = ({
    language,
    frequency,
    setFrequency,
    tone,
    setTone,
    postCount,
    setPostCount,
    audience,
    setAudience,
    topics,
    setTopics,
    onSave,
    isSaving
}) => {
    const t = translations[language].app.autopilot;
    const tConstants = translations[language].app.constants;
    const [newTopic, setNewTopic] = useState('');

    const handleAddTopic = () => {
        if (newTopic.trim()) {
            setTopics([...topics, newTopic.trim()]);
            setNewTopic('');
        }
    };

    const handleRemoveTopic = (index: number) => {
        setTopics(topics.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-slate-400" />
                    {t.config.title}
                </h3>
                {isSaving && <span className="text-xs text-sky-600 font-bold animate-pulse">Saving...</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Frequency */}
                <div className="space-y-2 min-w-0">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                        {t.config.frequencyLabel}
                        <Tooltip>{t.config.frequencyTooltip}</Tooltip>
                    </label>
                    <div className="relative group w-full">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value as any)}
                            className="w-full pl-9 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm font-medium appearance-none cursor-pointer hover:border-sky-300 transition-colors truncate"
                        >
                            <option value="daily">{t.frequencies.daily}</option>
                            <option value="weekly">{t.frequencies.weekly}</option>
                            <option value="biweekly">{t.frequencies.biweekly}</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                {/* Tone */}
                <div className="space-y-2 min-w-0">
                    <label className="text-xs font-bold text-slate-700">{t.activity.autoPilotTone}</label>
                    <div className="relative group w-full">
                        <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value as any)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm font-medium cursor-pointer hover:border-sky-300 transition-colors appearance-none truncate"
                        >
                            {TONES.map(tOption => (
                                <option key={tOption.value} value={tOption.value}>
                                    {tConstants.tones[tOption.value]?.label || tOption.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Count Slider */}
            <div className="space-y-2 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-sky-500" />
                        {t.config.postCountLabel}
                        <Tooltip>{t.config.postCountTooltip}</Tooltip>
                    </label>
                    <span className="text-sm font-bold bg-white px-3 py-1 rounded-md shadow-sm border border-slate-200 text-sky-600">
                        {postCount} {postCount === 1 ? t.activity.postUnit : t.activity.postsUnit}
                    </span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="5"
                    value={postCount}
                    onChange={(e) => setPostCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500 mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>1 {t.activity.postUnit}</span>
                    <span>5 {t.activity.postsUnit}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 italic">
                    {t.activity.creditCostNote.replace('{{count}}', postCount.toString())}
                </p>
            </div>

            {/* Target Audience */}
            <div className="space-y-2 mb-6">
                <label className="text-xs font-bold text-slate-700">{t.config.audienceLabel}</label>
                <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder={t.config.audiencePlaceholder || "e.g. SaaS Founders, Marketing Managers"}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm font-medium transition-colors"
                />
            </div>

            {/* Topics Input */}
            <div className="space-y-3 mb-8">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    {t.config.topicsLabel}
                    <Tooltip>{t.config.topicsTooltip}</Tooltip>
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                        placeholder={t.config.topicsPlaceholder}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-sm font-medium transition-colors"
                    />
                    <button onClick={handleAddTopic} className="px-5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* Topic Chips */}
                <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                    {topics.length === 0 && <span className="text-sm text-slate-400 italic self-center">{t.activity.noTopics}</span>}
                    {topics.map((tpc, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm animate-in zoom-in duration-200 group hover:border-sky-300 transition-colors">
                            {tpc}
                            <button onClick={() => handleRemoveTopic(idx)} className="p-0.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 hover:bg-sky-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {t.config.save}
                </button>
            </div>
        </div>
    );
};

export default AutoPilotConfig;
