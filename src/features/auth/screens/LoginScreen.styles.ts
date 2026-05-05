import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../shared/theme/colors';

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    title: {
      marginBottom: 16,
      fontSize: 18,
      color: colors.text,
    },
  });
}
