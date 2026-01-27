import { create } from 'zustand';
import { UserProfile, AppTab } from '../../types';

interface AppState {
  user: UserProfile | null;
  activeTab: AppTab;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setActiveTab: (tab: AppTab) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUserCredits: (newCredits: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  activeTab: 'home',
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  updateUserCredits: (newCredits) => set((state) => ({
    user: state.user ? { ...state.user, credits: newCredits } : null
  })),
}));
