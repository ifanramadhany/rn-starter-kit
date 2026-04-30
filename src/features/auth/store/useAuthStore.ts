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

  login: (token) => {
    return authStorage.setToken(token).then(() => {
      set({ token });
    });
  },

  logout: () => {
    return authStorage.removeToken().then(() => {
      set({ token: null });
    });
  },

  init: async () => {
    set({ isLoading: true });

    const token = await authStorage.getToken();

    set({ token });
    set({
      isLoading: false,
    });
  },
}));
