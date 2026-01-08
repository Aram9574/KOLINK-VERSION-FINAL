import React, { useMemo, useState } from "react";
import { usePosts } from "../../../context/PostContext";
import { useUser } from "../../../context/UserContext";
import { AppLanguage, GenerationParams, Post } from "../../../types";
import { translations } from "../../../translations";
import {
    Calendar as CalendarIcon,
    Filter,
    FolderOpen,
    List as ListIcon,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LibrarySidebar from "./LibrarySidebar";
import HistoryCard from "./HistoryCard";
import CalendarView from "./CalendarView";
import { updatePost as updatePostInDb } from "../../../services/postRepository";
import { Share } from "@capacitor/share";
import Skeleton from "../../ui/Skeleton";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";
import PremiumLockOverlay from "../../ui/PremiumLockOverlay";

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
    onUpgrade,
}) => {
    const {
        posts,
        updatePost,
        searchQuery,
        setSearchQuery,
        loadMorePosts,
        hasMore,
        isLoadingMore,
    } = usePosts();

    // Local Filter State (Synced with sidebar)
    const [selectedTone, setSelectedTone] = useState<string>("all");
    const [selectedFramework, setSelectedFramework] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [showFavorites, setShowFavorites] = useState<boolean>(false);

    // View Mode
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [sortOrder, setSortOrder] = useState<string>("newest");

    const t = translations[language].app.history;

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            // Search
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    post.content.toLowerCase().includes(query) ||
                    post.params.topic.toLowerCase().includes(query) ||
                    (post.tags &&
                        post.tags.some((tag) =>
                            tag.toLowerCase().includes(query)
                        ));
                if (!matchesSearch) return false;
            }

            // Tone
            if (selectedTone !== "all" && post.params.tone !== selectedTone) {
                return false;
            }

            // Framework
            if (
                selectedFramework !== "all" &&
                post.params.framework !== selectedFramework
            ) return false;

            // Status
            if (selectedStatus !== "all" && post.status !== selectedStatus) {
                return false;
            }

            // Favorites
            if (showFavorites && !post.isFavorite) return false;

            return true;
        }).sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sortOrder === 'oldest') {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            if (sortOrder === 'viral') {
                return (b.viralScore || 0) - (a.viralScore || 0);
            }
            return 0;
        });
    }, [
        posts,
        searchQuery,
        selectedTone,
        selectedFramework,
        selectedStatus,
        showFavorites,
        sortOrder,
    ]);

    const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
        const post = posts.find((p) => p.id === id);
        if (post) {
            updatePost({ ...post, isFavorite });
            try {
                const success = await updatePostInDb(id, { isFavorite });
                if (!success) {
                    updatePost({ ...post, isFavorite: !isFavorite });
                    toast.error("Failed to update favorite status");
                } else {
                    toast.success(
                        isFavorite
                            ? (language === "es" ? "Añadido a favoritos" : "Added to favorites")
                            : (language === "es" ? "Eliminado de favoritos" : "Removed from favorites"),
                    );
                }
            } catch (error) {
                console.error("Failed to toggle favorite:", error);
                updatePost({ ...post, isFavorite: !isFavorite });
            }
        }
    };

    const handleShare = async (post: Post) => {
        try {
            await Share.share({
                title: "Post de KOLINK",
                text: post.content,
                url: "https://kolink.ai",
                dialogTitle: "Compartir post",
            });
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    const { user } = useUser();

    if (!user?.isPremium) {
        return (
            <PremiumLockOverlay 
                title={language === "es" ? "Bóveda & Historial" : "Vault & History"}
                description={language === "es"
                    ? "Organiza tu contenido, accede a estadísticas avanzadas y mantén tus mejores posts seguros en tu bóveda personal."
                    : "Organize your content, access advanced analytics, and keep your best posts safe in your personal vault."}
                icon={<FolderOpen className="w-8 h-8" />}
            />
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* Sidebar Explorer */}
            <aside
                className={cn(
                    "fixed inset-0 z-50 bg-white md:bg-transparent md:relative md:flex md:w-72 lg:w-80 border-r border-slate-200/60 transition-transform duration-300 transform md:translate-x-0",
                    showMobileFilters ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full w-full bg-white relative">
                    <div className="p-6 h-full overflow-y-auto scrollbar-hide">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                {language === 'es' ? 'Biblioteca' : 'Content Library'}
                            </h2>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-50"
                            >
                                <X strokeWidth={2} className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <LibrarySidebar
                            searchTerm={searchQuery}
                            setSearchTerm={setSearchQuery}
                            selectedTone={selectedTone}
                            setSelectedTone={setSelectedTone}
                            selectedFramework={selectedFramework}
                            setSelectedFramework={setSelectedFramework}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                            sortOrder={sortOrder}
                            setSortOrder={setSortOrder}
                            showFavorites={showFavorites}
                            setShowFavorites={setShowFavorites}
                            language={language}
                        />
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 flex flex-col h-full bg-white relative">
                {/* Header */}
                <div className="p-6 md:p-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-20 border-b border-slate-100/50">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                                {viewMode === "list"
                                    ? (language === "es" ? "Biblioteca" : "Library")
                                    : (language === "es" ? "Calendario" : "Calendar")}
                            </h1>
                            <div className="px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                {filteredPosts.length} posts
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                            {language === "es" ? "Gestiona y perfecciona tu estrategia de contenido" : "Manage and refine your content strategy"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-xs shadow-sm"
                        >
                            <Filter className="w-4 h-4" />
                            {language === "es" ? "Filtros" : "Filters"}
                        </button>

                        {/* View Custom Switcher */}
                        <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/40">
                            <button
                                onClick={() => setViewMode("list")}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                                    viewMode === "list"
                                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                <ListIcon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{language === "es" ? "Lista" : "List"}</span>
                            </button>
                            <button
                                onClick={() => setViewMode("calendar")}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                                    viewMode === "calendar"
                                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                <CalendarIcon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{language === "es" ? "Calendario" : "Calendar"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Viewport */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={viewMode}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.02, y: -10 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="h-full"
                        >
                            {viewMode === "calendar" ? (
                                <CalendarView
                                    posts={filteredPosts}
                                    language={language}
                                    onSelectPost={onSelect}
                                />
                            ) : (
                                <div className="space-y-12">
                                    {filteredPosts.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-24 px-6 border-2 border-dashed border-slate-100 rounded-3xl text-center bg-slate-50/20">
                                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-soft">
                                                <FolderOpen className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                                {t.noResults}
                                            </h3>
                                            <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                                                {t.noResultsDesc}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                                            <AnimatePresence>
                                                {filteredPosts.map((post) => (
                                                    <HistoryCard
                                                        key={post.id}
                                                        post={post}
                                                        language={language}
                                                        onSelect={onSelect}
                                                        onReuse={onReuse}
                                                        onDelete={onDelete}
                                                        onToggleFavorite={handleToggleFavorite}
                                                        onShare={handleShare}
                                                    />
                                                ))}
                                            </AnimatePresence>
                                            
                                            {isLoadingMore && (
                                                <>
                                                    <Skeleton className="h-[380px] rounded-2xl" />
                                                    <Skeleton className="h-[380px] rounded-2xl" />
                                                    <Skeleton className="h-[380px] rounded-2xl" />
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Load More */}
                                    {hasMore && !isLoadingMore && (
                                        <div className="flex justify-center pb-12">
                                            <button
                                                onClick={loadMorePosts}
                                                className="group relative px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-lg shadow-slate-200/50 hover:bg-black transition-all hover:scale-105 active:scale-95"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    {language === "es" ? "Cargar más contenido" : "Load more content"}
                                                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default HistoryView;
