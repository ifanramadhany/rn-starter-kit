import { create } from 'zustand';

type ScrollState = {
  homeScreenScrollPosition: number;
  setHomeScreenScrollPosition: (position: number) => void;
  resetHomeScreenScrollPosition: () => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  homeScreenScrollPosition: 0,

  setHomeScreenScrollPosition: (position: number) => {
    set({ homeScreenScrollPosition: position });
  },

  resetHomeScreenScrollPosition: () => {
    set({ homeScreenScrollPosition: 0 });
  },
}));
