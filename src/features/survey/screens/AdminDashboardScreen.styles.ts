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
    activityCard: {
      gap: 20,
    },
    activityHeader: {
      flexDirection: isTablet ? 'row' : 'column',
      alignItems: isTablet ? 'flex-start' : 'stretch',
      justifyContent: 'space-between',
      gap: 14,
    },
    cardHeading: {
      gap: 6,
      flex: 1,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '800',
    },
    cardSubtitle: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    filterChip: {
      minHeight: 36,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    filterChipText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '700',
    },
    chartScroll: {
      marginHorizontal: -4,
    },
    chartContent: {
      paddingHorizontal: 4,
    },
    chartFrame: {
      minWidth: isTablet ? undefined : 760,
      gap: 12,
    },
    chart: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 8,
      height: 220,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    chartColumnWrap: {
      width: 18,
      alignItems: 'center',
      gap: 8,
    },
    chartColumn: {
      width: 12,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      backgroundColor: colors.primary,
    },
    chartColumnHighlighted: {
      backgroundColor: colors.secondary,
    },
    chartLabel: {
      color: colors.textSubtle,
      fontSize: 11,
      fontWeight: '700',
    },
    tableCard: {
      gap: 0,
      padding: 0,
      overflow: 'hidden',
    },
    tableHeader: {
      paddingHorizontal: 24,
      paddingTop: 22,
      paddingBottom: 18,
      flexDirection: isTablet ? 'row' : 'column',
      justifyContent: 'space-between',
      alignItems: isTablet ? 'center' : 'flex-start',
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    tableColumns: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 14,
      backgroundColor: colors.surfaceMuted,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tableColumnLabel: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    tableQuestionColumn: {
      flex: isTablet ? 1.05 : 1,
      paddingRight: 18,
    },
    tableAnswerColumn: {
      flex: isTablet ? 1.6 : 1,
    },
    tableRow: {
      flexDirection: isTablet ? 'row' : 'column',
      gap: 16,
      paddingHorizontal: 24,
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    tableQuestion: {
      color: colors.text,
      fontSize: 17,
      lineHeight: 24,
      fontWeight: '700',
    },
    tableMeta: {
      color: colors.textSubtle,
      fontSize: 13,
      lineHeight: 18,
      marginTop: 6,
      fontWeight: '600',
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.surface,
    },
    chipStrong: {
      backgroundColor: colors.secondaryContainer,
    },
    chipText: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
    },
    chipStrongText: {
      color: colors.onSecondaryContainer,
    },
    tableFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 24,
      paddingVertical: 16,
      backgroundColor: colors.surfaceMuted,
    },
    tableFooterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      minHeight: 36,
    },
    tableFooterText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '700',
    },
  });
}
