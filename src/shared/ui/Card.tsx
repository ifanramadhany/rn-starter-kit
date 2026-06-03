import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ViewProps } from 'react-native';

import type { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeProvider';

type CardProps = ViewProps & {
  children: React.ReactNode;
};

export default function Card({ children, style, ...viewProps }: CardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View {...viewProps} style={[styles.card, style]}>
      {children}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      padding: 18,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
  });
}
