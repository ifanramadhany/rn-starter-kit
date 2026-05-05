import { create } from 'zustand';
import { authStorage } from '../services/authStorage';

type AuthState = {
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  init: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: true,

  login: async (token) => {
    await authStorage.setToken(token);

    set({ token });
  },

  logout: async () => {
    try {
      await authStorage.removeToken();
    } finally {
      set({ token: null });
    }
  },

  init: async () => {
    set({ isLoading: true });

    try {
      const token = await authStorage.getToken();

      set({ token });
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to restore auth token.', error);
      }

      set({ token: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
