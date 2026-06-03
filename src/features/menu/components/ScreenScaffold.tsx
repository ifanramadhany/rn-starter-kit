import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { Screen } from '../../../shared/ui';
import AppHeader from './AppHeader';

type ScreenScaffoldProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  showBackAction?: boolean;
  showSettingsAction?: boolean;
};

export default function ScreenScaffold({
  title,
  subtitle,
  children,
  showBackAction,
  showSettingsAction,
}: ScreenScaffoldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <AppHeader
        title={title}
        subtitle={subtitle}
        showBackAction={showBackAction}
        showSettingsAction={showSettingsAction}
      />
      <Screen useSafeArea={false} showsVerticalScrollIndicator={false}>
        {children}
      </Screen>
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
}
