import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { GripVertical, SquarePen, Trash2 } from 'lucide-react-native';

import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import type { SurveyQuestion } from '../types';
import SurveySurfaceCard from './SurveySurfaceCard';

type QuestionListItemProps = {
  question: SurveyQuestion;
  onDelete: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
};

export default function QuestionListItem({
  question,
  onDelete,
  onEdit,
  onToggleStatus,
}: QuestionListItemProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isActive = question.status === 'active';

  return (
    <SurveySurfaceCard style={styles.card}>
      <View style={styles.leading}>
        <GripVertical color={colors.textSubtle} size={20} strokeWidth={2.2} />
      </View>
      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, styles.typeBadge]}>
            <Text style={styles.typeBadgeText}>
              {question.type === 'multiple' ? 'Multiple Choice' : 'Single Choice'}
            </Text>
          </View>
          <Text style={styles.metaText}>{question.id}</Text>
        </View>
        <Text style={styles.title}>{question.title}</Text>
        <Text style={styles.helperText}>
          {question.options.length} options · {question.updatedAt}
        </Text>
      </View>
      <View style={styles.actions}>
        <View style={styles.statusWrap}>
          <Switch
            ios_backgroundColor={colors.surfaceStrong}
            onValueChange={onToggleStatus}
            thumbColor={colors.surface}
            trackColor={{ false: colors.surfaceStrong, true: colors.secondary }}
            value={isActive}
          />
          <Text style={styles.statusLabel}>{isActive ? 'Active' : 'Draft'}</Text>
        </View>
        <View style={styles.actionButtons}>
          <Pressable
            accessibilityLabel={`Edit ${question.id}`}
            onPress={onEdit}
            style={({ pressed }) => [
              styles.actionButton,
              pressed ? styles.actionButtonPressed : null,
            ]}
          >
            <SquarePen color={colors.primary} size={18} strokeWidth={2.1} />
          </Pressable>
          <Pressable
            accessibilityLabel={`Delete ${question.id}`}
            onPress={onDelete}
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed ? styles.actionButtonPressed : null,
            ]}
          >
            <Trash2 color={colors.dangerAction} size={18} strokeWidth={2.1} />
          </Pressable>
        </View>
      </View>
    </SurveySurfaceCard>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
      paddingHorizontal: 20,
    },
    leading: {
      paddingVertical: 8,
    },
    content: {
      flex: 1,
      gap: 8,
    },
    badgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
    },
    badge: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    typeBadge: {
      backgroundColor: colors.secondaryContainer,
    },
    typeBadgeText: {
      color: colors.onSecondaryContainer,
      fontSize: 12,
      fontWeight: '700',
    },
    metaText: {
      color: colors.textSubtle,
      fontSize: 12,
      fontWeight: '600',
    },
    title: {
      color: colors.text,
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '700',
    },
    helperText: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    actions: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      minWidth: 154,
    },
    statusWrap: {
      alignItems: 'center',
      gap: 8,
    },
    statusLabel: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    actionButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primarySoft,
    },
    deleteButton: {
      backgroundColor: colors.dangerBackground,
    },
    actionButtonPressed: {
      opacity: 0.86,
    },
  });
}
