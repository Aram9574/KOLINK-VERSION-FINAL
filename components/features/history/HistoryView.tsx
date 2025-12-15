import React, { useState, useMemo } from 'react';
import { usePosts } from '../../../context/PostContext';
import { useUser } from '../../../context/UserContext';
import { Post, AppLanguage, GenerationParams } from '../../../types';
import { translations } from '../../../translations';
import { FolderOpen, Calendar as CalendarIcon, List as ListIcon } from 'lucide-react';
import LibrarySidebar from './LibrarySidebar';
import HistoryCard from './HistoryCard';
import CalendarView from './CalendarView';
import { updatePost as updatePostInDb } from '../../../services/postRepository';
import { toast } from 'sonner';

interface HistoryViewProps {
    onSelect: (post: Post) => void;
    onReuse: (params: GenerationParams) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
    language: AppLanguage;
    onUpgrade?: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({
    onSelect,
    onReuse,
    onDelete,
    language,
    onUpgrade
}) => {
    const {
        posts,
        updatePost,
        searchQuery,
        setSearchQuery,
        loadMorePosts,
        hasMore,
        isLoadingMore
    } = usePosts();

    // Local Filter State (Synced with sidebar)
    const [selectedTone, setSelectedTone] = useState<string>('all');
    const [selectedFramework, setSelectedFramework] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [showFavorites, setShowFavorites] = useState<boolean>(false);

    // View Mode
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    const t = translations[language].app.history;

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            // Search
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch = post.content.toLowerCase().includes(query) ||
                    post.params.topic.toLowerCase().includes(query) ||
                    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)));
                if (!matchesSearch) return false;
            }

            // Tone
            if (selectedTone !== 'all' && post.params.tone !== selectedTone) return false;

            // Framework
            if (selectedFramework !== 'all' && post.params.framework !== selectedFramework) return false;

            // Status
            if (selectedStatus !== 'all' && post.status !== selectedStatus) return false;

            // Favorites
            if (showFavorites && !post.isFavorite) return false;

            return true;
        });
    }, [posts, searchQuery, selectedTone, selectedFramework, selectedStatus, showFavorites]);

    const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
        // Optimistic update
        const post = posts.find(p => p.id === id);
        if (post) {
            updatePost({ ...post, isFavorite }); // Update Context

            // Persist
            try {
                const success = await updatePostInDb(id, { isFavorite });
                if (!success) {
                    // Revert if failed
                    updatePost({ ...post, isFavorite: !isFavorite });
                    toast.error('Failed to update favorite status');
                } else {
                    toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
                }
            } catch (error) {
                console.error("Failed to toggle favorite:", error);
                updatePost({ ...post, isFavorite: !isFavorite });
            }
        }
    };

    const { user } = useUser();

    if (!user?.isPremium) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-50/50">
                <div className="bg-white rounded-3xl p-12 text-center max-w-lg shadow-xl border border-slate-100">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FolderOpen className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {language === 'es' ? 'Historial Premium' : 'Premium History'}
                    </h2>
                    <p className="text-slate-600 mb-6 text-sm">
                        {language === 'es'
                            ? 'Accede a todo tu historial de publicaciones, estadísticas y favoritos.'
                            : 'Access your entire post history, analytics, and favorites.'}
                    </p>
                    <button
                        onClick={onUpgrade}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-1"
                    >
                        {language === 'es' ? 'Desbloquear Historial' : 'Unlock History'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-full">
            {/* Sidebar */}
            <div className="w-full md:w-64 p-4 md:p-6 border-b md:border-b-0 md:border-r border-slate-200 bg-white md:h-full overflow-y-auto">
                <LibrarySidebar
                    searchTerm={searchQuery}
                    setSearchTerm={setSearchQuery}
                    selectedTone={selectedTone}
                    setSelectedTone={setSelectedTone}
                    selectedFramework={selectedFramework}
                    setSelectedFramework={setSelectedFramework}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    showFavorites={showFavorites}
                    setShowFavorites={setShowFavorites}
                    language={language}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full bg-slate-50/50">
                {/* Top Bar */}
                <div className="p-6 pb-0 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-900">
                            {viewMode === 'list' ? (language === 'es' ? 'Biblioteca' : 'Library') : (language === 'es' ? 'Calendario' : 'Calendar')}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {filteredPosts.length} {language === 'es' ? 'publicaciones' : 'posts found'}
                        </p>
                    </div>

                    {/* View Switcher */}
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="List View"
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Calendar View"
                        >
                            <CalendarIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 min-h-0 overflow-y-auto">
                    {viewMode === 'calendar' ? (
                        <div className="h-full">
                            <CalendarView
                                posts={filteredPosts} // Only show filtered posts in calendar? Or all? Usually filter applies to view.
                                language={language}
                                onSelectPost={onSelect}
                            />
                        </div>
                    ) : (
                        // List View (CSS Grid)
                        <div className="pb-20"> {/* Padding bottom for scroll space */}
                            {filteredPosts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-slate-200 rounded-3xl text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <FolderOpen className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-1">{t.noResults}</h3>
                                    <p className="text-sm text-slate-500 max-w-xs mx-auto">{t.noResultsDesc}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {filteredPosts.map((post) => (
                                            <HistoryCard
                                                key={post.id}
                                                post={post}
                                                language={language}
                                                onSelect={onSelect}
                                                onReuse={onReuse}
                                                onDelete={onDelete}
                                                onToggleFavorite={handleToggleFavorite}
                                            />
                                        ))}
                                    </div>

                                    {/* Load More Trigger */}
                                    {hasMore && (
                                        <div className="mt-8 flex justify-center">
                                            <button
                                                onClick={loadMorePosts}
                                                disabled={isLoadingMore}
                                                className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50"
                                            >
                                                {isLoadingMore ? 'Loading...' : 'Load More'}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryView;
