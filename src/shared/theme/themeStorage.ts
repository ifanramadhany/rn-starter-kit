import { storage } from '../storage/storage';

const THEME_MODE_KEY = 'theme_mode';

export type ThemeMode = 'system' | 'light' | 'dark';

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

export const themeStorage = {
  getMode: async (): Promise<ThemeMode> => {
    const value = await storage.getString(THEME_MODE_KEY);

    return isThemeMode(value) ? value : 'system';
  },

  setMode: (mode: ThemeMode) => {
    return storage.set(THEME_MODE_KEY, mode);
  },
};
