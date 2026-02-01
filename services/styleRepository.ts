import { supabase } from './supabaseClient';

export interface StyleMemory {
  id: string;
  content: string;
  metadata?: any;
  similarity?: number;
  created_at?: string;
}

export const addStyleMemory = async (content: string, metadata?: any, userId?: string): Promise<StyleMemory> => {
  const { data, error } = await supabase.functions.invoke('manage-style-memory', {
    body: {
      action: 'add',
      content,
      metadata,
      userId
    }
  });

  if (error) throw error;
  return data.data;
};

export const findSimilarStyles = async (query: string): Promise<StyleMemory[]> => {
  const { data, error } = await supabase.functions.invoke('manage-style-memory', {
    body: {
      action: 'search',
      query
    }
  });

  if (error) throw error;
  return data.data || [];
};

export const getStyleMemories = async (): Promise<StyleMemory[]> => {
  const { data, error } = await supabase.functions.invoke('manage-style-memory', {
    body: { action: 'list' }
  });
  if (error) throw error;
  return data.data || [];
};

export const deleteStyleMemory = async (id: string): Promise<void> => {
  const { error } = await supabase.functions.invoke('manage-style-memory', {
    body: { action: 'delete', id }
  });
  if (error) throw error;
};

