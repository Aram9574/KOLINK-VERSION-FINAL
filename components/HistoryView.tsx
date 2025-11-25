
import React, { useState } from 'react';
import { Post, AppLanguage, GenerationParams } from '../types';
import { translations } from '../translations';
import { TONES, FRAMEWORKS } from '../constants';
import { Search, Calendar, ThumbsUp, Eye, Copy, Trash2, Edit3, Filter, FolderOpen, Zap, RotateCcw, TrendingUp } from 'lucide-react';

interface HistoryViewProps {
    posts: Post[];
    onSelect: (post: Post) => void;
    onReuse: (params: GenerationParams) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
    language: AppLanguage;
}

const HistoryView: React.FC<HistoryViewProps> = ({ posts, onSelect, onReuse, onDelete, language }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTone, setSelectedTone] = useState<string>('all');
    const [selectedFramework, setSelectedFramework] = useState<string>('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const t = translations[language].app.history;
    const tConstants = translations[language].app.constants;

    const handleCopy = (id: string, content: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.params.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTone = selectedTone === 'all' || post.params.tone === selectedTone;
        const matchesFramework = selectedFramework === 'all' || post.params.framework === selectedFramework;
        return matchesSearch && matchesTone && matchesFramework;
    });

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-100';
        if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-100';
        return 'text-red-600 bg-red-50 border-red-100';
    };

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 h-full flex flex-col">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">{t.viewTitle}</h1>
                    <p className="text-slate-500 mt-1">{t.viewSubtitle}</p>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium shadow-sm transition-all"
                        />
                    </div>

                    {/* Tone Filter */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <Filter className="w-4 h-4" />
                        </div>
                        <select
                            value={selectedTone}
                            onChange={(e) => setSelectedTone(e.target.value)}
                            className="w-full sm:w-48 pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium shadow-sm appearance-none cursor-pointer hover:border-brand-300 transition-all"
                        >
                            <option value="all">{t.filterAll}</option>
                            {TONES.map(tone => (
                                <option key={tone.value} value={tone.value}>
                                    {tConstants.tones[tone.value]?.label || tone.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Framework Filter */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <Zap className="w-4 h-4" />
                        </div>
                        <select
                            value={selectedFramework}
                            onChange={(e) => setSelectedFramework(e.target.value)}
                            className="w-full sm:w-48 pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium shadow-sm appearance-none cursor-pointer hover:border-brand-300 transition-all"
                        >
                            <option value="all">{language === 'es' ? 'Todas Estructuras' : 'All Frameworks'}</option>
                            {FRAMEWORKS.map(fw => (
                                <option key={fw.value} value={fw.value}>
                                    {tConstants.frameworks[fw.value]?.label || fw.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-2 -mr-2">
                {filteredPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] bg-white border border-slate-200 border-dashed rounded-3xl text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <FolderOpen className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{t.noResults}</h3>
                        <p className="text-slate-400 max-w-sm mx-auto">
                            {t.noResultsDesc}
                        </p>
                    </div>
                ) : (
                    /* Masonry Grid using CSS Columns */
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 pb-8">
                        {filteredPosts.map((post) => {
                            const toneLabel = tConstants.tones[post.params.tone]?.label || post.params.tone;
                            const frameworkLabel = tConstants.frameworks[post.params.framework]?.label || post.params.framework;
                            const score = post.viralScore || 0;

                            return (
                                <div
                                    key={post.id}
                                    onClick={() => onSelect(post)}
                                    className="break-inside-avoid group bg-white rounded-2xl border border-slate-200 p-6 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1 relative overflow-hidden"
                                >
                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                                        <div className="flex gap-2">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-200 group-hover:bg-brand-50 group-hover:text-brand-700 group-hover:border-brand-200 transition-colors">
                                                {toneLabel}
                                            </span>
                                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-100 group-hover:border-indigo-200 transition-colors">
                                                {frameworkLabel.split(' ')[0]}
                                            </span>
                                        </div>
                                        <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium whitespace-nowrap">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(post.createdAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-6">
                                        <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2" title={post.params.topic}>
                                            {post.params.topic}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-[8] font-normal whitespace-pre-line">
                                            {post.content}
                                        </p>
                                    </div>

                                    {/* Footer Stats & Actions */}
                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-4">
                                            {score > 0 ? (
                                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${getScoreColor(score)} text-xs font-bold`}>
                                                    <TrendingUp className="w-3.5 h-3.5" />
                                                    Score: {score}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">{t.noScore}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={(e) => handleCopy(post.id, post.content, e)}
                                                className="p-2 hover:bg-brand-50 text-slate-400 hover:text-brand-600 rounded-lg transition-colors relative"
                                                title={t.copy}
                                            >
                                                {copiedId === post.id && (
                                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap animate-in fade-in zoom-in">
                                                        {t.actions.copied}
                                                    </span>
                                                )}
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onReuse(post.params);
                                                }}
                                                className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                                                title={t.actions.reuse}
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => onDelete(post.id, e)}
                                                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                                title={t.delete}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryView;
