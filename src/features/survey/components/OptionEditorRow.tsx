import React, { useMemo } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { GripVertical, Trash2 } from 'lucide-react-native';

import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';

type OptionEditorRowProps = {
  canRemove: boolean;
  label: string;
  onChangeText: (value: string) => void;
  onRemove: () => void;
};

export default function OptionEditorRow({
  canRemove,
  label,
  onChangeText,
  onRemove,
}: OptionEditorRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <GripVertical color={colors.textSubtle} size={18} strokeWidth={2.2} />
      <TextInput
        value={label}
        onChangeText={onChangeText}
        placeholder="Add answer option"
        placeholderTextColor={colors.textSubtle}
        style={styles.input}
      />
      <Pressable
        accessibilityLabel="Remove answer option"
        disabled={!canRemove}
        onPress={onRemove}
        style={({ pressed }) => [
          styles.removeButton,
          !canRemove ? styles.removeButtonDisabled : null,
          pressed && canRemove ? styles.removeButtonPressed : null,
        ]}
      >
        <Trash2
          color={canRemove ? colors.dangerAction : colors.textSubtle}
          size={18}
          strokeWidth={2.1}
        />
      </Pressable>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    input: {
      flex: 1,
      minHeight: 42,
      color: colors.text,
      fontSize: 16,
      paddingVertical: 0,
    },
    removeButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.dangerBackground,
    },
    removeButtonDisabled: {
      backgroundColor: colors.surfaceStrong,
    },
    removeButtonPressed: {
      opacity: 0.82,
    },
  });
}
