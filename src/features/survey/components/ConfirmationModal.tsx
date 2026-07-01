import React, { useMemo } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useResponsiveLayout } from '../../../shared/hooks/useResponsiveLayout';
import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function ConfirmationModal({
  visible,
  title,
  description,
  confirmLabel,
  isSubmitting = false,
  onCancel,
  onConfirm,
}: ConfirmationModalProps) {
  const { colors } = useTheme();
  const { isTablet } = useResponsiveLayout();
  const styles = useMemo(() => createStyles(colors, isTablet), [colors, isTablet]);

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable disabled={isSubmitting} onPress={onCancel} style={styles.backdrop} />
        <View style={styles.card}>
          <View style={styles.heading}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              disabled={isSubmitting}
              onPress={onCancel}
              style={[styles.secondaryAction, isSubmitting ? styles.disabledAction : null]}
            >
              <Text style={styles.secondaryActionText}>Cancel</Text>
            </Pressable>
            <Pressable
              disabled={isSubmitting}
              onPress={onConfirm}
              style={[styles.dangerAction, isSubmitting ? styles.disabledAction : null]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.onPrimary} size="small" />
              ) : (
                <Text style={styles.dangerActionText}>{confirmLabel}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(colors: AppColors, isTablet: boolean) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: isTablet ? 48 : 20,
      paddingVertical: 24,
      backgroundColor: colors.overlay,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    card: {
      alignSelf: 'center',
      width: '100%',
      maxWidth: isTablet ? 560 : 420,
      borderRadius: 28,
      padding: 24,
      gap: 20,
      backgroundColor: colors.surface,
    },
    heading: {
      gap: 8,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      lineHeight: 30,
      fontWeight: '800',
    },
    description: {
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
    },
    actionRow: {
      flexDirection: isTablet ? 'row' : 'column',
      justifyContent: 'flex-end',
      gap: 12,
    },
    secondaryAction: {
      minHeight: 48,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 18,
      minWidth: isTablet ? 120 : undefined,
    },
    secondaryActionText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
    },
    dangerAction: {
      minHeight: 48,
      borderRadius: 16,
      backgroundColor: colors.dangerAction,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 18,
      minWidth: isTablet ? 180 : undefined,
    },
    dangerActionText: {
      color: colors.onPrimary,
      fontSize: 14,
      fontWeight: '800',
    },
    disabledAction: {
      opacity: 0.7,
    },
  });
}
