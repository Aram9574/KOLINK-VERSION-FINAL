
import { supabase } from './supabaseClient';
import { BrandKit } from '../types/carousel';

export const BrandKitRepository = {
  // Fetch all brand kits for a user
  async fetchBrandKits(userId: string): Promise<BrandKit[]> {
    const { data, error } = await supabase
      .from('brand_kits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching brand kits:', error);
      return [];
    }
    return data as BrandKit[];
  },

  // Create a new brand kit
  async createBrandKit(userId: string, kit: Omit<BrandKit, 'id' | 'created_at'>): Promise<BrandKit | null> {
    const { data, error } = await supabase
      .from('brand_kits')
      .insert({
        user_id: userId,
        name: kit.name,
        colors: kit.colors,
        fonts: kit.fonts,
        logos: kit.logos || []
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating brand kit:', error);
      throw error;
    }
    return data as BrandKit;
  },

  // Delete a brand kit
  async deleteBrandKit(kitId: string): Promise<boolean> {
    const { error } = await supabase
      .from('brand_kits')
      .delete()
      .eq('id', kitId);

    if (error) {
      console.error('Error deleting brand kit:', error);
      return false;
    }
    return true;
  }
};
