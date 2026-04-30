import React, { useEffect, useState } from 'react';
import { InitialState, NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { useAuthStore } from '../../features/auth';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { navigationPersistence } from './navigationPersistence';

export default function RootNavigator() {
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

      if (!token) {
        await navigationPersistence.clearState();

        if (isMounted) {
          setInitialNavigationState(undefined);
          setIsNavigationRestored(true);
        }

        return;
      }

      const savedState = await navigationPersistence.getState();

      if (isMounted) {
        setInitialNavigationState(savedState);
        setIsNavigationRestored(true);
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
      initialState={token ? initialNavigationState : undefined}
      onStateChange={(state) => {
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
  },
});
