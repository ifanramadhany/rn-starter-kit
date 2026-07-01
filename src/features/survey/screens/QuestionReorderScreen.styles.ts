import { StyleSheet } from 'react-native';

import type { AppColors } from '../../../shared/theme/colors';

export function createStyles(colors: AppColors, isTablet: boolean) {
  return StyleSheet.create({
    introCard: {
      gap: 10,
    },
    introTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
    },
    introText: {
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
    },
    list: {
      gap: 14,
    },
    item: {
      flexDirection: isTablet ? 'row' : 'column',
      alignItems: isTablet ? 'center' : 'flex-start',
      gap: 16,
      paddingHorizontal: 20,
    },
    itemLead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minWidth: 92,
    },
    itemOrder: {
      color: colors.textSubtle,
      fontSize: 13,
      fontWeight: '700',
    },
    itemContent: {
      flex: 1,
      gap: 6,
    },
    itemTitle: {
      color: colors.text,
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '700',
    },
    itemMeta: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    moveButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primarySoft,
    },
    moveButtonDisabled: {
      backgroundColor: colors.surfaceStrong,
    },
    doneButton: {
      alignSelf: 'flex-end',
      minHeight: 52,
      borderRadius: 18,
      paddingHorizontal: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },
    doneButtonText: {
      color: colors.onPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
  });
}
