
import React, { useState } from 'react';
import { UserProfile, AppLanguage, AutoPilotConfig, Post, ViralTone } from '../types';
import { translations } from '../translations';
import { Bot, Power, Clock, Target, Plus, X, Zap, Loader2, Play, Layers, Terminal, Activity, Eye } from 'lucide-react';
import { TONES } from '../constants';
import Tooltip from './Tooltip';

interface AutoPilotViewProps {
    user: UserProfile;
    onUpdateConfig: (config: AutoPilotConfig) => void;
    language: AppLanguage;
    posts: Post[]; // To show history
    onForceRun: () => void;
    isGenerating: boolean;
    onViewPost?: (post: Post) => void;
}

const AutoPilotView: React.FC<AutoPilotViewProps> = ({ user, onUpdateConfig, language, posts, onForceRun, isGenerating, onViewPost }) => {
    const config = user.autoPilot || {
        enabled: false,
        frequency: 'weekly',
        nextRun: Date.now(),
        topics: [],
        tone: 'Professional',
        targetAudience: '',
        postCount: 1
    };

    const [isEnabled, setIsEnabled] = useState(config.enabled);
    const [frequency, setFrequency] = useState(config.frequency);
    const [topics, setTopics] = useState<string[]>(config.topics);
    const [tone, setTone] = useState<ViralTone>(config.tone);
    const [audience, setAudience] = useState(config.targetAudience);
    const [postCount, setPostCount] = useState(config.postCount || 1);

    const [newTopic, setNewTopic] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const t = translations[language].app.autopilot;
    const tConstants = translations[language].app.constants;

    const automatedPosts = posts.filter(p => p.isAutoPilot).sort((a, b) => b.createdAt - a.createdAt);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate network delay
        setTimeout(() => {
            onUpdateConfig({
                enabled: isEnabled,
                frequency,
                nextRun: config.nextRun, // Preserve existing schedule logic unless toggle changed
                topics,
                tone,
                targetAudience: audience,
                postCount
            });
            setIsSaving(false);
        }, 600);
    };

    const handleAddTopic = () => {
        if (newTopic.trim()) {
            setTopics([...topics, newTopic.trim()]);
            setNewTopic('');
        }
    };

    const handleRemoveTopic = (index: number) => {
        setTopics(topics.filter((_, i) => i !== index));
    };

    const toggleSystem = () => {
        setIsEnabled(!isEnabled);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-8 animate-in fade-in duration-500 pb-20 flex flex-col">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 shadow-sm border border-sky-200">
                        <Bot className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-display font-bold text-slate-900">{t.title}</h1>
                            <span className="px-2 py-0.5 bg-sky-50 text-sky-600 border border-sky-200 rounded text-[10px] font-bold uppercase tracking-wider">{t.activity.beta}</span>
                        </div>
                        <p className="text-slate-500 text-lg">{t.subtitle}</p>
                    </div>
                </div>

                {/* Global Stats or Controls could go here */}
                {isEnabled && (
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-200 text-xs font-bold animate-pulse">
                        <Activity className="w-4 h-4" />
                        {t.activity.systemOnline}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Control Column (Left - 8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* Status Card */}
                    <div className={`rounded-3xl p-8 border transition-all duration-500 relative overflow-hidden shadow-lg group
                        ${isEnabled
                            ? 'bg-slate-900 border-slate-800 text-white ring-1 ring-white/10'
                            : 'bg-white border-slate-200 text-slate-500'}
                    `}>
                        {isEnabled && (
                            <>
                                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                                {/* Radar Sweep Animation */}
                                <div className="absolute top-1/2 left-12 w-64 h-64 bg-gradient-to-t from-sky-500/20 to-transparent rounded-full blur-xl animate-[spin_4s_linear_infinite] opacity-30 origin-bottom-right"></div>
                            </>
                        )}

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={toggleSystem}
                                    className={`w-20 h-10 rounded-full p-1 transition-all duration-300 relative
                                        ${isEnabled ? 'bg-green-500 shadow-[0_0_25px_rgba(34,197,94,0.5)]' : 'bg-slate-200 hover:bg-slate-300'}
                                    `}
                                >
                                    <div className={`w-8 h-8 bg-white rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center ${isEnabled ? 'translate-x-10' : 'translate-x-0'}`}>
                                        <Power className={`w-4 h-4 ${isEnabled ? 'text-green-500' : 'text-slate-400'}`} />
                                    </div>
                                </button>
                                <div>
                                    <h2 className={`text-sm font-bold uppercase tracking-widest mb-1 ${isEnabled ? 'text-green-400' : 'text-slate-400'}`}>
                                        {isEnabled ? t.statusCard.active : t.statusCard.inactive}
                                    </h2>
                                    <p className="text-xs opacity-70 font-mono">
                                        {isEnabled ? `ID: ${user.id.slice(0, 8)}... // ${t.activity.connected}` : t.activity.systemStandby}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-8 text-center md:text-left border-l border-white/10 pl-8 md:pl-0 md:border-l-0">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">{t.statusCard.nextRun}</p>
                                    <p className={`text-xl font-display font-bold ${isEnabled ? 'text-white' : 'text-slate-900'}`}>
                                        {isEnabled ? new Date(config.nextRun).toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : '--'}
                                    </p>
                                </div>
                                <div className="hidden sm:block w-px bg-current opacity-10 h-10 self-center"></div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">{t.statusCard.lastRun}</p>
                                    <p className={`text-xl font-display font-bold ${isEnabled ? 'text-white' : 'text-slate-900'}`}>
                                        {automatedPosts.length > 0 ? new Date(automatedPosts[0].createdAt).toLocaleDateString() : '--'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Configuration Card */}
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
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-8 py-3 bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 hover:bg-sky-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {t.config.save}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Log Column (Right - 4 cols) */}
                <div className="lg:col-span-4 flex flex-col">
                    {/* Fixed: Forced white background and dark text for Light Theme consistency */}
                    <div className="bg-white text-slate-600 rounded-3xl p-6 border border-slate-200 flex flex-col shadow-sm sticky top-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                                <Terminal className="w-5 h-5 text-sky-600" />
                                {t.activity.title}
                            </h3>
                            {isEnabled && (
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                            )}
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar font-mono text-xs">
                            {/* Manual Force Run Control in Log */}
                            {isEnabled && (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider">{t.activity.manualOverride}</span>
                                        <Zap className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <button
                                        onClick={onForceRun}
                                        disabled={isGenerating}
                                        className="w-full py-2.5 bg-white border border-slate-200 text-sky-700 font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-sky-50 hover:border-sky-200"
                                    >
                                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                                        {t.statusCard.forceRunBtn}
                                    </button>
                                </div>
                            )}

                            {automatedPosts.length === 0 ? (
                                <div className="text-slate-400 text-center py-10 italic border-2 border-dashed border-slate-200 rounded-xl">
                                    <div className="mb-2 text-slate-300">_</div>
                                    {t.activity.empty}
                                </div>
                            ) : (
                                automatedPosts.map(post => (
                                    <div key={post.id} className="group bg-slate-50 rounded-lg p-3 border border-slate-100 hover:border-slate-300 transition-colors">
                                        <div className="flex justify-between items-start mb-2 opacity-60">
                                            <span className="text-sky-600 font-bold">[{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2 mb-3">
                                            <span className="text-green-600 mt-0.5 font-bold">➜</span>
                                            <p className="text-slate-600 line-clamp-2 leading-relaxed">
                                                {t.activity.generatedFor} <span className="text-slate-900 font-bold">"{post.params.topic}"</span>
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => onViewPost && onViewPost(post)}
                                            className="w-full py-1.5 rounded bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-500 hover:text-sky-600 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 shadow-sm"
                                        >
                                            <Eye className="w-3 h-3" />
                                            {t.activity.viewOutput}
                                        </button>
                                    </div>
                                ))
                            )}
                            {isEnabled && <div className="text-slate-400 animate-pulse">_</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoPilotView;
