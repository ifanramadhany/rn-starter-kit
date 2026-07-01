import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Circle, CircleDot, Square, SquareCheckBig } from 'lucide-react-native';

import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';

type SurveyOptionCardProps = {
  isMultipleChoice: boolean;
  isSelected: boolean;
  label: string;
  onPress: () => void;
};

export default function SurveyOptionCard({
  isMultipleChoice,
  isSelected,
  label,
  onPress,
}: SurveyOptionCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const Icon = isMultipleChoice
    ? isSelected
      ? SquareCheckBig
      : Square
    : isSelected
    ? CircleDot
    : Circle;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isSelected ? styles.cardSelected : null,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.iconWrap}>
        <Icon color={isSelected ? colors.primary : colors.textSubtle} size={22} strokeWidth={2.1} />
      </View>
      <Text style={[styles.label, isSelected ? styles.labelSelected : null]}>{label}</Text>
    </Pressable>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: 18,
      paddingVertical: 18,
    },
    cardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primarySoft,
    },
    cardPressed: {
      opacity: 0.9,
    },
    iconWrap: {
      width: 26,
      alignItems: 'center',
    },
    label: {
      flex: 1,
      color: colors.text,
      fontSize: 17,
      lineHeight: 24,
      fontWeight: '600',
    },
    labelSelected: {
      color: colors.primary,
    },
  });
}
