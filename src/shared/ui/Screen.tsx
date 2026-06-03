import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeProvider';

type ScreenProps = ScrollViewProps & {
  children: React.ReactNode;
  useSafeArea?: boolean;
};

export default function Screen({
  children,
  contentContainerStyle,
  useSafeArea = true,
  ...scrollViewProps
}: ScreenProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <Container style={styles.container}>
      <ScrollView
        {...scrollViewProps}
        style={[styles.content, scrollViewProps.style]}
        contentContainerStyle={[styles.contentInner, contentContainerStyle]}
      >
        {children}
      </ScrollView>
    </Container>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    contentInner: {
      gap: 14,
      padding: 20,
      paddingBottom: 28,
    },
  });
}
