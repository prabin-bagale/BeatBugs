import { create } from 'zustand';
import type { ViewType, User, Beat } from './types';

interface AppState {
  // Navigation
  currentView: ViewType;
  previousView: ViewType | null;
  setView: (view: ViewType) => void;
  goBack: () => void;

  // Selected beat
  selectedBeat: Beat | null;
  selectedBeatId: string | null;
  selectBeat: (beat: Beat) => void;

  // Selected producer
  selectedProducerId: string | null;
  selectProducer: (id: string) => void;

  // Auth
  currentUser: User | null;
  isAuthOpen: boolean;
  authMode: 'login' | 'signup';
  login: (user: User) => void;
  logout: () => void;
  openAuth: (mode?: 'login' | 'signup') => void;
  closeAuth: () => void;

  // Checkout
  checkoutBeat: Beat | null;
  checkoutLicense: 'basic' | 'premium' | 'exclusive';
  startCheckout: (beat: Beat, license?: 'basic' | 'premium' | 'exclusive') => void;

  // Browse filters
  searchQuery: string;
  selectedGenre: string;
  selectedMood: string;
  sortBy: string;
  setSearchQuery: (q: string) => void;
  setSelectedGenre: (g: string) => void;
  setSelectedMood: (m: string) => void;
  setSortBy: (s: string) => void;

  // Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentView: 'home',
  previousView: null,
  setView: (view) => set({ currentView: view, previousView: get().currentView }),
  goBack: () => {
    const prev = get().previousView;
    if (prev) set({ currentView: prev, previousView: null });
    else set({ currentView: 'home' });
  },

  // Selected beat
  selectedBeat: null,
  selectedBeatId: null,
  selectBeat: (beat) => set({ selectedBeat: beat, selectedBeatId: beat.id, currentView: 'beat-detail' }),

  // Selected producer
  selectedProducerId: null,
  selectProducer: (id) => set({ selectedProducerId: id, currentView: 'producer' }),

  // Auth
  currentUser: null,
  isAuthOpen: false,
  authMode: 'login',
  login: (user) => set({ currentUser: user, isAuthOpen: false }),
  logout: () => set({ currentUser: null, currentView: 'home' }),
  openAuth: (mode = 'login') => set({ isAuthOpen: true, authMode: mode }),
  closeAuth: () => set({ isAuthOpen: false }),

  // Checkout
  checkoutBeat: null,
  checkoutLicense: 'basic',
  startCheckout: (beat, license = 'basic') =>
    set({ checkoutBeat: beat, checkoutLicense: license, currentView: 'checkout' }),

  // Browse filters
  searchQuery: '',
  selectedGenre: '',
  selectedMood: '',
  sortBy: 'newest',
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedGenre: (g) => set({ selectedGenre: g }),
  setSelectedMood: (m) => set({ selectedMood: m }),
  setSortBy: (s) => set({ sortBy: s }),

  // Toast
  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  clearToast: () => set({ toast: null }),
}));