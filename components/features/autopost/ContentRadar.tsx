import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, Globe, MessageCircle, FileText, Search, RefreshCw, Filter } from 'lucide-react';
import { Trend, TrendCategory, ContentAngle, Post, ViralTone, ViralFramework, EmojiDensity, PostLength } from '../../../types';
import { getRecommendedTrends } from '../../../lib/services/trendsService';
import { usePosts } from '../../../context/PostContext';
import AngleGenerator from './AngleGenerator';
import { toast } from 'sonner';

const ContentRadar: React.FC = () => {
    // const navigate = useNavigate(); // Not using router matching for internal tabs
    const { setCurrentPost } = usePosts();
    const [trends, setTrends] = useState<Trend[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
    const [filter, setFilter] = useState<TrendCategory | 'all'>('all');

    useEffect(() => {
        loadTrends();
    }, []);

    const loadTrends = async () => {
        setLoading(true);
        try {
            const data = await getRecommendedTrends([]); // Pass user keywords eventually
            setTrends(data);
        } catch (error) {
            console.error("Failed to load trends");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (angle: ContentAngle) => {
        // Simulate generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Enrich the context for the AI
        const ideaText = `TEMA: ${selectedTrend?.title}

CONTEXTO: ${selectedTrend?.summary}
FUENTE: ${selectedTrend?.source}

ESTRATEGIA: ${angle.title}
HOOK: "${angle.hook}"`;

        // Create a temporary post object for the Generator
        const newPost: Post = {
            id: `draft-${Date.now()}`,
            content: "", // Empty because we want to GENERATE based on the idea
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'draft',
            params: {
                topic: ideaText, 
                audience: "General",
                tone: ViralTone.PROFESSIONAL, 
                framework: ViralFramework.STANDARD,
                length: PostLength.MEDIUM,
                creativityLevel: 50,
                emojiDensity: EmojiDensity.MODERATE, 
                hashtagCount: 3,
                includeCTA: true
            },
            likes: 0,
            views: 0
        };

        toast.success(`¡Estrategia definida: ${angle.title}!`, {
            description: "Llevando esta idea al Laboratorio Viral..."
        });
        
        setSelectedTrend(null);
        
        // Set context and switch tab to GENERATOR (create)
        setTimeout(() => {
            setCurrentPost(newPost);
            window.dispatchEvent(new CustomEvent('kolink-switch-tab', { detail: 'create' }));
        }, 800);
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-500 bg-emerald-50 ring-emerald-500/20';
        if (score >= 70) return 'text-amber-500 bg-amber-50 ring-amber-500/20';
        return 'text-slate-500 bg-slate-50 ring-slate-500/20';
    };

    const getCategoryIcon = (cat: TrendCategory) => {
        switch (cat) {
            case 'news': return <Globe size={14} />;
            case 'social': return <MessageCircle size={14} />;
            case 'regulatory': return <FileText size={14} />;
            case 'search': return <Search size={14} />;
        }
    };

    const filteredTrends = filter === 'all' ? trends : trends.filter(t => t.category === filter);

    const translateCategory = (cat: string) => {
        switch(cat) {
            case 'all': return 'Todos';
            case 'news': return 'Noticias';
            case 'social': return 'Social';
            case 'regulatory': return 'Legal';
            case 'search': return 'Búsquedas';
            default: return cat;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 text-rose-600 rounded-lg animate-pulse">
                        <Radar size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Radar de Tendencias</h3>
                        <p className="text-sm text-slate-500">Oportunidades en tiempo real alineadas a tu ADN.</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {(['all', 'news', 'social', 'search'] as const).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat as any)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                    filter === cat 
                                        ? 'bg-white text-slate-900 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {translateCategory(cat)}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={loadTrends} 
                        disabled={loading}
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <AnimatePresence mode='popLayout'>
                    {loading ? (
                        [1,2,3,4].map(i => (
                            <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
                        ))
                    ) : filteredTrends.map((trend) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={trend.id}
                            onClick={() => setSelectedTrend(trend)}
                            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden"
                        >
                            {/* Match Score Badge */}
                            <div className={`absolute top-4 right-4 px-2 py-1 rounded-lg text-xs font-bold ring-1 flex items-center gap-1 ${getScoreColor(trend.matchScore)}`}>
                                {trend.matchScore}% Afinidad
                            </div>

                            <div className="flex items-start gap-3 mb-3">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                    {getCategoryIcon(trend.category)}
                                    {translateCategory(trend.category)}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {new Date(trend.timestamp).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                                </span>
                            </div>

                            <h4 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-indigo-700 transition-colors pr-20">
                                {trend.title}
                            </h4>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4 group-hover:text-slate-600">
                                {trend.summary}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                    Fuente: <span className="text-slate-600">{trend.source}</span>
                                </span>
                                <span className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    Reutilizar →
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal for Angle Generation */}
            <AnimatePresence>
                {selectedTrend && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="w-full max-w-2xl"
                        >
                            <AngleGenerator 
                                trend={selectedTrend} 
                                onGenerate={handleGenerate} 
                                onClose={() => setSelectedTrend(null)} 
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContentRadar;
