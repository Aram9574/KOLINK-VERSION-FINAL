import { supabase } from './supabaseClient';
import { BrandVoice } from '../types';

export const fetchBrandVoices = async (userId: string): Promise<BrandVoice[]> => {
    const { data, error } = await supabase
        .from('brand_voices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching brand voices:', error);
        return [];
    }

    return (data || []).map((v: any) => ({
        ...v,
        isActive: v.is_active,
        hookPatterns: v.hook_patterns,
        stylisticDNA: v.stylistic_dna
    }));
};

export const setBrandVoiceActive = async (userId: string, voiceId: string): Promise<void> => {
    await supabase.rpc('set_brand_voice_active', { p_user_id: userId, p_voice_id: voiceId });
};

export const createBrandVoice = async (userId: string, name: string, description: string, hookPatterns?: any[], stylisticDNA?: any): Promise<any> => {
    const { data, error } = await supabase
        .from('brand_voices')
        .insert([{ 
            user_id: userId, 
            name, 
            description, 
            hook_patterns: hookPatterns || [], 
            stylistic_dna: stylisticDNA || {} 
        }])
        .select()
        .single();
    
    if (error) throw error;
    
    return {
        ...data,
        isActive: data.is_active,
        hookPatterns: data.hook_patterns,
        stylisticDNA: data.stylistic_dna
    };
};

export const updateBrandVoice = async (id: string, updates: Partial<BrandVoice>): Promise<any> => {
    const dbUpdates: any = { ...updates };
    if (updates.isActive !== undefined) {
        dbUpdates.is_active = updates.isActive;
        delete dbUpdates.isActive;
    }
    if (updates.hookPatterns !== undefined) {
        dbUpdates.hook_patterns = updates.hookPatterns;
        delete dbUpdates.hookPatterns;
    }
    if (updates.stylisticDNA !== undefined) {
        dbUpdates.stylistic_dna = updates.stylisticDNA;
        delete dbUpdates.stylisticDNA;
    }

    const { data, error } = await supabase
        .from('brand_voices')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
    
    if (error) throw error;
    return data;
};

export const deleteBrandVoice = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('brand_voices')
        .delete()
        .eq('id', id);
    if (error) throw error;
};

export const analyzeBrandVoice = async (payload: { contentSamples?: string[], language: string, imageBase64?: string, pdfBase64?: string }): Promise<any> => {
    const { data, error } = await supabase.functions.invoke('analyze-brand-voice', {
        body: payload
    });

    if (error) {
        console.error("Analysis Error:", error);
        throw new Error(error.message);
    }

    if (data.error) throw new Error(data.error);

    return {
        ...data,
        styleName: data.voice_name || data.styleName,
        toneDescription: data.mimicry_instructions || data.toneDescription,
        stylisticDNA: data.stylistic_dna || data.stylisticDNA
    };
};
