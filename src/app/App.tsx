import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import RootNavigator from './navigation/RootNavigator';
import AppProviders from './providers/AppProviders';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AppProviders>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </AppProviders>
  );
}
