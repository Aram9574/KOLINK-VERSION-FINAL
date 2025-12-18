import React from "react";
import {
    AppLanguage,
    BrandVoice,
    EmojiDensity,
    GenerationParams,
    PostLength,
    ViralFramework,
    ViralHook,
    ViralTone,
} from "../../../types";
import { useUser } from "../../../context/UserContext";
import { fetchBrandVoices } from "../../../services/userRepository";
import {
    EMOJI_OPTIONS,
    FRAMEWORKS,
    HOOK_STYLES,
    LENGTH_OPTIONS,
    TONES,
} from "../../../constants";
import {
    AlignLeft,
    Info,
    Lock,
    MessageSquare,
    Sliders,
    Smile,
    Sparkles,
    Target,
    Type,
    Wand2,
    Zap,
} from "lucide-react";
import { translations } from "../../../translations";
import Tooltip from "../../ui/Tooltip";

import { toast } from "sonner";
import { GenerationParamsSchema } from "../../../schemas";

interface GeneratorFormProps {
    params: GenerationParams;
    onUpdateParams: (params: Partial<GenerationParams>) => void;
    onGenerate: () => void;
    isGenerating: boolean;
    credits: number;
    language: AppLanguage;
    showCreditDeduction?: boolean;
    isCancelled?: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({
    params,
    onUpdateParams,
    onGenerate,
    isGenerating,
    credits,
    language,
    showCreditDeduction,
    isCancelled,
}) => {
    const t = translations[language].app.generator;
    const tConstants = translations[language].app.constants;
    const { user } = useUser();
    const isFreeUser = user?.planTier === "free";

    const checkPremiumAccess = (option: { isPremium?: boolean }) => {
        if (isFreeUser && option.isPremium) {
            toast.error(
                language === "es"
                    ? "Esta opción es solo para usuarios Premium 🔒"
                    : "This option is for Premium users only 🔒",
            );
            return false;
        }
        return true;
    };
    const [voices, setVoices] = React.useState<BrandVoice[]>([]);

    React.useEffect(() => {
        if (user?.id) {
            fetchBrandVoices(user.id).then(setVoices);
        }
    }, [user?.id]);

    const [isStrategyOpen, setIsStrategyOpen] = React.useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

    // Rate Limiting Logic/Visuals
    const [cooldown, setCooldown] = React.useState(0);

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (cooldown > 0) {
            interval = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [cooldown]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isCancelled || cooldown > 0) return;

        const result = GenerationParamsSchema.safeParse(params);
        if (!result.success) {
            const errorMsg = (result.error as any).errors[0]?.message ||
                "Validation failed";
            toast.error(errorMsg);
            return;
        }

        onGenerate();
        setCooldown(15); // Set 15s visual cooldown (safe margin over 10s backend)
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateParams({ creativityLevel: parseInt(e.target.value) });
    };

    const currentFrameworkDesc = tConstants.frameworks[params.framework]?.desc;

