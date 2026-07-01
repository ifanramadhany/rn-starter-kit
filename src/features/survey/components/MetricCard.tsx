import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';

import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import SurveySurfaceCard from './SurveySurfaceCard';

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: 'primary' | 'secondary' | 'tertiary';
};

export default function MetricCard({ icon, label, value, tone = 'primary' }: MetricCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const valueStyle =
    tone === 'secondary'
      ? styles.valueSecondary
      : tone === 'tertiary'
      ? styles.valueTertiary
      : styles.valuePrimary;

  return (
    <SurveySurfaceCard style={styles.card}>
      <View style={styles.labelRow}>
        <View style={styles.iconWrap}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </SurveySurfaceCard>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      flex: 1,
      gap: 14,
      minWidth: 170,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceMuted,
    },
    label: {
      flex: 1,
      color: colors.textSubtle,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    value: {
      fontSize: 34,
      lineHeight: 40,
      fontWeight: '800',
    },
    valuePrimary: {
      color: colors.primary,
    },
    valueSecondary: {
      color: colors.secondary,
    },
    valueTertiary: {
      color: colors.tertiary,
    },
  });
}
