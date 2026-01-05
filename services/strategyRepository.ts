
import { createClient } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export interface ContentPillar {
    id: string;
    user_id: string;
    pillar_name: string;
    description?: string;
    weight: number;
    color_hex?: string;
    created_at?: string;
}

export interface ScheduleItem {
    id: string;
    user_id: string;
    scheduled_date: string;
    day_name: string;
    pillar_id?: string;
    pillar_name?: string; // Joined or cached
    idea_title: string;
    idea_summary?: string;
    status: 'pending_approval' | 'scheduled' | 'posted';
    authority_score?: number;
    created_at?: string;
}

export const fetchPillars = async (userId: string): Promise<ContentPillar[]> => {
    const { data, error } = await supabase
        .from("content_pillars")
        .select("*")
        .eq("user_id", userId)
        .order("weight", { ascending: false });

    if (error) {
        console.error("Error fetching pillars:", error);
        return [];
    }
    return data || [];
};

export const updatePillars = async (userId: string, pillars: ContentPillar[]) => {
    // Strategy: Upsert all. 
    // Note: If deletions happen in UI, we might need to handle them separately or sync specifically.
    // For now, we assume the UI passes the full active list.
    
    // 1. Upsert current list
    const { error } = await supabase
        .from("content_pillars")
        .upsert(pillars.map(p => ({
            ...p,
            user_id: userId,
            updated_at: new Date().toISOString()
        })));
    
    if (error) throw error;
};

export const deletePillar = async (pillarId: string) => {
    const { error } = await supabase
        .from("content_pillars")
        .delete()
        .eq("id", pillarId);
    if (error) throw error;
}

export const fetchSchedule = async (userId: string): Promise<ScheduleItem[]> => {
    const { data, error } = await supabase
        .from("autopost_schedule")
        .select("*")
        .eq("user_id", userId)
        .gte("scheduled_date", new Date().toISOString().split('T')[0]) // Only future/today
        .order("scheduled_date", { ascending: true });

    if (error) {
        console.error("Error fetching schedule:", error);
        return [];
    }
    return data || [];
};

export const updateScheduleStatus = async (itemId: string, status: ScheduleItem['status']) => {
    const { error } = await supabase
        .from("autopost_schedule")
        .update({ status })
        .eq("id", itemId);
    
    if (error) throw error;
};
