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
        viralAnalysis: post.viral_analysis,
        tags: post.tags || [],
        isFavorite: post.is_favorite || false,
        status: post.status || 'published',
        scheduledDate: post.scheduled_date ? new Date(post.scheduled_date).getTime() : undefined
    }));
};

export const updatePost = async (postId: string, updates: any): Promise<boolean> => {
    // Map frontend camelCase to DB snake_case
    const dbUpdates: any = {};
    if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.scheduledDate !== undefined) dbUpdates.scheduled_date = new Date(updates.scheduledDate).toISOString();
    if (updates.content !== undefined) dbUpdates.content = updates.content;

    const { error } = await supabase
        .from('posts')
        .update(dbUpdates)
        .eq('id', postId);

    if (error) {
        console.error('Error updating post:', error);
        return false;
    }
    return true;
};
