import React from 'react';
import { StatusBar } from 'react-native';
import RootNavigator from './navigation/RootNavigator';
import AppProviders from './providers/AppProviders';
import { useTheme } from '../shared/theme/ThemeProvider';

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

function AppContent() {
  const { resolvedScheme } = useTheme();

  return (
    <>
      <StatusBar barStyle={resolvedScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </>
  );
}
