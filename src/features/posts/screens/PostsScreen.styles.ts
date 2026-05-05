import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../shared/theme/colors';

export function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    statusText: {
      marginTop: 12,
      color: colors.textMuted,
    },
    errorText: {
      marginBottom: 12,
      color: colors.dangerText,
      textAlign: 'center',
    },
    header: {
      padding: 20,
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    headerText: {
      flex: 1,
    },
    title: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '700',
    },
    subtitle: {
      marginTop: 2,
      color: colors.textSubtle,
    },
    message: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    createMessage: {
      color: colors.successText,
      backgroundColor: colors.successBackground,
    },
    updateMessage: {
      color: colors.warningText,
      backgroundColor: colors.warningBackground,
    },
    deleteMessage: {
      color: colors.dangerText,
      backgroundColor: colors.dangerBackground,
    },
    listContent: {
      padding: 20,
      gap: 12,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: colors.overlay,
    },
    modalContent: {
      padding: 20,
      borderRadius: 8,
      backgroundColor: colors.surface,
      gap: 12,
    },
    modalTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
    },
    modalText: {
      color: colors.textMuted,
    },
    deleteTitle: {
      color: colors.text,
      fontWeight: '700',
    },
    input: {
      minHeight: 44,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    bodyInput: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
  });
}
