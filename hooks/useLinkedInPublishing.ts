import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { supabase } from '../services/supabaseClient';
import { Post } from '../types';

export const useLinkedInPublishing = () => {
    const toast = useToast();
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = async (currentPost: Post | null) => {
        if (!currentPost) return;

        setIsPublishing(true);
        try {
            // @ts-ignore
            const { data: { session } } = await supabase.auth.getSession();
            const providerToken = session?.provider_token;

            if (!providerToken) {
                toast.error("No se detectó conexión con LinkedIn. Por favor inicia sesión nuevamente.", "Error de Auth");
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

            toast.success("¡Post publicado exitosamente en LinkedIn!", "Publicado");
        } catch (error: any) {
            console.error("Publishing error:", error);
            toast.error(error.message || "Error al publicar en LinkedIn", "Error");
        } finally {
            setIsPublishing(false);
        }
    };

    return {
        isPublishing,
        handlePublish
    };
};
