import React, { useEffect, useMemo, useState } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  InitialState,
  NavigationContainer,
} from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { useAuthStore } from '../../features/auth';
import { logger } from '../../shared/logging/logger';
import type { AppColors } from '../../shared/theme/colors';
import { useTheme } from '../../shared/theme/ThemeProvider';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { navigationPersistence } from './navigationPersistence';

function getActiveRouteName(state: InitialState): string | undefined {
  const route = state.routes[state.index ?? 0];

  if (route?.state) {
    return getActiveRouteName(route.state as InitialState);
  }

  return route?.name;
}

export default function RootNavigator() {
  const { colors, resolvedScheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigationTheme = resolvedScheme === 'dark' ? DarkTheme : DefaultTheme;
  const { token, isLoading, init } = useAuthStore();
  const [initialNavigationState, setInitialNavigationState] = useState<InitialState>();
  const [isNavigationRestored, setIsNavigationRestored] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    let isMounted = true;

    async function restoreNavigationState() {
      if (isLoading) {
        return;
      }

      setIsNavigationRestored(false);

      try {
        if (!token) {
          await navigationPersistence.clearState();

          if (isMounted) {
            setInitialNavigationState(undefined);
          }

          return;
        }

        const savedState = await navigationPersistence.getState();

        if (isMounted) {
          setInitialNavigationState(savedState);
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('Failed to restore navigation state.', error);
        }

        if (isMounted) {
          setInitialNavigationState(undefined);
        }
      } finally {
        if (isMounted) {
          setIsNavigationRestored(true);
        }
      }
    }

    restoreNavigationState();

    return () => {
      isMounted = false;
    };
  }, [isLoading, token]);

  if (isLoading || !isNavigationRestored) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Initializing app...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer
      key={token ? 'main' : 'auth'}
      theme={navigationTheme}
      initialState={token ? initialNavigationState : undefined}
      onStateChange={(state) => {
        if (state) {
          logger.debug('Current screen:', getActiveRouteName(state));
        }

        if (token && state) {
          navigationPersistence.setState(state).catch((error) => {
            if (__DEV__) {
              console.warn('Failed to persist navigation state.', error);
            }
          });
        }
      }}
    >
      {token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 18,
      color: colors.text,
    },
  });
}
