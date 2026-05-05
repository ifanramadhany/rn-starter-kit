import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../shared/theme/colors';

type HomeScreenStyleOptions = {
  isTablet: boolean;
};

export function createStyles(colors: AppColors, { isTablet }: HomeScreenStyleOptions) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      width: '100%',
      maxWidth: isTablet ? 1100 : undefined,
      alignSelf: 'center',
    },
    topBar: {
      paddingHorizontal: isTablet ? 32 : 20,
      paddingTop: 16,
      paddingBottom: 10,
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    themeLabel: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
    },
    themeOptions: {
      padding: 2,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      flexDirection: 'row',
      gap: 2,
    },
    themeOption: {
      minHeight: 30,
      paddingHorizontal: 10,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    themeOptionSelected: {
      backgroundColor: colors.surface,
    },
    themeOptionText: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    themeOptionTextSelected: {
      color: colors.accentText,
    },
    header: {
      paddingHorizontal: isTablet ? 32 : 20,
      paddingTop: 20,
      paddingBottom: 12,
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  });
}
