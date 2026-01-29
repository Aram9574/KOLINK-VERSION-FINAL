import { supabase } from './supabaseClient';
import { GenerationParams, PostContentSchema } from '../types';
import { z } from 'zod';

class PostServiceError extends Error {
    constructor(message: string, public originalError?: any) {
        super(message);
        this.name = 'PostServiceError';
    }
}

export const PostService = {
    /**
     * Calls the Edge Function to generate a viral post.
     * @param params Generation parameters
     * @param userId User ID for context
     * @returns Generated post content and metadata
     */
    async generateViralPost(params: GenerationParams, userId: string) {
        try {
            console.log('PostService.generateViralPost:', params);

            const { data, error } = await supabase.functions.invoke('generate-viral-post', {
                body: {
                    ...params,
                    userId,
                }
            });

            if (error) {
                console.error("Supabase Invoke Error:", error);
                
                // Try to extract body from FunctionsHttpError
                if (error instanceof Error && 'context' in error) {
                    try {
                        const context = (error as any).context;
                        if (context && typeof context.json === 'function') {
                            const errBody = await context.json();
                            console.error("Error Response Body:", errBody);
                        }
                    } catch (e) {
                        console.error("Failed to parse error body", e);
                    }
                }

                throw new PostServiceError(`Failed to invoke generation function: ${error.message}`, error);
            }

            // Runtime validation using Zod
            const validation = PostContentSchema.safeParse(data);
            
            if (!validation.success) {
                console.error("Validation Error:", validation.error);
                // Fallback for partial data or throw descriptive error
                throw new PostServiceError("Invalid response format from AI", validation.error);
            }

            return validation.data;

        } catch (error: any) {
            console.error("PostService Error:", error);
            if (error instanceof PostServiceError) throw error;
            throw new PostServiceError(error.message || "Unknown error during generation", error);
        }
    },

    /**
     * Saves a generated post to the database.
     */
    async savePostToDb(content: string, params: GenerationParams, userId: string) {
         try {
            const { data, error } = await supabase
                .from('posts')
                .insert({
                    user_id: userId,
                    content: content,
                    status: 'draft',
                    metadata: params
                })
                .select()
                .single();

            if (error) throw error;
            return data;
         } catch (error: any) {
             throw new PostServiceError("Failed to save post to database", error);
         }
    }
};
