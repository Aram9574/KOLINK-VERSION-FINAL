import React, { useState, useEffect } from 'react';
import { UserProfile, AppLanguage, AutoPilotConfig as AutoPilotConfigType, Post, ViralTone, ViralFramework, PostLength, EmojiDensity, GenerationParams } from '../../../types';
import { generatePostIdeas, generateViralPost } from '../../../services/geminiService';
import { supabase } from '../../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../../translations';
// - [x] AutoPilot UX: Resize Status Bar (Move to Grid)
// - [ ] AutoPilot UX: Move Description to Right Column
import AutoPilotStatus from './AutoPilotStatus';
import AutoPilotConfig from './AutoPilotConfig';
import AutoPilotActivityLog from './AutoPilotActivityLog';

interface AutoPilotViewProps {
    user: UserProfile;
    language: AppLanguage;
    onViewPost?: (post: Post) => void;
    onUpgrade?: () => void;
}

const AutoPilotView: React.FC<AutoPilotViewProps> = ({ user, language, onViewPost, onUpgrade }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Config State
    const [frequency, setFrequency] = useState('daily');
    const [tone, setTone] = useState<ViralTone>(ViralTone.PROFESSIONAL);

    const [audience, setAudience] = useState('');
    const [topics, setTopics] = useState<string[]>([]);

    // Mock Data for Demo
    const [config, setConfig] = useState<AutoPilotConfigType>({
        frequency: 'daily',
        tone: ViralTone.PROFESSIONAL,
        topics: [],
        nextRun: Date.now() + 86400000,
        enabled: false,
        targetAudience: 'General Professional Audience',
        postCount: 1
    });

    const [automatedPosts, setAutomatedPosts] = useState<Post[]>([]);

    const navigate = useNavigate();
    const t = translations[language].app.autopilot;

    // Load saved config and posts on mount
    useEffect(() => {
        fetchConfig();
        fetchAutoPilotPosts();
    }, [user.id]);

    const fetchConfig = async () => {
        const { data, error } = await supabase
            .from('autopilot_config')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (data) {
            setConfig({
                enabled: data.is_enabled,
                frequency: data.frequency,
                tone: data.tone as ViralTone,
                topics: data.topics || [],
                nextRun: data.next_run ? new Date(data.next_run).getTime() : Date.now() + 86400000,
                targetAudience: data.target_audience || '',
                postCount: 1 // Enforce 1
            });
            setFrequency(data.frequency);
            setTone(data.tone as ViralTone);
            setTopics(data.topics || []);
            setAudience(data.target_audience || '');

            setIsEnabled(data.is_enabled);
        }
    };

    const fetchAutoPilotPosts = async () => {
        const { data, error } = await supabase
            .from('autopilot_posts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);

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
                viralAnalysis: p.params?.viralAnalysis // Assuming it is stored in params or we fetch it?
            }));
            setAutomatedPosts(mappedPosts);
        }
    };

    const toggleSystem = async () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        await saveConfig({ ...config, enabled: newState }, newState);
    };

    const saveConfig = async (newConfig: any, enabledState?: boolean) => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('autopilot_config')
                .upsert({
                    user_id: user.id,
                    frequency: newConfig.frequency || frequency,
                    tone: newConfig.tone || tone,
                    topics: newConfig.topics || topics,
                    target_audience: newConfig.targetAudience || audience,
                    post_count: 1,
                    is_enabled: enabledState !== undefined ? enabledState : isEnabled,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            setConfig({
                ...config,
                ...newConfig,
                enabled: enabledState !== undefined ? enabledState : isEnabled
            });

        } catch (e) {
            console.error('Error saving config:', e);
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
    };

    const handleForceRun = async () => {
        if (topics.length === 0) {
            alert(language === 'es' ? 'Agrega al menos un tema primero.' : 'Add at least one topic first.');
            return;
        }

        setIsGenerating(true);
        try {
            // 1. Pick a random topic
            const topic = topics[Math.floor(Math.random() * topics.length)];

            // 2. Generate Idea
            const ideas = await generatePostIdeas(user, language, {
                niche: topic,
                style: 'trending',
                source: 'news',
                count: 1
            });

            if (ideas && ideas.ideas.length > 0) {
                // 3. Generate Post
                const generationParams: GenerationParams = {
                    topic: ideas.ideas[0],
                    audience: audience || "General Professional Audience",
                    tone: tone,
                    framework: ViralFramework.STORY,
                    length: PostLength.MEDIUM,
                    creativityLevel: 80,
                    emojiDensity: EmojiDensity.MODERATE,
                    includeCTA: true,
                    hashtagCount: 3
                };

                const postResult = await generateViralPost(generationParams, user);

                // 4. Save to DB
                const { data: insertedPost, error } = await supabase
                    .from('autopilot_posts')
                    .insert({
                        user_id: user.id,
                        content: postResult.content,
                        topic: topic,
                        params: generationParams,
                        viral_score: postResult.viralScore,
                        status: 'generated'
                    })
                    .select()
                    .single();

                if (error) throw error;

                // 5. Add to local state
                const newPost: Post = {
                    id: insertedPost.id,
                    content: postResult.content,
                    createdAt: Date.now(),
                    params: generationParams,
                    likes: 0,
                    views: 0,
                    isAutoPilot: true,
                    viralScore: postResult.viralScore,
                    viralAnalysis: postResult.viralAnalysis
                };

                setAutomatedPosts(prev => [newPost, ...prev]);
            }

        } catch (e) {
            console.error(e);
            alert(language === 'es' ? 'Error al generar post. Revisa tus créditos.' : 'Error generating post. Check credits.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle "View/Edit" action - Redirect to Studio
    const handleViewPost = (post: Post) => {
        // We can pass state via navigate to pre-fill the Studio
        navigate('/studio', { state: { initialContent: post.content, fromAutoPilot: true } });
        if (onViewPost) onViewPost(post);
    };

    const handleDeletePost = async (postId: string) => {
        if (!window.confirm(language === 'es' ? '¿Estás seguro de que quieres eliminar este post?' : 'Are you sure you want to delete this post?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('autopilot_posts')
                .delete()
                .eq('id', postId);

            if (error) throw error;

            setAutomatedPosts(prev => prev.filter(p => p.id !== postId));
        } catch (e) {
            console.error('Error deleting post:', e);
            alert(language === 'es' ? 'Error al eliminar post.' : 'Error deleting post.');
        }
    };

    if (!user.isPremium) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8">
                <div className="bg-white rounded-3xl p-12 text-center max-w-lg shadow-xl border border-slate-100">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="w-12 h-12 text-amber-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">{language === 'es' ? 'AutoPilot Premium' : 'Premium AutoPilot'}</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        {language === 'es'
                            ? 'Automatiza tu creación de contenido con IA. Define tus temas, frecuencia y tono, y deja que nuestra IA trabaje por ti.'
                            : 'Automate your content creation with AI. Define your topics, frequency, and tone, and let our AI work for you.'}
                    </p>
                    <button
                        onClick={onUpgrade}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-1"
                    >
                        {language === 'es' ? 'Desbloquear AutoPilot' : 'Unlock AutoPilot'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">





            <div className="grid lg:grid-cols-3 gap-8">
                {/* Configuration Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Card */}
                    <AutoPilotStatus
                        user={user}
                        config={config}
                        isEnabled={isEnabled}
                        toggleSystem={toggleSystem}
                        language={language}
                        automatedPosts={automatedPosts}
                    />

                    <AutoPilotConfig
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

                {/* Activity Log Column */}
                <div className="lg:col-span-1 flex flex-col space-y-6 h-full">
                    {/* Description Bubble */}
                    <div className="bg-indigo-50/50 text-indigo-900/80 px-6 py-4 rounded-2xl text-sm font-medium border border-indigo-100 shadow-sm backdrop-blur-sm text-center">
                        {t.description}
                    </div>

                    <div className="flex-1 min-h-0">
                        <AutoPilotActivityLog
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
            </div>
        </div>
    );
};

export default AutoPilotView;
