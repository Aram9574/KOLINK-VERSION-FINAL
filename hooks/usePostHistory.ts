import React from 'react';
import { Post, UserProfile } from '../types';

interface UsePostHistoryProps {
    user: UserProfile;
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    currentPost: Post | null;
    setCurrentPost: React.Dispatch<React.SetStateAction<Post | null>>;
}

export const usePostHistory = ({ user, posts, setPosts, currentPost, setCurrentPost }: UsePostHistoryProps) => {

    const savePostToHistory = (post: Post) => {
        setPosts(prev => {
            const newPosts = [post, ...prev];
            if (user.id) {
                localStorage.setItem(`kolink_history_${user.id}`, JSON.stringify(newPosts));
            }
            return newPosts;
        });
    };

    const handleDeletePost = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newPosts = posts.filter(p => p.id !== id);
        setPosts(newPosts);
        if (user.id) {
            localStorage.setItem(`kolink_history_${user.id}`, JSON.stringify(newPosts));
        }
        if (currentPost?.id === id) {
            setCurrentPost(null);
        }
    };

    const handleUpdatePostContent = (newContent: string) => {
        if (!currentPost) return;
        const updatedPost = { ...currentPost, content: newContent };
        setCurrentPost(updatedPost);
        const updatedPosts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
        setPosts(updatedPosts);
        if (user.id) {
            localStorage.setItem(`kolink_history_${user.id}`, JSON.stringify(updatedPosts));
        }
    };

    return {
        savePostToHistory,
        handleDeletePost,
        handleUpdatePostContent
    };
};
