import React, { useEffect, useState } from "react";
import {
    AppLanguage,
    AutoPilotConfig as AutoPostConfigType,
    EmojiDensity,
    GenerationParams,
    Post,
    PostLength,
    UserProfile,
    ViralFramework,
    ViralTone,
} from "../../../types";
import {
    generatePostIdeas,
    generateViralPost,
} from "../../../services/geminiService";
import { supabase } from "../../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { translations } from "../../../translations";
import AutoPostStatus from "./AutoPostStatus";
import AutoPostConfig from "./AutoPostConfig";
import AutoPostActivityLog from "./AutoPostActivityLog";
import { toast } from "sonner";
import {
    Bot,
    ChevronRight,
    Cpu,
    Crown,
    ShieldCheck,
    Sparkles,
    Zap,
} from "lucide-react";

interface AutoPostViewProps {
    user: UserProfile;
    language: AppLanguage;
    onViewPost?: (post: Post) => void;
    onUpgrade?: () => void;
}

const AutoPostView: React.FC<AutoPostViewProps> = (
    { user, language, onViewPost, onUpgrade },
) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Config State
    const [frequency, setFrequency] = useState("daily");
    const [tone, setTone] = useState<ViralTone>(ViralTone.PROFESSIONAL);

    const [audience, setAudience] = useState("");
    const [topics, setTopics] = useState<string[]>([]);

    // Config Object for Status
    const [config, setConfig] = useState<AutoPostConfigType>({
        frequency: "daily",
        tone: ViralTone.PROFESSIONAL,
        topics: [],
        nextRun: Date.now() + 86400000,
        enabled: false,
        targetAudience: "General Professional Audience",
        postCount: 1,
    });

    const [automatedPosts, setAutomatedPosts] = useState<Post[]>([]);

    const navigate = useNavigate();
    const t = translations[language].app.autopilot;

    // Load saved config and posts on mount
    useEffect(() => {
        if (user.id) {
            fetchConfig();
            fetchAutoPostPosts();
        }
    }, [user.id]);

    const fetchConfig = async () => {
        const { data, error } = await supabase
            .from("autopilot_config")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (data) {
            const nextRunVal = data.next_run
                ? new Date(data.next_run).getTime()
                : Date.now() + 86400000;

            setConfig({
                enabled: data.is_enabled,
                frequency: data.frequency,
                tone: data.tone as ViralTone,
                topics: data.topics || [],
                nextRun: nextRunVal,
                targetAudience: data.target_audience || "",
                postCount: 1,
            });
            setFrequency(data.frequency);
            setTone(data.tone as ViralTone);
            setTopics(data.topics || []);
            setAudience(data.target_audience || "");

            setIsEnabled(data.is_enabled);
        }
    };

    const fetchAutoPostPosts = async () => {
        const { data, error } = await supabase
            .from("autopilot_posts")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(30);

        if (data) {
            const mappedPosts: Post[] = data.map((p: any) => ({
                id: p.id,
                content: p.content,
                createdAt: new Date(p.created_at).getTime(),
                params: p.params || {},
                likes: 0,
                views: 0,
                isAutoPilot: true,
                viralScore: p.viral_score,
                viralAnalysis: p.params?.viralAnalysis,
            }));
            setAutomatedPosts(mappedPosts);
        }
    };

    const toggleSystem = async () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        await saveConfig({ ...config, enabled: newState }, newState);

        if (newState) {
            toast.success(
                language === "es" ? "AutoPost Activado" : "AutoPost Active",
                { icon: <Zap className="w-4 h-4 text-green-500" /> },
            );
        } else {
            toast.info(
                language === "es"
                    ? "AutoPost en Standby"
                    : "AutoPost Standby",
            );
        }
    };

    const saveConfig = async (newConfig: any, enabledState?: boolean) => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from("autopilot_config")
                .upsert({
                    user_id: user.id,
                    frequency: newConfig.frequency || frequency,
                    tone: newConfig.tone || tone,
                    topics: newConfig.topics || topics,
                    target_audience: newConfig.targetAudience || audience,
                    post_count: 1,
                    is_enabled: enabledState !== undefined
                        ? enabledState
                        : isEnabled,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            setConfig((prev) => ({
                ...prev,
                ...newConfig,
                enabled: enabledState !== undefined ? enabledState : isEnabled,
            }));
        } catch (e) {
            console.error("Error saving config:", e);
            toast.error(
                language === "es"
                    ? "Error al guardar configuración"
                    : "Error saving configuration",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveSettings = () => {
        saveConfig({
            frequency,
            tone,
            topics,
            targetAudience: audience,
        });
        toast.success(
            language === "es"
                ? "Configuración guardada"
                : "Configuration saved",
        );
    };

    const handleForceRun = async () => {
        if (topics.length === 0) {
            toast.error(
                language === "es"
                    ? "Agrega al menos un tema primero."
                    : "Add at least one topic first.",
            );
            return;
        }

        setIsGenerating(true);
        const toastId = toast.loading(
            language === "es"
                ? "AutoPost: Generando contenido estratégico..."
                : "AutoPost: Generating strategic content...",
        );

        try {
            const topic = topics[Math.floor(Math.random() * topics.length)];

            const ideas = await generatePostIdeas(user, language, {
                niche: topic,
                style: "trending",
                source: "news",
                count: 1,
            });

            if (ideas && ideas.ideas.length > 0) {
                const generationParams: GenerationParams = {
                    topic: ideas.ideas[0],
                    audience: audience || "General Professional Audience",
                    tone: tone,
                    framework: ViralFramework.STORY,
                    length: PostLength.MEDIUM,
                    creativityLevel: 80,
                    emojiDensity: EmojiDensity.MODERATE,
                    includeCTA: true,
                    hashtagCount: 3,
                };

                const postResult = await generateViralPost(
                    generationParams,
                    user,
                );

                const { data: insertedPost, error } = await supabase
                    .from("autopilot_posts")
                    .insert({
                        user_id: user.id,
                        content: postResult.content,
                        topic: topic,
                        params: {
                            ...generationParams,
                            viralAnalysis: postResult.viralAnalysis,
                        },
                        viral_score: postResult.viralScore,
                        status: "generated",
                    })
                    .select()
                    .single();

                if (error) throw error;

                const newPost: Post = {
                    id: insertedPost.id,
                    content: postResult.content,
                    createdAt: Date.now(),
                    params: generationParams,
                    likes: 0,
                    views: 0,
                    isAutoPilot: true,
                    viralScore: postResult.viralScore,
                    viralAnalysis: postResult.viralAnalysis,
                };

                setAutomatedPosts((prev) => [newPost, ...prev]);
                toast.success(
                    language === "es"
                        ? "Post generado con éxito"
                        : "Post generated successfully",
                    { id: toastId },
                );
            }
        } catch (e: any) {
            console.error(e);
            toast.error(
                language === "es"
                    ? "Error al generar post. Revisa tus créditos."
                    : "Error generating post. Check credits.",
                { id: toastId },
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleViewPost = (post: Post) => {
        if (onViewPost) onViewPost(post);
    };

    const handleDeletePost = (postId: string) => {
        toast(
            language === "es" ? "¿Eliminar este post?" : "Delete this post?",
            {
                description: language === "es"
                    ? "Esta acción no se puede deshacer."
                    : "This action cannot be undone.",
                action: {
                    label: language === "es" ? "Eliminar" : "Delete",
                    onClick: async () => {
                        try {
                            const { error } = await supabase
                                .from("autopilot_posts")
                                .delete()
                                .eq("id", postId);

                            if (error) throw error;

                            setAutomatedPosts((prev) =>
                                prev.filter((p) => p.id !== postId)
                            );
                            toast.success(
                                language === "es"
                                    ? "Post eliminado"
                                    : "Post deleted",
                            );
                        } catch (e) {
                            console.error("Error deleting post:", e);
                            toast.error(
                                language === "es"
                                    ? "Error al eliminar post"
                                    : "Error deleting post",
                            );
                        }
                    },
                },
            },
        );
    };

    if (!user.isPremium) {
        return (
            <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 overflow-hidden bg-slate-50">
                {/* Background Decoration */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-400/10 rounded-full blur-[100px] animate-pulse">
                </div>
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-orange-400/10 rounded-full blur-[100px] animate-pulse transition-all">
                </div>

                <div className="relative z-10 w-full max-w-4xl">
                    <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl p-8 md:p-12 overflow-hidden group">
                        {/* Decorative Badge */}
                        <div className="flex justify-center mb-8">
                            <div className="px-4 py-2 bg-amber-50 rounded-full border border-amber-100/50 flex items-center gap-2">
                                <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                                    Premium Experience
                                </span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="text-center md:text-left">
                                <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
                                    Tu Contenido en <br />
                                    <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                                        Piloto Automático
                                    </span>
                                </h2>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                    {language === "es"
                                        ? "Deja que la IA analice tendencias, redacte posts virales y los programe por ti. Mantén tu presencia activa 24/7 sin mover un dedo."
                                        : "Let AI analyze trends, write viral posts, and schedule them for you. Keep your presence active 24/7 without lifting a finger."}
                                </p>

                                <button
                                    onClick={onUpgrade}
                                    className="group relative w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:shadow-slate-900/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    <span>
                                        {language === "es"
                                            ? "Desbloquear AutoPost"
                                            : "Unlock AutoPost"}
                                    </span>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        icon: <Zap />,
                                        title: "IA Estratégica",
                                        desc:
                                            "Contenido optimizado para visibilidad",
                                    },
                                    {
                                        icon: <ShieldCheck />,
                                        title: "Control Total",
                                        desc: "Define temas, tono y frecuencia",
                                    },
                                    {
                                        icon: <Cpu />,
                                        title: "Mantenimiento Zero",
                                        desc:
                                            "Publicaciones constantes y automáticas",
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-4 p-5 bg-white/50 rounded-xl border border-white/40 shadow-sm transition-transform hover:scale-[1.02]"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-slate-500">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-slate-50/50 pb-20">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-sky-50 to-transparent -z-10">
            </div>
            <div className="absolute top-40 -left-20 w-80 h-80 bg-sky-200/20 rounded-full blur-[100px] -z-10">
            </div>
            <div className="absolute top-60 -right-20 w-80 h-80 bg-indigo-200/20 rounded-full blur-[100px] -z-10">
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
                {/* Professional Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
                            AutoPost{" "}
                            <span className="text-sky-600 text-2xl md:text-3xl font-mono align-top ml-1 opacity-50">
                                v2.0
                            </span>
                        </h1>
                        <p className="text-slate-500 max-w-xl leading-relaxed">
                            {language === "es"
                                ? "Configura tu estrategia autónoma y deja que la IA genere contenido viral basado en tu marca y audiencia."
                                : "Configure your autonomous strategy and let AI generate viral content based on your brand and audience."}
                        </p>
                    </div>

                    <div className="hidden lg:flex items-center gap-4 bg-white/70 backdrop-blur-md px-6 py-4 rounded-xl border border-white shadow-sm ring-1 ring-slate-200/5">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                                {t.stats.systemHealth}
                            </p>
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-sm font-bold text-slate-700 font-mono">
                                    {t.stats.optimal}
                                </span>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse">
                                </div>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                                {t.stats.generations}
                            </p>
                            <p className="text-sm font-bold text-slate-700 font-mono">
                                {automatedPosts.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Activity Log / Status Column (Main) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Status Card */}
                        <AutoPostStatus
                            user={user}
                            config={config}
                            isEnabled={isEnabled}
                            toggleSystem={toggleSystem}
                            language={language}
                            automatedPosts={automatedPosts}
                        />

                        {/* Activity Log (Now Main Content) */}
                         <div className="h-[800px]">
                            <AutoPostActivityLog
                                language={language}
                                isEnabled={isEnabled}
                                automatedPosts={automatedPosts}
                                onForceRun={handleForceRun}
                                isGenerating={isGenerating}
                                onViewPost={handleViewPost}
                                onDeletePost={handleDeletePost}
                            />
                        </div>
                    </div>

                    {/* Configuration Sidebar */}
                    <div className="lg:col-span-4 sticky top-8 space-y-6">
                        {/* Insight Bubble */}
                        <div className="relative overflow-hidden bg-white rounded-xl p-6 text-slate-900 border border-slate-200/60/60 shadow-sm group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:bg-sky-500/20 transition-colors">
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-2 text-sky-600">
                                    <Sparkles className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        {t.insight.title}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed italic">
                                    "{t.description}"
                                </p>
                            </div>
                        </div>

                         {/* Configuration Form (Now Sidebar) */}
                         <div id="autopilot-setup">
                            <AutoPostConfig
                                language={language}
                                frequency={frequency}
                                setFrequency={setFrequency}
                                tone={tone}
                                setTone={setTone}
                                audience={audience}
                                setAudience={setAudience}
                                topics={topics}
                                setTopics={setTopics}
                                onSave={handleSaveSettings}
                                isSaving={isSaving}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoPostView;
