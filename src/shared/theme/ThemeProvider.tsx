import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { colorPalettes, ColorScheme } from './colors';
import { themeStorage, ThemeMode } from './themeStorage';

type ThemeContextValue = {
  colors: (typeof colorPalettes)[ColorScheme];
  mode: ThemeMode;
  resolvedScheme: ColorScheme;
  setMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
  const osScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    let isMounted = true;

    themeStorage.getMode().then((storedMode) => {
      if (isMounted) {
        setModeState(storedMode);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const systemScheme: ColorScheme = osScheme === 'dark' ? 'dark' : 'light';
  const resolvedScheme: ColorScheme = mode === 'system' ? systemScheme : mode;

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: colorPalettes[resolvedScheme],
      mode,
      resolvedScheme,
      setMode: async (nextMode) => {
        await themeStorage.setMode(nextMode);
        setModeState(nextMode);
      },
    }),
    [mode, resolvedScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider.');
  }

  return value;
}
