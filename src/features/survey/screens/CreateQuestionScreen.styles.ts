import { StyleSheet } from 'react-native';

import type { AppColors } from '../../../shared/theme/colors';

export function createStyles(colors: AppColors, isTablet: boolean) {
  return StyleSheet.create({
    columns: {
      flexDirection: isTablet ? 'row' : 'column',
      gap: 18,
      alignItems: 'stretch',
    },
    leftColumn: {
      flex: isTablet ? 5 : 1,
      gap: 18,
    },
    rightColumn: {
      flex: isTablet ? 6 : 1,
      gap: 18,
    },
    fieldCard: {
      gap: 16,
    },
    fieldLabel: {
      color: colors.textSubtle,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    textInput: {
      minHeight: 140,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 18,
      paddingVertical: 16,
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
      textAlignVertical: 'top',
    },
    helperInput: {
      minHeight: 88,
    },
    statusRow: {
      flexDirection: 'row',
      gap: 10,
    },
    toggleButton: {
      flex: 1,
      minHeight: 52,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toggleButtonActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primarySoft,
    },
    toggleButtonText: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: '700',
    },
    toggleButtonTextActive: {
      color: colors.primary,
    },
    optionsCard: {
      gap: 18,
      minHeight: isTablet ? 430 : undefined,
    },
    optionsHeader: {
      flexDirection: isTablet ? 'row' : 'column',
      justifyContent: 'space-between',
      alignItems: isTablet ? 'center' : 'flex-start',
      gap: 12,
    },
    addOptionButton: {
      minHeight: 46,
      borderRadius: 999,
      paddingHorizontal: 16,
      backgroundColor: colors.secondaryContainer,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    addOptionButtonText: {
      color: colors.onSecondaryContainer,
      fontSize: 14,
      fontWeight: '700',
    },
    optionsList: {
      gap: 12,
      flex: 1,
    },
    footerBar: {
      flexDirection: isTablet ? 'row' : 'column',
      justifyContent: 'space-between',
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 18,
      marginTop: 6,
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
      paddingHorizontal: 24,
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
  });
}
