import { useState } from 'react';
import { useToasts } from '../components/ui/toast';
import { supabase } from '../services/supabaseClient';
import { Post } from '../types';

export const useLinkedInPublishing = () => {
    const toasts = useToasts();
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = async (currentPost: Post | null) => {
        if (!currentPost) return;

        setIsPublishing(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const providerToken = session?.provider_token;

            if (!providerToken) {
                toasts.error("No se detectó conexión con LinkedIn. Por favor inicia sesión nuevamente con LinkedIn.");
                return;
            }

            const { data, error } = await supabase.functions.invoke('publish-to-linkedin', {
                body: {
                    content: currentPost.content,
                    providerToken: providerToken,
                    visibility: 'PUBLIC'
                }
            });

            if (error) throw error;

            if (data && !data.success) {
                throw new Error(data.error || "Error desconocido al publicar");
            }

            toasts.success("¡Post publicado exitosamente en LinkedIn!");
        } catch (error: any) {
            console.error("Publishing error:", error);
            toasts.error(error.message || "Error al publicar en LinkedIn");
        } finally {
            setIsPublishing(false);
        }
    };

    return {
        isPublishing,
        handlePublish
    };
};
