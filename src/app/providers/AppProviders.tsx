import { QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from '../../shared/api/queryClient';
import { ThemeProvider } from '../../shared/theme/ThemeProvider';

export default function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
