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
    Fingerprint,
} from "lucide-react";
import { translations } from "../../../translations";
import Tooltip from "../../ui/Tooltip";

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
    Fingerprint,
} from "lucide-react";
import { translations } from "../../../translations";
import Tooltip from "../../ui/Tooltip";

import { useToast } from "../../../context/ToastContext";
import { GenerationParamsSchema } from "../../../schemas";
import { CustomSelect } from "../../ui/CustomSelect";
import LoadingProgress from "../../ui/LoadingProgress";

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
    const toast = useToast();
    const tConstants = translations[language].app.constants;
    const { user } = useUser();
    const isFreeUser = user?.planTier === "free";

    const checkPremiumAccess = (option: { isPremium?: boolean }) => {
        if (isFreeUser && option.isPremium) {
            toasts.error(
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
            toasts.error(errorMsg);
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
            className="bg-white border border-border rounded-xl p-6 shadow-sm transition-all hover:shadow-brand-500/5 group relative overflow-hidden"
        >
            {/* Bento Corner Light */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-brand-100 rounded-lg">
                        <Zap strokeWidth={1.5} className="w-5 h-5 text-brand-600" />
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
                {/* Hero Topic Input */}
                <div className="space-y-4">
                    <div className="relative group/input">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-indigo-500/10 rounded-2xl blur-lg opacity-0 group-hover/input:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="relative bg-white border-0 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand-500/20 rounded-2xl shadow-sm transition-all duration-300">
                             <div className="absolute top-4 left-4 text-slate-400">
                                <Sparkles className="w-5 h-5 text-brand-500" />
                             </div>
                             <textarea
                                className="w-full h-32 md:h-40 p-4 pl-12 bg-transparent border-0 focus:ring-0 text-lg text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed transition-all"
                                placeholder={t.topicPlaceholder}
                                value={params.topic}
                                onChange={(e) => onUpdateParams({ topic: e.target.value })}
                                required
                                maxLength={5000}
                            />
                             {/* Character Counter */}
                            <div className="absolute bottom-3 right-4">
                                <span className={`text-[10px] font-bold tracking-wider uppercase ${params.topic.length > 4500 ? "text-amber-500" : "text-slate-300"}`}>
                                    {params.topic.length} / 5000
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 1: ESTRATEGIA DE CONTENIDO (Premium Accordion) */}
                <div className="space-y-4 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsStrategyOpen(!isStrategyOpen)}
                        className={`
                            flex items-center justify-between w-full p-4 rounded-xl border transition-all duration-300 text-left group
                            ${isStrategyOpen 
                                ? "bg-slate-50 border-brand-200 shadow-inner" 
                                : "bg-white border-slate-100 hover:border-brand-200 hover:shadow-sm"
                            }
                        `}
                    >   
                        <div className="flex items-center gap-3">
                            <div className={`
                                p-2 rounded-lg transition-colors duration-300
                                ${isStrategyOpen ? "bg-brand-100 text-brand-600" : "bg-slate-100 text-slate-500 group-hover:text-brand-500 group-hover:bg-brand-50"}
                            `}>
                                <AlignLeft strokeWidth={2} className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className={`text-sm font-bold tracking-tight transition-colors ${isStrategyOpen ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"}`}>
                                    {language === "es" ? "Estrategia de Contenido" : "Content Strategy"}
                                </h3>
                                <p className="text-[11px] text-slate-400 font-medium">
                                    {language === "es" ? "Define formato, gancho y voz" : "Format, hook and voice"}
                                </p>
                            </div>
                        </div>
                        
                        <div
                            className={`p-1 rounded-full transition-transform duration-300 ${isStrategyOpen ? "rotate-180 bg-slate-200" : "bg-transparent text-slate-400 group-hover:text-brand-500"}`}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                <CustomSelect
                                    options={FRAMEWORKS.map((f) => ({
                                        value: f.value,
                                        label: tConstants.frameworks[f.value]
                                            ?.label || f.label,
                                        isPremium: f.isPremium,
                                    }))}
                                    value={params.framework}
                                    onChange={(val) =>
                                        onUpdateParams({
                                            framework: val as ViralFramework,
                                        })}
                                    isFreeUser={isFreeUser}
                                    onPremiumClick={() =>
                                        checkPremiumAccess({ isPremium: true })}
                                />
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
                                <CustomSelect
                                    options={HOOK_STYLES.map((h) => ({
                                        value: h.value,
                                        label: h.label,
                                        isPremium: h.isPremium,
                                    }))}
                                    value={params.hookStyle || "auto"}
                                    onChange={(val) =>
                                        onUpdateParams({
                                            hookStyle: val as ViralHook,
                                        })}
                                    isFreeUser={isFreeUser}
                                    onPremiumClick={() =>
                                        checkPremiumAccess({ isPremium: true })}
                                />
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
                                <CustomSelect
                                    options={[
                                        {
                                            value: "",
                                            label: language === "es"
                                                ? "Usar Tono (Abajo)"
                                                : "Use Tone (Below)",
                                        },
                                        ...voices.map((v) => ({
                                            value: v.id,
                                            label: v.name,
                                        })),
                                    ]}
                                    value={params.brandVoiceId || ""}
                                    onChange={(val) =>
                                        onUpdateParams({
                                            brandVoiceId: val === ""
                                                ? undefined
                                                : val as string,
                                        })}
                                    disabled={isFreeUser}
                                    isFreeUser={isFreeUser}
                                    icon={isFreeUser
                                        ? <Lock size={16} />
                                        : <Wand2 size={16} />}
                                    onPremiumClick={() =>
                                        toasts.error(
                                            language === "es"
                                                ? "Las voces de marca son solo para usuarios Premium 🔒"
                                                : "Brand voices are for Premium users only 🔒",
                                        )}
                                />
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
                                <CustomSelect
                                    options={TONES.map((tOption) => ({
                                        value: tOption.value,
                                        label: tConstants.tones[tOption.value]
                                            ?.label || tOption.label,
                                        isPremium: tOption.isPremium,
                                    }))}
                                    value={params.tone}
                                    onChange={(val) =>
                                        onUpdateParams({
                                            tone: val as ViralTone,
                                        })}
                                    disabled={!!params.brandVoiceId}
                                    isFreeUser={isFreeUser}
                                    onPremiumClick={() =>
                                        checkPremiumAccess({ isPremium: true })}
                                />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                                {/* Idioma */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">
                                        {language === "es"
                                            ? "Idioma"
                                            : "Language"}
                                    </label>
                                    <CustomSelect
                                        options={[
                                            { value: "es", label: "Español" },
                                            { value: "en", label: "Inglés" },
                                        ]}
                                        value={params.outputLanguage || "es"}
                                        onChange={(val) =>
                                            onUpdateParams({
                                                outputLanguage: val as
                                                    | "es"
                                                    | "en",
                                            })}
                                    />
                                </div>

                                {/* Generate Carousel Toggle */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1.5">
                                        {language === "es"
                                            ? "Generar Carrusel"
                                            : "Generate Carousel"}
                                        <div className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full">
                                            BETA
                                        </div>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onUpdateParams({
                                                generateCarousel: !params
                                                    .generateCarousel,
                                            })}
                                        className={`w-full h-[42px] px-3 rounded-xl border flex items-center justify-between transition-all duration-200 group ${
                                            params.generateCarousel
                                                ? "bg-blue-50 border-blue-200"
                                                : "bg-white border-slate-200/60/60 hover:border-blue-300"
                                        }`}
                                    >
                                        <span
                                            className={`text-sm font-medium ${
                                                params.generateCarousel
                                                    ? "text-blue-700"
                                                    : "text-slate-600"
                                            }`}
                                        >
                                            {params.generateCarousel
                                                ? (language === "es"
                                                    ? "Sí, crear carrusel"
                                                    : "Yes, create carousel")
                                                : (language === "es"
                                                    ? "Solo texto"
                                                    : "Text only")}
                                        </span>
                                        <div
                                            className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${
                                                params.generateCarousel
                                                    ? "bg-blue-500"
                                                    : "bg-slate-200"
                                            }`}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                                    params.generateCarousel
                                                        ? "translate-x-4"
                                                        : "translate-x-0"
                                                }`}
                                            />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 2: DETALLES & AJUSTES (Premium Accordion) */}
                <div className="space-y-4">
                    <button
                        type="button"
                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                        className={`
                            flex items-center justify-between w-full p-4 rounded-xl border transition-all duration-300 text-left group
                            ${isDetailsOpen 
                                ? "bg-slate-50 border-brand-200 shadow-inner" 
                                : "bg-white border-slate-100 hover:border-brand-200 hover:shadow-sm"
                            }
                        `}
                    >
                         <div className="flex items-center gap-3">
                            <div className={`
                                p-2 rounded-lg transition-colors duration-300
                                ${isDetailsOpen ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500 group-hover:text-indigo-500 group-hover:bg-indigo-50"}
                            `}>
                                <Sliders strokeWidth={2} className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className={`text-sm font-bold tracking-tight transition-colors ${isDetailsOpen ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"}`}>
                                    {language === "es" ? "Detalles & Ajustes" : "Details & Settings"}
                                </h3>
                                <p className="text-[11px] text-slate-400 font-medium">
                                    {language === "es" ? "Audiencia, creatividad y hashtags" : "Audience, creativity & hashtags"}
                                </p>
                            </div>
                        </div>

                        <div
                            className={`p-1 rounded-full transition-transform duration-300 ${isDetailsOpen ? "rotate-180 bg-slate-200" : "bg-transparent text-slate-400 group-hover:text-indigo-500"}`}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                        <Target strokeWidth={1.5} className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full pl-10"
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
                                    <CustomSelect
                                        options={LENGTH_OPTIONS.map(
                                            (option) => ({
                                                value: option.value,
                                                label: tConstants
                                                    .lengths[option.value]
                                                    ?.label || option.label,
                                            }),
                                        )}
                                        value={params.length}
                                        onChange={(val) =>
                                            onUpdateParams({
                                                length: val as PostLength,
                                            })}
                                    />
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
                                    <CustomSelect
                                        options={EMOJI_OPTIONS.map((opt) => ({
                                            value: opt.value,
                                            label: language === "es" &&
                                                    opt.value ===
                                                        EmojiDensity.MINIMAL
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
                                                : opt.label,
                                        }))}
                                        value={params.emojiDensity}
                                        onChange={(val) =>
                                            onUpdateParams({
                                                emojiDensity:
                                                    val as EmojiDensity,
                                            })}
                                        icon={<Smile size={16} />}
                                    />
                                </div>

                                {/* Hashtags Count Dropdown */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">
                                        # Hashtags (SEO)
                                    </label>
                                    <CustomSelect
                                        options={[
                                            { value: 0, label: "0 (Ninguno)" },
                                            {
                                                value: 1,
                                                label: "1 (Marca Persona)",
                                            },
                                            {
                                                value: 2,
                                                label: "2 (Balanceado)",
                                            },
                                            {
                                                value: 3,
                                                label: "3 (Recomendado)",
                                            },
                                            {
                                                value: 4,
                                                label: "4 (Alto Alcance)",
                                            },
                                            { value: 5, label: "5 (Máximo)" },
                                        ]}
                                        value={params.hashtagCount || 3}
                                        onChange={(val) =>
                                            onUpdateParams({
                                                hashtagCount: parseInt(val),
                                            })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 3: DNA INSIGHT (If Available) */}
                {user?.behavioral_dna && (
                    <div className="p-4 bg-brand-50/30 border border-brand-100/50 rounded-xl relative overflow-hidden group/dna">
                         <div className="absolute -right-2 -bottom-2 opacity-5 group-hover/dna:opacity-10 transition-opacity">
                            <Fingerprint className="w-16 h-16" />
                         </div>
                         <div className="flex items-center gap-2 mb-2">
                            <Fingerprint className="w-4 h-4 text-brand-600" />
                            <span className="text-[10px] font-bold text-brand-800 uppercase tracking-widest">DNA Insight</span>
                         </div>
                         <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            Nexus sugiere: <span className="text-brand-700 italic">"He notado que tu tono {user.behavioral_dna.dominant_tone.toLowerCase()} funciona mejor para tu audiencia de {params.audience || 'LinkedIn'}. He activado el modo {user.behavioral_dna.archetype} para esta generación."</span>
                         </p>
                    </div>
                )}

                {/* Loading State Overlay/Progress */}
                {isGenerating && (
                    <div className="mt-4 pt-4 border-t border-slate-200/60/60 animate-in fade-in slide-in-from-top-4 duration-500">
                        <LoadingProgress
                            steps={language === "es"
                                ? [
                                    "Analizando tu marca Persona...",
                                    "Arquitectando Post Viral...",
                                    "Orquestando IA Generativa...",
                                    "Diseñando Estructura de Gancho...",
                                    "Afinando detalles finales...",
                                ]
                                : [
                                    "Analyzing your Personal Brand...",
                                    "Architecting Viral Post...",
                                    "Orchestrating Generative AI...",
                                    "Designing Hook Structure...",
                                    "Polishing final details...",
                                ]}
                            duration={12000}
                        />
                    </div>
                )}

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
                                <Wand2 className="w-5 h-5 animate-pulse" />
                                <span>
                                    {language === "es"
                                        ? "Arquitectando Post..."
                                        : "Architecting Post..."}
                                </span>
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
