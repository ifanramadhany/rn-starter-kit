import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ViewProps } from 'react-native';

import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';

type SurveySurfaceCardProps = ViewProps & {
  children: React.ReactNode;
};

export default function SurveySurfaceCard({
  children,
  style,
  ...viewProps
}: SurveySurfaceCardProps) {
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
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      backgroundColor: colors.surface,
      padding: 24,
      shadowColor: colors.shadow,
      shadowOpacity: 0.24,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 4,
    },
  });
}
