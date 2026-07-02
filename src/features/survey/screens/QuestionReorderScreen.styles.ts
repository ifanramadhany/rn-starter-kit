import { StyleSheet } from 'react-native';

import type { AppColors } from '../../../shared/theme/colors';

export function createStyles(colors: AppColors, isTablet: boolean) {
  return StyleSheet.create({
    screenContent: {
      flex: 1,
      minHeight: 0,
      overflow: 'visible',
    },
    introCard: {
      width: '100%',
      maxWidth: isTablet ? 720 : undefined,
      alignSelf: 'center',
      gap: isTablet ? 8 : 10,
      padding: isTablet ? 20 : 24,
    },
    introTitle: {
      color: colors.text,
      fontSize: isTablet ? 17 : 18,
      fontWeight: '700',
    },
    introText: {
      color: colors.textMuted,
      fontSize: isTablet ? 14 : 15,
      lineHeight: isTablet ? 20 : 22,
    },
    statusRow: {
      gap: isTablet ? 8 : 10,
    },
    statusChip: {
      alignSelf: 'flex-start',
      borderRadius: 999,
      paddingHorizontal: isTablet ? 12 : 14,
      paddingVertical: isTablet ? 7 : 8,
      backgroundColor: colors.primarySoft,
    },
    statusChipActive: {
      backgroundColor: colors.secondaryContainer,
    },
    statusChipText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '700',
    },
    statusChipTextActive: {
      color: colors.secondary,
    },
    statusHint: {
      color: colors.textSubtle,
      fontSize: isTablet ? 13 : 14,
      lineHeight: isTablet ? 18 : 20,
    },
    listContainer: {
      flex: 1,
      minHeight: 0,
      overflow: 'visible',
    },
    listViewport: {
      flex: 1,
      minHeight: 0,
      width: '100%',
      maxWidth: isTablet ? 720 : undefined,
      alignSelf: 'center',
      overflow: 'visible',
    },
    listContent: {
      paddingBottom: 12,
      overflow: 'visible',
    },
    dragOverlayLayer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 160,
      elevation: 18,
      overflow: 'visible',
    },
    dragOverlayCardWrap: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 180,
      elevation: 22,
      overflow: 'visible',
    },
    dragOverlayCard: {
      flexDirection: isTablet ? 'row' : 'column',
      alignItems: isTablet ? 'center' : 'flex-start',
      gap: isTablet ? 14 : 16,
      paddingVertical: isTablet ? 18 : 24,
      paddingHorizontal: isTablet ? 18 : 20,
      borderColor: colors.secondary,
      backgroundColor: colors.surface,
      shadowOpacity: 0.34,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 18 },
      elevation: 18,
    },
    itemSeparator: {
      height: isTablet ? 12 : 14,
    },
    item: {
      flexDirection: isTablet ? 'row' : 'column',
      alignItems: isTablet ? 'center' : 'flex-start',
      gap: isTablet ? 14 : 16,
      paddingVertical: isTablet ? 18 : 24,
      paddingHorizontal: isTablet ? 18 : 20,
      overflow: 'visible',
    },
    itemActive: {
      borderColor: colors.secondary,
      backgroundColor: colors.secondaryContainer,
      transform: [{ scale: 1.01 }],
      elevation: 8,
      zIndex: 20,
    },
    itemDraggingGhost: {
      opacity: 0,
    },
    placeholderCard: {
      flexDirection: isTablet ? 'row' : 'column',
      alignItems: isTablet ? 'center' : 'flex-start',
      gap: isTablet ? 14 : 16,
      paddingVertical: isTablet ? 18 : 24,
      paddingHorizontal: isTablet ? 18 : 20,
      borderStyle: 'dashed',
      borderColor: colors.border,
      backgroundColor: colors.surfaceMuted,
      shadowOpacity: 0,
      elevation: 0,
      opacity: 0.75,
    },
    itemLead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: isTablet ? 10 : 12,
      minWidth: isTablet ? 82 : 92,
    },
    dragBadge: {
      width: isTablet ? 36 : 40,
      height: isTablet ? 36 : 40,
      borderRadius: isTablet ? 18 : 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceStrong,
    },
    itemOrder: {
      color: colors.textSubtle,
      fontSize: 12,
      fontWeight: '700',
    },
    itemContent: {
      flex: 1,
      gap: isTablet ? 4 : 6,
    },
    itemTitle: {
      color: colors.text,
      fontSize: isTablet ? 16 : 18,
      lineHeight: isTablet ? 22 : 24,
      fontWeight: '700',
    },
    itemMeta: {
      color: colors.textMuted,
      fontSize: isTablet ? 13 : 14,
      lineHeight: isTablet ? 18 : 20,
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
    doneButtonDisabled: {
      opacity: 0.72,
    },
    doneButtonText: {
      color: colors.onPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
  });
}
