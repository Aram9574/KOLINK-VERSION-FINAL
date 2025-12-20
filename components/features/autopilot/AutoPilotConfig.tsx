import React, { useState } from "react";
import {
    Bot,
    Clock,
    Loader2,
    Palette,
    Plus,
    Sliders,
    Sparkles,
    Target,
    Users,
    X,
    Zap,
} from "lucide-react";
import { AppLanguage, ViralTone } from "../../../types";
import { translations } from "../../../translations";
import { TONES } from "../../../constants";
import { CustomSelect } from "../../ui/CustomSelect";

interface AutoPilotConfigProps {
    language: AppLanguage;
    frequency: string;
    setFrequency: (freq: string) => void;
    tone: ViralTone;
    setTone: (tone: ViralTone) => void;

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

    audience,
    setAudience,
    topics,
    setTopics,
    onSave,
    isSaving,
}) => {
    const t = translations[language].app.autopilot;
    const tConstants = translations[language].app.constants;
    const [newTopic, setNewTopic] = useState("");
    const [isConfigOpen, setIsConfigOpen] = useState(true);

    const handleAddTopic = () => {
        if (newTopic.trim()) {
            setTopics([...topics, newTopic.trim()]);
            setNewTopic("");
        }
    };

    const handleRemoveTopic = (index: number) => {
        setTopics(topics.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
            {/* Pocket Header */}
            <div
                className="flex items-center justify-between mb-8 cursor-pointer group/header"
                onClick={() => setIsConfigOpen(!isConfigOpen)}
            >
                <div className="space-y-1">
                    <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                        <Sliders
                            className={`w-5 h-5 text-sky-600 transition-transform duration-300 ${
                                isConfigOpen ? "rotate-90" : ""
                            }`}
                        />
                        {t.config.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                        {isConfigOpen
                            ? "Define your automated content strategy parameters."
                            : "Click to expand settings."}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {isSaving && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-sky-50 rounded-full border border-sky-100">
                            <Loader2 className="w-3 h-3 text-sky-600 animate-spin" />
                            <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">
                                Syncing...
                            </span>
                        </div>
                    )}
                    <div
                        className={`p-2 rounded-xl transition-all ${
                            isConfigOpen ? "bg-slate-100" : "bg-slate-50"
                        }`}
                    >
                        <Sliders
                            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                                isConfigOpen ? "rotate-180" : ""
                            }`}
                        />
                    </div>
                </div>
            </div>

            {isConfigOpen && (
                <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Core Parameters Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                        {/* Frequency Area */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                {t.config.frequencyLabel}
                            </label>
                            <CustomSelect
                                options={[
                                    {
                                        value: "daily",
                                        label: t.frequencies.daily,
                                    },
                                    {
                                        value: "weekly",
                                        label: t.frequencies.weekly,
                                    },
                                    {
                                        value: "biweekly",
                                        label: t.frequencies.biweekly,
                                    },
                                ]}
                                value={frequency}
                                onChange={(val) => setFrequency(val as any)}
                            />
                        </div>

                        {/* Tone Area */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Palette className="w-3.5 h-3.5" />
                                {t.activity.autoPilotTone}
                            </label>
                            <CustomSelect
                                options={TONES.map((tOption) => ({
                                    value: tOption.value,
                                    label: tConstants.tones[tOption.value]
                                        ?.label || tOption.label,
                                }))}
                                value={tone}
                                onChange={(val) => setTone(val as ViralTone)}
                            />
                        </div>
                    </div>

                    {/* Audience Section */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 px-2">
                            <Users className="w-3.5 h-3.5" />
                            {t.config.audienceLabel}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={audience}
                                onChange={(e) => setAudience(e.target.value)}
                                placeholder={t.config.audiencePlaceholder ||
                                    "e.g. SaaS Founders, Marketing Managers"}
                                className="w-full h-14 px-6 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none text-sm font-semibold transition-all hover:bg-white placeholder:text-slate-400"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100 opacity-60">
                                <Bot className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Topics Intelligence Section */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 px-2">
                            <Target className="w-3.5 h-3.5" />
                            {t.config.topicsLabel}
                        </label>

                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={newTopic}
                                    onChange={(e) =>
                                        setNewTopic(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleAddTopic()}
                                    placeholder={t.config.topicsPlaceholder ||
                                        "Add industrial niche..."}
                                    className="w-full h-14 px-6 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none text-sm font-semibold transition-all hover:bg-white placeholder:text-slate-400"
                                />
                            </div>
                            <button
                                onClick={handleAddTopic}
                                disabled={!newTopic.trim()}
                                className="h-14 px-6 bg-slate-900 text-white rounded-[1.25rem] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="text-sm font-bold hidden md:block">
                                    Add Theme
                                </span>
                            </button>
                        </div>

                        {/* Modern Topic Chips Layout */}
                        <div className="flex flex-wrap gap-2.5 min-h-[100px] p-6 bg-white border border-slate-100 rounded-[2rem] shadow-inner shadow-slate-100/50 relative overflow-hidden group/chips">
                            {/* Faint Grid Background */}
                            <div
                                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(circle, #000 1px, transparent 1px)",
                                    backgroundSize: "20px 20px",
                                }}
                            >
                            </div>

                            {topics.length === 0 && (
                                <div className="flex flex-col items-center justify-center w-full h-full gap-2 opacity-30 select-none py-4">
                                    <Sparkles className="w-6 h-6" />
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        {t.activity.noTopics}
                                    </span>
                                </div>
                            )}

                            {topics.map((tpc, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 pl-4 pr-2 py-2 bg-sky-50/50 border border-sky-100/50 rounded-xl text-xs font-bold text-sky-700 shadow-sm animate-in zoom-in-95 duration-200 group/chip hover:bg-sky-100/60 transition-all hover:-translate-y-0.5"
                                >
                                    <span className="truncate max-w-[150px]">
                                        {tpc}
                                    </span>
                                    <button
                                        onClick={() => handleRemoveTopic(idx)}
                                        className="p-1 rounded-lg hover:bg-red-100 text-sky-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final Footer Actions */}
                    <div className="flex justify-end pt-8 border-t border-slate-100/60">
                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            className="group relative px-10 h-14 bg-sky-600 text-white font-bold rounded-[1.25rem] shadow-xl shadow-sky-500/20 hover:bg-sky-700 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-wait"
                        >
                            {isSaving
                                ? <Loader2 className="w-5 h-5 animate-spin" />
                                : (
                                    <Zap className="w-5 h-5 fill-current text-white/50 group-hover:scale-110 transition-transform" />
                                )}
                            <span>{t.config.save}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutoPilotConfig;
