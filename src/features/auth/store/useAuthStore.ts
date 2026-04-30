import { create } from 'zustand';
import { authStorage } from '../services/authStorage';

type AuthState = {
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  init: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: true,

  login: (token) => {
    authStorage.setToken(token);
    set({ token });
  },

  logout: () => {
    authStorage.removeToken();
    set({ token: null });
  },

  init: () => {
    set({ isLoading: true });

    const token = authStorage.getToken();

    set({
      token,
      isLoading: false,
    });
  },
}));
