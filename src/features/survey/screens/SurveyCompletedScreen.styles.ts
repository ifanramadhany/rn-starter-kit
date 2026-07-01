import { StyleSheet } from 'react-native';

import type { AppColors } from '../../../shared/theme/colors';

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    successCard: {
      alignItems: 'center',
      gap: 18,
      paddingTop: 34,
      paddingBottom: 34,
    },
    successIconWrap: {
      width: 122,
      height: 122,
      borderRadius: 61,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.secondaryContainer,
    },
    title: {
      color: colors.primary,
      fontSize: 40,
      lineHeight: 46,
      fontWeight: '800',
      textAlign: 'center',
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
      maxWidth: 520,
    },
    summaryRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
    },
    summaryChip: {
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: colors.surfaceMuted,
    },
    summaryChipText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '700',
    },
    actionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
      width: '100%',
    },
    actionInnerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    secondaryAction: {
      minHeight: 54,
      paddingHorizontal: 18,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryActionText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '700',
    },
    primaryAction: {
      minHeight: 54,
      paddingHorizontal: 20,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 10,
    },
    primaryActionText: {
      color: colors.onPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
  });
}
