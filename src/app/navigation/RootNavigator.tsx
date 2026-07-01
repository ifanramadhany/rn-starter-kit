import React, { useEffect, useMemo, useState } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  InitialState,
  NavigationContainer,
} from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { useSurveyStore } from '../../features/survey';
import { logger } from '../../shared/logging/logger';
import type { AppColors } from '../../shared/theme/colors';
import { useTheme } from '../../shared/theme/ThemeProvider';
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
  const [initialNavigationState, setInitialNavigationState] = useState<InitialState>();
  const [isNavigationRestored, setIsNavigationRestored] = useState(false);
  const initializeSurveyStore = useSurveyStore((state) => state.initialize);
  const isSurveyLoading = useSurveyStore((state) => state.isLoading);

  useEffect(() => {
    initializeSurveyStore();
  }, [initializeSurveyStore]);

  useEffect(() => {
    let isMounted = true;

    async function restoreNavigationState() {
      setIsNavigationRestored(false);

      try {
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
  }, []);

  if (!isNavigationRestored || isSurveyLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Initializing app...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={navigationTheme}
      initialState={initialNavigationState}
      onStateChange={(state) => {
        if (state) {
          logger.debug('Current screen:', getActiveRouteName(state));
        }

        if (state) {
          navigationPersistence.setState(state).catch((error) => {
            if (__DEV__) {
              console.warn('Failed to persist navigation state.', error);
            }
          });
        }
      }}
    >
      <MainNavigator />
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
