import { supabase } from "./supabaseClient";
import { z } from "zod";
import { Post } from "../types";
import { Database } from "../types/supabase";
import { PostID, asPostID } from "../types/branded";

// DB Schemas for validation
const PostDbSchema = z.object({
    id: z.string(),
    content: z.string(),
    params: z.any(),
    created_at: z.string(),
    viral_score: z.number().nullable().optional(),
    viral_analysis: z.any().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    is_favorite: z.boolean().nullable().optional(),
    is_auto_pilot: z.boolean().nullable().optional(),
    status: z.enum(["draft", "scheduled", "published"]).nullable().optional(),
    scheduled_date: z.string().nullable().optional(),
    user_id: z.string(),
});

const SnippetDbSchema = z.object({
    id: z.string(),
    content: z.string(),
    created_at: z.string(),
    last_used_at: z.string().nullable().optional(),
    user_id: z.string(),
});

export const fetchUserPosts = async (
    userId: string,
    page: number = 0,
    limit: number = 10,
    searchQuery: string = "",
    tone: string = "all",
): Promise<Post[]> => {
    const from = page * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);

    if (searchQuery) {
        query = query.or(
            `content.ilike.%${searchQuery}%,params->>topic.ilike.%${searchQuery}%`,
        );
    }

    if (tone && tone !== "all") {
        query = query.eq("params->>tone", tone);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching posts:", error);
        return [];
    }

    // Validate and transform
    return (data || []).map((post) => {
        const validated = PostDbSchema.parse(post);
        return {
            id: asPostID(validated.id),
            content: validated.content,
            params: validated.params,
            createdAt: new Date(validated.created_at).getTime(),
            likes: validated.viral_score || 0,
            views: 0,
            isAutoPilot: validated.is_auto_pilot || false,
            viralScore: validated.viral_score || 0,
            viralAnalysis: validated.viral_analysis,
            tags: validated.tags || [],
            isFavorite: validated.is_favorite || false,
            status: validated.status || "published",
            scheduledDate: validated.scheduled_date
                ? new Date(validated.scheduled_date).getTime()
                : undefined,
        };
    });
};

export const updatePost = async (
    postId: PostID,
    updates: Partial<Post>,
): Promise<boolean> => {
    // Map frontend camelCase to DB snake_case
    const dbUpdates: Database['public']['Tables']['posts']['Update'] = {};
    if (updates.isFavorite !== undefined) {
        dbUpdates.is_favorite = updates.isFavorite;
    }
    if (updates.isAutoPilot !== undefined) {
        dbUpdates.is_auto_pilot = updates.isAutoPilot;
    }
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.viralScore !== undefined) dbUpdates.viral_score = updates.viralScore;
    if (updates.viralAnalysis !== undefined) dbUpdates.viral_analysis = updates.viralAnalysis;
    if (updates.scheduledDate !== undefined) {
        dbUpdates.scheduled_date = new Date(updates.scheduledDate)
            .toISOString();
    }
    if (updates.content !== undefined) dbUpdates.content = updates.content;

    const { error } = await supabase
        .from("posts")
        .update(dbUpdates)
        .eq("id", postId);

    if (error) {
        console.error("Error updating post:", error);
        return false;
    }
    return true;
};

export const createPost = async (post: Partial<Post> & { userId: string }): Promise<Post | null> => {
    const dbPost: Database['public']['Tables']['posts']['Insert'] = {
        user_id: post.userId,
        content: post.content,
        params: post.params,
        viral_score: post.viralScore !== undefined ? post.viralScore : (post.likes || 0),
        viral_analysis: post.viralAnalysis,
        tags: post.tags || [],
        is_favorite: post.isFavorite || false,
        is_auto_pilot: post.isAutoPilot || false,
        status: post.status || "published",
        created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from("posts")
        .insert(dbPost)
        .select()
        .single();

    if (error) {
        console.error("Error creating post:", error);
        return null;
    }

    const validated = PostDbSchema.parse(data);

    return {
        id: asPostID(validated.id),
        content: validated.content,
        params: validated.params,
        createdAt: new Date(validated.created_at).getTime(),
        likes: validated.viral_score || 0,
        views: 0,
        isAutoPilot: validated.is_auto_pilot || false,
        viralScore: validated.viral_score,
        viralAnalysis: validated.viral_analysis,
        tags: validated.tags || [],
        isFavorite: validated.is_favorite || false,
        status: validated.status || "published",
        scheduledDate: validated.scheduled_date
            ? new Date(validated.scheduled_date).getTime()
            : undefined,
    };
};

export const fetchSnippets = async (userId: string): Promise<{ id: string, text: string, createdAt: number, lastUsed?: number }[]> => {
    const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching snippets:", error);
        return [];
    }

    return (data || []).map((snippet) => {
        const validated = SnippetDbSchema.parse(snippet);
        return {
            id: validated.id,
            text: validated.content,
            createdAt: new Date(validated.created_at).getTime(),
            lastUsed: validated.last_used_at
                ? new Date(validated.last_used_at).getTime()
                : undefined,
        };
    });
};

export const createSnippet = async (
    userId: string,
    content: string,
): Promise<{ id: string, text: string, createdAt: number } | null> => {
    const { data, error } = await supabase
        .from("snippets")
        .insert({ user_id: userId, content })
        .select()
        .single();

    if (error) {
        console.error("Error creating snippet:", error);
        return null;
    }

    return {
        id: data.id,
        text: data.content,
        createdAt: new Date(data.created_at).getTime(),
    };
};

export const deleteSnippet = async (snippetId: string): Promise<boolean> => {
    const { error } = await supabase
        .from("snippets")
        .delete()
        .eq("id", snippetId);

    if (error) {
        console.error("Error deleting snippet:", error);
        return false;
    }
    return true;
};

export interface HookSuggestion {
    id: string;
    category: string;
    value: string;
    label: string;
}

export const fetchHooks = async (): Promise<HookSuggestion[]> => {
    const { data, error } = await supabase
        .from("hooks")
        .select("*")
        .order("category", { ascending: true });

    if (error) {
        console.error("Error fetching hooks:", error);
        return [];
    }
    
    return (data || []).map((h) => ({
        id: h.id,
        category: h.category,
        value: h.content, 
        label: h.category + " - " + h.content.substring(0, 20) + "..."
    }));
};

export interface ClosureSuggestion {
    id: string;
    category: string;
    value: string;
}

export const fetchClosures = async (): Promise<ClosureSuggestion[]> => {
    const { data, error } = await supabase
        .from("closures")
        .select("*")
        .order("category", { ascending: true });

    if (error) {
        console.error("Error fetching closures:", error);
        return [];
    }

    return (data || []).map((c) => ({
        id: c.id,
        category: c.category,
        value: c.content
    }));
};
