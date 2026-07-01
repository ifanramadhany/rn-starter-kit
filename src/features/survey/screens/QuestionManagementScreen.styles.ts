import { StyleSheet } from 'react-native';

import type { AppColors } from '../../../shared/theme/colors';

export function createStyles(colors: AppColors, isTablet: boolean) {
  return StyleSheet.create({
    actionRow: {
      flexDirection: isTablet ? 'row' : 'column',
      gap: 12,
      width: isTablet ? 'auto' : '100%',
    },
    secondaryAction: {
      minHeight: 52,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 18,
      flexDirection: 'row',
      gap: 10,
    },
    secondaryActionText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
    },
    primaryAction: {
      minHeight: 52,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      flexDirection: 'row',
      gap: 10,
    },
    primaryActionText: {
      color: colors.onPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
    metricGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    searchCard: {
      gap: 14,
    },
    searchRow: {
      flexDirection: isTablet ? 'row' : 'column',
      gap: 12,
    },
    searchInputWrap: {
      flex: 1,
      minHeight: 58,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceMuted,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      gap: 12,
    },
    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      paddingVertical: 0,
    },
    searchMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap',
    },
    searchMetaText: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '600',
    },
    filterChip: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.secondaryContainer,
    },
    filterChipText: {
      color: colors.onSecondaryContainer,
      fontSize: 12,
      fontWeight: '700',
    },
    list: {
      gap: 16,
    },
    emptyState: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: 28,
      alignItems: 'center',
      gap: 10,
    },
    emptyTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '700',
    },
    emptyText: {
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center',
      maxWidth: 460,
    },
  });
}
