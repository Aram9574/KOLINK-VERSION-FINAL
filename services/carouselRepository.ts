import { supabase } from "./supabaseClient";

export interface CarouselDB {
    id?: string;
    user_id?: string;
    data: any;
    settings: any;
    theme_id: string;
    aspect_ratio: string;
    status: "draft" | "published";
    created_at?: string;
    updated_at?: string;
}

export const CarouselRepository = {
    async fetchUserCarousels(userId: string): Promise<CarouselDB[]> {
        const { data, error } = await supabase
            .from("carousels")
            .select("*")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false });

        if (error) {
            console.error("Error fetching carousels:", error);
            return [];
        }
        return data || [];
    },

    async getCarouselById(id: string): Promise<CarouselDB | null> {
        const { data, error } = await supabase
            .from("carousels")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error fetching carousel by id:", error);
            return null;
        }
        return data;
    },

    async createCarousel(
        carousel: Partial<CarouselDB>,
    ): Promise<CarouselDB | null> {
        const { data, error } = await supabase
            .from("carousels")
            .insert(carousel)
            .select()
            .single();

        if (error) {
            console.error("Error creating carousel:", error);
            return null;
        }
        return data;
    },

    async updateCarousel(
        id: string,
        updates: Partial<CarouselDB>,
    ): Promise<CarouselDB | null> {
        const { data, error } = await supabase
            .from("carousels")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating carousel:", error);
            return null;
        }
        return data;
    },

    async deleteCarousel(id: string): Promise<boolean> {
        const { error } = await supabase
            .from("carousels")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting carousel:", error);
            return false;
        }
        return true;
    },
};
