import React, { useState, useEffect } from 'react';
import { UserProfile, AppLanguage, AutoPilotConfig as AutoPilotConfigType, Post, ViralTone, ViralFramework, PostLength, EmojiDensity, GenerationParams } from '../../../types';
import { generatePostIdeas, generateViralPost } from '../../../services/geminiService';
import { supabase } from '../../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import AutoPilotStatus from './AutoPilotStatus';
import AutoPilotConfig from './AutoPilotConfig';
import AutoPilotActivityLog from './AutoPilotActivityLog';

interface AutoPilotViewProps {
    user: UserProfile;
    language: AppLanguage;
    onViewPost?: (post: Post) => void;
}

const AutoPilotView: React.FC<AutoPilotViewProps> = ({ user, language, onViewPost }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Config State
    const [frequency, setFrequency] = useState('daily');
    const [tone, setTone] = useState<ViralTone>(ViralTone.PROFESSIONAL);
    const [postCount, setPostCount] = useState(1);
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
                postCount: data.post_count || 1
            });
            setFrequency(data.frequency);
            setTone(data.tone as ViralTone);
            setTopics(data.topics || []);
            setAudience(data.target_audience || '');
            setPostCount(data.post_count || 1);
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
                    post_count: newConfig.postCount || postCount,
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
            postCount
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
                    includeCTA: true
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

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
            {/* Status Card */}
            <div className="mb-8">
                <AutoPilotStatus
                    user={user}
                    config={config}
                    isEnabled={isEnabled}
                    toggleSystem={toggleSystem}
                    language={language}
                    automatedPosts={automatedPosts}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Configuration Column */}
                <div className="lg:col-span-2 space-y-6">
                    <AutoPilotConfig
                        language={language}
                        frequency={frequency}
                        setFrequency={setFrequency}
                        tone={tone}
                        setTone={setTone}
                        postCount={postCount}
                        setPostCount={setPostCount}
                        audience={audience}
                        setAudience={setAudience}
                        topics={topics}
                        setTopics={setTopics}
                        onSave={handleSaveSettings}
                        isSaving={isSaving}
                    />
                </div>

                {/* Activity Log Column */}
                <div className="lg:col-span-1">
                    <AutoPilotActivityLog
                        language={language}
                        isEnabled={isEnabled}
                        automatedPosts={automatedPosts}
                        onForceRun={handleForceRun}
                        isGenerating={isGenerating}
                        onViewPost={handleViewPost}
                    />
                </div>
            </div>
        </div>
    );
};

export default AutoPilotView;
