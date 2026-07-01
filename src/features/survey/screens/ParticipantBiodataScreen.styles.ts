import { StyleSheet } from 'react-native';

import type { AppColors } from '../../../shared/theme/colors';

export function createStyles(colors: AppColors, isTablet: boolean) {
  return StyleSheet.create({
    guidelineCard: {
      gap: 12,
    },
    guidelineHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    guidelineTitle: {
      color: colors.secondary,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    guidelineText: {
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
    },
    selectionGrid: {
      flexDirection: isTablet ? 'row' : 'column',
      gap: 18,
    },
    selectionColumn: {
      flex: 1,
      gap: 16,
    },
    sectionTitle: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    optionCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: 18,
      paddingVertical: 18,
      gap: 8,
    },
    optionCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primarySoft,
    },
    optionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
    },
    optionTitleSelected: {
      color: colors.primary,
    },
    optionSubtitle: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    footerCard: {
      gap: 16,
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
    },
    footerLabel: {
      color: colors.textSubtle,
      fontSize: 13,
      fontWeight: '700',
    },
    footerValue: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
    },
    privacyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    startButton: {
      minHeight: 62,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 12,
    },
    startButtonDisabled: {
      opacity: 0.45,
    },
    startButtonText: {
      color: colors.onPrimary,
      fontSize: 18,
      fontWeight: '800',
    },
  });
}
