import React from "react";
import {
    AppLanguage,
    EmojiDensity,
    GenerationParams,
    PostLength,
    ViralFramework,
    ViralHook,
    ViralTone,
} from "../../../types";
import {
    EMOJI_OPTIONS,
    FRAMEWORKS,
    HOOK_STYLES,
    LENGTH_OPTIONS,
    TONES,
} from "../../../constants";
import {
    AlignLeft,
    Lock,
    Sliders,
    Smile,
    Sparkles,
    Target,
    Wand2,
    Zap,
} from "lucide-react";
import { translations } from "../../../translations";
import Tooltip from "../../ui/Tooltip";
import { toast } from "sonner";

interface DemoGeneratorFormProps {
    language: AppLanguage;
    onGenerate: () => void;
    isGenerating: boolean;
}

const DemoGeneratorForm: React.FC<DemoGeneratorFormProps> = ({
    language,
    onGenerate,
    isGenerating,
}) => {
    // Local state for demo purposes
    const [params, setParams] = React.useState<GenerationParams>({
        topic: language === "es"
            ? "Cómo la consistencia vence a la intensidad en LinkedIn. Muchos empiezan posteando 5 veces por semana y lo dejan al mes. El secreto es encontrar un ritmo sostenible."
            : "How consistency beats intensity on LinkedIn. Many start posting 5x a week and quit after a month. The secret is finding a sustainable rhythm.",
        audience: language === "es"
            ? "Fundadores SaaS, Creadores de Contenido"
            : "SaaS Founders, Content Creators",
        tone: ViralTone.CONTROVERSIAL,
        framework: ViralFramework.PAS,
        hookStyle: "question",
        length: PostLength.MEDIUM,
        creativityLevel: 85,
        emojiDensity: EmojiDensity.MODERATE,
        hashtagCount: 3,
        includeCTA: true,
        outputLanguage: language === "es" ? "es" : "en",
    });

    const [isStrategyOpen, setIsStrategyOpen] = React.useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
    const [credits, setCredits] = React.useState(20);

    const t = translations[language].app.generator;
    const tConstants = translations[language].app.constants;

    const onUpdateParams = (updates: Partial<GenerationParams>) => {
        setParams((prev) => ({ ...prev, ...updates }));
    };

    const handleGenerate = () => {
        if (isGenerating) return;

        if (credits <= 0) {
            toast.error(
                language === "es"
                    ? "¡Ups! En la demo solo tienes créditos limitados 😉"
                    : "Oops! You have limited credits in the demo 😉",
            );
            return;
        }

        onGenerate();
    };

    // Simulate current framework desc look up
    const currentFrameworkDesc = tConstants.frameworks[params.framework]?.desc;

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-brand-100 rounded-lg">
                        <Zap className="w-5 h-5 text-brand-600" />
                    </div>
                    {t.title}
                </h2>

                <div className="relative">
                    <div className="text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 bg-brand-50 text-brand-700 border-brand-200">
                        <Sparkles className="w-3 h-3" />
                        {credits} {t.credits}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Topic Input */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                        {t.topicLabel}
                    </label>
                    <textarea
                        className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-slate-900 placeholder-slate-400 resize-none h-28 text-sm font-medium shadow-sm hover:border-brand-300"
                        placeholder={t.topicPlaceholder}
                        value={params.topic}
                        onChange={(e) =>
                            onUpdateParams({ topic: e.target.value })}
                    />
                    <div className="flex justify-end mt-1">
                        <span className="text-xs font-medium text-slate-400">
                            {params.topic.length}/5000
                        </span>
                    </div>
                </div>

                {/* Section 1: ESTRATEGIA DE CONTENIDO */}
                <div className="space-y-4">
                    <button
                        type="button"
                        onClick={() => setIsStrategyOpen(!isStrategyOpen)}
                        className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider w-full hover:text-slate-600 transition-colors group cursor-pointer"
                    >
                        <AlignLeft className="w-4 h-4" />
                        {language === "es"
                            ? "ESTRATEGIA DE CONTENIDO"
                            : "CONTENT STRATEGY"}
                        <div
                            className={`ml-auto transition-transform duration-200 ${
                                isStrategyOpen ? "rotate-180" : ""
                            }`}
                        >
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </button>

                    {isStrategyOpen && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
                            {/* Formato (Framework) */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    {language === "es" ? "Formato" : "Format"}
                                </label>
                                <div className="relative group">
                                    <select
                                        className="w-full pl-3 pr-8 py-2.5 h-[46px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-900 transition-all hover:border-brand-300 shadow-sm"
                                        value={params.framework}
                                        onChange={(e) =>
                                            onUpdateParams({
                                                framework: e.target
                                                    .value as ViralFramework,
                                            })}
                                    >
                                        {FRAMEWORKS.map((fOption) => (
                                            <option
                                                key={fOption.value}
                                                value={fOption.value}
                                            >
                                                {tConstants
                                                    .frameworks[fOption.value]
                                                    ?.label || fOption.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            >
                                            </path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Hook */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    {language === "es"
                                        ? "Estilo de Gancho (Hook)"
                                        : "Hook Style"}
                                </label>
                                <div className="relative group">
                                    <select
                                        className="w-full pl-3 pr-8 py-2.5 h-[46px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-900 transition-all hover:border-brand-300 shadow-sm"
                                        value={params.hookStyle || "auto"}
                                        onChange={(e) =>
                                            onUpdateParams({
                                                hookStyle: e.target
                                                    .value as ViralHook,
                                            })}
                                    >
                                        {HOOK_STYLES.map((hOption) => (
                                            <option
                                                key={hOption.value}
                                                value={hOption.value}
                                            >
                                                {hOption.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            >
                                            </path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Brand Voice (Locked) */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1.5">
                                    {language === "es"
                                        ? "Voz de Marca"
                                        : "Brand Voice"}
                                    <Lock className="w-3 h-3 text-amber-500" />
                                </label>
                                <div className="relative group">
                                    <select
                                        disabled
                                        className="w-full pl-3 pr-8 py-2.5 h-[46px] bg-slate-50 border border-slate-300 rounded-xl text-sm appearance-none cursor-not-allowed font-medium text-slate-400 shadow-sm"
                                    >
                                        <option>
                                            {language === "es"
                                                ? "Usar Tono (Abajo)"
                                                : "Use Tone (Below)"}
                                        </option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <Lock className="w-4 h-4 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Tone */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    {t.toneLabel}
                                </label>
                                <div className="relative group">
                                    <select
                                        className="w-full pl-3 pr-8 py-2.5 h-[46px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-900 transition-all hover:border-brand-300 shadow-sm"
                                        value={params.tone}
                                        onChange={(e) =>
                                            onUpdateParams({
                                                tone: e.target
                                                    .value as ViralTone,
                                            })}
                                    >
                                        {TONES.map((tOption) => (
                                            <option
                                                key={tOption.value}
                                                value={tOption.value}
                                            >
                                                {tConstants.tones[tOption.value]
                                                    ?.label || tOption.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            >
                                            </path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 2: DETALLES & AJUSTES */}
                <div className="space-y-4 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                        className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider w-full hover:text-slate-600 transition-colors group cursor-pointer"
                    >
                        <Sliders className="w-4 h-4" />
                        {language === "es"
                            ? "DETALLES & AJUSTES"
                            : "DETAILS & SETTINGS"}
                        <div
                            className={`ml-auto transition-transform duration-200 ${
                                isDetailsOpen ? "rotate-180" : ""
                            }`}
                        >
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </button>

                    {isDetailsOpen && (
                        <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                            {/* Audience Input */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    {t.audienceLabel}
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Target className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium transition-all text-slate-900 shadow-sm hover:border-brand-300"
                                        placeholder={t.audiencePlaceholder}
                                        value={params.audience}
                                        onChange={(e) =>
                                            onUpdateParams({
                                                audience: e.target.value,
                                            })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mt-4">
                                {/* Length */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">
                                        {t.lengthLabel}
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full pl-3 pr-8 py-2.5 h-[46px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-900 transition-all hover:border-brand-300 shadow-sm"
                                            value={params.length}
                                            onChange={(e) =>
                                                onUpdateParams({
                                                    length: e.target
                                                        .value as PostLength,
                                                })}
                                        >
                                            {LENGTH_OPTIONS.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {tConstants
                                                        .lengths[option.value]
                                                        ?.label || option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 9l-7 7-7-7"
                                                >
                                                </path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Creativity Slider */}
                                <div className="space-y-1.5 pb-1">
                                    <div className="flex justify-between text-sm mb-1.5 ml-1">
                                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                                            {t.creativityLabel}
                                        </span>
                                        <span className="text-brand-600 font-bold">
                                            {params.creativityLevel}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={params.creativityLevel}
                                        onChange={(e) =>
                                            onUpdateParams({
                                                creativityLevel: parseInt(
                                                    e.target.value,
                                                ),
                                            })}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Generate Button */}
                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`w-full py-4 px-4 rounded-xl text-white font-bold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-brand-500/40 mt-4 bg-gradient-to-r from-brand-600 to-indigo-600`}
                >
                    {isGenerating
                        ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent">
                                </div>
                                <span>{t.generatingBtn}</span>
                            </>
                        )
                        : (
                            <>
                                <Wand2 className="w-5 h-5" />
                                <span>{t.generateBtn}</span>
                            </>
                        )}
                </button>
            </div>
        </div>
    );
};

export default DemoGeneratorForm;
