import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post } from '../types';
import { fetchUserPosts } from '../services/postRepository';
import { useUser } from './UserContext';
import { toast } from 'sonner';

interface PostContextType {
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    currentPost: Post | null;
    setCurrentPost: React.Dispatch<React.SetStateAction<Post | null>>;
    isGenerating: boolean;
    setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
    refreshPosts: () => Promise<void>;
    addPost: (post: Post) => void;
    updatePost: (post: Post) => void;
    removePost: (id: string) => void;
    // Pagination
    loadMorePosts: () => Promise<void>;
    hasMore: boolean;
    isLoadingMore: boolean;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    selectedTone: string;
    setSelectedTone: React.Dispatch<React.SetStateAction<string>>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination State
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const POSTS_PER_PAGE = 10;

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTone, setSelectedTone] = useState('all');

    // Initial Fetch & Filter Change
    useEffect(() => {
        let isMounted = true;

        const loadInitialPosts = async () => {
            if (!user.id || user.id.startsWith('mock-')) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                // 1. Try Local Storage first (only if no filters)
                const storageKey = `kolink_history_${user.id}`;
                if (!searchQuery && selectedTone === 'all') {
                    const savedHistory = localStorage.getItem(storageKey);
                    if (savedHistory) {
                        setPosts(JSON.parse(savedHistory));
                        setIsLoading(false); // Show cached data immediately
                    }
                }

                // 2. Fetch from DB (Page 0)
                const dbPosts = await fetchUserPosts(user.id, 0, POSTS_PER_PAGE, searchQuery, selectedTone);

                if (isMounted && dbPosts) {
                    setPosts(dbPosts);
                    setPage(0);
                    setHasMore(dbPosts.length === POSTS_PER_PAGE);

                    // Only cache if no filters
                    if (!searchQuery && selectedTone === 'all') {
                        localStorage.setItem(storageKey, JSON.stringify(dbPosts));
                    }
                }
            } catch (error) {
                console.error("Error loading posts:", error);
                toast.error("Failed to load posts");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            loadInitialPosts();
        }, 500);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [user.id, searchQuery, selectedTone]);

    const loadMorePosts = async () => {
        if (isLoadingMore || !hasMore || !user.id) return;

        setIsLoadingMore(true);
        try {
            const nextPage = page + 1;
            const newPosts = await fetchUserPosts(user.id, nextPage, POSTS_PER_PAGE, searchQuery, selectedTone);

            if (newPosts.length > 0) {
                setPosts(prev => [...prev, ...newPosts]);
                setPage(nextPage);
                setHasMore(newPosts.length === POSTS_PER_PAGE);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more posts:", error);
            toast.error("Failed to load more posts");
        } finally {
            setIsLoadingMore(false);
        }
    };

    const refreshPosts = async () => {
        if (!user.id) return;
        // Reset to page 0
        const dbPosts = await fetchUserPosts(user.id, 0, POSTS_PER_PAGE, searchQuery, selectedTone);
        if (dbPosts) {
            setPosts(dbPosts);
            setPage(0);
            setHasMore(dbPosts.length === POSTS_PER_PAGE);
            if (!searchQuery && selectedTone === 'all') {
                localStorage.setItem(`kolink_history_${user.id}`, JSON.stringify(dbPosts));
            }
        }
    };

    const addPost = (post: Post) => {
        setPosts(prev => {
            const newPosts = [post, ...prev];
            // Update local storage with just the first page to keep it light
            const firstPage = newPosts.slice(0, POSTS_PER_PAGE);
            if (!searchQuery && selectedTone === 'all') {
                localStorage.setItem(`kolink_history_${user.id}`, JSON.stringify(firstPage));
            }
            return newPosts;
        });
    };

    const updatePost = (updatedPost: Post) => {
        setPosts(prev => {
            const newPosts = prev.map(p => p.id === updatedPost.id ? updatedPost : p);
            const firstPage = newPosts.slice(0, POSTS_PER_PAGE);
            if (!searchQuery && selectedTone === 'all') {
                localStorage.setItem(`kolink_history_${user.id}`, JSON.stringify(firstPage));
            }
            return newPosts;
        });
    };

    const removePost = (id: string) => {
        setPosts(prev => {
            const newPosts = prev.filter(p => p.id !== id);
            const firstPage = newPosts.slice(0, POSTS_PER_PAGE);
            if (!searchQuery && selectedTone === 'all') {
                localStorage.setItem(`kolink_history_${user.id}`, JSON.stringify(firstPage));
            }
            return newPosts;
        });
        if (currentPost?.id === id) {
            setCurrentPost(null);
        }
    };

    return (
        <PostContext.Provider value={{
            posts,
            setPosts,
            currentPost,
            setCurrentPost,
            isGenerating,
            setIsGenerating,
            isLoading,
            refreshPosts,
            addPost,
            updatePost,
            removePost,
            loadMorePosts,
            hasMore,
            isLoadingMore,
            searchQuery,
            setSearchQuery,
            selectedTone,
            setSelectedTone
        }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePosts = () => {
    const context = useContext(PostContext);
    if (context === undefined) {
        throw new Error('usePosts must be used within a PostProvider');
    }
    return context;
};
