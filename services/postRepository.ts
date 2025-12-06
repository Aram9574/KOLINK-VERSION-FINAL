import { supabase } from './supabaseClient';

export const fetchUserPosts = async (userId: string, page: number = 0, limit: number = 10, searchQuery: string = '', tone: string = 'all'): Promise<any[]> => {
    const from = page * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (searchQuery) {
        query = query.or(`content.ilike.%${searchQuery}%,params->>topic.ilike.%${searchQuery}%`);
    }

    if (tone && tone !== 'all') {
        query = query.eq('params->>tone', tone);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

    return data.map(post => ({
        id: post.id,
        content: post.content,
        params: post.params,
        createdAt: new Date(post.created_at).getTime(),
        likes: post.viral_score || 0,
        views: 0,
        isAutoPilot: false,
        viralScore: post.viral_score,
        viralAnalysis: post.viral_analysis
    }));
};