    return (
        <div
            id="tour-generator"
            className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-brand-100 rounded-lg">
                        <Zap className="w-5 h-5 text-brand-600" />
                    </div>
                    {t.title}
                </h2>

                {!user?.isPremium && (
                    <div className="relative">
                        <div
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-all duration-300
                  ${
                                credits > 0
                                    ? "bg-brand-50 text-brand-700 border-brand-200"
                                    : "bg-red-50 text-red-600 border-red-200"
                            }
                  ${
                                showCreditDeduction
                                    ? "bg-red-50 border-red-200 text-red-600 scale-105 shadow-sm ring-2 ring-red-100"
                                    : ""
                            }
                `}
                        >
                            <Sparkles className="w-3 h-3" />
                            {credits} {t.credits}
                        </div>
                        {showCreditDeduction && (
                            <div className="absolute top-full right-0 mt-1 text-xs font-bold text-red-500 animate-bounce whitespace-nowrap flex items-center gap-0.5">
                                -1 credit
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* Topic Input - Keeping it here as it's the main prompt */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                        {t.topicLabel}
                    </label>
                    <textarea
                        className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-slate-900 placeholder-slate-400 resize-none h-28 text-base lg:text-sm font-medium shadow-sm hover:border-brand-300"
                        placeholder={t.topicPlaceholder}
                        value={params.topic}
                        onChange={(e) =>
                            onUpdateParams({ topic: e.target.value })}
                        required
                        maxLength={5000}
                    />
                    <div className="flex justify-end mt-1">
                        <span
                            className={`text-xs font-medium ${
                                params.topic.length > 4500
                                    ? "text-amber-500"
                                    : "text-slate-400"
                            }`}
                        >
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
                                    <Tooltip>
                                        {currentFrameworkDesc || ""}
                                    </Tooltip>
                                </label>
                                <div className="relative group">
                                    <select
                                        className="w-full pl-3 pr-8 py-2.5 h-[46px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-900 transition-all hover:border-brand-300 shadow-sm"
                                        value={params.framework}
                                        onChange={(e) => {
                                            const selected = FRAMEWORKS.find(
                                                (f) =>
                                                    f.value === e.target.value
                                            );
                                            if (
                                                selected &&
                                                checkPremiumAccess(selected)
                                            ) {
                                                onUpdateParams({
                                                    framework: e.target
                                                        .value as ViralFramework,
                                                });
                                            }
                                        }}
                                    >
                                        {FRAMEWORKS.map((fOption) => (
                                            <option
                                                key={fOption.value}
                                                value={fOption.value}
                                                disabled={isFreeUser &&
                                                    fOption.isPremium}
                                                className={isFreeUser &&
                                                        fOption.isPremium
                                                    ? "text-slate-400"
                                                    : ""}
                                            >
                                                {isFreeUser && fOption.isPremium
                                                    ? "🔒 "
                                                    : ""}
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

                            {/* Estilo de Gancho */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    {language === "es"
                                        ? "Estilo de Gancho (Hook)"
                                        : "Hook Style"}
                                    <Tooltip>
                                        {(t as any).hookStyleTooltip ||
                                            "Choose how your post starts."}
                                    </Tooltip>
                                </label>
                                <div className="relative group">
                                    <select
                                        className="w-full pl-3 pr-8 py-2.5 h-[46px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-900 transition-all hover:border-brand-300 shadow-sm"
                                        value={params.hookStyle || "auto"}
                                        onChange={(e) => {
                                            const selected = HOOK_STYLES.find(
                                                (h) =>
                                                    h.value === e.target.value
                                            );
                                            if (
                                                selected &&
                                                checkPremiumAccess(selected)
                                            ) {
                                                onUpdateParams({
                                                    hookStyle: e.target
                                                        .value as ViralHook,
                                                });
                                            }
                                        }}
                                    >
                                        {HOOK_STYLES.map((hOption) => (
                                            <option
                                                key={hOption.value}
                                                value={hOption.value}
                                                disabled={isFreeUser &&
                                                    hOption.isPremium}
                                                className={isFreeUser &&
                                                        hOption.isPremium
                                                    ? "text-slate-400"
                                                    : ""}
                                            >
                                                {isFreeUser && hOption.isPremium
                                                    ? "🔒 "
                                                    : ""}
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

                            {/* Brand Voice Selector */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1.5">
                                    {language === "es"
                                        ? "Voz de Marca"
                                        : "Brand Voice"}
                                    {isFreeUser && (
                                        <Lock className="w-3 h-3 text-amber-500" />
                                    )}
                                    <Tooltip>
                                        {language === "es"
                                            ? "Selecciona una voz personalizada o usa un tono predefinido."
                                            : "Select a custom voice or use a preset tone."}
                                    </Tooltip>
                                </label>
                                <div
                                    className="relative group"
                                    onClickCapture={() => {
                                        if (isFreeUser) {
                                            toast.error(
                                                language === "es"
                                                    ? "Las voces de marca son solo para usuarios Premium 🔒"
                                                    : "Brand voices are for Premium users only 🔒",
                                            );
                                        }
                                    }}
                                >
                                    <select
                                        className={`w-full pl-3 pr-8 py-2.5 h-[46px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-900 transition-all hover:border-brand-300 shadow-sm ${
                                            isFreeUser
                                                ? "opacity-60 cursor-not-allowed bg-slate-50"
                                                : ""
                                        }`}
                                        value={params.brandVoiceId || ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            onUpdateParams({
                                                brandVoiceId: val === ""
                                                    ? undefined
                                                    : val,
                                            });
                                        }}
                                        disabled={isFreeUser}
                                    >
                                        <option value="">
                                            {language === "es"
                                                ? "Usar Tono (Abajo)"
                                                : "Use Tone (Below)"}
                                        </option>
                                        {voices.map((voice) => (
                                            <option
                                                key={voice.id}
                                                value={voice.id}
                                            >
                                                {voice.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        {isFreeUser
                                            ? (
                                                <Lock className="w-4 h-4 text-slate-400" />
                                            )
                                            : (
                                                <Wand2 className="w-4 h-4 opacity-50" />
                                            )}
                                    </div>
                                </div>
                            </div>

                            {/* Tono (Disable if Brand Voice is selected) */}
                            <div
                                className={`space-y-1.5 ${
                                    params.brandVoiceId
                                        ? "opacity-50 pointer-events-none grayscale"
                                        : ""
                                }`}
                            >
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    {t.toneLabel}
                                    <Tooltip>{t.toneTooltip}</Tooltip>
                                </label>
                                <div className="relative group">
                                    <select
                                        className="w-full pl-3 pr-8 py-2.5 h-[46px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-900 transition-all hover:border-brand-300 shadow-sm"
                                        value={params.tone}
                                        onChange={(e) => {
                                            const selected = TONES.find((t) =>
                                                t.value === e.target.value
                                            );
                                            if (
                                                selected &&
                                                checkPremiumAccess(selected)
                                            ) {
                                                onUpdateParams({
                                                    tone: e.target
                                                        .value as ViralTone,
                                                });
                                            }
                                        }}
                                        disabled={!!params.brandVoiceId}
                                    >
                                        {TONES.map((tOption) => (
                                            <option
                                                key={tOption.value}
                                                value={tOption.value}
                                                disabled={isFreeUser &&
                                                    tOption.isPremium}
                                                className={isFreeUser &&
                                                        tOption.isPremium
                                                    ? "text-slate-400"
                                                    : ""}
                                            >
                                                {isFreeUser && tOption.isPremium
                                                    ? "🔒 "
                                                    : ""}
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

                            {/* Idioma */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    {language === "es" ? "Idioma" : "Language"}
                                </label>
                                <div className="relative group">
                                    <select
                                        className="w-full pl-3 pr-8 py-2.5 h-[46px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-900 transition-all hover:border-brand-300 shadow-sm"
                                        value={params.outputLanguage || "es"}
                                        onChange={(e) =>
                                            onUpdateParams({
                                                outputLanguage: e.target
                                                    .value as "es" | "en",
                                            })}
                                    >
                                        <option value="es">Español</option>
                                        <option value="en">Inglés</option>
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
                                    <Tooltip>{t.audienceTooltip}</Tooltip>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Target className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-base lg:text-sm font-medium transition-all text-slate-900 shadow-sm hover:border-brand-300"
                                        placeholder={t.audiencePlaceholder}
                                        value={params.audience}
                                        onChange={(e) =>
                                            onUpdateParams({
                                                audience: e.target.value,
                                            })}
                                        required
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
                                            <Tooltip>
                                                {t.creativityTooltip}
                                            </Tooltip>
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
                                        onChange={handleSliderChange}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                    />
                                </div>
                            </div>

                            {/* Emojis & Hashtags Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 mt-2">
                                {/* Emoji Density Dropdown */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">
                                        {t.emojiLabel}
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full pl-3 pr-8 py-2.5 h-[46px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-900 transition-all hover:border-brand-300 shadow-sm"
                                            value={params.emojiDensity}
                                            onChange={(e) =>
                                                onUpdateParams({
                                                    emojiDensity: e.target
                                                        .value as EmojiDensity,
                                                })}
                                        >
                                            {EMOJI_OPTIONS.map((opt) => (
                                                <option
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {language === "es" &&
                                                            opt.value ===
                                                                EmojiDensity
                                                                    .MINIMAL
                                                        ? "Mínimo (Profesional)"
                                                        : language === "es" &&
                                                                opt.value ===
                                                                    EmojiDensity
                                                                        .MODERATE
                                                        ? "Moderado (Atractivo)"
                                                        : language === "es" &&
                                                                opt.value ===
                                                                    EmojiDensity
                                                                        .HIGH
                                                        ? "Alto (Visual/Divertido)"
                                                        : opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Smile className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Hashtags Count Dropdown */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">
                                        # Hashtags (SEO)
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full pl-3 pr-8 py-2.5 h-[46px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-900 transition-all hover:border-brand-300 shadow-sm"
                                            value={params.hashtagCount || 3}
                                            onChange={(e) =>
                                                onUpdateParams({
                                                    hashtagCount: parseInt(
                                                        e.target.value,
                                                    ),
                                                })}
                                        >
                                            <option value="0">
                                                0 (Ninguno)
                                            </option>
                                            <option value="1">
                                                1 (Marca Persona)
                                            </option>
                                            <option value="2">
                                                2 (Balanceado)
                                            </option>
                                            <option value="3">
                                                3 (Recomendado)
                                            </option>
                                            <option value="4">
                                                4 (Alto Alcance)
                                            </option>
                                            <option value="5">
                                                5 (Máximo)
                                            </option>
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
                        </div>
                    )}
                </div>

                {/* Generate Button */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isGenerating || isCancelled || cooldown > 0}
                    className={`w-full py-4 px-4 rounded-xl text-white font-bold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-brand-500/40 mt-4
            ${
                        isGenerating || isCancelled || cooldown > 0
                            ? "bg-slate-400 cursor-not-allowed shadow-none hover:translate-y-0 hover:shadow-none"
                            : credits <= 0
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                            : "bg-gradient-to-r from-brand-600 to-indigo-600"
                    }`}
                >
                    {isGenerating
                        ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent">
                                </div>
                                <span>{t.generatingBtn}</span>
                            </>
                        )
                        : isCancelled
                        ? <span>Subscription Cancelled - Credits Frozen</span>
                        : cooldown > 0
                        ? (
                            <>
                                <div className="w-5 h-5 rounded-full border-2 border-white/50 border-t-white animate-spin">
                                </div>
                                <span>
                                    {language === "es"
                                        ? `Espera ${cooldown}s`
                                        : `Wait ${cooldown}s`}
                                </span>
                            </>
                        )
                        : credits <= 0
                        ? (
                            <>
                                <Zap className="w-5 h-5 fill-current" />
                                <span>
                                    {language === "es"
                                        ? "Conseguir más créditos"
                                        : "Get more credits"}
                                </span>
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

export default GeneratorForm;
