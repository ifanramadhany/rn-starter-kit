import { StyleSheet } from 'react-native';

import type { AppColors } from '../../../shared/theme/colors';

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    progressRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
    },
    progressLabel: {
      color: colors.textSubtle,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    progressValue: {
      color: colors.secondary,
      fontSize: 14,
      fontWeight: '700',
    },
    progressBar: {
      height: 10,
      borderRadius: 999,
      backgroundColor: colors.surfaceStrong,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: colors.secondary,
    },
    questionCard: {
      gap: 20,
    },
    questionIntro: {
      gap: 10,
    },
    questionTitle: {
      color: colors.text,
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '800',
    },
    questionHelper: {
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
    },
    optionList: {
      gap: 12,
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      paddingTop: 8,
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
      color: colors.secondary,
      fontSize: 15,
      fontWeight: '700',
    },
    secondaryActionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    primaryAction: {
      minHeight: 54,
      paddingHorizontal: 22,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 10,
    },
    primaryActionDisabled: {
      opacity: 0.45,
    },
    primaryActionText: {
      color: colors.onPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    emptyCard: {
      alignItems: 'center',
      gap: 12,
    },
    emptyTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '700',
    },
    emptyText: {
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center',
      maxWidth: 420,
    },
  });
}
