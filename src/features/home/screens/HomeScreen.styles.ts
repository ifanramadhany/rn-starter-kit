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
