import { supabase } from './supabaseClient';

export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                upsert: true,
                contentType: file.type
            });

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};
